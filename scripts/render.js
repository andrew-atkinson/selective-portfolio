#!/usr/bin/env node
/**
 * render.js — bake data/projects.json into a static index.html
 *
 * Usage:
 *   node scripts/render.js              # overwrites index.html in place
 *   node scripts/render.js --dry-run    # prints rendered HTML to stdout
 *
 * What it does:
 *   1. Reads data/projects.json
 *   2. Renders project cards + sidebar nav using the same logic as main.js
 *   3. Injects the rendered HTML into the index.html template
 *   4. Embeds window.__PROJECTS__ so runtime JS (lightbox, carousel) works
 *      without needing to re-fetch the JSON
 *   5. Writes the result back to index.html
 *
 * Runtime JS (main.js) checks for window.__PROJECTS__ first and skips
 * the fetch if it finds pre-baked data.
 */

const fs   = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────
const ROOT         = path.resolve(__dirname, '..');
const JSON_PATH    = path.join(ROOT, 'data', 'projects.json');
const TEMPLATE     = path.join(ROOT, 'index.html');
const DRY_RUN      = process.argv.includes('--dry-run');

// ── Helpers (mirrored from main.js) ───────────────────────────────────────

function pad2(n) {
  return String(n).padStart(2, '0');
}

function countWords(html) {
  if (!html) return 0;
  return html.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;
}

function sortByYear(projects) {
  return [...projects].sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
}

// ── Sidebar nav ────────────────────────────────────────────────────────────

function renderSidebarNav(projects) {
  const sorted = sortByYear(projects);
  let html = '';
  let lastGroup = null;

  sorted.forEach((project, index) => {
    if (project.group && project.group !== lastGroup) {
      html += `<li class="group-label">${project.group}</li>\n`;
      lastGroup = project.group;
    } else if (!project.group && lastGroup !== null && lastGroup !== '') {
      html += `<li class="group-label">Other Works</li>\n`;
      lastGroup = '';
    }
    html += `<li>
  <a href="#project-${index}" class="nav-link" data-project-index="${index}">
    ${project.title} <span class="nav-year">${project.year}</span>
  </a>
</li>\n`;
  });

  return html;
}

// ── Video embed ────────────────────────────────────────────────────────────

function renderVideo(url) {
  if (!url) return '';

  if (url.includes('vimeo.com')) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${m[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let id = '';
    try {
      if (url.includes('youtube.com')) id = new URL(url).searchParams.get('v');
      else id = url.split('youtu.be/')[1]?.split('?')[0];
    } catch (_) {}
    if (id) return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
  }

  if (url.includes('drive.google.com')) {
    const m = url.match(/\/d\/([\w-]+)/);
    if (m) return `<div class="video-embed"><iframe src="https://drive.google.com/file/d/${m[1]}/preview" allowfullscreen></iframe></div>`;
  }

  return '';
}

// ── Thumbnail strip ────────────────────────────────────────────────────────

function renderThumbnailStrip(images, projectIndex) {
  const stripId = `strip-${projectIndex}`;
  const carouselId = `carousel-${projectIndex}`;
  const thumbs = images.map((img, i) => `<button class="thumb ${i === 0 ? 'active' : ''}"
        id="${stripId}-thumb-${i}"
        onclick="jumpCarousel('${carouselId}', ${i}, ${projectIndex})"
        aria-label="Image ${i + 1}${img.caption ? ': ' + img.caption : ''}">
    <img src="${img.src}" alt="${img.caption || ''}" loading="lazy">
  </button>`).join('\n');
  return `<div class="thumbnail-strip" id="${stripId}">\n${thumbs}\n</div>`;
}

// ── Image carousel ─────────────────────────────────────────────────────────

function renderImages(images, projectIndex) {
  if (!images || images.length === 0) return '';

  const carouselId = `carousel-${projectIndex}`;

  // Single image
  if (images.length === 1) {
    const img = images[0];
    const escapedCaption = (img.caption || '').replace(/'/g, "\\'");
    return `<div class="project-single-image" onclick="openLightbox('${img.src}', '${escapedCaption}', ${projectIndex}, 0)">
  <img src="${img.src}" alt="${img.caption || ''}" loading="lazy">
  ${img.caption ? `<p class="image-caption">${img.caption}</p>` : ''}
</div>`;
  }

  // Carousel
  const slides = images.map((img, i) => {
    const safeCaption = (img.caption || '').replace(/"/g, '&quot;');
    const escaped = (img.caption || '').replace(/'/g, "\\'");
    return `<div class="carousel-slide ${i === 0 ? 'active' : ''}"
       data-caption="${safeCaption}"
       data-src="${img.src}"
       onclick="openLightbox('${img.src}', '${escaped}', ${projectIndex}, ${i})">
  <img src="${img.src}" alt="${img.caption || ''}" loading="${i === 0 ? 'eager' : 'lazy'}">
</div>`;
  }).join('\n');

  const firstCaption = images[0].caption || '';

  return `<div class="image-carousel" id="${carouselId}" data-current="0" data-total="${images.length}" data-project="${projectIndex}">
  <div class="carousel-track">
    ${slides}
  </div>
  <div class="carousel-nav">
    <button class="carousel-btn carousel-prev" onclick="carouselNav('${carouselId}', -1)" aria-label="Previous image">&#8592;</button>
    <div class="carousel-info">
      <span class="carousel-counter">01 &mdash; ${pad2(images.length)}</span>
      <span class="carousel-caption">${firstCaption}</span>
    </div>
    <button class="carousel-btn carousel-next" onclick="carouselNav('${carouselId}', 1)" aria-label="Next image">&#8594;</button>
  </div>
</div>`;
}

// ── Description ────────────────────────────────────────────────────────────

function renderDescription(description, projectIndex) {
  if (!description) return '';
  const wordCount = countWords(description);
  const isLong = wordCount > 50;
  const id = `desc-${projectIndex}`;

  if (!isLong) {
    return `<div class="project-description-wrapper">
  <div class="project-description">${description}</div>
</div>`;
  }

  return `<div class="project-description-wrapper">
  <div class="project-description">
    <div class="description-full collapsed" id="${id}">${description}</div>
    <button class="description-toggle" onclick="toggleDescription('${id}', this)">
      Read Full Description
    </button>
    <div class="word-count">${wordCount} words</div>
  </div>
</div>`;
}

// ── Metadata ───────────────────────────────────────────────────────────────

function renderTools(tools) {
  if (!tools || tools.length === 0) return '';
  return `<div class="metadata-section">
  <h4>Tools &amp; Technologies</h4>
  <ul>${tools.map(t => `<li>${t}</li>`).join('')}</ul>
</div>`;
}

function renderMetadata(project) {
  let html = '';

  if (project.collaborators?.length > 0) {
    html += `<div class="metadata-section">
  <h4>Collaborators</h4>
  <ul>${project.collaborators.map(c => `<li>${c}</li>`).join('')}</ul>
</div>`;
  }

  if (project.datasets?.length > 0) {
    const items = project.datasets.map(d =>
      `<li>${d.url ? `<a href="${d.url}" target="_blank">${d.name}</a>` : d.name}</li>`
    ).join('');
    html += `<div class="metadata-section">
  <h4>Datasets &amp; Resources</h4>
  <ul>${items}</ul>
</div>`;
  }

  return html;
}

function renderLinks(links) {
  if (!links || links.length === 0) return '';
  return `<div class="project-links">
  ${links.map(l => `<a href="${l.url}" class="project-link" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join('\n  ')}
</div>`;
}

// ── Project card ───────────────────────────────────────────────────────────

function renderProject(project, index) {
  let html = `<article class="project" id="project-${index}"><div class="project-inner">`;

  html += `<div class="project-header">
  <h2 class="project-title">${project.title}</h2>
  <span class="project-year">${project.year}</span>
</div>`;

  if (project.group) {
    html += `<span class="project-group">${project.group}</span>`;
  }

  html += `<div class="project-media">`;
  if (project.video)           html += renderVideo(project.video);
  if (project.images?.length > 1) html += renderThumbnailStrip(project.images, index);
  if (project.images?.length > 0) html += renderImages(project.images, index);
  html += `</div>`;

  if (project.description) html += renderDescription(project.description, index);

  const meta = renderTools(project.tools) + renderMetadata(project);
  if (meta) html += `<div class="project-metadata">${meta}</div>`;

  if (project.links?.length > 0) html += renderLinks(project.links);

  html += `</div></article>`;
  return html;
}

function renderAllProjects(projects) {
  const sorted = sortByYear(projects);
  return sorted.map((p, i) => renderProject(p, i)).join('\n');
}

// ── Template injection ─────────────────────────────────────────────────────

function inject(template, projects) {
  const sorted = sortByYear(projects);

  const navHTML      = renderSidebarNav(projects);
  const projectsHTML = renderAllProjects(projects);

  // Embed sorted project data for runtime JS (lightbox needs it)
  const dataScript = `<script>window.__PROJECTS__ = ${JSON.stringify(sorted, null, 2)};</script>`;

  let html = template;

  // ── Sidebar nav ──────────────────────────────────────────────────────────
  // Wrap content in markers so repeated runs replace only the marker block,
  // not the first </ul> found inside the baked HTML (which would be wrong).
  const navBlock = `<!-- NAV_START -->\n${navHTML}\n<!-- NAV_END -->`;

  if (html.includes('<!-- NAV_START -->')) {
    // Idempotent: replace between existing markers
    html = html.replace(/<!-- NAV_START -->[\s\S]*?<!-- NAV_END -->/, navBlock);
  } else {
    // First run: find the container tag and inject
    html = html.replace(
      /(<ul[^>]*id="sidebar-nav"[^>]*>)([\s\S]*?)(<\/ul>)/,
      `$1\n${navBlock}\n$3`
    );
  }

  // ── Projects container ───────────────────────────────────────────────────
  const projectsBlock = `<!-- PROJECTS_START -->\n${projectsHTML}\n<!-- PROJECTS_END -->`;

  if (html.includes('<!-- PROJECTS_START -->')) {
    // Idempotent: replace between existing markers
    html = html.replace(/<!-- PROJECTS_START -->[\s\S]*?<!-- PROJECTS_END -->/, projectsBlock);
  } else {
    // First run: find the container tag and inject
    html = html.replace(
      /(<div[^>]*id="projects-container"[^>]*>)([\s\S]*?)(<\/div>)/,
      `$1\n${projectsBlock}\n$3`
    );
  }

  // ── Data script ──────────────────────────────────────────────────────────
  if (html.includes('window.__PROJECTS__')) {
    // Idempotent: replace existing script block
    html = html.replace(/<script>window\.__PROJECTS__[\s\S]*?<\/script>/, dataScript);
  } else {
    html = html.replace('</body>', `${dataScript}\n</body>`);
  }

  return html;
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`Error: ${JSON_PATH} not found — run "npm run build" first`);
    process.exit(1);
  }
  if (!fs.existsSync(TEMPLATE)) {
    console.error(`Error: ${TEMPLATE} not found`);
    process.exit(1);
  }

  const projects = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')).projects || [];
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const output   = inject(template, projects);

  if (DRY_RUN) {
    process.stdout.write(output);
    return;
  }

  fs.writeFileSync(TEMPLATE, output, 'utf8');
  console.log(`✓ Baked ${projects.length} projects into ${TEMPLATE}`);
}

main();

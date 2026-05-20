#!/usr/bin/env node
/**
 * build.js — parse docs/todo.md → data/projects.json
 *
 * Usage:
 *   node scripts/build.js              # write to data/projects.json
 *   node scripts/build.js --dry-run    # print JSON to stdout, don't write
 *
 * Schema expected in todo.md:
 *   ## Project N        — starts a project block (number is ignored)
 *   ### Title           — project title (required)
 *   ### Year            — four-digit year (required)
 *   ### Group           — series/group name (required)
 *   ### Collaborators   — bullet list of names
 *   ### Description     — plain text paragraphs → <p> tags; _x_ → <em>; **x** → <strong>
 *   ### Tools           — bullet list
 *   ### Datasets        — bullet list of [Label](url) links
 *   ### Video           — bare URL or [Label](url); URL is extracted
 *   ### File Type       — string, e.g. "images", "online .mov"
 *   ### Images          — one ![caption](../assets/file) per line
 *   ### Repository      — bare URL → becomes a "GitHub Repository" link
 *   ### Links           — bullet list of [Label](url)
 */

const fs   = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname, '..');
const TODO_PATH   = path.join(ROOT, 'docs', 'projects.md');
const OUTPUT_PATH = path.join(ROOT, 'data', 'projects.json');
const DRY_RUN     = process.argv.includes('--dry-run');

// ── Helpers ────────────────────────────────────────────────────────────────

/** Convert minimal Markdown inline syntax → HTML */
function inlineToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

/** Convert plain-text paragraphs (blank-line separated) → HTML <p> blocks */
function descriptionToHtml(raw) {
  return raw
    .trim()
    .split(/\n{2,}/)                    // split on blank lines
    .map(para => para.replace(/\n/g, ' ').trim())
    .filter(Boolean)
    .map(para => `<p>${inlineToHtml(para)}</p>`)
    .join('');
}

/** Extract the href from a Markdown link `[Label](url)` or a bare URL */
function extractUrl(str) {
  const mdLink = str.match(/\[.*?\]\((.*?)\)/);
  if (mdLink) return mdLink[1].trim();
  // bare URL
  const bare = str.trim();
  if (/^https?:\/\//.test(bare)) return bare;
  return null;
}

/** Extract label + href from `[Label](url)` */
function parseMdLink(str) {
  const m = str.match(/\[(.+?)\]\((.*?)\)/);
  if (!m) return null;
  return { label: m[1].trim(), url: m[2].trim() };
}

/** Extract caption + src from `![caption](path)` */
function parseMdImage(str) {
  const m = str.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (!m) return null;
  // Strip leading ../ — images are served from assets/ relative to root
  const src = m[2].replace(/^\.\.\//, '');
  return { src, caption: m[1].trim() };
}

/** Parse a bullet list block → array of strings (stripped of leading `- `) */
function parseBulletList(block) {
  return block
    .split('\n')
    .map(l => l.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

// ── Core parser ────────────────────────────────────────────────────────────

function parseTodo(markdown) {
  // Split the file into project blocks on `## Project` headings
  const projectBlocks = markdown
    .split(/^## Project\s+\d+/m)
    .slice(1); // discard preamble before first project

  const projects = projectBlocks.map((block, idx) => {
    // Split block into sections on `### Field` headings
    const sections = {};
    const sectionPattern = /^### (.+)$/m;
    const parts = block.split(/(?=^### )/m);

    for (const part of parts) {
      const headingMatch = part.match(sectionPattern);
      if (!headingMatch) continue;
      const key   = headingMatch[1].trim().toLowerCase().replace(/\s+/g, ' ');
      const value = part.replace(sectionPattern, '').replace(/^---+$/m, '').trim();
      sections[key] = value;
    }

    // ── Required fields ──────────────────────────────────────
    const title = sections['title'] || '';
    const year  = parseInt(sections['year'], 10) || null;
    const group = sections['group'] || '';

    if (!title) {
      console.warn(`  ⚠ Project ${idx + 1}: missing Title — skipping`);
      return null;
    }

    // ── Description ──────────────────────────────────────────
    const description = sections['description']
      ? descriptionToHtml(sections['description'])
      : '';

    // ── Tools ────────────────────────────────────────────────
    const tools = sections['tools']
      ? parseBulletList(sections['tools'])
      : [];

    // ── Collaborators ─────────────────────────────────────────
    const collaborators = sections['collaborators']
      ? parseBulletList(sections['collaborators'])
      : undefined;

    // ── Images ───────────────────────────────────────────────
    const images = sections['images']
      ? sections['images']
          .split('\n')
          .map(l => parseMdImage(l.trim()))
          .filter(Boolean)
      : undefined;

    // ── Datasets ─────────────────────────────────────────────
    const datasets = sections['datasets']
      ? parseBulletList(sections['datasets'])
          .map(item => {
            const link = parseMdLink(item);
            return link ? { name: link.label, url: link.url } : null;
          })
          .filter(Boolean)
      : undefined;

    // ── Video ────────────────────────────────────────────────
    const video = sections['video']
      ? extractUrl(sections['video'])
      : undefined;

    // ── File Type ─────────────────────────────────────────────
    const fileType = sections['file type'] || undefined;

    // ── Links ─────────────────────────────────────────────────
    // Collect explicit links list; also auto-add repository as a link
    const explicitLinks = sections['links']
      ? parseBulletList(sections['links'])
          .map(item => parseMdLink(item))
          .filter(Boolean)
      : [];

    // If a ### Repository field exists and isn't already in links, prepend it
    if (sections['repository']) {
      const repoUrl = sections['repository'].trim();
      const alreadyPresent = explicitLinks.some(l => l.url === repoUrl);
      if (!alreadyPresent && /^https?:\/\//.test(repoUrl)) {
        explicitLinks.unshift({ label: 'GitHub Repository', url: repoUrl });
      }
    }

    const links = explicitLinks.length ? explicitLinks : undefined;

    // ── Assemble project object (omit undefined fields) ───────
    const project = { title, year, group };
    if (collaborators && collaborators.length) project.collaborators = collaborators;
    if (description)                            project.description   = description;
    if (video)                                  project.video         = video;
    if (images && images.length)                project.images        = images;
    if (fileType)                               project.fileType      = fileType;
    if (tools && tools.length)                  project.tools         = tools;
    if (datasets && datasets.length)            project.datasets      = datasets;
    if (links && links.length)                  project.links         = links;

    return project;
  }).filter(Boolean);

  return { projects };
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(TODO_PATH)) {
    console.error(`Error: cannot find ${TODO_PATH}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(TODO_PATH, 'utf8');
  const data     = parseTodo(markdown);
  const json     = JSON.stringify(data, null, 2);

  if (DRY_RUN) {
    console.log(json);
    return;
  }

  // Ensure data/ directory exists
  const dataDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, json, 'utf8');
  console.log(`✓ Wrote ${data.projects.length} projects → ${OUTPUT_PATH}`);
}

main();

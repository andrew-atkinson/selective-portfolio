// Portfolio Site — Main JS
// Revised by Sonnet 4.6
// Features: sidebar nav, collapsible descriptions, full-width image / carousel

const PROJECTS_DATA_FILE = 'data/projects.json';
let allProjects = [];
let sidebarOpen = false;

// ──────────────────────────────────────────────
// Data loading
// ──────────────────────────────────────────────

async function loadProjects() {
    try {
        const response = await fetch(PROJECTS_DATA_FILE);
        if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
        const data = await response.json();
        return data.projects || [];
    } catch (error) {
        console.error('Error loading projects:', error);
        displayError('Error loading projects. Please check that data/projects.json exists.');
        return [];
    }
}

function displayError(message) {
    const container = document.getElementById('projects-container');
    if (container) container.innerHTML = `<div class="error">${message}</div>`;
}

// ──────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────

function countWords(text) {
    if (!text) return 0;
    return text.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;
}

function sortProjectsByYear(projects) {
    return [...projects].sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

// ──────────────────────────────────────────────
// Sidebar
// ──────────────────────────────────────────────

function generateSidebarNav(projects) {
    const navContainer = document.getElementById('sidebar-nav');
    const sortedProjects = sortProjectsByYear(projects);

    let navHTML = '';
    let lastGroup = null;

    sortedProjects.forEach((project, index) => {
        if (project.group && project.group !== lastGroup) {
            navHTML += `<li class="group-label">${project.group}</li>`;
            lastGroup = project.group;
        } else if (!project.group && lastGroup !== null && lastGroup !== '') {
            navHTML += `<li class="group-label">Other Works</li>`;
            lastGroup = '';
        }

        navHTML += `
            <li>
                <a href="#project-${index}" class="nav-link" data-project-index="${index}">
                    ${project.title} <span class="nav-year">${project.year}</span>
                </a>
            </li>
        `;
    });

    navContainer.innerHTML = navHTML;

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            closeSidebar();
            const el = document.getElementById(`project-${link.dataset.projectIndex}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Active nav link on scroll
function setupScrollSpy() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const index = id.replace('project-', '');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.dataset.projectIndex === index);
                });
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });

    document.querySelectorAll('.project').forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────────
// Thumbnail strip (multiple images only)
// ──────────────────────────────────────────────

function createThumbnailStrip(images, projectIndex) {
    const stripId = `strip-${projectIndex}`;
    const carouselId = `carousel-${projectIndex}`;

    const thumbsHTML = images.map((img, i) => `
        <button class="thumb ${i === 0 ? 'active' : ''}"
                id="${stripId}-thumb-${i}"
                onclick="jumpCarousel('${carouselId}', ${i}, ${projectIndex})"
                aria-label="Image ${i + 1}${img.caption ? ': ' + img.caption : ''}">
            <img src="${img.src}" alt="${img.caption || ''}" loading="lazy">
        </button>
    `).join('');

    return `<div class="thumbnail-strip" id="${stripId}">${thumbsHTML}</div>`;
}

// Jump a carousel to a specific index and sync thumbnail strip
window.jumpCarousel = function(carouselId, targetIndex, projectIndex) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const current = parseInt(carousel.dataset.current);
    if (current === targetIndex) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const total = parseInt(carousel.dataset.total);

    slides[current].classList.remove('active');
    slides[targetIndex].classList.add('active');
    carousel.dataset.current = targetIndex;

    const counter = carousel.querySelector('.carousel-counter');
    const captionEl = carousel.querySelector('.carousel-caption');
    if (counter) counter.innerHTML = `${pad2(targetIndex + 1)} &mdash; ${pad2(total)}`;
    if (captionEl) captionEl.textContent = slides[targetIndex].dataset.caption || '';

    syncThumbs(projectIndex, targetIndex);
};

function syncThumbs(projectIndex, activeIndex) {
    const stripId = `strip-${projectIndex}`;
    document.querySelectorAll(`#${stripId} .thumb`).forEach((btn, i) => {
        btn.classList.toggle('active', i === activeIndex);
    });
}

// ──────────────────────────────────────────────
// Image rendering: single image or carousel
// ──────────────────────────────────────────────

function createImageCarousel(images, projectIndex) {
    if (!images || images.length === 0) return '';

    const carouselId = `carousel-${projectIndex}`;

    // ── Single image: fills full content width, click to lightbox ──
    if (images.length === 1) {
        const img = images[0];
        const escapedCaption = (img.caption || '').replace(/'/g, "\\'");
        return `
            <div class="project-single-image" onclick="openLightbox('${img.src}', '${escapedCaption}', ${projectIndex}, 0)">
                <img src="${img.src}" alt="${img.caption || ''}" loading="lazy">
                ${img.caption ? `<p class="image-caption">${img.caption}</p>` : ''}
            </div>
        `;
    }

    // ── Multiple images: carousel ──
    const slidesHTML = images.map((img, i) => {
        const safeCaption = (img.caption || '').replace(/"/g, '&quot;');
        return `
            <div class="carousel-slide ${i === 0 ? 'active' : ''}"
                 data-caption="${safeCaption}"
                 data-src="${img.src}"
                 onclick="openLightbox('${img.src}', '${(img.caption || '').replace(/'/g, "\\'")}', ${projectIndex}, ${i})">
                <img src="${img.src}" alt="${img.caption || ''}" loading="${i === 0 ? 'eager' : 'lazy'}">
            </div>
        `;
    }).join('');

    const firstCaption = images[0].caption || '';

    return `
        <div class="image-carousel" id="${carouselId}" data-current="0" data-total="${images.length}" data-project="${projectIndex}">
            <div class="carousel-track">
                ${slidesHTML}
            </div>
            <div class="carousel-nav">
                <button class="carousel-btn carousel-prev"
                        onclick="carouselNav('${carouselId}', -1)"
                        aria-label="Previous image">&#8592;</button>
                <div class="carousel-info">
                    <span class="carousel-counter">01 &mdash; ${pad2(images.length)}</span>
                    <span class="carousel-caption">${firstCaption}</span>
                </div>
                <button class="carousel-btn carousel-next"
                        onclick="carouselNav('${carouselId}', 1)"
                        aria-label="Next image">&#8594;</button>
            </div>
        </div>
    `;
}

// Navigate a carousel by +1 or -1
window.carouselNav = function(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const total = parseInt(carousel.dataset.total);
    let current = parseInt(carousel.dataset.current);
    const slides = carousel.querySelectorAll('.carousel-slide');

    slides[current].classList.remove('active');
    current = (current + direction + total) % total;
    slides[current].classList.add('active');
    carousel.dataset.current = current;

    const counter = carousel.querySelector('.carousel-counter');
    const captionEl = carousel.querySelector('.carousel-caption');

    if (counter) counter.innerHTML = `${pad2(current + 1)} &mdash; ${pad2(total)}`;
    if (captionEl) captionEl.textContent = slides[current].dataset.caption || '';

    // Keep thumbnail strip in sync with arrow navigation
    const projectIndex = parseInt(carousel.dataset.project);
    syncThumbs(projectIndex, current);
};

// ──────────────────────────────────────────────
// Video embed
// ──────────────────────────────────────────────

function createVideoEmbed(url) {
    if (!url) return '';

    // Vimeo
    if (url.includes('vimeo.com')) {
        const match = url.match(/vimeo\.com\/(\d+)/);
        if (match) return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${match[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let id = '';
        if (url.includes('youtube.com')) {
            try { id = new URL(url).searchParams.get('v'); } catch (e) {}
        } else {
            id = url.split('youtu.be/')[1]?.split('?')[0];
        }
        if (id) return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([\w-]+)/);
        if (match) return `<div class="video-embed"><iframe src="https://drive.google.com/file/d/${match[1]}/preview" allowfullscreen></iframe></div>`;
    }

    return '';
}

// ──────────────────────────────────────────────
// Description
// ──────────────────────────────────────────────

function createDescription(description) {
    if (!description) return '';

    const wordCount = countWords(description);
    const isLong = wordCount > 50;

    if (!isLong) {
        return `<div class="project-description-wrapper"><div class="project-description">${description}</div></div>`;
    }

    const id = `desc-${Math.random().toString(36).substr(2, 9)}`;
    return `
        <div class="project-description-wrapper">
            <div class="project-description">
                <div class="description-full collapsed" id="${id}">${description}</div>
                <button class="description-toggle" onclick="toggleDescription('${id}', this)">
                    Read Full Description
                </button>
                <div class="word-count">${wordCount} words</div>
            </div>
        </div>
    `;
}

window.toggleDescription = function(id, button) {
    const el = document.getElementById(id);
    const collapsed = el.classList.contains('collapsed');
    el.classList.toggle('collapsed', !collapsed);
    button.textContent = collapsed ? 'Show Less' : 'Read Full Description';
};

// ──────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────

function createToolsList(tools) {
    if (!tools || tools.length === 0) return '';
    return `<div class="metadata-section"><h4>Tools &amp; Technologies</h4><ul>${tools.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
}

function createLinksSection(links) {
    if (!links || links.length === 0) return '';
    return `<div class="project-links">${links.map(l => `<a href="${l.url}" class="project-link" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join('')}</div>`;
}

function createMetadata(project) {
    let html = '';

    if (project.collaborators?.length > 0) {
        html += `<div class="metadata-section"><h4>Collaborators</h4><ul>${project.collaborators.map(c => `<li>${c}</li>`).join('')}</ul></div>`;
    }

    if (project.datasets?.length > 0) {
        const items = project.datasets.map(d =>
            `<li>${d.url ? `<a href="${d.url}" target="_blank">${d.name}</a>` : d.name}</li>`
        ).join('');
        html += `<div class="metadata-section"><h4>Datasets &amp; Resources</h4><ul>${items}</ul></div>`;
    }

    return html;
}

// ──────────────────────────────────────────────
// Project rendering
// ──────────────────────────────────────────────

function renderProject(project, index) {
    let html = `<article class="project" id="project-${index}"><div class="project-inner">`;

    html += `<div class="project-header">
        <h2 class="project-title">${project.title}</h2>
        <span class="project-year">${project.year}</span>
    </div>`;

    if (project.group) {
        html += `<span class="project-group">${project.group}</span>`;
    }

    html += '<div class="project-media">';
    if (project.video) html += createVideoEmbed(project.video);
    if (project.images?.length > 1) html += createThumbnailStrip(project.images, index);
    if (project.images?.length > 0) html += createImageCarousel(project.images, index);
    html += '</div>';

    if (project.description) html += createDescription(project.description);

    const metaHTML = createToolsList(project.tools) + createMetadata(project);
    if (metaHTML) html += `<div class="project-metadata">${metaHTML}</div>`;

    if (project.links?.length > 0) html += createLinksSection(project.links);

    html += '</div></article>';
    return html;
}

function renderAllProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<div class="error">No projects found.</div>';
        return;
    }

    const sorted = sortProjectsByYear(projects);
    container.innerHTML = sorted.map((p, i) => renderProject(p, i)).join('');
}

// ──────────────────────────────────────────────
// Lightbox — shared image viewer
// ──────────────────────────────────────────────

let lightboxImages = [];    // images for the active project
let lightboxIndex = 0;      // current position

window.openLightbox = function(imageSrc, caption, projectIndex, imgIndex) {
    // Gather the full image set for this project so arrow keys can navigate
    const project = allProjects && sortProjectsByYear(allProjects)[projectIndex];
    lightboxImages = project?.images || [{ src: imageSrc, caption: caption }];
    lightboxIndex = imgIndex ?? 0;

    showLightboxFrame();

    const modal = document.getElementById('lightbox-modal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

function showLightboxFrame() {
    const modal = document.getElementById('lightbox-modal');
    const img = modal.querySelector('.lightbox-image');
    const captionEl = modal.querySelector('.lightbox-caption');
    const current = lightboxImages[lightboxIndex];

    img.src = current.src || current;
    captionEl.textContent = current.caption || '';
}

window.lightboxStep = function(direction) {
    if (lightboxImages.length <= 1) return;
    lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    const img = document.querySelector('#lightbox-modal .lightbox-image');
    img.style.opacity = '0';
    setTimeout(() => {
        showLightboxFrame();
        img.style.opacity = '1';
    }, 120);
};

window.closeLightbox = function() {
    const modal = document.getElementById('lightbox-modal');
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    lightboxImages = [];
    lightboxIndex = 0;
};

// ──────────────────────────────────────────────
// Sidebar toggle
// ──────────────────────────────────────────────

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('open', sidebarOpen);
    toggle.classList.toggle('open', sidebarOpen);
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    sidebarOpen = false;
    sidebar.classList.remove('open');
    toggle?.classList.remove('open');
}

// ──────────────────────────────────────────────
// Keyboard navigation
// ──────────────────────────────────────────────

function setupKeyboard() {
    document.addEventListener('keydown', e => {
        const modal = document.getElementById('lightbox-modal');
        const isOpen = modal?.classList.contains('open');

        if (e.key === 'Escape') {
            if (isOpen) closeLightbox();
        }

        if (isOpen) {
            if (e.key === 'ArrowLeft')  window.lightboxStep(-1);
            if (e.key === 'ArrowRight') window.lightboxStep(1);
        }
    });
}

// ──────────────────────────────────────────────
// Theme (light / dark)
// ──────────────────────────────────────────────

const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);

    const label = document.querySelector('.theme-toggle-label');
    if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function initTheme() {
    // Respect saved preference, then OS preference, then default to light
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });
}

// ──────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────

async function init() {
    document.getElementById('year').textContent = new Date().getFullYear();
    initTheme();

    allProjects = await loadProjects();
    generateSidebarNav(allProjects);
    renderAllProjects(allProjects);
    setupScrollSpy();
    setupKeyboard();

    // Sidebar toggle button
    document.querySelector('.sidebar-toggle')?.addEventListener('click', toggleSidebar);

    // Close sidebar on main content click (mobile)
    document.querySelector('.main-content')?.addEventListener('click', () => {
        if (sidebarOpen && window.innerWidth <= 768) closeSidebar();
    });

    // Lightbox close button
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);

    // Lightbox prev/next buttons
    document.querySelector('.lightbox-prev')?.addEventListener('click', () => window.lightboxStep(-1));
    document.querySelector('.lightbox-next')?.addEventListener('click', () => window.lightboxStep(1));

    // Close lightbox on backdrop click
    document.getElementById('lightbox-modal')?.addEventListener('click', e => {
        if (e.target.id === 'lightbox-modal') closeLightbox();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

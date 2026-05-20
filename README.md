# Selective Works — Andrew Atkinson

A static portfolio site with a Node.js build pipeline. Content is authored in Markdown (`docs/projects.md`), compiled to JSON, and baked into static HTML — no database or server required.

## Project Structure

```
portfolio/
├── index.html                 # Built output — do not edit by hand
├── css/
│   └── style-minimal.css      # Stylesheet (customize colors/fonts here)
├── js/
│   └── main.js                # Runtime JS: carousel, lightbox, sidebar, theme
├── data/
│   └── projects.json          # Built output — do not edit by hand
├── docs/
│   └── projects.md            # ✏️  EDIT THIS to manage projects
├── scripts/
│   ├── build.js               # docs/projects.md → data/projects.json
│   └── render.js              # data/projects.json → index.html
├── assets/                    # Images and other media
├── package.json
└── README.md
```

## Workflow

All content lives in `docs/projects.md`. After editing it, run the pipeline to rebuild the site:

```bash
npm run pipeline
```

This runs both steps in sequence:

| Command | What it does |
|---|---|
| `npm run build` | Parses `docs/projects.md` → writes `data/projects.json` |
| `npm run render` | Reads `data/projects.json` → bakes static HTML into `index.html` |
| `npm run pipeline` | Runs both in order |
| `npm run build:dry` | Prints JSON to stdout without writing |
| `npm run render:dry` | Prints HTML to stdout without writing |

Requires Node.js 16 or later. No dependencies to install.

## Editing Projects

Open `docs/projects.md` in any text editor. Each project follows this schema:

```markdown
## Project N

### Title
Your Project Title

### Year
2024

### Group
Series Name

### Description
Plain text paragraphs here. Separate paragraphs with a blank line.
Each paragraph becomes a <p> tag. Use _italic_ and **bold** inline.

### Tools
- Tool 1
- Tool 2

### Images
![Caption text](../assets/filename.jpg)

### Video
[Label](https://vimeo.com/...)

### File Type
images

### Collaborators
- Name One
- Name Two

### Datasets
- [Dataset Name](https://url-to-dataset)

### Links
- [Label](https://url)
- [Another Label](https://url)

### Repository
https://github.com/...

---
```

### Field reference

| Field | Required | Notes |
|---|---|---|
| Title | Yes | Plain text |
| Year | Yes | Four-digit number, used for sorting (newest first) |
| Group | Yes | Series name — groups projects in the sidebar |
| Description | Yes | Plain text paragraphs; `_italic_` → `<em>`, `**bold**` → `<strong>` |
| Tools | Yes | Bullet list |
| Images | Optional | One `![caption](../assets/file)` per line |
| Video | Optional | Bare URL or `[Label](url)` — supports Vimeo, YouTube, Google Drive |
| File Type | Optional | e.g. `images`, `online .mov` |
| Collaborators | Optional | Bullet list of names |
| Datasets | Optional | Bullet list of `[Label](url)` links |
| Links | Optional | Bullet list of `[Label](url)` links |
| Repository | Optional | Bare URL — auto-labelled "GitHub Repository" and added to links |

Projects are displayed in reverse chronological order by year. Within the same year, they appear in the order written in `docs/projects.md`.

### Adding a new project

1. Open `docs/projects.md`
2. Add a new `## Project N` block at the end (increment the number)
3. Fill in the fields using the schema above
4. Place any image files in `assets/`
5. Run `npm run pipeline`

### Adding images

Place image files in `assets/` and reference them as `../assets/filename.jpg` in the Images field. One image per line, in the order you want them displayed.

Supported formats: JPG, PNG, WebP.

A single image renders full-width with a click-to-zoom lightbox. Two or more images render as a carousel with a thumbnail strip.

### Video embeds

Paste the sharing URL — the pipeline handles the embed conversion:

- **Vimeo**: `https://vimeo.com/553111781`
- **YouTube**: `https://youtube.com/watch?v=...`
- **Google Drive**: `https://drive.google.com/file/d/.../view`

## Customisation

### Colors and typography

Edit `css/style-minimal.css`. All design tokens are CSS variables at the top of the file:

```css
:root {
  --primary-bg: #fdfcfa;
  --text-dark:  #2a2520;
  --accent-color: #1a1a1a;
  --font-serif: "Garamond", "Baskerville", "Georgia", serif;
  --font-sans:  "Helvetica Neue", "Arial", sans-serif;
  --sidebar-width: 200px;
}
```

### Site title and tagline

Edit `docs/projects.md` — the `## Page Title` section at the top. Then re-run `npm run pipeline`. Alternatively edit the `<h1>` and `<p class="tagline">` directly in `index.html` between pipeline runs (they will be preserved since the renderer only touches the `#sidebar-nav` and `#projects-container` elements).

## Deployment

### GitHub Pages

```bash
git add docs/projects.md assets/ data/projects.json index.html
git commit -m "Update portfolio"
git push origin main
```

Enable GitHub Pages in repository Settings → Pages → Source: main branch, root folder. The site is then live at `https://username.github.io/repository-name`.

Because `index.html` is pre-baked, the site works on any static host (Netlify, Vercel, S3, etc.) without a build step on the server.

## Troubleshooting

**Projects not appearing after running the pipeline**
Check that `docs/projects.md` has `## Project N` headings and each project has at least a Title, Year, and Group field. Run `npm run build:dry` to inspect the JSON output.

**Images not loading**
Confirm the file exists in `assets/` and the path in `projects.md` matches exactly (paths are case-sensitive on Linux/macOS servers). Reference images as `../assets/filename.jpg`.

**Videos not embedding**
Supported platforms are Vimeo, YouTube, and Google Drive. For Google Drive, use the file sharing link (`/file/d/.../view`), not the folder link.

**Pipeline produced duplicate content**
This should not happen — the renderer uses comment markers (`<!-- PROJECTS_START -->` / `<!-- PROJECTS_END -->`) to make repeated runs idempotent. If you suspect duplication, open `index.html` and check for more than 7 `class="project"` elements. If found, delete the contents of `index.html` and replace it with the clean template, then re-run `npm run pipeline`.

**Styling looks wrong after editing CSS**
Hard-reload the browser (Cmd+Shift+R / Ctrl+Shift+R) to bypass the cache. The stylesheet uses a cache-busting version string in `index.html` — if you change the CSS significantly, increment the `?v=N` query string on the `<link>` tag.

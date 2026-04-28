# Quick Maintenance Guide

## 📝 Most Common Tasks

### Add a New Project (5 minutes)

1. Open `data/projects.json`
2. Copy this template:
```json
{
  "title": "Project Title",
  "year": 2024,
  "group": "Optional Series Name",
  "description": "<p>Your project description here.</p>",
  "images": [
    {
      "src": "../assets/image-filename.jpg",
      "caption": "Image caption"
    }
  ],
  "tools": ["Tool 1", "Tool 2"],
  "links": [
    {
      "label": "Link Text",
      "url": "https://..."
    }
  ]
}
```
3. Add it to the projects array (before the last `]`)
4. Save file
5. Upload images to `assets/` folder
6. Done! Changes appear immediately

### Upload Images

1. Add images to `assets/` folder
2. Reference in `projects.json` with path: `../assets/filename.jpg`
3. Supported: JPG, PNG, WebP, GIF

### Change Site Colors

Edit `css/style.css` and update these colors:

```css
--primary-bg: #ffffff;        /* Background */
--accent-color: #1a5f7a;      /* Links, buttons */
--accent-light: #e8f4f8;      /* Light accents */
--text-dark: #2c2c2c;         /* Main text */
--text-light: #666666;        /* Secondary text */
--border-color: #e0e0e0;      /* Borders */
```

### Update Site Title

Edit `index.html`:
```html
<h1>Your New Title</h1>
<p class="tagline">Your tagline</p>
```

### Delete a Project

1. Open `data/projects.json`
2. Find the project object
3. Delete the entire object (including curly braces `{ ... }`)
4. Make sure there's a comma after the previous object (if not last)
5. Save file

### Reorder Projects

Projects automatically sort by year (newest first). Change the `year` field to adjust order.

---

## 🔧 JSON Tips

**Valid JSON requires:**
- Quotes around all keys and string values: `"title": "My Title"`
- Commas between items: `{"a": 1, "b": 2}`
- NO trailing commas: `[1, 2, 3]` ✓ `[1, 2, 3,]` ✗
- Arrays with `[ ]`, objects with `{ }`

**Check your JSON:**
Use [jsonlint.com](https://www.jsonlint.com) to validate

---

## 📊 Field Quick Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✓ | Project name |
| `year` | number | ✓ | Used for sorting |
| `group` | string | | Series/collection name |
| `description` | string | | Can include HTML tags |
| `images` | array | | Array of image objects |
| `video` | string | | Vimeo/YouTube/Google Drive URL |
| `fileType` | string | | E.g., "images", "audio", "video" |
| `tools` | array | | Technologies/tools used |
| `collaborators` | array | | People involved |
| `datasets` | array | | Data sources |
| `links` | array | | External links |

---

## 🚀 Publishing Changes

### If using GitHub Pages:

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Add new project or update"

# Push to GitHub
git push origin main
```

Changes appear on your website in seconds.

### If editing on GitHub directly:

1. Go to github.com and open your repository
2. Navigate to the file you want to edit
3. Click the pencil icon
4. Make changes
5. Click "Commit changes"
6. Done!

---

## 📱 Testing

Test locally before pushing:

1. Open `index.html` in a web browser
2. Check that projects appear
3. Test image loading
4. Test video embeds
5. Test links work
6. Check on mobile (F12 → Toggle device toolbar)

---

## ❌ Common Mistakes

| Issue | Fix |
|-------|-----|
| Projects don't show | Check JSON syntax at [jsonlint.com](https://www.jsonlint.com) |
| Images don't load | Verify path starts with `../assets/` |
| Broken links | Make sure URLs are complete: `https://...` |
| Videos don't embed | Use full URL, test in browser first |
| Text formatting looks wrong | HTML tags need closing tags: `<p>text</p>` |
| Site looks broken | Clear browser cache (Ctrl+F5) |

---

## 📞 Need Help?

- **JSON validation**: [jsonlint.com](https://www.jsonlint.com)
- **HTML reference**: [mdn.io](https://mdn.io)
- **GitHub Pages help**: [pages.github.com](https://pages.github.com)

---

Remember: After editing `data/projects.json`, **save the file** and **commit/push** the changes!

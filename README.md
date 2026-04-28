# Selective Works Portfolio Website

A professional, easy-to-maintain portfolio website for an art professor, built as a static site compatible with GitHub Pages.

## Overview

This portfolio website is designed to be:
- **Easy to maintain**: Add, edit, or remove projects by editing a simple JSON file
- **Fast to load**: Static HTML/CSS/JavaScript, no database or server needed
- **GitHub Pages compatible**: Deploy directly from your GitHub repository
- **Responsive**: Works beautifully on desktop, tablet, and mobile devices
- **Professional**: Clean, academic design suitable for an art professor's work

## Project Structure

```
portfolio/
├── index.html                 # Main page (do not edit)
├── css/
│   └── style.css             # Styling (can customize colors/fonts)
├── js/
│   └── main.js               # JavaScript (loads projects, do not edit)
├── data/
│   └── projects.json         # 🔑 PROJECT DATA (edit this to manage projects)
├── assets/                   # Images and media files
├── docs/                     # Documentation
├── README.md                 # This file
└── .gitignore               # Git configuration

```

## Managing Your Portfolio

### Adding a New Project

1. Open `data/projects.json` in any text editor
2. Add a new project object to the `projects` array
3. Fill in the project details (see "Project Fields" section below)
4. Save the file
5. The changes appear automatically on your website

### Example: Adding a New Project

```json
{
  "title": "My New Project Title",
  "year": 2024,
  "group": "Project Series Name",
  "description": "<p>Project description here. You can use HTML tags like <em>emphasis</em> or <strong>bold</strong>.</p>",
  "images": [
    {
      "src": "../assets/my-image-1.jpg",
      "caption": "Image caption"
    }
  ],
  "tools": [
    "Tool 1",
    "Tool 2"
  ],
  "links": [
    {
      "label": "GitHub Repository",
      "url": "https://github.com/..."
    }
  ]
}
```

### Project Fields Reference

#### Required Fields

- **`title`** (string): Project title
- **`year`** (number): Year of creation (used for sorting)

#### Optional Fields

- **`group`** (string): Project series/group name (displays as a badge)
- **`description`** (string): Project description. Use HTML for formatting:
  - `<p>Paragraph</p>`
  - `<em>Italics</em>`
  - `<strong>Bold</strong>`
  - `<a href="url">Link</a>`

- **`images`** (array): Array of image objects
  ```json
  "images": [
    {
      "src": "../assets/image-1.jpg",
      "caption": "Optional caption"
    }
  ]
  ```

- **`video`** (string): Video URL (supports Vimeo, YouTube, or Google Drive)
  - Vimeo: `https://vimeo.com/553111781`
  - YouTube: `https://youtube.com/watch?v=...`
  - Google Drive: `https://drive.google.com/file/d/...`

- **`fileType`** (string): Type of media (e.g., "images", "online .mov", "audio")

- **`tools`** (array): List of tools/technologies used
  ```json
  "tools": ["Max/MSP", "OpenGL", "Python"]
  ```

- **`collaborators`** (array): Names of collaborators
  ```json
  "collaborators": ["Jane Doe", "John Smith"]
  ```

- **`datasets`** (array): Data sources or resources used
  ```json
  "datasets": [
    {
      "name": "NYC Open Data",
      "url": "https://data.cityofnewyork.us/..."
    }
  ]
  ```

- **`links`** (array): External links (GitHub, video links, etc.)
  ```json
  "links": [
    {
      "label": "GitHub Repository",
      "url": "https://github.com/..."
    },
    {
      "label": "Watch on Vimeo",
      "url": "https://vimeo.com/..."
    }
  ]
  ```

### Managing Images

1. Place images in the `assets/` folder
2. Reference them in `projects.json` with the path `../assets/filename.jpg`
3. Organize images by project:
   ```
   assets/
   ├── storhofdi-1.jpg
   ├── storhofdi-2.jpg
   ├── grimsey-1.jpg
   ├── stefan-1.jpg
   └── ...
   ```

4. Supported formats: JPG, PNG, WebP, GIF

### Sorting Projects

Projects automatically display in **reverse chronological order** (newest first) based on the `year` field. The website sorts them when loading.

## Customization

### Changing Colors and Fonts

Edit `css/style.css` to customize the design:

```css
/* Change primary accent color */
--accent-color: #1a5f7a;        /* Teal blue */

/* Change fonts */
--font-serif: 'Georgia', serif;    /* For headings */
--font-sans: system fonts;          /* For body text */

/* Adjust spacing */
--spacing-lg: 2rem;
```

### Changing the Site Title and Tagline

Edit `index.html`:

```html
<h1>Your Site Title</h1>
<p class="tagline">Your tagline here</p>
```

## Deployment to GitHub Pages

### Initial Setup

1. Create a GitHub account (if you don't have one)
2. Create a new repository named `username.github.io` (replace `username` with your GitHub username)
3. Clone the repository locally
4. Copy the portfolio files into the repository
5. Push to GitHub

### Updating Your Portfolio

After you've set up GitHub Pages:

1. Edit `data/projects.json` locally
2. Add new images to the `assets/` folder
3. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio with new project"
   git push origin main
   ```

4. Changes appear on your website within seconds

### Alternative: Using GitHub Web Editor

You can edit files directly on GitHub without using the command line:

1. Go to your repository on GitHub
2. Navigate to `data/projects.json`
3. Click the pencil icon to edit
4. Make changes and click "Commit changes"
5. Changes appear on your website automatically

## Troubleshooting

### Projects not appearing?

- Check that `data/projects.json` is valid JSON (use an online JSON validator)
- Make sure all image paths start with `../assets/`
- Check browser console for errors (F12 → Console tab)

### Images not loading?

- Verify image files exist in the `assets/` folder
- Check that file paths in `projects.json` match exactly (case-sensitive on some servers)
- Use absolute paths if needed: `https://yourdomain.com/assets/image.jpg`

### Videos not embedding?

- Supported platforms: Vimeo, YouTube, Google Drive
- For Google Drive, use the full sharing link
- Test the video URL in a browser first

### Styling issues?

- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Make sure `css/style.css` is in the correct location
- Check browser console for CSS errors

## Tips and Best Practices

1. **Backup your work**: Keep a backup of your `data/projects.json` file
2. **Test locally**: Open `index.html` in a browser to preview changes
3. **Use meaningful file names**: Name images like `project-name-1.jpg`, not `image1.jpg`
4. **Optimize images**: Compress images before uploading (use TinyPNG.com)
5. **Validate JSON**: Use an online JSON validator when editing `projects.json`
6. **Use descriptive captions**: Add captions to images for context
7. **Keep descriptions concise**: Long descriptions may not fit well on smaller screens

## Browser Support

Works on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This portfolio template is provided as-is. Customize it as needed for your use.

## Support

For help with:
- **JSON formatting**: [JSON.org](https://www.json.org)
- **GitHub Pages**: [GitHub Pages Documentation](https://pages.github.com)
- **HTML/CSS**: [MDN Web Docs](https://developer.mozilla.org)

---

**Last updated**: April 2024

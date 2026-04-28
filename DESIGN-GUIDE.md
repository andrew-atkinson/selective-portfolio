# Design Variations Guide

The descriptions are now properly collapsible (they hide when > 50 words), and the images work as interactive thumbnails with a lightbox viewer.

## 📋 Side-by-Side Comparison

| Feature           | Minimal                     |
| ----------------- | --------------------------- |
| **Sidebar**       | Simple clean border         |
| **Project Cards** | No rounding, editorial      |
| **Images**        | Subtle refined borders      |
| **Text**          | Classic, refined, editorial |
| **Buttons**       | Simple, understated         |
| **Overall Feel**  | Sophisticated/Classic       |

---

## ✨ What's New Across All Designs

### Fixed Description Folding

- Descriptions over 50 words now properly collapse
- "Read Full Description" button expands them
- Word count displayed for long descriptions
- Smooth animation when expanding/collapsing

### Image Gallery as Thumbnails

- Images display as grid of small thumbnails
- Hover to see interactive magnifying glass icon
- Click any image to open fullscreen lightbox viewer
- Smooth zoom animation and caption display
- Mobile-friendly thumbnail grid

### Lightbox Viewer

- Full-screen image viewing
- Image captions displayed
- Click background or press Escape to close
- Smooth animations

### Sidebar Navigation

- Project listing with years
- Grouped by series/project type
- Click to smoothly scroll to project
- Mobile hamburger menu
- Responsive collapse on smaller screens

---

## 🔧 Customizing Your Chosen Design

You can customize it further:

### Change Colors

Open your chosen CSS file and modify the `:root` variables:

```css
:root {
  --accent-color: #yourcolor;
  --primary-bg: #yourcolor;
  --text-dark: #yourcolor;
  /* etc */
}
```

### Change Fonts

```css
--font-serif: "Your Font", serif;
--font-sans: "Your Font", sans-serif;
```

### Adjust Spacing

```css
--spacing-xl: 3rem; /* Increase for more spacious feel */
```

---

## 📱 Responsive Behavior

All three designs are fully responsive:

- **Desktop**: Full sidebar + wide content
- **Tablet**: Narrower sidebar, content adjusts
- **Mobile**: Sidebar becomes hamburger menu, full-width content

---

## 🚀 Deploying to GitHub Pages

No matter which design you choose:

1. Select your favorite CSS file in `index.html`
2. Push to GitHub
3. Your site automatically uses that design

You can always switch designs later by updating the CSS file link!

Enjoy your new portfolio! 🎉

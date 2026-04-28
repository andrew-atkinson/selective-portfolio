# Portfolio Setup & Design Selection Guide

Welcome! Your portfolio now has **fully working description folding, image thumbnails with lightbox**, and **3 radically different design options**. Here's how to get started.

---

## ✅ What's Fixed & New

### ✓ Description Folding Works Perfectly
- Descriptions longer than 50 words are now properly hidden
- "Read Full Description" button expands them with smooth animation
- Word count is displayed
- Works on desktop and mobile
- **Before**: Text was fully visible anyway  
- **Now**: Actually collapses and expands correctly

### ✓ Image Thumbnails
- Images display as small clickable thumbnails in a grid
- Hover shows a magnifying glass icon
- Click to open fullscreen lightbox viewer
- Smooth zoom animations
- Mobile-friendly responsive layout

### ✓ Sidebar Navigation
- Quick access to all projects
- Organized by project series/group
- Click to smoothly scroll to project
- Mobile hamburger menu
- Active project highlighting as you scroll

### ✓ 3 Completely Different Designs
- **Dark & Bold**: Cyberpunk modern gallery aesthetic
- **Playful & Colorful**: Vibrant experimental joyful design  
- **Minimalist Artsy**: Fine art publication elegance

---

## 🎨 Pick Your Design (1 minute)

### Step 1: Choose Your Favorite
Look at the descriptions below:

**Dark & Bold** (`style-dark.css`)
- Cyan/magenta/yellow neon on black
- Modern gallery, cutting-edge, edgy
- UPPERCASE monospace fonts
- Glowing effects, high contrast
- Best for: Contemporary/digital/experimental work

**Playful & Colorful** (`style-colorful.css`)
- Rainbow gradients on pastel background
- Fun, joyful, experimental vibe
- Playful rounded elements, animations
- Bold expressive typography
- Best for: Vibrant/participatory/community work

**Minimalist Artsy** (`style-minimal.css`)
- Warm beige with neutral palette
- Fine art magazine, editorial, sophisticated
- Classic serif fonts, lots of whitespace
- Refined and scholarly
- Best for: Conceptual/research/academic work

### Step 2: Edit `index.html`

Open `index.html` in your text editor and find this line:

```html
<link rel="stylesheet" href="css/style.css">
```

Replace it with your choice:

```html
<!-- Option 1: Dark & Bold Modern Gallery -->
<link rel="stylesheet" href="css/style-dark.css">

<!-- Option 2: Playful & Colorful -->
<link rel="stylesheet" href="css/style-colorful.css">

<!-- Option 3: Minimalist Artsy -->
<link rel="stylesheet" href="css/style-minimal.css">
```

### Step 3: Refresh Your Browser

Open `index.html` in your browser and refresh. Your new design appears instantly!

---

## 🖼️ How Everything Works Now

### Images (Fixed!)
1. Your images display as **small thumbnail grid**
2. Hover any thumbnail → see magnifying glass icon
3. Click thumbnail → fullscreen lightbox opens
4. Image shows at full size with caption
5. Click background or press **Escape** to close
6. Click the **X** button to close

### Descriptions (Fixed!)
1. Short descriptions (< 50 words) show fully
2. Long descriptions (> 50 words) start **collapsed**
3. Shows word count and "Read Full Description" button
4. Click button → smoothly expands to show full text
5. Click button again → collapses back
6. Works on mobile too!

### Sidebar Navigation
1. Left sidebar lists all projects with years
2. Projects grouped by series (e.g., "Harbor Studies")
3. Click any project name → smoothly scrolls to it
4. On mobile: hamburger menu icon (☰)
5. Click menu → sidebar slides down
6. Click a project → sidebar auto-closes

---

## 📁 Your File Structure

```
portfolio/
├── index.html                    ← Start here!
├── css/
│   ├── style.css                ← Original (still there)
│   ├── style-dark.css           ← Design 1
│   ├── style-colorful.css       ← Design 2
│   └── style-minimal.css        ← Design 3
├── js/
│   └── main.js                  ← Handles everything (fixed)
├── data/
│   └── projects.json            ← Your projects
├── assets/                       ← Your images & media
├── DESIGN-GUIDE.md              ← Complete design reference
├── DESIGN-PREVIEW.md            ← Visual preview of all 3
├── SETUP.md                     ← This file
├── README.md                    ← Full documentation
├── MAINTENANCE.md               ← Quick how-to guide
└── .gitignore                   ← Git configuration
```

---

## 🚀 Ready to Deploy

### On GitHub Pages

1. **Create repository** (if not already): `username.github.io`
2. **Push your portfolio folder** to GitHub
3. **Enable GitHub Pages** in settings
4. **Live in seconds!** → `username.github.io`

### To Update Later

Just edit `data/projects.json` and push:

```bash
git add .
git commit -m "Update portfolio with new project"
git push origin main
```

Or edit directly on GitHub's web interface!

---

## 🎯 Quick Decision Matrix

| Your Work Type | Best Design | Why |
|---|---|---|
| Digital/tech/experimental | Dark & Bold | Modern, edgy, cutting-edge feel |
| Installation/participatory/fun | Playful & Colorful | Joyful, expressive, vibrant |
| Conceptual/research/academic | Minimalist Artsy | Refined, scholarly, sophisticated |
| Photography/images dominant | Minimalist Artsy | Lets images shine without distraction |
| Mixed media/hybrid | Playful & Colorful | Accommodates variety with energy |
| Gallery/institution | Dark & Bold | Contemporary and professional |

---

## 💡 Pro Tips

1. **Test all three first**: Open each design in separate browser tabs
2. **Check mobile**: Each design looks different on phones
3. **Get feedback**: Ask colleagues which design best represents your work
4. **Take your time**: No rush, you can always change later
5. **Customize further**: Once you pick, you can tweak colors in the CSS

---

## 🔍 Testing Your Choice

### Desktop
1. Open `index.html` in browser
2. Click an image → lightbox should open
3. Click "Read Full Description" → text should expand
4. Click a project in sidebar → page scrolls to it

### Mobile (Responsive)
1. Resize browser window small (480px)
2. Hamburger menu (☰) appears
3. Click menu → sidebar opens
4. Images still clickable and expand
5. Text still expands nicely

---

## 📞 Troubleshooting

### Images don't show in lightbox?
- Check image paths in `data/projects.json`
- Path should start with `../assets/`
- Make sure image files exist in `assets/` folder

### Design not changing?
- Make sure you edited `index.html` correctly
- Check the CSS file name is spelled right
- Refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache if needed

### Description toggle button not working?
- Check your browser console (F12) for errors
- Make sure `js/main.js` loaded
- Try a different browser

---

## 🎨 Next Steps

1. **Pick your favorite design** (1 minute)
2. **Edit index.html** to use that CSS file (30 seconds)
3. **Test in browser** (1 minute)
4. **Push to GitHub** and share your portfolio!

---

## 📖 Full Documentation

- **`DESIGN-GUIDE.md`**: Complete design reference, customization tips
- **`DESIGN-PREVIEW.md`**: Visual previews of all three designs
- **`README.md`**: How to add projects, manage content
- **`MAINTENANCE.md`**: Quick how-to for common tasks

---

## Questions?

Everything is documented! Start with:
1. **Just want to pick a design?** → Read this file
2. **Want to understand each design?** → Read `DESIGN-PREVIEW.md`
3. **Want to customize colors/fonts?** → Read `DESIGN-GUIDE.md`
4. **Want to add new projects?** → Read `README.md` or `MAINTENANCE.md`

---

**You're all set! Pick your design and go! 🎉**

Your portfolio is now:
- ✅ Fully functional with proper description folding
- ✅ Beautiful image galleries with lightbox
- ✅ Easy to navigate with sidebar
- ✅ Ready with 3 great design options
- ✅ Completely customizable
- ✅ GitHub Pages ready

Enjoy! 🚀

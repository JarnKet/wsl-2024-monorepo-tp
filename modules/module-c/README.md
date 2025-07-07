# Lyon Heritage Sites - WorldSkills Web Technologies Project

A React-based web application for showcasing Lyon's heritage sites, built for the WorldSkills competition.

## Features

- **Content Management**: Reads `.html` and `.txt` files from `content-pages` folder
- **Dynamic Routing**: Support for nested folders and content organization
- **Search Functionality**: Full-text search with multiple keyword support using `/` separator
- **Tag System**: Filter content by tags
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built with accessibility best practices
- **Interactive Elements**:
  - Cover image spotlight effect following mouse
  - Clickable images with modal enlargement
  - Sticky sidebar on content pages
  - Drop cap typography on first paragraphs

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContentList.jsx     # Lists pages and folders
│   ├── ContentRenderer.jsx # Renders .html/.txt content
│   ├── CoverImage.jsx      # Cover image with spotlight effect
│   ├── ImageModal.jsx      # Image enlargement modal
│   ├── Layout.jsx          # Main app layout
│   └── SearchBox.jsx       # Search input component
├── contexts/            # React contexts
│   └── ContentProvider.jsx # Content management state
├── pages/              # Route components
│   ├── HomePage.jsx        # Main listing page
│   ├── HeritagePage.jsx    # Individual heritage site pages
│   └── TagPage.jsx         # Tag filtering page
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Content Structure

The application expects content files in a `public/content-pages/` directory:

```
public/content-pages/
├── images/                    # All images referenced in content
│   ├── basilique-notre-dame.jpg
│   ├── vieux-lyon.jpg
│   └── ...
├── 2024-09-01-example-page.html
├── 2024-09-15-another-page.txt
└── subfolder/
    ├── 2024-10-01-nested-page.html
    └── ...
```

### Content File Format

**Front-matter (optional):**
```
---
title: Page Title
tags: tag1, tag2, tag3
cover: image-filename.jpg
summary: Brief description of the content
draft: false
---
```

**HTML Files (.html):**
- Content after front-matter is rendered as HTML
- Image paths are automatically prefixed with `/content-pages/images/`

**Text Files (.txt):**
- Each line becomes a `<p>` paragraph
- Lines with just image filenames become `<img>` tags
- First paragraph gets drop-cap styling

## URL Structure

- `/XX_module_c/` - Home page with all content
- `/XX_module_c/heritages/[page-slug]` - Individual heritage site
- `/XX_module_c/heritages/[folder]/[page-slug]` - Nested content
- `/XX_module_c/tags/[tag-name]` - Pages filtered by tag
- `/?search=[query]` - Search results

## Key Features Implementation

### Cover Image Spotlight Effect
The cover images include a radial gradient mask that follows the mouse cursor, creating a spotlight effect as specified in the requirements.

### Content Filtering
- **Date filtering**: Only shows pages with dates <= today
- **Draft filtering**: Hides pages marked as `draft: true`
- **Filename validation**: Only shows files matching `YYYY-MM-DD-*` pattern

### Search Functionality
- Searches both title and content
- Supports multiple keywords separated by `/`
- Uses OR logic for multiple keywords

### Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus management for modals

### Social Sharing
Each heritage site page includes Open Graph meta tags for social media sharing.

## Browser Support

Optimized for Google Chrome as specified in the requirements. Uses modern CSS features including:
- CSS Grid and Flexbox
- CSS Custom Properties
- CSS Masks for spotlight effect

## Deployment Notes

- Update `XX` in configuration files to match your seat number
- Ensure `content-pages` folder is accessible in production
- Images should be placed in `public/content-pages/images/`
- The app uses client-side routing; configure server for SPA support

## Development Guidelines

- Component files use `.jsx` extension
- CSS classes follow Tailwind utility-first approach
- State management via React Context API
- No external API dependencies - all content is file-based
- No localStorage usage (as per artifacts restrictions)

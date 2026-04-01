# Johnson Performance Co. — Website

Premium personal training website for Johnson Performance Co.

**Live site:** [johnsonperformanceco.com](https://johnsonperformanceco.com)

## Tech Stack
- Vanilla HTML5, CSS3, JavaScript
- Hosted on GitHub Pages
- Google Fonts (Cormorant Garamond + DM Sans)
- CSS scroll-driven animations + IntersectionObserver
- Calendly embed for booking

## Setup
1. Clone the repo
2. Open `index.html` in a browser — no build step needed
3. Push to GitHub, enable Pages from `main` branch

## DNS (GoDaddy)
A Records → GitHub Pages IPs:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

CNAME `www` → `yourusername.github.io`

## Structure
```
├── index.html          # Single-page site
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # Animations, nav, interactions
├── images/             # Gym photos, portraits, client pics
├── CNAME               # Custom domain for GitHub Pages
└── README.md
```

## Content Updates
- Testimonials: Edit the `#results` section in `index.html`
- Photos: Drop images into `/images/` and update `src` attributes
- Scheduling: Swap Calendly link in the booking section

---
Built by [NeuralFlow AI](https://neuralflowai.io)

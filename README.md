# Wanshika Arora — Portfolio

Static site: plain HTML, CSS and a small vanilla JS file. No build step, no dependencies.

```
index.html              Homepage (built from the "Portfolio-Home Page" Figma frame)
work/<project>/         Case studies: tandem, bitgrit, lumineve, rbl-mahindra, rbl-nova, cbps
assets/css/style.css    Homepage styles; fluid from 1440px desktop down to phones
assets/js/main.js       Homepage: scroll reveals, parallax, nav hide/show, ring spin, cursor pill
assets/css/case.css     Case study styles
assets/js/case.js       Case studies: object reveals, parallax, idle float, cursor tilt, progress bar
assets/svg/             Display type exported as exact vectors from Figma
assets/img/             Project images, 1x and 2x
```

## Preview locally

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321

## Deploy

Drag the whole folder onto https://app.netlify.com/drop, or push it to GitHub and import it in Vercel/Netlify (framework: "Other", no build command, output directory: `.`). Then add your domain in the host's Domains settings and set the DNS records it gives you at your registrar.

## How the case studies are built

Each case study is its Figma frame rendered pixel-exact and cut into full-width sections
(`img/b*.webp`, with 2x versions for retina). Objects that sit on top of the composition
(phones, cards, stickers, packaging) are rendered as separate transparent layers (`img/l*.webp`)
so they can float, rise in and tilt toward the cursor. At rest everything lines up with the design.

On phones, sections that contain small paragraphs swap to a version with that text removed
(`img/b*-m-1x.webp`), and the same text follows as real, readable HTML.

The scripts that generated this live in `../tools/case-studies/` (one config per page in `cfg/`).
Re-exporting a frame as SVG from Figma and re-running them regenerates that page.

## Fonts

Sans: Manrope · Script: Pinyon Script · Serif (card titles only): Junge, a stand-in. Display lettering
(name, tagline, headings, "What I actually do") is exported as vector from Figma, so it matches exactly.
To use the real serif, add its webfont files and change `--serif` in `style.css`.

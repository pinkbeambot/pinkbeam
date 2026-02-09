# Pink Beam Website

The marketing website for Pink Beam — a Living Intelligence Factory.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion + GSAP
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## Getting Started

```bash
# Clone the repository
git clone https://github.com/pinkbeambot/pinkbeam-website.git
cd pinkbeam-website

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run test:ui` | Run tests with UI |

## Project Structure

```
app/              # Next.js App Router pages
components/       # React components
  ui/             # shadcn/ui components
hooks/            # Custom React hooks
lib/              # Utility functions
types/            # TypeScript type definitions
public/           # Static assets
  images/         # Optimized images
  videos/         # Video assets
styles/           # Global styles, Tailwind config
content/          # CMS content (Sanity)
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for required variables.

## Design System

- **Colors:** Neutral base with semantic tokens
- **Typography:** System font stack (optimized for performance)
- **Spacing:** 4px base grid (Tailwind default)
- **Animations:** 60fps target, purposeful motion

## Performance Budget

- First Contentful Paint: < 1.0s
- Time to Interactive: < 3.0s
- Lighthouse Score: 95+
- JS Bundle: < 200KB gzipped

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Private — All rights reserved.

# Contributing to Pink Beam Website

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define types in `/types` directory
- Avoid `any` — use `unknown` with type guards

### Components
- Use functional components with hooks
- Props interface required for all components
- Default exports for page components
- Named exports for shared components

### Styling
- Tailwind CSS for all styling
- Use `cn()` utility from `lib/utils` for conditional classes
- Follow mobile-first responsive design
- Support dark mode (when implemented)

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `PascalCase.ts` or `types.ts`
- Constants: `SCREAMING_SNAKE_CASE`

## Git Workflow

1. Create feature branch from `main`
2. Make focused, atomic commits
3. Write descriptive commit messages
4. Open PR for review
5. Squash merge after approval

## Testing

- Write tests for utility functions
- Write tests for complex components
- Run tests before committing: `npm run test`

## Performance

- Lazy load below-fold content
- Optimize images before committing
- Use `will-change` sparingly for animations
- Profile with Chrome DevTools

## Accessibility

- WCAG 2.1 AA minimum
- Keyboard navigation for all interactions
- ARIA labels where needed
- Test with screen readers

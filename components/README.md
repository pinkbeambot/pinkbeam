# Pink Beam Component Library

> A cosmic design system featuring our signature pink beam aesthetic, smooth animations, and accessible components.

---

## Table of Contents

- [Installation](#installation)
- [UI Components](#ui-components)
- [Animation Components](#animation-components)
- [Layout Components](#layout-components)
- [Theme & Colors](#theme--colors)
- [Typography](#typography)

---

## Installation

Components are organized in the `components/` directory:

```tsx
// Import from main components index
import { Button, Card, FadeIn, Container } from "@/components";

// Or import from specific categories
import { Button, Card } from "@/components/ui";
import { FadeIn, SlideUp } from "@/components/animations";
import { Container, Section } from "@/components/layout";
```

---

## UI Components

### Button

Interactive button with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui";

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="beam">Beam</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With icons
<Button>
  <Sparkles className="w-4 h-4 mr-2" />
  Get Started
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| secondary \| outline \| ghost \| beam \| destructive \| link` | `default` | Visual style variant |
| `size` | `default \| sm \| lg \| xs \| icon \| icon-sm \| icon-lg` | `default` | Button size |
| `asChild` | `boolean` | `false` | Render as child element |

---

### Card

Versatile container for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";

<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="default">Standard card</Card>
<Card variant="elevated">Stronger shadow</Card>
<Card variant="outlined">Border only</Card>
<Card variant="beam">Pink beam glow</Card>
<Card variant="glow">Subtle pink glow</Card>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| elevated \| outlined \| beam \| glow` | `default` | Card visual style |

---

### Input

Form input with validation support.

```tsx
import { Input } from "@/components/ui";

// Default
<Input placeholder="Enter text" />

// With error state
<Input 
  error 
  errorMessage="This field is required" 
  placeholder="Enter email"
/>

// Disabled
<Input disabled placeholder="Disabled" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | - | Error message text |

---

### Badge

Status indicators and labels.

```tsx
import { Badge } from "@/components/ui";

// Basic variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Brand colors
<Badge variant="pink">Pink</Badge>
<Badge variant="purple">Purple</Badge>
<Badge variant="cyan">Cyan</Badge>
<Badge variant="amber">Amber</Badge>
<Badge variant="indigo">Indigo</Badge>

// Outline variants
<Badge variant="outline-pink">Outline Pink</Badge>

// Soft variants
<Badge variant="soft-pink">Soft Pink</Badge>
<Badge variant="soft-purple">Soft Purple</Badge>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | See above | `default` | Badge color/style variant |
| `asChild` | `boolean` | `false` | Render as child element |

---

### Avatar

User avatar with fallback.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui";

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback className="bg-pink-500 text-white font-display">
    JD
  </AvatarFallback>
</Avatar>
```

---

### Dialog

Modal dialog for focused interactions.

```tsx
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text
      </DialogDescription>
    </DialogHeader>
    <div>Content goes here</div>
  </DialogContent>
</Dialog>
```

---

### Sheet

Slide-out panel for mobile menus and sidebars.

```tsx
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>
        Sheet description text
      </SheetDescription>
    </SheetHeader>
    <div>Content goes here</div>
  </SheetContent>
</Sheet>
```

---

## Animation Components

All animation components use Framer Motion and support scroll-triggered animations.

### FadeIn

Fade in animation with directional options.

```tsx
import { FadeIn } from "@/components/animations";

// Basic fade in
<FadeIn>
  <h1>Hello World</h1>
</FadeIn>

// Directional fade
<FadeIn direction="up" delay={0.2}>
  <p>Slides up while fading in</p>
</FadeIn>

// Fade in on mount (no scroll trigger)
import { FadeInOnMount } from "@/components/animations";
<FadeInOnMount delay={0.5}>
  <p>Fades in when component mounts</p>
</FadeInOnMount>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `up \| down \| left \| right \| none` | `up` | Direction of motion |
| `delay` | `number` | `0` | Delay before animation (seconds) |
| `duration` | `number` | `0.5` | Animation duration (seconds) |
| `once` | `boolean` | `true` | Only animate once |
| `as` | `string` | `div` | HTML element to render |

---

### SlideUp

Slide up animation with customizable distance.

```tsx
import { SlideUp } from "@/components/animations";

<SlideUp>
  <Card>Content slides up</Card>
</SlideUp>

<SlideUp delay={0.2} distance={40} duration={0.6}>
  <Card>Custom distance and duration</Card>
</SlideUp>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `0` | Delay before animation |
| `duration` | `number` | `0.5` | Animation duration |
| `distance` | `number` | `30` | Slide distance in pixels |
| `once` | `boolean` | `true` | Only animate once |

### SlideIn

Slide in from any direction.

```tsx
import { SlideIn } from "@/components/animations";

<SlideIn direction="left">
  <p>Slides in from left</p>
</SlideIn>

<SlideIn direction="right" delay={0.2}>
  <p>Slides in from right</p>
</SlideIn>
```

---

### StaggerContainer

Container that staggers animations of its children.

```tsx
import { StaggerContainer } from "@/components/animations";

<StaggerContainer staggerDelay={0.1} direction="up">
  <Card>First item</Card>
  <Card>Second item</Card>
  <Card>Third item</Card>
</StaggerContainer>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `staggerDelay` | `number` | `0.1` | Delay between children |
| `direction` | `up \| down \| left \| right \| none` | `up` | Animation direction |
| `duration` | `number` | `0.5` | Animation duration |
| `once` | `boolean` | `true` | Only animate once |
| `distance` | `number` | `20` | Movement distance |

---

### StaggerGrid

Pre-configured staggered grid layout.

```tsx
import { StaggerGrid } from "@/components/animations";

<StaggerGrid columns={3} staggerDelay={0.1}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
  <Card>Item 5</Card>
  <Card>Item 6</Card>
</StaggerGrid>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Number of grid columns |
| `staggerDelay` | `number` | `0.1` | Delay between items |
| `once` | `boolean` | `true` | Only animate once |

---

## Layout Components

### Container

Max-width container with responsive padding.

```tsx
import { Container } from "@/components/layout";

<Container>
  <p>Default max-width container</p>
</Container>

<Container size="sm">
  <p>Small container (max-w-3xl)</p>
</Container>

<Container size="lg" padding={false}>
  <p>Large container without padding</p>
</Container>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `sm \| md \| lg \| xl \| full` | `xl` | Max-width size |
| `padding` | `boolean` | `true` | Include responsive padding |

---

### Section

Page section wrapper with background and padding options.

```tsx
import { Section } from "@/components/layout";

<Section id="features" background="muted" padding="lg">
  <Container>
    <h2>Features</h2>
  </Container>
</Section>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Section ID for anchor links |
| `background` | `default \| muted \| sunken \| gradient \| void` | `default` | Background style |
| `padding` | `sm \| md \| lg \| xl` | `lg` | Vertical padding size |

---

### SectionContainer

Combined Section + Container for common use cases.

```tsx
import { SectionContainer } from "@/components/layout";

<SectionContainer 
  id="hero" 
  background="void" 
  padding="xl"
  containerSize="lg"
>
  <h1>Hero Content</h1>
</SectionContainer>
```

---

### SplitSection

Two-column layout section.

```tsx
import { SplitSection } from "@/components/layout";

<SplitSection background="default" gap="lg">
  <div>
    <h2>Left Content</h2>
  </div>
  <div>
    <p>Right Content</p>
  </div>
</SplitSection>

// Reversed order on desktop
<SplitSection reverse>
  <div>Content</div>
  <div>Image</div>
</SplitSection>
```

---

## Theme & Colors

### CSS Variables

Colors are available as CSS custom properties:

```css
/* Primary Pink */
var(--color-pink-500);  /* #FF006E - Primary */

/* Void Black */
var(--color-void-900);  /* #0A0A0F - Dark background */

/* Semantic */
var(--color-success-500);  /* #22C55E */
var(--color-warning-500);  /* #F59E0B */
var(--color-error-500);    /* #EF4444 */
var(--color-info-500);     /* #3B82F6 */
```

### Tailwind Classes

```tsx
// Brand colors
<div className="bg-pink-500 text-white" />
<div className="bg-void-900 text-white" />
<div className="bg-success-500" />
<div className="bg-error-500" />

// Gradients
<div className="bg-gradient-beam" />
<div className="bg-gradient-cosmic" />
<div className="text-gradient-beam" />

// Glow effects
<div className="glow-pink-sm" />
<div className="glow-pink-md" />
<div className="shadow-beam" />
```

### Dark Mode

The design system supports automatic dark mode:

```tsx
// In layout.tsx
<html lang="en" className="dark">
  <body>...</body>
</html>

// Or toggle dynamically
<html lang="en" className={isDark ? "dark" : ""}>
```

---

## Typography

### Font Families

```tsx
// Display (Space Grotesk)
<h1 className="font-display">Headlines & Display</h1>

// Body (Inter)
<p className="font-body">Body text and paragraphs</p>

// Mono (JetBrains Mono)
<code className="font-mono">Code snippets</code>
```

### Type Scale

```tsx
// Display sizes
<h1 className="text-hero">Hero (64px)</h1>
<h1 className="text-h1">H1 (40px)</h1>
<h2 className="text-h2">H2 (32px)</h2>
<h3 className="text-h3">H3 (24px)</h3>
<h4 className="text-h4">H4 (20px)</h4>

// Body sizes
<p className="text-lead">Lead (18px)</p>
<p className="text-body">Body (16px)</p>
<p className="text-small">Small (14px)</p>
<p className="text-caption">Caption (12px)</p>
<p className="text-tiny">Tiny (10px)</p>
```

### Typography is Responsive

All typography scales automatically for mobile:
- `text-hero`: 64px → 48px → 40px
- `text-h1`: 40px → 36px → 32px
- `text-h2`: 32px → 28px → 24px

---

## Examples

### Hero Section

```tsx
import { Button, Badge } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { SectionContainer } from "@/components/layout";

<SectionContainer background="void" padding="xl">
  <div className="text-center">
    <FadeIn>
      <Badge variant="pink">New Release</Badge>
    </FadeIn>
    <FadeIn delay={0.1}>
      <h1 className="text-hero font-display font-bold text-gradient-beam">
        Pink Beam
      </h1>
    </FadeIn>
    <FadeIn delay={0.2}>
      <p className="text-lead text-muted-foreground">
        Build faster, deploy smarter
      </p>
    </FadeIn>
    <FadeIn delay={0.3}>
      <Button size="lg" variant="beam">Get Started</Button>
    </FadeIn>
  </div>
</SectionContainer>
```

### Feature Grid

```tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { StaggerGrid } from "@/components/animations";
import { SectionContainer } from "@/components/layout";

const features = [
  { title: "Fast", description: "Lightning quick deployments" },
  { title: "Secure", description: "Enterprise-grade security" },
  { title: "Scalable", description: "Grow without limits" },
];

<SectionContainer>
  <StaggerGrid columns={3}>
    {features.map((feature) => (
      <Card key={feature.title}>
        <CardHeader>
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
      </Card>
    ))}
  </StaggerGrid>
</SectionContainer>
```

---

## View Design System

Visit `/design-system` in your browser to see all components in action.

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FadeIn, SlideUp, StaggerContainer, StaggerGrid } from "@/components/animations";
import { Container, Section, SectionContainer } from "@/components/layout";
import { Zap, Star, Code, Sparkles, Menu } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <SectionContainer 
        background="void" 
        padding="xl"
        className="relative overflow-hidden"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-beam-glow opacity-50 pointer-events-none" />
        
        <div className="relative z-10 text-center">
          <FadeIn>
            <Badge variant="pink" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Design System v1.0
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-hero font-display font-bold text-gradient-beam mb-6">
              Pink Beam Design System
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto mb-8">
              A cosmic design system built for the future. Featuring our signature pink beam aesthetic, 
              smooth animations, and accessible components.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="font-display">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="font-display">
                Documentation
              </Button>
            </div>
          </FadeIn>
        </div>
      </SectionContainer>

      {/* Typography Section */}
      <SectionContainer background="default" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Typography</h2>
          <p className="text-body text-muted-foreground mb-8">
            Our typographic system uses Space Grotesk for display and Inter for body text.
          </p>
        </SlideUp>
        
        <StaggerGrid columns={1} className="gap-6">
          <Card>
            <CardContent className="space-y-6">
              <div>
                <span className="text-caption text-muted-foreground">Hero (64px)</span>
                <h1 className="text-hero font-display font-bold">The Cosmos Awaits</h1>
              </div>
              <div>
                <span className="text-caption text-muted-foreground">H1 (40px)</span>
                <h1 className="text-h1 font-display font-bold">Build for the Future</h1>
              </div>
              <div>
                <span className="text-caption text-muted-foreground">H2 (32px)</span>
                <h2 className="text-h2 font-display font-semibold">Developer Experience</h2>
              </div>
              <div>
                <span className="text-caption text-muted-foreground">H3 (24px)</span>
                <h3 className="text-h3 font-display font-semibold">Seamless Integration</h3>
              </div>
              <div>
                <span className="text-caption text-muted-foreground">Lead (18px)</span>
                <p className="text-lead">Build faster, deploy smarter, and scale effortlessly with our cosmic platform.</p>
              </div>
              <div>
                <span className="text-caption text-muted-foreground">Body (16px)</span>
                <p className="text-body">Our platform provides everything you need to build modern applications with confidence. From deployment to scaling, we have you covered.</p>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>
      </SectionContainer>

      {/* Colors Section */}
      <SectionContainer background="sunken" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Colors</h2>
          <p className="text-body text-muted-foreground mb-8">
            Our cosmic color palette featuring the signature pink beam.
          </p>
        </SlideUp>
        
        <StaggerGrid columns={3}>
          {/* Pink Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Pink Beam</CardTitle>
              <CardDescription>Primary brand color</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {["500", "400", "300", "600", "700"].map((shade) => (
                <div key={shade} className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: shade === "500" ? "#FF006E" : shade === "400" ? "#FF4D94" : shade === "300" ? "#FF80B3" : shade === "600" ? "#E6005E" : "#CC0055" }}
                  />
                  <span className="text-small font-mono">{shade}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Void Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Void Black</CardTitle>
              <CardDescription>Dark backgrounds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {["900", "800", "700", "600", "500"].map((shade) => (
                <div key={shade} className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: shade === "900" ? "#0A0A0F" : shade === "800" ? "#0F0F17" : shade === "700" ? "#1A1A24" : shade === "600" ? "#2A2A3C" : "#525266" }}
                  />
                  <span className="text-small font-mono">{shade}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Semantic Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Semantic</CardTitle>
              <CardDescription>Status colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success-500" />
                <span className="text-small font-mono">Success</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-warning-500" />
                <span className="text-small font-mono">Warning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-error-500" />
                <span className="text-small font-mono">Error</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-info-500" />
                <span className="text-small font-mono">Info</span>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>
      </SectionContainer>

      {/* Buttons Section */}
      <SectionContainer background="default" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Buttons</h2>
          <p className="text-body text-muted-foreground mb-8">
            Interactive button components with multiple variants and sizes.
          </p>
        </SlideUp>
        
        <StaggerGrid columns={2}>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="beam">Beam</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </CardContent>
          </Card>
        </StaggerGrid>
      </SectionContainer>

      {/* Cards Section */}
      <SectionContainer background="sunken" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Cards</h2>
          <p className="text-body text-muted-foreground mb-8">
            Versatile card components for content organization.
          </p>
        </SlideUp>
        
        <StaggerGrid columns={4}>
          <Card>
            <CardHeader>
              <CardTitle>Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-small text-muted-foreground">Standard card with border and subtle shadow.</p>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-small text-muted-foreground">Card with stronger shadow for emphasis.</p>
            </CardContent>
          </Card>
          
          <Card variant="beam">
            <CardHeader>
              <CardTitle>Beam</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-small text-muted-foreground">Card with pink beam glow effect.</p>
            </CardContent>
          </Card>
          
          <Card variant="glow">
            <CardHeader>
              <CardTitle>Glow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-small text-muted-foreground">Card with subtle pink glow on hover.</p>
            </CardContent>
          </Card>
        </StaggerGrid>
      </SectionContainer>

      {/* Badges Section */}
      <SectionContainer background="default" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Badges</h2>
          <p className="text-body text-muted-foreground mb-8">
            Status indicators and labels with multiple color options.
          </p>
        </SlideUp>
        
        <StaggerContainer className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="pink">Pink</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="cyan">Cyan</Badge>
          <Badge variant="amber">Amber</Badge>
          <Badge variant="indigo">Indigo</Badge>
          <Badge variant="outline-pink">Outline Pink</Badge>
          <Badge variant="soft-pink">Soft Pink</Badge>
          <Badge variant="soft-purple">Soft Purple</Badge>
        </StaggerContainer>
      </SectionContainer>

      {/* Form Elements */}
      <SectionContainer background="sunken" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Form Elements</h2>
          <p className="text-body text-muted-foreground mb-8">
            Input components with validation states.
          </p>
        </SlideUp>
        
        <StaggerGrid columns={2}>
          <Card>
            <CardHeader>
              <CardTitle>Input States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-small font-medium mb-1.5 block">Default</label>
                <Input placeholder="Enter your email" />
              </div>
              <div>
                <label className="text-small font-medium mb-1.5 block">With Error</label>
                <Input 
                  placeholder="Enter your email" 
                  error 
                  errorMessage="Please enter a valid email address"
                  defaultValue="invalid-email"
                />
              </div>
              <div>
                <label className="text-small font-medium mb-1.5 block">Disabled</label>
                <Input placeholder="Disabled input" disabled />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Avatars</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 items-center">
              <Avatar>
                <AvatarFallback className="bg-pink-500 text-white font-display">JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-accent-purple text-white font-display">AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-accent-cyan text-white font-display">MK</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
        </StaggerGrid>
      </SectionContainer>

      {/* Dialog & Sheet */}
      <SectionContainer background="default" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2">Overlays</h2>
          <p className="text-body text-muted-foreground mb-8">
            Dialog and Sheet components for modal interactions.
          </p>
        </SlideUp>
        
        <StaggerContainer className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Cosmic Dialog</DialogTitle>
                <DialogDescription>
                  This is a modal dialog with our signature styling.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-body text-muted-foreground">
                  Dialogs are perfect for focused tasks and confirmations.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu className="w-4 h-4 mr-2" />
                Open Sheet
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-display">Navigation</SheetTitle>
                <SheetDescription>
                  Slide-out panels for mobile menus and sidebars.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start">Home</Button>
                <Button variant="ghost" className="w-full justify-start">Features</Button>
                <Button variant="ghost" className="w-full justify-start">Pricing</Button>
                <Button variant="ghost" className="w-full justify-start">About</Button>
              </div>
            </SheetContent>
          </Sheet>
        </StaggerContainer>
      </SectionContainer>

      {/* Animations Section */}
      <SectionContainer background="void" padding="lg">
        <SlideUp>
          <h2 className="text-h2 font-display font-semibold mb-2 text-white">Animations</h2>
          <p className="text-body text-muted-foreground mb-8">
            Smooth, purposeful animations powered by Framer Motion.
          </p>
        </SlideUp>
        
        <StaggerGrid columns={3}>
          <Card variant="glow">
            <CardContent className="text-center py-8">
              <Zap className="w-8 h-8 mx-auto mb-4 text-pink-500" />
              <CardTitle className="mb-2">Fade In</CardTitle>
              <p className="text-small text-muted-foreground">Elements fade in smoothly as they enter the viewport.</p>
            </CardContent>
          </Card>
          
          <Card variant="glow">
            <CardContent className="text-center py-8">
              <Star className="w-8 h-8 mx-auto mb-4 text-accent-purple" />
              <CardTitle className="mb-2">Slide Up</CardTitle>
              <p className="text-small text-muted-foreground">Content slides up with a subtle motion effect.</p>
            </CardContent>
          </Card>
          
          <Card variant="glow">
            <CardContent className="text-center py-8">
              <Code className="w-8 h-8 mx-auto mb-4 text-accent-cyan" />
              <CardTitle className="mb-2">Stagger</CardTitle>
              <p className="text-small text-muted-foreground">Children animate in sequence with staggered delays.</p>
            </CardContent>
          </Card>
        </StaggerGrid>
      </SectionContainer>

      {/* Footer */}
      <Section background="sunken" padding="md">
        <Container>
          <div className="text-center">
            <p className="text-small text-muted-foreground">
              Pink Beam Design System — Built with Next.js, Tailwind CSS & shadcn/ui
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}

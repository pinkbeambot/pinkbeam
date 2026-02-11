import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-gradient-beam mb-4">404</h1>
        <h2 className="text-h2 font-display font-bold mb-4">
          Lost in the <span className="text-gradient-beam">Signal</span>
        </h2>
        <p className="text-lead text-muted-foreground mb-8">
          Even VALIS can't find this page. It might have been moved, deleted, or never existed.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

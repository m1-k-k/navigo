import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-navy">
          Navi<span className="text-coral">Go</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-navy/70 hover:text-navy">
            Features
          </a>
          <a href="#problems" className="text-sm text-navy/70 hover:text-navy">
            Why
          </a>
          <a href="#pricing" className="text-sm text-navy/70 hover:text-navy">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-navy/70 hover:text-navy"
          >
            Log in
          </Link>
          <Link
            href="/navigate"
            className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral/90"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-navy/5 bg-cream px-6 py-12">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-2xl font-bold text-navy">
          Navi<span className="text-coral">Go</span>
        </p>
        <p className="mt-2 text-sm text-navy/50">
          A smarter, safer way to get home. Built for young people in London.
        </p>
        <p className="mt-6 text-xs text-navy/40">
          © {new Date().getFullYear()} NaviGo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

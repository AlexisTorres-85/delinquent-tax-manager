import { Link } from 'react-router-dom';


const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Accessibility', href: '#' },
  { label: 'Contact', href: '#' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="shrink-0 flex items-center justify-between gap-4 px-6 h-14 bg-white text-xs text-muted-foreground border-t border-l-[length:var(--border-divider-dark-width)] border-divider-dark"

    >
      <div className="flex items-center gap-3">
        <span>&copy; {year} Kenosha County. All rights reserved.</span>
      </div>

      {/* Right: nav links */}
      <nav className="flex items-center gap-4">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

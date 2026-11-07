export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-outline-variant/10 bg-surface-container-lowest">
      <div className="px-8 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-4">
            <img
              src="/mark-light.webp"
              alt="HAYTHI.MG"
              className="h-10 w-auto object-contain"
            />
            <span className="font-label text-[10px] tracking-widest text-white/30 uppercase">
              © {year} HAYTHI.MG
            </span>
          </div>

          <nav className="flex flex-wrap gap-6">
            {[
              { label: 'Services', href: '#services' },
              { label: 'Projets', href: '#work' },
              { label: 'Contact', href: '#contact' },
              { label: 'Privacy', href: '#' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-label text-[10px] tracking-widest uppercase text-white/40 hover:text-tertiary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

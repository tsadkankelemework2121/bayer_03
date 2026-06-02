import logo from "../../assets/image.png";

interface HeaderProps {
  organization: string;
  title: string;
  month: string;
}

export function Header({ organization, title, month }: HeaderProps) {
  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Speed', href: '#speed' },
    { name: 'Compliance', href: '#compliance' },
    { name: 'Prohibited', href: '#prohibited' },
    { name: 'Distance', href: '#distance' },
    { name: 'Events', href: '#events' },
    { name: 'Violations', href: '#violations' },
  ];

  return (
    <header
      className="sticky top-0 z-50 animate-fade-in-up"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-card)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="mx-auto flex flex-col md:flex-row items-center justify-between"
        style={{
          maxWidth: '1360px',
          padding: 'var(--space-md) var(--space-lg)',
          gap: 'var(--space-md)'
        }}
      >
        {/* Logo and Title */}
        <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
          <img
            src={logo}
            alt="Bayer Logo"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <div>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                marginBottom: '2px',
              }}
            >
              {organization}
            </p>
            <h1
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center" style={{ gap: 'var(--space-lg)' }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Date Badge */}
        <div
          className="flex items-center shrink-0"
          style={{
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'var(--primary-light)',
            border: '1px solid rgba(138, 212, 36, 0.2)',
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {month}
          </span>
        </div>
      </div>
    </header>
  );
}

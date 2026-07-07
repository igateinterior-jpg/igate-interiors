import './globals.css';

export default function NotFound() {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          color: '#f5f5f5',
          fontFamily: "'Outfit', sans-serif",
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div
          className="glitch-text"
          data-text="404"
          style={{
            fontSize: 'clamp(100px, 20vw, 240px)',
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          404
        </div>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 22px)',
            color: '#a3a3a3',
            marginBottom: '2.5rem',
            maxWidth: '440px',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <a
          href="/en"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 36px',
            background: '#E5332A',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            borderRadius: '100px',
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(229, 51, 42, 0.25)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          <span>Back to Home</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </body>
    </html>
  );
}

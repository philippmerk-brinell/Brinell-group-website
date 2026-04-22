// Button.jsx — Primary pill, secondary rounded, ghost
const Button = ({ children, variant = 'primary', onClick, href, style }) => {
  const base = {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontWeight: 400,
    textTransform: 'uppercase',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 250ms cubic-bezier(0.4,0,0.2,1), color 250ms cubic-bezier(0.4,0,0.2,1), opacity 250ms, border-color 250ms',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };
  const variants = {
    primary: {
      border: '1px solid #fff',
      borderRadius: '9999px',
      padding: '14px 28px',
      fontSize: 13,
      letterSpacing: '1.4px',
    },
    secondary: {
      border: '1px solid #999',
      borderRadius: '9999px',
      padding: '14px 28px',
      fontSize: 13,
      letterSpacing: '1.4px',
    },
    ghost: {
      border: 0,
      padding: '8px 0',
      fontSize: 13,
      letterSpacing: '1.2px',
    },
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle =
    variant === 'primary' && hover ? { background: '#fff', color: '#000' }
    : variant === 'secondary' && hover ? { borderColor: '#fff' }
    : variant === 'ghost' && hover ? { opacity: 0.75 }
    : null;

  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      onClick={onClick}
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...hoverStyle, ...style }}
    >
      {children}
    </Tag>
  );
};

window.Button = Button;

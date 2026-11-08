export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" /><path d="m8 12 3 3 5-6" /></>,
    car: <path d="m5 10 2-5h10l2 5M3 10h18v8H3zM6 18v3M18 18v3M6 14h2M16 14h2" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    filter: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" /></>,
    expand: <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v1" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.car}</svg>;
}

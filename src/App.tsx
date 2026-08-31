import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

/**
 * The page is one continuous read, but its sections have to be linkable on
 * their own — a credential badge carries one URL, and a job application often
 * points at a specific part of the site. So each section has a real path that
 * renders the same page and lands on that section.
 *
 * Changing a published path breaks a link that may be impossible to update;
 * add a new one and keep the old, never rename. See AGENTS.md.
 */
export const SECTION_ROUTES = ['work', 'credentials', 'education', 'experience', 'skills', 'contact'] as const;

function ScrollToSection() {
  const { pathname } = useLocation();

  useEffect(() => {
    const id = pathname.replace(/^\/|\/$/g, '');
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    // 'auto' rather than 'smooth': arriving from an external link should land
    // on the section, not animate past several others on the way.
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToSection />
      <Routes>
        <Route path="/" element={<Home />} />
        {SECTION_ROUTES.map((s) => (
          <Route key={s} path={`/${s}`} element={<Home />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { SITE_MODEL } from './content/live';

/**
 * The portfolio is one scrolling page, but its sections must be linkable on
 * their own — a credential badge carries one URL, and a job application often
 * points at a specific part of the site.
 *
 * So every section id is also a real path. `/work` renders the page and lands
 * on the Selected work section, and survives a hard refresh because server.js
 * falls back to index.html.
 *
 * NEVER CHANGE A PUBLISHED PATH. Some of these links cannot be updated once
 * they are out in the world. Add a new one and keep the old.
 */
const SECTION_PATHS = SITE_MODEL.sections.map((s) => s.id);

function LandOnSection() {
  const { pathname } = useLocation();
  useEffect(() => {
    const id = pathname.replace(/^\/|\/$/g, '');
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    // 'auto', not 'smooth': arriving from an external link should land on the
    // section, not animate past every one above it on the way down.
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <LandOnSection />
      <Routes>
        <Route path="/" element={<Home />} />
        {SECTION_PATHS.map((id) => (
          <Route key={id} path={`/${id}`} element={<Home />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

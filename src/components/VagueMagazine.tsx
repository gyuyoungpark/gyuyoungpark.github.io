import { useEffect, useState } from 'react';
import { VagueLogo } from './VagueLogo';
import { VagueField } from './VagueField';
import './VagueMagazine.css';

export function VagueMagazine() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'VAGUE';
    window.scrollTo({ top: 0, behavior: 'instant' });
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => {
      document.title = previousTitle;
      preference.removeEventListener('change', updatePreference);
    };
  }, []);

  return (
    <div className="vague-magazine" lang="en">
      <VagueField paused={reducedMotion} reducedMotion={reducedMotion} resetKey={0} />
      <header className="vm-navigation">
        <a className="vm-home" href="/#columns"><span aria-hidden="true">←</span>Gyuyoung Park</a>
      </header>
      <div className="vm-center">
        <h1 className="vm-masthead" translate="no"><VagueLogo /></h1>
      </div>
    </div>
  );
}

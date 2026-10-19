import { useEffect, useState } from 'react';
import { VagueLogo } from './VagueLogo';
import { VagueField } from './VagueField';
import './VagueMagazine.css';

export function VagueMagazine() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playbackPaused, setPlaybackPaused] = useState<boolean | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const paused = playbackPaused ?? reducedMotion;

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
      <VagueField paused={paused} reducedMotion={reducedMotion && playbackPaused !== false} resetKey={resetKey} />
      <header className="vm-navigation">
        <a className="vm-home" href="/#columns"><span aria-hidden="true">←</span>Gyuyoung Park</a>
      </header>
      <div className="vm-center">
        <h1 className="vm-masthead" translate="no"><VagueLogo /></h1>
      </div>
      <footer className="vm-interaction-bar">
        <p className="vm-hint">Move / drag / click</p>
        <div className="vm-controls" role="group" aria-label="Animation controls">
          <button type="button" className="vm-control" onClick={() => setPlaybackPaused(!paused)}
            aria-label={paused ? 'Play animation' : 'Pause animation'}>
            <span className={`vm-motion-symbol ${paused ? 'is-paused' : ''}`} aria-hidden="true" />
            {paused ? 'Play' : 'Pause'}
          </button>
          <button type="button" className="vm-control" aria-label="Reset animation" onClick={() => setResetKey(value => value + 1)}>Reset</button>
        </div>
      </footer>
    </div>
  );
}

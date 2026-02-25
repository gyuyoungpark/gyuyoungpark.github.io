import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TagCloud } from '@/components/TagCloud';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ProducersSection } from '@/components/ProducersSection';
import { CabinetSection } from '@/components/CabinetSection';
import { Footer } from '@/components/Footer';
import { AdminPanel } from '@/components/AdminPanel';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { loadSiteContent, saveSiteContent } from '@/lib/siteContentStorage';
import type { SiteContent } from '@/types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [siteContent, setSiteContent] = useState<SiteContent>(() => loadSiteContent());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Get current page from URL
    const path = window.location.pathname;
    const page = path === '/' ? 'home' : path.slice(1);
    setCurrentPage(page);
    setAdminLoggedIn(isAdminLoggedIn());
  }, []);

  useEffect(() => {
    saveSiteContent(siteContent);
  }, [siteContent]);

  return (
    <div className="min-h-screen bg-[rgb(244,243,238)] text-zinc-900">
      <Header
        currentPage={currentPage}
        isAdminLoggedIn={adminLoggedIn}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
      />
      
      <main className="site-shell bg-white">
        <Hero aboutDescription={siteContent.aboutDescription} />
        <TagCloud tags={siteContent.tags} />
        <FeaturesSection articles={siteContent.articles} />
        <ProducersSection producers={siteContent.producers} />
        <CabinetSection items={siteContent.cabinetItems} />
      </main>

      <Footer />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        isLoggedIn={adminLoggedIn}
        content={siteContent}
        onClose={() => setIsAdminPanelOpen(false)}
        onLoginStateChange={setAdminLoggedIn}
        onContentChange={setSiteContent}
      />
    </div>
  );
}

export default App;


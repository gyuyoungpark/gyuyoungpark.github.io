import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TagCloud } from '@/components/TagCloud';
import { FeaturesSection } from '@/components/FeaturesSection';
import { StudiesSection } from '@/components/StudiesSection';
import { ProducersSection } from '@/components/ProducersSection';
import { CabinetSection } from '@/components/CabinetSection';
import { articles, cabinetItems, producers, studies } from '@/data/content';
import './App.css';

function App() {
  return (
    <div className="min-h-screen text-zinc-900">
      <Header />
      <main className="site-shell bg-white">
        <Hero />
        <TagCloud />
        <FeaturesSection articles={articles} />
        <StudiesSection studies={studies} />
        <ProducersSection producers={producers} />
        <CabinetSection items={cabinetItems} />
      </main>
    </div>
  );
}

export default App;


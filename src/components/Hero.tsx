import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for browsers/contexts without clipboard API
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy"
      aria-label={copied ? `${email} copied to clipboard` : `Copy ${email} to clipboard`}
      className="group flex w-full items-center gap-1.5 text-left text-[15px] leading-6 text-zinc-700 transition-colors hover:text-black"
    >
      <span className="underline-offset-2 group-hover:underline">{email}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

export function Hero() {
  return (
    <section id="top" className="trimmed-borders scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr_0.75fr]">
        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">RESEARCH INTEREST</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <span className="block">Magnetism and Spintronics</span>
            <span className="block">Probabilistic computing and AI</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">DEGREE</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <span className="block">Ph.D. in Materials Science</span>
            <span className="block">and Engineering</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">CURRENT AFFILIATION</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <a
              href="https://www.kist.re.kr/eng/research/post-silicon-semiconductor-institute.do"
              target="_blank"
              rel="noopener noreferrer"
              className="block underline-offset-2 hover:underline"
            >Post-Silicon Semiconductor Institute</a>
            <a
              href="https://www.kist.re.kr/eng/"
              target="_blank"
              rel="noopener noreferrer"
              className="block underline-offset-2 hover:underline"
            >Korea Institute of Science and Technology</a>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">CONTACT</p>
          <div className="space-y-0.5">
            <CopyEmail email="proslaw@kist.re.kr" />
            <CopyEmail email="lawsper@gmail.com" />
          </div>
        </div>
      </div>
    </section>
  );
}

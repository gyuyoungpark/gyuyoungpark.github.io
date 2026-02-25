export function Hero() {
  return (
    <section id="top" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr_0.75fr]">
        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">RESEARCH INTEREST</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <span className="block">Magnetism, Spintronics</span>
            <span className="block">Probabilistic computing</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">DEGREE</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <span className="block">Ph.D. in Materials Science</span>
            <span className="block">Seoul National University</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">CURRENT AFILLIATION</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <span className="block">Post-silicon Semiconductor Institute</span>
            <span className="block">Korea Institute of Science and Technology</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-medium leading-6 text-zinc-700">CONTACT</p>
          <p className="text-[15px] leading-6 text-zinc-700">
            <span className="block">proslaw@kist.re.kr</span>
            <span className="block">lawsper@gmail.com</span>
          </p>
        </div>
      </div>
    </section>
  );
}

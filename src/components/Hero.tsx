"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import PillLink from "@/components/ui/PillLink";
import { trackEvent } from "@/lib/analytics";

const STATS = [
  { value: "50+", label: "Number of specialized team" },
  { value: "600+", label: "Satisfied clients" },
  { value: "150+", label: "Projects completed" },
];

function AnimatedStat({ value }: { value: string }) {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(0);

  const target = match ? parseFloat(match[2]) : 0;
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const duration = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [match, target]);

  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  const [, prefix, , suffix] = match;

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function AwsLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`fill-current ${className}`}
      aria-hidden="true"
    >
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z" />
    </svg>
  );
}

function CloudflareLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`fill-current ${className}`}
      aria-hidden="true"
    >
      <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727" />
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const rippleLayerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: ReactMouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    const layer = rippleLayerRef.current;
    if (!section || !layer) return;
    const rect = section.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    ripple.style.width = "4px";
    ripple.style.height = "4px";
    ripple.style.background = "rgba(74, 108, 247, 0.6)";
    ripple.style.borderRadius = "9999px";
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.pointerEvents = "none";
    ripple.style.animation = "dot-appear 1s ease-out forwards";
    layer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onClick={handleClick}
      className="relative flex min-h-screen flex-col items-start justify-end overflow-hidden bg-graphite px-6 pb-16 pt-32 text-left md:px-10 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-graphite/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black"
      />

      <div ref={rippleLayerRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 mb-auto flex w-full items-center justify-between gap-6">
        <span className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-fog sm:flex">
          Built for teams that cannot afford unreliable releases
        </span>
      </div>

      <div className="relative z-10 flex w-full flex-col gap-6">
        <div className="flex max-w-5xl flex-col items-start gap-6">
          <h1 className="font-display text-[28px] font-bold leading-[1.25] tracking-tight text-paper sm:text-5xl sm:leading-[1.1] lg:text-6xl">
            <span className="sm:block sm:whitespace-nowrap">
              Cloud infrastructure that automates, scales,{" "}
            </span>
            <span className="sm:block">and future-proofs your business.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-fog sm:text-lg">
            A trusted operations partner delivering secure, scalable, and
            always-on infrastructure.
          </p>
          <PillLink
            href="#contact"
            variant="outline-dark"
            className="bg-black/30 backdrop-blur-sm"
            onClick={() => trackEvent("cta_click", { cta: "request_a_review", location: "hero" })}
          >
            Request a review
          </PillLink>
        </div>

        <div className="mt-2 flex w-full flex-wrap items-end justify-between gap-10 lg:gap-24 xl:gap-32">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6 border-t border-paper/15 pt-8 sm:gap-x-16 lg:gap-x-20">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5">
                <span className="text-sm text-fog sm:text-base">{stat.label}</span>
                <span className="font-display text-2xl font-bold text-paper sm:text-3xl lg:text-4xl">
                  <AnimatedStat value={stat.value} />
                </span>
              </div>
            ))}
          </div>

          <div className="hidden shrink-0 flex-col items-end gap-3 pb-1 lg:flex">
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-fog">
              Verified Partners
            </span>
            <div className="flex items-center gap-8">
              <div className="group flex items-center gap-2.5 text-paper/80">
                <AwsLogo className="h-7 w-7 transition-colors group-hover:text-[#FF9900]" />
                <span className="text-base font-medium tracking-wide">
                  AWS Verified
                </span>
              </div>
              <div className="group flex items-center gap-2.5 text-paper/80">
                <CloudflareLogo className="h-7 w-7 transition-colors group-hover:text-[#F38020]" />
                <span className="text-base font-medium tracking-wide">
                  Cloudflare
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

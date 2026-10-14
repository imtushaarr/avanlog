"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

export function ContainerScroll({
  titleComponent,
  browserLabel = "avanlog",
  browserUrl,
  children,
}: {
  titleComponent?: ReactNode;
  browserLabel?: string;
  browserUrl?: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Tie progress to the container passing through the viewport (bottom to
  // top) rather than the default start/end-of-document edges — otherwise on
  // shorter laptop/tablet viewports the card finishes animating long before
  // (or after) it's actually centered on screen.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = isMobile ? [0.85, 0.97] : [0.9, 1];

  // Settle into place by the midpoint of the scroll-through, so the card
  // reads as "arrived" once it's centered in the viewport, then holds still.
  const rotate = useTransform(smoothProgress, [0.1, 0.5], [28, 0]);
  const scale = useTransform(smoothProgress, [0.1, 0.5], scaleDimensions);
  const translate = useTransform(smoothProgress, [0, 1], [0, -60]);
  const lift = useTransform(smoothProgress, [0.1, 0.5], [40, 0]);
  const opacity = useTransform(smoothProgress, [0.05, 0.3], [0.3, 1]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[42rem] w-full items-center justify-center md:min-h-[56rem]"
    >
      <div
        className={`relative w-full ${titleComponent ? "py-10 md:py-24" : "py-4 md:py-6"}`}
        style={{ perspective: "1000px" }}
      >
        {titleComponent && (
          <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
            {titleComponent}
          </motion.div>
        )}
        <Card
          rotate={rotate}
          scale={scale}
          lift={lift}
          opacity={opacity}
          browserLabel={browserLabel}
          browserUrl={browserUrl}
        >
          {children}
        </Card>
      </div>
    </div>
  );
}

function Card({
  rotate,
  scale,
  lift,
  opacity,
  browserLabel,
  browserUrl,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  lift: MotionValue<number>;
  opacity: MotionValue<number>;
  browserLabel?: string;
  browserUrl?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        y: lift,
        opacity,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a",
      }}
      className="mx-auto h-[36rem] w-full max-w-6xl rounded-[30px] border border-steel-line bg-steel p-2 shadow-2xl md:h-[48rem] md:p-6"
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-graphite md:rounded-2xl">
        {browserUrl && (
          <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex flex-1 items-center gap-2">
              {browserLabel && (
                <span className="font-display text-xs font-bold tracking-tight text-wire">
                  {browserLabel}
                </span>
              )}
              <span className="truncate font-mono text-[11px] text-gray-500">{browserUrl}</span>
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

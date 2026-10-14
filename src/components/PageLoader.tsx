"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Component as LumaSpin } from "@/components/ui/luma-spin";

const LOAD_DURATION_MS = 4000;
const FADE_DURATION_MS = 500;

export default function PageLoader({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => setVisible(false), LOAD_DURATION_MS);
    const removeTimer = setTimeout(
      () => setMounted(false),
      LOAD_DURATION_MS + FADE_DURATION_MS
    );
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {mounted && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-500 ease-out ${
            visible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <LumaSpin />
        </div>
      )}
      {children}
    </>
  );
}

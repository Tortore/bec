"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Building2, MapPin, Users } from "lucide-react";
import type { HomeStat } from "@/types";

const icons = [Building2, Users, MapPin, Award];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(value * progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function Stats({ stats }: { stats: HomeStat[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-site grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = icons[index] ?? Building2;
          return (
            <article
              key={`${stat.label}-${index}`}
              className="rounded-2xl border border-[#00af84]/15 bg-gradient-to-br from-[#00af84]/8 to-white p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#065b48] text-white shadow-md shadow-[#065b48]/20">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-4 text-4xl font-bold text-[#065b48]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm font-semibold text-[#00af84]">{stat.label}</p>
              <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

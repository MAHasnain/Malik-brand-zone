"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./HomeSections.module.css";

export default function ArrivalRail({ children, id = "arrival-products", label = "New Arrivals" }: { children: ReactNode; id?: string; label?: string }) {
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    function measure() {
      if (!el) return;
      setEdges({ start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
    }
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    return () => { resize.disconnect(); el.removeEventListener("scroll", measure); };
  }, [children]);

  function move(direction: number) {
    const el = list.current;
    const first = el?.firstElementChild;
    if (!el || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap);
    el.scrollBy({ left: direction * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <div className={styles.railWrap}>
      <ul ref={list} className={styles.rail} id={id} aria-label={label}>{children}</ul>
      {!(edges.start && edges.end) && (
        <div className={styles.controls}>
          <button type="button" disabled={edges.start} onClick={() => move(-1)} aria-label="Previous products" aria-controls={id}><ArrowLeft size={18} /></button>
          <button type="button" disabled={edges.end} onClick={() => move(1)} aria-label="Next products" aria-controls={id}><ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}


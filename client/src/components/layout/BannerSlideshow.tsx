"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const control = "grid size-11 place-items-center rounded-full bg-black/65 text-white focus-visible:outline focus-visible:outline-white";

export default function BannerSlideshow({ images, children }: { images: string[]; children: ReactNode }) {
    const [index, setIndex] = useState(0);
    const [failed, setFailed] = useState<string[]>([]);
    const [paused, setPaused] = useState(false);
    const [visible, setVisible] = useState(false);
    const slides = images.filter(url => !failed.includes(url));
    const count = slides.length;
    const active = index % (count || 1);

    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updateMotion = () => setPaused(motion.matches);
        const updateVisibility = () => setVisible(!document.hidden);
        updateMotion();
        updateVisibility();
        motion.addEventListener("change", updateMotion);
        document.addEventListener("visibilitychange", updateVisibility);
        return () => {
            motion.removeEventListener("change", updateMotion);
            document.removeEventListener("visibilitychange", updateVisibility);
        };
    }, []);

    useEffect(() => {
        if (count < 2 || paused || !visible) return;
        const timer = window.setTimeout(() => setIndex((active + 1) % count), 5000);
        return () => window.clearTimeout(timer);
    }, [count, active, paused, visible]);

    if (!count) return <>{children}</>;
    function move(step: number) {
        setPaused(true);
        setIndex((active + step + count) % count);
    }
    return (
        <div className="absolute inset-0" role="region" aria-label="Collection banners" aria-roledescription="carousel">
            {slides.map((url, i) => (
                // Cloudinary serves the uploaded banner directly.
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt={i === active ? `Collection banner ${i + 1} of ${count}` : ""}
                    aria-hidden={i !== active} fetchPriority={i === 0 ? "high" : "low"}
                    onError={() => setFailed(current => current.includes(url) ? current : [...current, url])}
                    className={`absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`} />
            ))}
            {count > 1 && <div className="absolute inset-x-3 bottom-3 flex justify-end gap-1">
                <button type="button" className={control} aria-label="Previous banner" onClick={() => move(-1)}><ChevronLeft size={18} /></button>
                <button type="button" className={control} aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(!paused)}>
                    {paused ? <Play size={16} /> : <Pause size={16} />}
                </button>
                <button type="button" className={control} aria-label="Next banner" onClick={() => move(1)}><ChevronRight size={18} /></button>
            </div>}
        </div>
    );
}

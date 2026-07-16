'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  alt: string;
  /** ms between rotations */
  interval?: number;
  /** ms staggered delay so cards don't all flip together */
  startDelay?: number;
  /** first image loads eagerly + high priority (above-the-fold usage) */
  priority?: boolean;
  /** sizes hint for next/image's responsive srcset (defaults to a typical grid card) */
  sizes?: string;
}

/**
 * Crossfading photo rotator. Uses next/image so each viewport gets a properly
 * sized, format-negotiated (WebP/AVIF) image instead of the full-resolution
 * source, then advances `current` on a timer once the active image loads.
 * Pauses when the tab is hidden.
 */
export default function RotatingPhotos({
  images,
  alt,
  interval = 4000,
  startDelay = 0,
  priority = false,
  sizes = '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw'
}: Props) {
  const [current, setCurrent] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const ready = loadedCount > 0;

  // Rotate once at least the first image has loaded; don't block on all of them.
  useEffect(() => {
    if (!ready || images.length < 2) return;
    let timer: ReturnType<typeof setTimeout>;
    let interv: ReturnType<typeof setInterval>;
    timer = setTimeout(() => {
      interv = setInterval(() => {
        if (document.hidden) return;
        setCurrent((c) => (c + 1) % images.length);
      }, interval);
    }, startDelay);
    return () => { clearTimeout(timer); clearInterval(interv); };
  }, [ready, images.length, interval, startDelay]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={i === 0 ? alt : ''}
            fill
            sizes={sizes}
            className="object-cover"
            priority={priority && i === 0}
            loading={i === current ? undefined : 'lazy'}
            onLoad={() => setLoadedCount((c) => c + 1)}
          />
        </div>
      ))}
      {/* SR-only alt text for accessibility */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}

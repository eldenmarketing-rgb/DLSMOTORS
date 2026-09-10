"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { ImageRef } from "@/lib/config";

/**
 * Comparateur avant / après : l'image « après » en fond, l'image « avant »
 * par-dessus, rognée à la position de la glissière. Un <input type="range">
 * invisible couvre toute la surface : glisser à la souris ou au doigt,
 * flèches au clavier, lecteurs d'écran servis — sans aucun code de drag.
 */
export function BeforeAfter({
  before,
  after,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  before: ImageRef;
  after: ImageRef;
  sizes?: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div className="relative aspect-[4/3] select-none overflow-hidden rounded-2xl bg-primary-800 ring-1 ring-surface-50/15">
      <Image
        src={after.src}
        alt={after.alt}
        fill
        sizes={sizes}
        className="object-cover"
        draggable={false}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before.src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-primary-900/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-surface-50">
        Avant
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-accent-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-on-accent">
        Après
      </span>

      {/* Ligne + poignée, purement décoratives : l'interaction est le range. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-surface-50 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: `calc(${pos}% - 1px)` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-500 text-on-accent shadow-lg ring-2 ring-surface-50/80">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M8.5 6 3 12l5.5 6 1.4-1.4L6.3 13h11.4l-3.6 3.6L15.5 18 21 12l-5.5-6-1.4 1.4 3.6 3.6H6.3l3.6-3.6L8.5 6z" />
          </svg>
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Comparer avant et après
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos} % avant`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

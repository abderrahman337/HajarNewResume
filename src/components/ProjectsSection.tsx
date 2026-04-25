import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lang } from "../locales/types";
import { PROJECTS, type ProjectCategory } from "../data/projects";

type FilterKey = "all" | ProjectCategory;

type Props = {
  lang: Lang;
  t: {
    title: string;
    filterAll: string;
    filterApps: string;
    filterEcommerce: string;
    filterShopify: string;
    counter: string;
    close: string;
    prev: string;
    next: string;
    openDetails: string;
    noResults: string;
  };
};

function titleFor(lang: Lang, item: (typeof PROJECTS)[number]) {
  return lang === "fr" ? item.titleFr : item.titleEn;
}

export function ProjectsSection({ lang, t }: Props) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  const openAt = useCallback((index: number) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goPrev = useCallback(() => {
    setLightbox((i) => {
      if (i === null || filtered.length === 0) return i;
      return (i - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightbox((i) => {
      if (i === null || filtered.length === 0) return i;
      return (i + 1) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    if (lightbox >= filtered.length) setLightbox(filtered.length ? filtered.length - 1 : null);
  }, [filtered.length, lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, closeLightbox, goPrev, goNext]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "apps", label: t.filterApps },
    { key: "ecommerce", label: t.filterEcommerce },
    { key: "shopify", label: t.filterShopify },
  ];

  const current = lightbox !== null && filtered[lightbox] ? filtered[lightbox] : null;
  const counterLabel =
    lightbox !== null && filtered.length
      ? t.counter.replace("{n}", String(lightbox + 1)).replace("{total}", String(filtered.length))
      : "";

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-title">
      <div className="projects-section-head">
        <span className="projects-deco" aria-hidden />
        <h2 id="projects-title" className="projects-heading">
          {t.title}
        </h2>
        <span className="projects-deco" aria-hidden />
      </div>

      <div className="projects-shell">
        <aside className="projects-sidebar" aria-label={t.title}>
          <ul className="projects-filters">
            {filters.map(({ key, label }) => (
              <li key={key}>
                <button
                  type="button"
                  className={`projects-filter-btn${filter === key ? " is-active" : ""}`}
                  onClick={() => {
                    setFilter(key);
                    setLightbox(null);
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="projects-main">
          {filtered.length === 0 ? (
            <p className="projects-empty">{t.noResults}</p>
          ) : (
            <ul className="projects-grid">
              {filtered.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="projects-tile"
                    onClick={() => openAt(index)}
                    aria-label={`${t.openDetails}: ${titleFor(lang, item)}`}
                  >
                    <img src={item.image} alt="" loading="lazy" />
                    <span className="projects-tile-title">{titleFor(lang, item)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {current !== null ? (
        <div className="projects-lightbox" role="dialog" aria-modal="true" aria-label={t.title}>
          <button type="button" className="projects-lightbox-backdrop" onClick={closeLightbox} aria-label={t.close} />
          <div className="projects-lightbox-panel">
            <button type="button" className="projects-lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <button type="button" className="projects-carousel-arrow projects-carousel-arrow--prev" onClick={goPrev} aria-label={t.prev}>
              ‹
            </button>
            <button type="button" className="projects-carousel-arrow projects-carousel-arrow--next" onClick={goNext} aria-label={t.next}>
              ›
            </button>
            <div className="projects-carousel-frame">
              <img src={current.image} alt="" />
            </div>
            <div className="projects-carousel-footer">
              <span className="projects-carousel-title">{titleFor(lang, current)}</span>
              <span className="projects-carousel-count">{counterLabel}</span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

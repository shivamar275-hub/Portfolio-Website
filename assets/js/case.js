/* Case study interactions: layer reveals, scroll parallax, idle float, pointer tilt, progress. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = window.matchMedia('(max-width: 760px)');
  const layers = [...document.querySelectorAll('.cs-layer')];
  const panels = [...document.querySelectorAll('[data-reveal]')];
  const progress = document.querySelector('[data-progress]');

  // Give each floating layer its own rhythm so nothing bobs in sync
  layers.forEach((el, i) => {
    const r = (n) => ((Math.sin((i + 1) * 12.9898 * n) * 43758.5453) % 1 + 1) % 1;
    el.style.setProperty('--dur', `${6 + r(1) * 4}s`);
    el.style.setProperty('--bob-d', `${-r(2) * 6}s`);
    el.style.setProperty('--amp', `${8 + r(3) * 10}px`);
    el.style.setProperty('--rot', `${(r(4) - 0.5) * 3}deg`);
  });

  /* ---- Reveal on enter --------------------------------------------------- */
  const reveal = (els, margin) => {
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: margin, threshold: 0.01 });
    els.forEach((e) => io.observe(e));
  };
  // stagger layers that share a band
  const byBand = new Map();
  layers.forEach((l) => { const b = l.parentElement; byBand.set(b, (byBand.get(b) || 0) + 1); l.style.setProperty('--d', `${(byBand.get(b) - 1) * 0.08}s`); });
  reveal(layers, '0px 0px -8% 0px');
  reveal(panels, '0px 0px -6% 0px');
  reveal([...document.querySelectorAll('.cs-band--reveal')], '0px 0px -12% 0px');

  /* ---- Scroll: parallax + progress -------------------------------------- */
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    if (reduce) return;
    const k = mobile.matches ? 0.35 : 1;
    for (const el of layers) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 (top) .. 1 (bottom)
      el.style.setProperty('--py', `${(p * -(el.dataset.depth === undefined ? 40 : +el.dataset.depth) * k).toFixed(1)}px`);
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---- Pointer: objects lean toward the cursor --------------------------- */
  if (finePointer && !reduce) {
    document.querySelectorAll('.cs-band').forEach((band) => {
      const own = layers.filter((l) => l.parentElement === band);
      if (!own.length) return;
      band.addEventListener('pointermove', (e) => {
        const b = band.getBoundingClientRect();
        const nx = (e.clientX - b.left) / b.width - 0.5;
        const ny = (e.clientY - b.top) / b.height - 0.5;
        own.forEach((l) => {
          const s = l.dataset.motion === 'tilt' ? 14 : 5;
          l.style.setProperty('--ry', `${(nx * s).toFixed(2)}deg`);
          l.style.setProperty('--rx', `${(-ny * s).toFixed(2)}deg`);
        });
      });
      band.addEventListener('pointerleave', () => own.forEach((l) => { l.style.setProperty('--rx', '0deg'); l.style.setProperty('--ry', '0deg'); }));
    });
  }
})();

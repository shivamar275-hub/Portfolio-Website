/* Wanshika Arora — portfolio interactions. No dependencies. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- Reveal on scroll ------------------------------------------------ */
  const revealables = document.querySelectorAll('[data-reveal], [data-rule], [data-wid]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- Nav: hide on scroll down, show on scroll up --------------------- */
  const nav = document.querySelector('[data-nav]');
  let lastY = window.scrollY;

  /* ---- Scroll-linked motion -------------------------------------------- */
  const hero = document.querySelector('[data-hero]');
  const heroName = hero && hero.querySelector('.hero__name');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const wid = document.querySelector('[data-wid]');
  const ring = document.querySelector('[data-ring]');
  const vh = () => window.innerHeight;

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    const y = window.scrollY;

    if (nav) {
      nav.classList.toggle('is-scrolled', y > 40);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > 240) nav.classList.add('is-hidden');
      else if (goingUp || y < 240) nav.classList.remove('is-hidden');
      lastY = y;
    }

    if (reduce) return;

    // Hero: name drifts up and softens as you leave
    if (heroName) {
      const p = Math.min(Math.max(y / (hero.offsetHeight || 1), 0), 1);
      heroName.style.transform = `translate3d(0, ${p * -60}px, 0) scale(${1 - p * 0.06})`;
      heroName.style.opacity = String(1 - p * 0.7);
    }

    // Card images: gentle parallax inside their frames
    const h = vh();
    for (const el of parallax) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > h + 100) continue;
      const progress = (r.top + r.height / 2 - h / 2) / (h / 2 + r.height / 2); // -1..1
      el.style.transform = `translate3d(0, ${(progress * -3.2).toFixed(2)}%, 0)`;
    }

    // Ring: slow turn tied to scroll
    if (wid && ring) {
      const r = wid.getBoundingClientRect();
      if (r.bottom > 0 && r.top < h) {
        const p = (h - r.top) / (h + r.height); // 0..1 through viewport
        ring.style.setProperty('--spin', `${(p - 0.5) * 28}deg`);
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---- "View case study" cursor pill ----------------------------------- */
  const cursor = document.querySelector('[data-cursor]');
  if (cursor && finePointer && !reduce) {
    let mx = -100, my = -100, cx = mx, cy = my, raf = null;
    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.1 ? requestAnimationFrame(loop) : null;
    };
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointerenter', (e) => {
        mx = cx = e.clientX; my = cy = e.clientY;
        cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        cursor.classList.add('is-on');
      });
      card.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
    });
  }
})();

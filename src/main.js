import { countValue } from './utils.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COUNT_DURATION_MS = 1400;
const PARALLAX_FACTOR = 0.25;
const CHAR_STAGGER_MS = 35;

/** Duplicate marquee content once for a seamless 50% loop. */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/** Split section titles into per-char spans for staggered reveal. */
function initCharSplit() {
  document.querySelectorAll('.split-chars').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('aria-hidden', 'true');
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.transitionDelay = `${i * CHAR_STAGGER_MS}ms`;
      wrapper.appendChild(span);
    });
    el.replaceChildren(wrapper);
  });
}

/** Animate a metric number from 0 to its data-count target. */
function startCountUp(numEl) {
  if (numEl.dataset.done) return;
  numEl.dataset.done = '1';
  const target = Number(numEl.dataset.count);
  const suffix = numEl.dataset.suffix || '';
  if (!Number.isFinite(target)) return;
  const t0 = performance.now();
  const tick = (now) => {
    const progress = (now - t0) / COUNT_DURATION_MS;
    numEl.textContent = countValue(target, progress) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Reveal-on-scroll for .reveal and .split-chars elements. */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .split-chars');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      const num = entry.target.querySelector('.met-num');
      if (num) startCountUp(num);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  targets.forEach((el) => io.observe(el));
}

/** Hero background parallax (transform-only, rAF-throttled). */
function initParallax() {
  const bg = document.querySelector('.hero-bg');
  const hero = document.getElementById('hero');
  if (!bg || !hero) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < hero.offsetHeight) {
        bg.style.transform = `translateY(${y * PARALLAX_FACTOR}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
}

/** Shrink fixed header after scrolling past the fold start. */
function initHeaderShrink() {
  const header = document.getElementById('main-header');
  if (!header) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  initMarquee();

  if (REDUCED_MOTION) {
    // CSS already forces visible state; ensure metric numbers show final values.
    document.querySelectorAll('.met-num').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    document.body.classList.add('loaded');
    return;
  }

  initCharSplit();
  initReveal();
  initParallax();
  initHeaderShrink();

  // Hero entrance (double rAF so initial styles are committed first)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  }));
});

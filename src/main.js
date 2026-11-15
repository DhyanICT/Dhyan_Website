const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = $('.theme-toggle');
function updateThemeLabel() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
  themeButton.title = `Switch to ${next} theme`;
  $('meta[name="theme-color"]').content = next === 'light' ? '#101310' : '#f4f3ea';
}
updateThemeLabel();
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('dhyan-theme', next); } catch { /* Storage is optional. */ }
  updateThemeLabel();
  renderOrb();
});
const menuButton = $('.menu-toggle');
const mobileNav = $('.mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !expanded;
});
$$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Reveal all content for printing and captures that never scroll the page.
const showAll = () => $$('.reveal').forEach(element => element.classList.add('visible'));
window.addEventListener('beforeprint', showAll);
setTimeout(showAll, 4000);

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  $$('.reveal').forEach(element => revealObserver.observe(element));
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) $$('.desktop-nav a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  $$('main>section[id]').forEach(section => sectionObserver.observe(section));
}
let scrollPending = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $('.scroll-progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
updateScroll();
$('#year').textContent = new Date().getFullYear();

$$('.filter-button').forEach(button => button.addEventListener('click', () => {
  $$('.filter-button').forEach(other => { other.classList.toggle('active', other === button); other.setAttribute('aria-pressed', String(other === button)); });
  $$('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) card.classList.add('visible'); });
  updateScroll();
}));

const projectDetails = {
  trustmed: {
    title: 'TrustMed AI',
    intro: 'Health answers are only as useful as the evidence behind them. This group research project combines Neo4j, FAISS, and Llama 3.1 to generate sectioned answers with citations and explicitly labelled sources.',
    metrics: [['13,345', 'retrieval chunks'], ['~30 ms', 'warm retrieval'], ['87.5%', 'Recall@15 baseline']],
    contribution: 'I built the Playwright scrapers, graph model and loaders, FAISS indexes, FastAPI backend, and ground-truth retrieval evaluation. The pipeline detects a condition, retrieves relevant passages, adds graph context, and passes labelled evidence to the model.',
    note: 'The published retrieval baseline uses 7 hand-labelled queries. These metrics are a small-set comparison baseline, not a general accuracy claim. TrustMed is an educational research project, not medical advice.',
    url: 'https://github.com/DhyanICT/Trusted_Medical_AI', label: 'Explore the source'
  },
  automation: {
    title: 'Computer-Use Automation',
    intro: 'Legacy software does not always have an API. This project separates task discovery from execution: a planner explores a browser task, compiles a typed capability artifact, and replays that artifact with new inputs.',
    metrics: [['0', 'LLM calls in replay'], ['Typed', 'workflow artifacts'], ['Human', 'handoff for risky actions']],
    contribution: 'A custom Chrome DevTools Protocol client drives the browser. The engine validates checkpoints and distinguishes business outcomes from crashes. Origin and action allowlists, redacted logs, and an explicit handoff path make runs easier to audit.',
    note: 'The committed demo uses a scripted planner against a bundled local banking console. The project supports an OpenAI-compatible planner; the published evidence does not claim a live-LLM discovery run.',
    url: 'https://github.com/DhyanICT/Computer-Use-Automation', label: 'Explore the source'
  },
  proofboard: {
    title: 'Proofboard',
    intro: 'A small shared workspace for decisions that deserve a visible rationale. Frame the question, add options and evidence, cast one editable vote, and record an outcome.',
    metrics: [['Live', 'presence & sync'], ['1 vote', 'per person per board'], ['Explicit', 'recorded outcomes']],
    contribution: 'The implementation uses DeepSpace authentication, collections, live synchronization, and per-board presence. Server-side voter identity and a unique board/user pair enforce one ballot per person. Writes are confirmed before the interface reports success.',
    note: 'Built with an AI coding agent under my direction. Shared boards require sign-in.',
    url: 'https://github.com/DhyanICT/deepspace_proofboard', live: 'https://proofboard-dhyan.app.space', label: 'Explore the source'
  },
  taskboard: {
    title: 'Task Board',
    intro: 'A focused Kanban board built with Next.js, TypeScript, Tailwind CSS, and Supabase. It supports anonymous guest sessions, persisted tasks, and drag-and-drop between four workflow columns.',
    metrics: [['4', 'workflow columns'], ['RLS', 'per-user isolation'], ['Guest', 'authentication']],
    contribution: 'The product brings together task creation, priorities, due dates, search, and filtering. Supabase row-level security limits each guest to their own tasks, while loading, empty, and error states keep the interface understandable.',
    url: 'https://github.com/DhyanICT/Task_Board_NextPlay', live: 'https://taskboard-gamma-ten.vercel.app/', label: 'Explore the source'
  }
};
const dialog = $('.project-dialog');
$$('.project-detail').forEach(button => button.addEventListener('click', () => {
  const project = projectDetails[button.dataset.project];
  // Content is a fixed, local editorial data set; no user or network HTML is injected.
  $('#dialog-content').innerHTML = `<h2 id="dialog-title">${project.title}</h2><p>${project.intro}</p><div class="dialog-metrics">${project.metrics.map(([value, label]) => `<div><b>${value}</b><span>${label}</span></div>`).join('')}</div><h3>The engineering</h3><p>${project.contribution}</p>${project.note ? `<p class="dialog-note">${project.note}</p>` : ""}<a class="button button-primary" href="${project.url}" target="_blank" rel="noopener noreferrer">${project.label} ↗</a>${project.live ? `<p><a class="text-link" href="${project.live}" target="_blank" rel="noopener noreferrer">Open live app ↗</a></p>` : ''}`;
  dialog.showModal();
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

const resumeDialog = $('#resume-preview-dialog');
const resumeLink = $('[data-resume-preview]');
const resumePage = $('.resume-dialog-page', resumeDialog);
const zoomButton = $('.resume-zoom', resumeDialog);
resumeLink.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !resumeDialog.showModal) return;
  event.preventDefault();
  resumeDialog.showModal();
});
resumeLink.setAttribute('aria-haspopup', 'dialog');

function setResumeZoom(zoomed) {
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? 'Fit to width' : 'Zoom in';
  resumePage.classList.toggle('is-zoomed', zoomed);
}
zoomButton.addEventListener('click', () => {
  setResumeZoom(zoomButton.getAttribute('aria-pressed') === 'false');
});
resumeDialog.addEventListener('close', () => {
  setResumeZoom(false);
  resumePage.scrollTo(0, 0);
  resumeLink.focus({ preventScroll: true });
});

let toastTimer;
$('.copy-email').addEventListener('click', async () => {
  const toast = $('.toast');
  try { await navigator.clipboard.writeText('dhyanpatel2632003@gmail.com'); toast.textContent = 'Email address copied'; }
  catch { toast.textContent = 'Please select the email address to copy it.'; }
  toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
});

// Project the sphere in 3D, with a persistent drag orientation and a temporary hover offset.
const canvas = $('#network-orb');
const ctx = canvas.getContext('2d');
let orbWidth = 0, orbHeight = 0, lastFrame = 0, frameId = 0;
let orbVisible = true;
let yaw = .5, pitch = .22;
let hoverYaw = 0, hoverPitch = 0, targetYaw = 0, targetPitch = 0;
let drag = null;
const limitPitch = angle => Math.max(-1.35, Math.min(1.35, angle));
const points = [];
const pointCount = 390;
for (let i = 0; i < pointCount; i++) {
  const y = 1 - 2 * (i + .5) / pointCount;
  const radius = Math.sqrt(1 - y * y);
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
}
const edges = [];
for (let a = 0; a < pointCount; a++) for (let b = a + 1; b < pointCount; b++) {
  const p = points[a], q = points[b];
  if ((p.x-q.x)**2 + (p.y-q.y)**2 + (p.z-q.z)**2 < .042) edges.push([a,b]);
}
function sizeOrb() {
  const rect = canvas.getBoundingClientRect();
  orbWidth = rect.width; orbHeight = rect.height;
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(orbWidth * scale); canvas.height = Math.round(orbHeight * scale);
  ctx?.setTransform(scale,0,0,scale,0,0); renderOrb();
}
function renderOrb() {
  if (!ctx || !orbWidth || !orbHeight) return;
  ctx.clearRect(0,0,orbWidth,orbHeight);
  const dark = document.documentElement.dataset.theme !== 'light';
  const rgb = dark ? '184,227,142' : '74,110,45';
  const radius = Math.min(orbWidth * .40, orbHeight * .405);
  const angleX = yaw + hoverYaw;
  const angleY = limitPitch(pitch + hoverPitch);
  const cosYaw = Math.cos(angleX), sinYaw = Math.sin(angleX);
  const cosPitch = Math.cos(angleY), sinPitch = Math.sin(angleY);
  const projected = points.map(p => {
    const x = p.x * cosYaw + p.z * sinYaw;
    const z = -p.x * sinYaw + p.z * cosYaw;
    const y = p.y * cosPitch - z * sinPitch;
    const depth = p.y * sinPitch + z * cosPitch;
    const perspective = 3.8 / (3.8 - depth);
    return { x:orbWidth*.51+x*radius*perspective, y:orbHeight*.49+y*radius*perspective, z:depth };
  });
  const glow = ctx.createRadialGradient(orbWidth*.5,orbHeight*.5,0,orbWidth*.5,orbHeight*.5,radius*1.2);
  glow.addColorStop(0,`rgba(${rgb},.035)`);glow.addColorStop(1,`rgba(${rgb},0)`);
  ctx.fillStyle=glow;ctx.fillRect(0,0,orbWidth,orbHeight);
  edges.forEach(([a,b])=>{
    const p=projected[a], q=projected[b]; const depth=(p.z+q.z)/2;
    ctx.strokeStyle=`rgba(${rgb},${.035+(depth+1)*.068})`;ctx.lineWidth=.55;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
  });
  projected.forEach((p,i)=>{
    const alpha=.17+(p.z+1)*.32;
    ctx.fillStyle=`rgba(${rgb},${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,(i%13===0?1.6:.9)*(p.z+3)/3,0,Math.PI*2);ctx.fill();
  });
  // Orbital arcs make the point cloud read as a connected system.
  ctx.save();ctx.translate(orbWidth*.51,orbHeight*.49);ctx.rotate(-.4);
  ctx.strokeStyle=`rgba(${rgb},.13)`;ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(0,0,radius*1.25,radius*.31,0,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function animateOrb(time) {
  frameId = 0;
  if (!orbVisible || document.hidden || reducedMotion.matches) return;
  const elapsed = time - lastFrame;
  const moving = drag || Math.abs(targetYaw - hoverYaw) + Math.abs(targetPitch - hoverPitch) > .002;
  if (moving || elapsed >= 30) {
    const seconds = lastFrame ? Math.min(elapsed / 1000, .05) : 0;
    const blend = 1 - Math.exp(-12 * seconds);
    hoverYaw += (targetYaw - hoverYaw) * blend;
    hoverPitch += (targetPitch - hoverPitch) * blend;
    if (!drag) yaw += .055 * seconds;
    renderOrb();
    lastFrame = time;
  }
  frameId = requestAnimationFrame(animateOrb);
}

function startOrb() {
  if (!frameId && orbVisible && !document.hidden && !reducedMotion.matches) {
    frameId = requestAnimationFrame(animateOrb);
  }
}

function stopOrb() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  lastFrame = 0;
}

function clearHover() {
  targetYaw = 0;
  targetPitch = 0;
}

function keepCurrentOrientation() {
  yaw += hoverYaw;
  pitch = limitPitch(pitch + hoverPitch);
  hoverYaw = 0;
  hoverPitch = 0;
  clearHover();
}

canvas.addEventListener('pointermove', event => {
  if (drag?.id === event.pointerId) {
    yaw += (event.clientX - drag.x) * .009;
    pitch = limitPitch(pitch + (event.clientY - drag.y) * .009);
    drag.x = event.clientX;
    drag.y = event.clientY;
    if (reducedMotion.matches) renderOrb();
    return;
  }
  if (drag || event.pointerType === 'touch' || reducedMotion.matches) return;
  const bounds = canvas.getBoundingClientRect();
  targetYaw = ((event.clientX - bounds.left) / bounds.width - .5) * 1.65;
  targetPitch = ((event.clientY - bounds.top) / bounds.height - .5) * 1.15;
});
canvas.addEventListener('pointerleave', clearHover);

canvas.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || drag) return;
  keepCurrentOrientation();
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add('is-dragging');
});

function endDrag(event) {
  if (drag?.id !== event.pointerId) return;
  drag = null;
  canvas.classList.remove('is-dragging');
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('lostpointercapture', endDrag);

const keyTurns = {
  ArrowLeft: [-.18, 0], ArrowRight: [.18, 0],
  ArrowUp: [0, -.18], ArrowDown: [0, .18]
};
canvas.addEventListener('keydown', event => {
  const turn = keyTurns[event.key];
  if (!turn) return;
  event.preventDefault();
  keepCurrentOrientation();
  yaw += turn[0];
  pitch = limitPitch(pitch + turn[1]);
  renderOrb();
});

if ('ResizeObserver' in window) {
  new ResizeObserver(sizeOrb).observe(canvas);
} else {
  window.addEventListener('resize', sizeOrb);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    orbVisible = entry.isIntersecting;
    if (orbVisible) startOrb();
    else stopOrb();
  }, { rootMargin: '100px' }).observe(canvas);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopOrb();
  else startOrb();
});
reducedMotion.addEventListener('change', () => {
  stopOrb();
  keepCurrentOrientation();
  renderOrb();
  startOrb();
});
sizeOrb();
startOrb();

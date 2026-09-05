/**
 * Lincmox Docs - Main Application Script
 * Vanilla JS — no framework, no build step.
 *
 * Features:
 *  - Config-driven navigation (config.json)
 *  - Hash-based routing (#/section/path)
 *  - Markdown rendering via marked.js
 *  - Full-text search (in-memory index)
 *  - Auto-generated Table of Contents
 *  - Light / Dark theme toggle (localStorage)
 *  - Vanta.js animated LED-matrix background (landing page)
 */

/* =============================================
   STATE
   ============================================= */
let config = null;
let currentSection = 'functional';
let searchIndex = [];  // [{ path, section, title, content }]
let searchIndexBuilt = false;
let vantaEffect = null;

/* =============================================
   INIT
   ============================================= */
async function init() {
  // Load config
  try {
    const res = await fetch('config.json');
    config = await res.json();
  } catch (e) {
    console.error('Failed to load config.json', e);
    return;
  }

  // Apply saved title and logo from config
  document.title = config.title;
  document.getElementById('site-title').textContent = config.title;
  if (config.logo) {
    document.getElementById('logo').src = config.logo;
  }

  // Restore theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  // Setup UI interactions
  setupThemeToggle();
  setupSearch();
  setupSectionToggle();
  setupMobileUI();

  // Build nav and route to initial page
  buildNav(currentSection);
  handleRoute();

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('hashchange', () => {
    document.body.classList.remove('nav-open');
    document.body.classList.remove('search-open');
  });

  // Build search index in background
  buildSearchIndex();
}

/* =============================================
   MOBILE UI (sidebar drawer + search overlay)
   ============================================= */
function setupMobileUI() {
  const menuToggle = document.getElementById('menu-toggle');
  const searchToggle = document.getElementById('search-toggle');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      document.body.classList.remove('search-open');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => document.body.classList.remove('nav-open'));
  }
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      const opening = !document.body.classList.contains('search-open');
      document.body.classList.toggle('search-open');
      document.body.classList.remove('nav-open');
      if (opening) {
        const input = document.getElementById('search-input');
        if (input) setTimeout(() => input.focus(), 10);
      }
    });
  }
}

/* =============================================
   THEME
   ============================================= */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const logo = document.getElementById('logo');
  if (logo) {
    logo.src = theme === 'dark' ? 'assets/logo-dark.jpg' : 'assets/logo.jpg';
  }
  // Restart Vanta with the new theme's palette while it is active
  if (vantaEffect) {
    stopVanta();
    startVanta();
  }
}

/* =============================================
   VANTA BACKGROUND (landing page only)
   ============================================= */
function vantaConfig() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    el: '#vanta-bg',
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    scale: 1.0,
    scaleMobile: 1.0,
    // LED-matrix vibe (echoes the LincStation N1 LED strip)
    showLines: false,
    size: 4.5,
    spacing: 16.0,
    color: dark ? 0xf08c1f : 0xe47404,        // brand accent
    backgroundColor: dark ? 0x0b1120 : 0xffffff,
  };
}

function startVanta() {
  const bg = document.getElementById('vanta-bg');
  if (vantaEffect || !window.VANTA || !bg) return;
  vantaEffect = VANTA.DOTS(vantaConfig());
}

function stopVanta() {
  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
  }
}

function setupThemeToggle() {
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* =============================================
   SECTION TOGGLE (Functional / Technical)
   ============================================= */
function setupSectionToggle() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      if (section === currentSection) return;
      currentSection = section;

      // Update button states
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Rebuild nav
      buildNav(section);

      // Navigate to first page of the section
      const firstPage = getFirstPage(section);
      if (firstPage) navigateTo(section, firstPage);
    });
  });
}

function getFirstPage(section) {
  const nav = config.nav[section];
  if (!nav || !nav.length) return null;
  const firstCat = nav[0];
  if (firstCat.items && firstCat.items.length) return firstCat.items[0].path;
  return null;
}

function getFlatNav(section) {
  const flat = [];
  const categories = config.nav[section] || [];
  categories.forEach(cat => {
    (cat.items || []).forEach(item => flat.push(item));
    (cat.subcategories || []).forEach(sub => {
      (sub.items || []).forEach(item => flat.push(item));
    });
  });
  return flat;
}

/* =============================================
   NAV BUILDER
   ============================================= */

/** Creates a collapsible chevron label element */
function makeCollapsibleLabel(text, className, targetEl) {
  const labelEl = document.createElement('div');
  labelEl.className = className;
  labelEl.innerHTML = `
    <span>${text}</span>
    <svg class="cat-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`;
  labelEl.addEventListener('click', () => targetEl.classList.toggle('collapsed'));
  return labelEl;
}

/** Creates a nav link <li> element */
function makeNavLink(item, section) {
  const liEl = document.createElement('li');
  liEl.className = 'nav-item';
  const linkEl = document.createElement('a');
  linkEl.className = 'nav-link';
  linkEl.textContent = item.label;
  linkEl.href = `#/${section}/${item.path}`;
  linkEl.dataset.path = item.path;
  linkEl.dataset.section = section;
  liEl.appendChild(linkEl);
  return liEl;
}

function buildNav(section) {
  const navEl = document.getElementById('sidebar-nav');
  navEl.innerHTML = '';

  const categories = config.nav[section] || [];
  categories.forEach(cat => {
    const catEl = document.createElement('div');
    catEl.className = 'nav-category';

    // Category label (always collapsible)
    catEl.appendChild(makeCollapsibleLabel(cat.label, 'nav-category-label', catEl));

    // Body — contains either direct items, subcategories, or both
    const bodyEl = document.createElement('div');
    bodyEl.className = 'nav-category-body';

    // Direct items (flat list)
    if (cat.items && cat.items.length) {
      const listEl = document.createElement('ul');
      listEl.className = 'nav-items';
      cat.items.forEach(item => listEl.appendChild(makeNavLink(item, section)));
      bodyEl.appendChild(listEl);
    }

    // Subcategories (nested groups)
    if (cat.subcategories && cat.subcategories.length) {
      cat.subcategories.forEach(sub => {
        const subEl = document.createElement('div');
        subEl.className = 'nav-subcategory';

        // Subcategory label (collapsible)
        subEl.appendChild(makeCollapsibleLabel(sub.label, 'nav-subcategory-label', subEl));

        const subListEl = document.createElement('ul');
        subListEl.className = 'nav-subitems';
        (sub.items || []).forEach(item => subListEl.appendChild(makeNavLink(item, section)));
        subEl.appendChild(subListEl);

        bodyEl.appendChild(subEl);
      });
    }

    catEl.appendChild(bodyEl);
    navEl.appendChild(catEl);
  });

  highlightActiveLink();
}

function highlightActiveLink() {
  const hash = window.location.hash;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
}

/* =============================================
   ROUTING
   ============================================= */
function handleRoute() {
  const hash = window.location.hash; // e.g. #/functional/functional/index.md
  const match = hash.match(/^#\/([^/]+)\/(.+)$/);

  if (!match) {
    if (!hash || hash === '#/' || hash === '#') {
      // Landing page
      currentSection = null;
      document.body.classList.add('landing');
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('sidebar-nav').innerHTML = '';
      startVanta();
      loadPage('doc/home.md');
    } else {
      // Fallback
      window.location.hash = '#/';
    }
    return;
  }

  document.body.classList.remove('landing');
  stopVanta();
  const [, section, path] = match;

  // If section changed, update the section toggle
  if (section !== currentSection) {
    currentSection = section;
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });
    buildNav(section);
  }

  highlightActiveLink();
  loadPage(`doc/${path}`);
}

function navigateTo(section, path) {
  window.location.hash = `#/${section}/${path}`;
}

/* =============================================
   MARKDOWN LOADER & RENDERER
   ============================================= */
async function loadPage(filePath) {
  const contentEl = document.getElementById('doc-content');
  contentEl.innerHTML = '<p class="loading-message">Loading...</p>';
  document.getElementById('toc-nav').innerHTML = '';

  // Check if we need to render the interactive Swagger UI
  if (filePath === 'doc/technical/api.md') {
    contentEl.innerHTML = '<div id="swagger-ui"></div>';
    
    // We adjust theme based on current mode
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    SwaggerUIBundle({
      url: "assets/swagger.yaml",
      dom_id: '#swagger-ui',
      deepLinking: false, // disabled to not conflict with the SPA router
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: "BaseLayout",
      onComplete: () => {
        // Build TOC from Swagger tags once it's rendered
        const tocNav = document.getElementById('toc-nav');
        tocNav.innerHTML = '';
        
        const tags = ['LED', 'Strip', 'System', 'Monitors'];
        const tagElements = [];
        
        tags.forEach(tag => {
          const id = `operations-tag-${tag}`;
          const link = document.createElement('a');
          link.href = `#${id}`;
          link.className = 'toc-link';
          link.textContent = tag;
          
          link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(id);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          tocNav.appendChild(link);
          
          // Collect elements for TOC highlight
          const target = document.getElementById(id);
          if (target) tagElements.push(target);
        });
        
        // Highlight active section on scroll
        observeTOCHighlight(tagElements);
      }
    });
    
    window.scrollTo(0, 0);
    injectPrevNextButtons(filePath);
    return;
  }

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const markdown = await res.text();

    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const html = marked.parse(markdown);
    contentEl.innerHTML = html;

    // Wire up relative markdown links so intra-doc navigation works
    setupDocLinks(contentEl, filePath);

    // Add IDs to headings for anchors (marked may already do this)
    addHeadingIds(contentEl);

    // Render Mermaid diagrams (code blocks with language "mermaid")
    if (window.mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
      });

      contentEl.querySelectorAll('pre > code.language-mermaid').forEach(async (codeEl) => {
        const pre = codeEl.parentElement;
        const diagramDef = codeEl.textContent;

        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid-wrapper';

        const diagramEl = document.createElement('div');
        diagramEl.className = 'mermaid';
        diagramEl.textContent = diagramDef;

        wrapper.appendChild(diagramEl);
        pre.replaceWith(wrapper);
      });

      await mermaid.run({ querySelector: '.mermaid' });

      // Add expand button to each rendered diagram
      contentEl.querySelectorAll('.mermaid-wrapper').forEach(wrapper => {
        const btn = document.createElement('button');
        btn.className = 'mermaid-expand-btn';
        btn.title = 'Enlarge diagram';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
          <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
        </svg>`;
        btn.addEventListener('click', () => openDiagramModal(wrapper));
        wrapper.appendChild(btn);
      });
    }

    // Syntax highlighting via Prism.js (skip mermaid blocks)
    if (window.Prism) {
      Prism.highlightAllUnder(contentEl);

      // Inject language badges above each code block, outside the <pre>
      contentEl.querySelectorAll('pre > code[class*="language-"]').forEach(codeEl => {
        const match = codeEl.className.match(/language-(\S+)/);
        if (!match) return;
        const lang = match[1];
        if (lang === 'mermaid') return; // already replaced above

        const pre = codeEl.parentElement;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        const badge = document.createElement('span');
        badge.className = 'code-lang-badge';
        badge.textContent = lang;

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(badge);
        wrapper.appendChild(pre);
      });
    }

    // Add zoom expand buttons to standalone images
    setupImageZoom(contentEl);

    // Build TOC from rendered headings
    buildTOC(contentEl);

    // Scroll to top
    window.scrollTo(0, 0);

    // Inject pagination buttons
    injectPrevNextButtons(filePath);

  } catch (e) {
    contentEl.innerHTML = `
      <h1>Page not found</h1>
      <p>The file <code>${filePath}</code> could not be loaded.</p>
      <p style="color: var(--color-text-muted); font-size: 0.875rem;">${e.message}</p>
    `;
  }
}

/* =============================================
   IMAGE ZOOM (expand button on standalone images)
   ============================================= */
function setupImageZoom(contentEl) {
  contentEl.querySelectorAll('img').forEach(img => {
    // Skip images inside links, mermaid wrappers, inline-sized figures
    // and centered blocks (e.g. the landing page logo)
    if (img.closest('a')) return;
    if (img.closest('.mermaid-wrapper')) return;
    if (img.hasAttribute('width') || img.hasAttribute('height')) return;
    const parent = img.parentElement;
    if (parent && (parent.getAttribute('align') === 'center' || parent.style.textAlign === 'center')) return;
    if (img.closest('[align="center"]')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'image-zoom-wrapper';

    const btn = document.createElement('button');
    btn.className = 'image-expand-btn';
    btn.title = 'Enlarge image';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>`;
    btn.addEventListener('click', () => openZoomModal(img));

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(btn);
  });
}

/* =============================================
   INTRA-DOC LINKS
   ============================================= */
function resolveDocLink(fromPath, href) {
  // fromPath e.g. "doc/functional/index.md", href e.g. "getting-started.md" or "../technical/api.md"
  let dirs = fromPath.split('/');
  dirs.pop();
  const segs = href.split('/');
  for (const s of segs) {
    if (s === '.' || s === '') continue;
    if (s === '..') { dirs.pop(); continue; }
    dirs.push(s);
  }
  return dirs.join('/');
}

function setupDocLinks(contentEl, filePath) {
  const fromPath = filePath;
  contentEl.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Leave anchors, absolute URLs and routed hashes alone
    if (href.startsWith('#') || /^[a-z]+:\/\//i.test(href) || href.startsWith('mailto:')) return;

    const resolved = resolveDocLink(fromPath, href);
    const isMarkdown = resolved.endsWith('.md');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (isMarkdown) {
        const section = resolved.startsWith('functional/') ? 'functional' : 'technical';
        window.location.hash = `#/${section}/${resolved.replace(/^doc\//, '')}`;
      } else {
        window.location.href = href;
      }
    });
  });
}

/* =============================================
   PAGINATION (Previous / Next)
   ============================================= */
function injectPrevNextButtons(filePath) {
  if (!currentSection) return;
  const relativePath = filePath.replace(/^doc\//, '');
  const flatNav = getFlatNav(currentSection);
  const currentIndex = flatNav.findIndex(item => item.path === relativePath);

  if (currentIndex === -1) return;

  const prev = currentIndex > 0 ? flatNav[currentIndex - 1] : null;
  const next = currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : null;

  if (!prev && !next) return;

  const navEl = document.createElement('div');
  navEl.className = 'doc-pagination';

  const prevHtml = prev ? `<a href="#/${currentSection}/${prev.path}" class="pagination-btn prev">
      <span class="pagination-label">Previous</span>
      <span class="pagination-title">« ${prev.label}</span>
    </a>` : `<div></div>`;

  const nextHtml = next ? `<a href="#/${currentSection}/${next.path}" class="pagination-btn next">
      <span class="pagination-label">Next</span>
      <span class="pagination-title">${next.label} »</span>
    </a>` : `<div></div>`;

  navEl.innerHTML = prevHtml + nextHtml;
  document.getElementById('doc-content').appendChild(navEl);
}

/* =============================================
   HEADING IDS (for TOC anchors)
   ============================================= */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

function addHeadingIds(container) {
  const headings = container.querySelectorAll('h2, h3, h4');
  const usedIds = {};
  headings.forEach(h => {
    if (!h.id) {
      let id = slugify(h.textContent);
      if (usedIds[id]) {
        usedIds[id]++;
        id = `${id}-${usedIds[id]}`;
      } else {
        usedIds[id] = 1;
      }
      h.id = id;
    }
  });
}

/* =============================================
   TABLE OF CONTENTS
   ============================================= */
function buildTOC(container) {
  const tocNav = document.getElementById('toc-nav');
  tocNav.innerHTML = '';

  const headings = container.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  headings.forEach(h => {
    const link = document.createElement('a');
    link.href = `#${h.id}`;
    link.className = `toc-link ${h.tagName === 'H3' ? 'toc-h3' : ''}`;
    link.textContent = h.textContent;
    link.addEventListener('click', e => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tocNav.appendChild(link);
  });

  // Highlight TOC link on scroll
  observeTOCHighlight(headings);
}

function observeTOCHighlight(headings) {
  // Disconnect any previous observer
  if (window._tocObserver) window._tocObserver.disconnect();

  const tocLinks = document.querySelectorAll('.toc-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px' });

  headings.forEach(h => observer.observe(h));
  window._tocObserver = observer;
}

/* =============================================
   SEARCH INDEX
   ============================================= */
async function buildSearchIndex() {
  if (searchIndexBuilt || !config) return;
  searchIndex = [];

  const sections = Object.keys(config.nav);
  for (const section of sections) {
    for (const cat of config.nav[section]) {
      for (const item of (cat.items || [])) {
        try {
          const res = await fetch(`doc/${item.path}`);
          if (!res.ok) continue;
          const text = await res.text();
          // Extract title from first # heading
          const titleMatch = text.match(/^#\s+(.+)/m);
          const title = titleMatch ? titleMatch[1].trim() : item.label;
          searchIndex.push({
            section,
            path: item.path,
            label: item.label,
            title,
            content: text,
          });
        } catch (_) { /* ignore */ }
      }
    }
  }
  searchIndexBuilt = true;
}

/* =============================================
   SEARCH UI
   ============================================= */
function setupSearch() {
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query.length < 2) {
      resultsEl.hidden = true;
      return;
    }
    const results = performSearch(query);
    renderSearchResults(results, query);
  });

  // Close results when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) {
      resultsEl.hidden = true;
    }
  });

  // Open results when focusing input if there's content
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) {
      resultsEl.hidden = false;
    }
  });

  // Keyboard navigation
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      resultsEl.hidden = true;
      input.blur();
    }
  });
}

function performSearch(query) {
  if (!searchIndexBuilt || searchIndex.length === 0) return [];
  const q = query.toLowerCase();
  const results = [];

  for (const doc of searchIndex) {
    const contentLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();

    if (!titleLower.includes(q) && !contentLower.includes(q)) continue;

    // Find excerpt around first match in content
    const idx = contentLower.indexOf(q);
    let excerpt = '';
    if (idx !== -1) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(doc.content.length, idx + query.length + 80);
      excerpt = (start > 0 ? '…' : '') + doc.content.slice(start, end).replace(/#+\s/g, '') + (end < doc.content.length ? '…' : '');
    }

    results.push({ ...doc, excerpt, matchIndex: titleLower.includes(q) ? -1 : idx });
  }

  // Sort: title matches first
  results.sort((a, b) => a.matchIndex - b.matchIndex);
  return results.slice(0, 8);
}

function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-result-match">$1</mark>');
}

function renderSearchResults(results, query) {
  const resultsEl = document.getElementById('search-results');
  resultsEl.innerHTML = '';

  if (results.length === 0) {
    resultsEl.innerHTML = `<p class="search-no-result">No results for « ${query} »</p>`;
    resultsEl.hidden = false;
    return;
  }

  results.forEach(r => {
    const item = document.createElement('a');
    item.className = 'search-result-item';
    item.href = `#/${r.section}/${r.path}`;
    item.innerHTML = `
      <div class="search-result-title">${highlightMatch(r.title, query)}</div>
      ${r.excerpt ? `<div class="search-result-excerpt">${highlightMatch(r.excerpt, query)}</div>` : ''}
    `;
    item.addEventListener('click', () => {
      document.getElementById('search-results').hidden = true;
      document.getElementById('search-input').value = '';
    });
    resultsEl.appendChild(item);
  });

  resultsEl.hidden = false;
}

/* =============================================
   ZOOM MODAL (zoom / pan) — diagrams & images
   ============================================= */
function openDiagramModal(wrapper) {
  const sourceSvg = wrapper.querySelector('svg');
  if (!sourceSvg) return;
  openZoomModal(sourceSvg);
}

function openZoomModal(sourceEl) {
  const isImage = sourceEl.tagName.toLowerCase() === 'img';

  // Create modal if it doesn't exist yet
  let modal = document.getElementById('diagram-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'diagram-modal';
    modal.className = 'diagram-modal';
    modal.innerHTML = `
      <div class="diagram-modal-backdrop"></div>
      <div class="diagram-modal-window">
        <div class="diagram-modal-toolbar">
          <div class="diagram-zoom-controls">
            <button class="diagram-tool-btn" id="dm-zoom-out" title="Zoom out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <span class="diagram-zoom-level" id="dm-zoom-level">100%</span>
            <button class="diagram-tool-btn" id="dm-zoom-in" title="Zoom in">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="diagram-tool-btn" id="dm-zoom-reset" title="Reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
          <button class="diagram-tool-btn diagram-close-btn" id="dm-close" title="Close (Esc)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="diagram-modal-viewport" id="dm-viewport">
          <div class="diagram-modal-inner" id="dm-inner"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Wire up controls
    document.getElementById('dm-close').addEventListener('click', closeDiagramModal);
    document.getElementById('dm-zoom-in').addEventListener('click', () => adjustZoom(0.2));
    document.getElementById('dm-zoom-out').addEventListener('click', () => adjustZoom(-0.2));
    document.getElementById('dm-zoom-reset').addEventListener('click', () => setZoom(1));
    modal.querySelector('.diagram-modal-backdrop').addEventListener('click', closeDiagramModal);
    document.addEventListener('keydown', onModalKey);

    // Wheel zoom
    const vp = document.getElementById('dm-viewport');
    vp.addEventListener('wheel', (e) => {
      e.preventDefault();
      adjustZoom(e.deltaY < 0 ? 0.1 : -0.1);
    }, { passive: false });

    // Drag to pan
    let dragging = false, startX, startY, scrollLeft, scrollTop;
    vp.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.pageX - vp.offsetLeft;
      startY = e.pageY - vp.offsetTop;
      scrollLeft = vp.scrollLeft;
      scrollTop  = vp.scrollTop;
      vp.style.cursor = 'grabbing';
    });
    vp.addEventListener('mouseleave', () => { dragging = false; vp.style.cursor = 'grab'; });
    vp.addEventListener('mouseup',    () => { dragging = false; vp.style.cursor = 'grab'; });
    vp.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      e.preventDefault();
      vp.scrollLeft = scrollLeft - (e.pageX - vp.offsetLeft - startX);
      vp.scrollTop  = scrollTop  - (e.pageY - vp.offsetTop  - startY);
    });
  }

  // Inject cloned element
  let zoom = 1;
  const inner = document.getElementById('dm-inner');
  inner.innerHTML = '';
  const clone = sourceEl.cloneNode(true);
  clone.removeAttribute('style');
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  inner.appendChild(clone);

  // Read intrinsic size (reliable even when hidden)
  let contentW, contentH;
  if (isImage) {
    contentW = sourceEl.naturalWidth || 800;
    contentH = sourceEl.naturalHeight || 600;
  } else {
    const vb = clone.viewBox?.baseVal;
    contentW = (vb && vb.width > 0) ? vb.width : parseFloat(clone.getAttribute('width')) || 800;
    contentH = (vb && vb.height > 0) ? vb.height : parseFloat(clone.getAttribute('height')) || 600;
  }

  function setZoom(z) {
    zoom = Math.min(Math.max(z, 0.2), 5);
    inner.style.width  = (contentW * zoom) + 'px';
    inner.style.height = (contentH * zoom) + 'px';
    clone.style.width  = '100%';
    clone.style.height = '100%';
    document.getElementById('dm-zoom-level').textContent = Math.round(zoom * 100) + '%';
  }
  function adjustZoom(delta) { setZoom(zoom + delta); }
  modal._setZoom = setZoom;
  modal._adjustZoom = adjustZoom;
  setZoom(1);

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDiagramModal() {
  const modal = document.getElementById('diagram-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function onModalKey(e) {
  if (e.key === 'Escape') closeDiagramModal();
}

/* =============================================
   START
   ============================================= */
document.addEventListener('DOMContentLoaded', init);
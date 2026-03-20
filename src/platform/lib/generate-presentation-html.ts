import type { Slide } from './presentation-types';

interface StandaloneHTMLOptions {
  title: string;
  slides: Slide[];
  accentColor?: string;
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateCSS(accent: string): string {
  return `
  :root {
    --accent: ${accent};
    --accent-glow: ${accent}26;
    --midnight: #121948;
    --midnight-deep: #0C1030;
    --navy: #0F3563;
    --slide-transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; font-family: 'Jost', sans-serif; }

  /* ─ Dark (default) ─ */
  body {
    background: var(--midnight-deep); color: #FFFFFF;
    display: flex; flex-direction: column;
  }
  .deck { flex: 1; position: relative; overflow: hidden; }

  .slide {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity var(--slide-transition), transform var(--slide-transition);
    transform: translateY(30px);
    padding: 60px 80px 80px;
    overflow: hidden;
  }
  .slide.active { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .slide-inner { width: 100%; max-width: 1100px; margin: 0 auto; }

  .bg-radial { background: radial-gradient(ellipse at 20% 50%, #1A2460 0%, var(--midnight-deep) 70%); }
  .bg-grad { background: linear-gradient(135deg, var(--midnight-deep) 0%, var(--midnight) 40%, var(--navy) 100%); }
  .bg-accent { background: linear-gradient(135deg, var(--accent) 0%, ${accent}CC 100%); }

  .glow-orb { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; opacity: 0.15; }
  .orb-accent { background: var(--accent); width: 400px; height: 400px; }
  .orb-blue { background: #2563EB; width: 300px; height: 300px; }

  .grid-pattern {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .kicker { font-size: 13px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
  h1 { font-size: clamp(42px, 5vw, 64px); font-weight: 800; line-height: 1.05; letter-spacing: -1px; margin-bottom: 20px; }
  h2 { font-size: clamp(32px, 3.5vw, 48px); font-weight: 700; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 20px; }
  .subtitle { font-size: clamp(16px, 1.8vw, 22px); font-weight: 300; line-height: 1.6; color: rgba(255,255,255,0.6); max-width: 600px; }

  .stat-grid { display: grid; gap: 24px; margin-top: 40px; }
  .stat-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 28px 20px; text-align: center;
    transition: all 0.3s ease; position: relative; overflow: hidden;
  }
  .stat-card:hover { border-color: ${accent}4D; transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .stat-icon { font-size: 28px; margin-bottom: 8px; display: block; }
  .stat-value { font-size: 48px; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }

  .bullet-card {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    font-size: 17px; line-height: 1.5; color: #FFFFFF;
    transition: all 0.3s ease;
  }
  .bullet-card:hover { border-color: ${accent}4D; transform: translateY(-2px); }
  .bullet-icon { width: 24px; height: 24px; flex-shrink: 0; }

  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .active .reveal { opacity: 1; transform: translateY(0); }
  .active .reveal.d1 { transition-delay: 0.1s; }
  .active .reveal.d2 { transition-delay: 0.2s; }
  .active .reveal.d3 { transition-delay: 0.3s; }
  .active .reveal.d4 { transition-delay: 0.4s; }
  .active .reveal.d5 { transition-delay: 0.5s; }

  /* ─ Nav bar ─ */
  .nav-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 32px; background: rgba(12,16,48,0.85);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .nav-logo { font-weight: 700; font-size: 13px; letter-spacing: 0.5px; color: var(--accent); }
  .nav-logo span { color: rgba(255,255,255,0.4); font-weight: 400; }
  .progress-track { flex: 1; max-width: 320px; height: 3px; background: rgba(255,255,255,0.08); border-radius: 4px; margin: 0 24px; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.5s ease; }
  .nav-controls { display: flex; align-items: center; gap: 10px; }
  .nav-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
    color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.25s ease; font-family: 'Jost', sans-serif;
  }
  .nav-btn:hover { background: var(--accent); border-color: var(--accent); transform: scale(1.05); }
  .nav-btn:disabled { opacity: 0.25; cursor: default; transform: none; }
  .nav-btn:disabled:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); }
  .slide-counter { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 500; min-width: 50px; text-align: center; font-variant-numeric: tabular-nums; }

  /* ─ Light theme ─ */
  [data-theme="light"] body { background: #F4F5F7; color: #121948; }
  [data-theme="light"] .bg-radial { background: radial-gradient(ellipse at 20% 50%, #EEEFF3 0%, #F4F5F7 70%); }
  [data-theme="light"] .bg-grad { background: linear-gradient(135deg, #F4F5F7 0%, #ECEDF2 40%, #E8EAF0 100%); }
  [data-theme="light"] .slide { color: #121948; }
  [data-theme="light"] .subtitle { color: #4B5563; }
  [data-theme="light"] .glow-orb { opacity: 0.06; }
  [data-theme="light"] .grid-pattern {
    background-image: linear-gradient(rgba(18,25,72,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(18,25,72,0.025) 1px, transparent 1px);
  }
  [data-theme="light"] .nav-bar { background: rgba(255,255,255,0.92); border-top-color: rgba(18,25,72,0.08); }
  [data-theme="light"] .nav-logo span { color: rgba(18,25,72,0.4); }
  [data-theme="light"] .progress-track { background: rgba(18,25,72,0.07); }
  [data-theme="light"] .nav-btn { border-color: rgba(18,25,72,0.12); background: rgba(18,25,72,0.04); color: #121948; }
  [data-theme="light"] .nav-btn:hover { background: var(--accent); border-color: var(--accent); color: #FFFFFF; }
  [data-theme="light"] .slide-counter { color: rgba(18,25,72,0.35); }
  [data-theme="light"] .stat-card { background: #FFFFFF; border-color: rgba(18,25,72,0.07); box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  [data-theme="light"] .stat-card:hover { border-color: var(--accent); box-shadow: 0 12px 40px ${accent}1A; }
  [data-theme="light"] .stat-label { color: #4B5563; }
  [data-theme="light"] .bullet-card { background: #FFFFFF; border-color: rgba(18,25,72,0.07); color: #121948; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  [data-theme="light"] .bullet-card:hover { border-color: var(--accent); }

  @media (max-width: 768px) {
    .slide { padding: 40px 24px 80px; }
    .stat-grid { gap: 16px; }
    .stat-card { padding: 20px 16px; }
    .stat-value { font-size: 36px; }
    .nav-bar { padding: 10px 16px; }
    .progress-track { max-width: 120px; margin: 0 12px; }
  }
  `;
}

const CHECK_SVG = `<svg width="24" height="24" viewBox="0 0 256 256" fill="none"><circle cx="128" cy="128" r="128" fill="currentColor" opacity="0.15"/><path d="M108 164L76 132l-8 8 40 40 80-80-8-8z" fill="currentColor"/></svg>`;

function generateSlideHTML(slide: Slide, index: number, accent: string): string {
  const bgClass = index % 2 === 0 ? 'bg-radial' : 'bg-grad';

  if (slide.type === 'title' || slide.type === 'closing') {
    return `
    <div class="slide ${bgClass}" data-slide="${index}">
      <div class="glow-orb orb-accent" style="top:-150px;right:-100px"></div>
      <div class="glow-orb orb-blue" style="bottom:-100px;left:-80px;opacity:0.1"></div>
      <div class="grid-pattern"></div>
      <div class="slide-inner" style="text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh">
        ${slide.kicker ? `<div class="kicker reveal">${esc(slide.kicker)}</div>` : ''}
        <h1 class="reveal d1" style="max-width:700px">${esc(slide.title || '')}</h1>
        ${slide.subtitle ? `<p class="subtitle reveal d2" style="margin:0 auto">${esc(slide.subtitle)}</p>` : ''}
      </div>
    </div>`;
  }

  if (slide.type === 'section') {
    return `
    <div class="slide bg-accent" data-slide="${index}">
      <div class="glow-orb" style="background:rgba(255,255,255,1);width:300px;height:300px;top:-100px;right:-80px;opacity:0.08"></div>
      <div class="grid-pattern" style="background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:60px 60px"></div>
      <div class="slide-inner" style="text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh">
        ${slide.emoji ? `<span class="reveal" style="font-size:64px;display:block;margin-bottom:20px">${slide.emoji}</span>` : ''}
        <h2 class="reveal d1" style="color:#FFFFFF;font-size:clamp(36px,4vw,56px)">${esc(slide.title || '')}</h2>
        <div class="reveal d2" style="width:48px;height:3px;border-radius:2px;background:rgba(255,255,255,0.4);margin:16px auto 0"></div>
      </div>
    </div>`;
  }

  if (slide.type === 'stats') {
    const stats = slide.stats || [];
    const cols = stats.length;
    const iconMap: Record<string, string> = {
      smiley: '\u{1F60A}', smileySad: '\u{1F61E}', sun: '\u2600\uFE0F', users: '\u{1F465}',
      lightning: '\u26A1', trendDown: '\u{1F4C9}', heart: '\u2764\uFE0F',
      coffee: '\u2615', clock: '\u{1F552}', eye: '\u{1F441}\uFE0F',
    };
    const statsHTML = stats.map((s, i) => `
      <div class="stat-card reveal d${i + 2}">
        <span class="stat-icon">${iconMap[s.iconName || ''] || ''}</span>
        <div class="stat-value" style="color:${s.color || accent}">${esc(s.value)}</div>
        <div class="stat-label">${esc(s.label)}</div>
      </div>
    `).join('');

    return `
    <div class="slide ${bgClass}" data-slide="${index}">
      <div class="glow-orb orb-accent" style="top:10%;left:5%;width:250px;height:250px;opacity:0.12"></div>
      <div class="grid-pattern"></div>
      <div class="slide-inner">
        ${slide.kicker ? `<div class="kicker reveal">${esc(slide.kicker)}</div>` : ''}
        <h2 class="reveal d1">${esc(slide.title || '')}</h2>
        <div class="stat-grid reveal" style="grid-template-columns:repeat(${cols},1fr)">
          ${statsHTML}
        </div>
      </div>
    </div>`;
  }

  if (slide.type === 'content') {
    const bulletsHTML = (slide.bullets || []).map((b, i) => `
      <div class="bullet-card reveal d${Math.min(i + 2, 5)}">
        <div class="bullet-icon" style="color:${accent}">${CHECK_SVG}</div>
        ${esc(b)}
      </div>
    `).join('');

    return `
    <div class="slide ${bgClass}" data-slide="${index}">
      <div class="glow-orb orb-accent" style="bottom:15%;right:10%;width:300px;height:300px;opacity:0.1"></div>
      <div class="grid-pattern"></div>
      <div class="slide-inner">
        ${slide.kicker ? `<div class="kicker reveal">${esc(slide.kicker)}</div>` : ''}
        <h2 class="reveal d1">${esc(slide.title || '')}</h2>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:32px">
          ${bulletsHTML}
        </div>
      </div>
    </div>`;
  }

  if (slide.type === 'quote') {
    return `
    <div class="slide ${bgClass}" data-slide="${index}">
      <div class="glow-orb orb-accent" style="top:30%;left:50%;transform:translateX(-50%);width:400px;height:400px;opacity:0.08"></div>
      <div class="grid-pattern"></div>
      <div class="slide-inner" style="text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh">
        <div class="reveal" style="width:48px;height:3px;border-radius:2px;background:${accent};margin:0 auto 28px"></div>
        <p class="reveal d1" style="font-size:clamp(20px,2.5vw,28px);font-style:italic;line-height:1.5;max-width:700px;font-weight:400">&ldquo;${esc(slide.quote || '')}&rdquo;</p>
        ${slide.attribution ? `<p class="reveal d2" style="font-size:16px;color:rgba(255,255,255,0.45);margin-top:24px;font-weight:500">&mdash; ${esc(slide.attribution)}</p>` : ''}
      </div>
    </div>`;
  }

  return `<div class="slide ${bgClass}" data-slide="${index}"><div class="grid-pattern"></div><div class="slide-inner"></div></div>`;
}

function generateJS(total: number, title: string, accent: string): string {
  const accentNoHash = accent.replace('#', '');
  return `
(function() {
  var slides = document.querySelectorAll('.slide');
  var total = ${total};
  var current = 0;
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var counter = document.getElementById('slideCounter');
  var progress = document.getElementById('progressFill');

  function goTo(idx) {
    if (idx < 0 || idx >= total || idx === current) return;
    slides[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    update();
  }
  function update() {
    counter.textContent = (current + 1) + ' / ' + total;
    progress.style.width = ((current + 1) / total * 100) + '%';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', function() { goTo(current - 1); });
  nextBtn.addEventListener('click', function() { goTo(current + 1); });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  });

  var touchStartX = 0;
  document.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) { diff > 0 ? goTo(current + 1) : goTo(current - 1); }
  });

  // Click navigation on deck
  document.getElementById('deck').addEventListener('click', function(e) {
    if (e.target.closest('.nav-bar') || e.target.closest('button')) return;
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x < rect.width * 0.15) goTo(current - 1);
    else goTo(current + 1);
  });

  // Theme toggle
  var themeBtn = document.getElementById('themeToggle');
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    themeBtn.textContent = t === 'light' ? '\\u263E' : '\\u2600';
  }
  themeBtn.addEventListener('click', function() {
    var cur = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(cur === 'light' ? 'dark' : 'light');
  });

  // Fullscreen
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }
  document.getElementById('fsBtn').addEventListener('click', toggleFullscreen);

  // ─── PPTX Export ───
  document.getElementById('exportBtn').addEventListener('click', exportPPTX);

  function exportPPTX() {
    if (typeof PptxGenJS === 'undefined') { alert('PptxGenJS is still loading. Try again in a moment.'); return; }

    var isDark = (document.documentElement.getAttribute('data-theme') || 'dark') !== 'light';
    var T = isDark ? {
      bg1:'0C1030', bg2:'121948', bg3:'0F3563',
      text:'FFFFFF', textMuted:'AAAACC', textSoft:'8888AA',
      accent:'${accentNoHash}',
      cardBg:'1A2060', cardBorder:'2A3070',
      tableHeaderBg:'121948', tableHeaderText:'FFFFFF'
    } : {
      bg1:'F5F6FA', bg2:'FFFFFF', bg3:'E8EAF4',
      text:'121948', textMuted:'4B5563', textSoft:'6B7280',
      accent:'${accentNoHash}',
      cardBg:'FFFFFF', cardBorder:'E0E2EA',
      tableHeaderBg:'121948', tableHeaderText:'FFFFFF'
    };

    var pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9';
    pres.author = '${esc(title)}';
    pres.title = '${esc(title)}';

    var FONT = 'Calibri';
    var shadow = { type:'outer', blur:6, offset:2, angle:135, color:'000000', opacity:0.1 };
    var M = 0.7, CW = 10 - M * 2, KY = 0.45, TY = 0.85, SY = 1.55, BY = 2.55;
    var IX = 1.5, IW = 7;

    var slideData = JSON.parse(document.getElementById('slide-data').textContent);

    slideData.forEach(function(s, idx) {
      var sl = pres.addSlide();
      sl.background = { color: T.bg1 };

      if (s.type === 'title' || s.type === 'closing') {
        var ty = s.type === 'closing' ? 1.4 : 1.5;
        if (s.kicker) {
          sl.addText(s.kicker.toUpperCase(), { x:M, y:ty, w:CW, h:0.3, fontFace:FONT, fontSize:11, color:T.accent, bold:true, charSpacing:4, align:'center' });
          ty += 0.5;
        }
        sl.addText(s.title || '', { x:M, y:ty, w:CW, h:0.8, fontFace:FONT, fontSize:42, bold:true, color:T.text, align:'center' });
        if (s.subtitle) {
          sl.addText(s.subtitle, { x:IX, y:ty+0.9, w:IW, h:0.7, fontFace:FONT, fontSize:16, color:T.textMuted, align:'center', lineSpacingMultiple:1.4 });
        }
      }

      else if (s.type === 'section') {
        sl.background = { color: T.accent };
        if (s.emoji) {
          sl.addText(s.emoji, { x:M, y:1.6, w:CW, h:0.8, fontFace:FONT, fontSize:48, align:'center' });
        }
        sl.addText(s.title || '', { x:M, y:2.5, w:CW, h:0.7, fontFace:FONT, fontSize:36, bold:true, color:'FFFFFF', align:'center' });
      }

      else if (s.type === 'stats') {
        if (s.kicker) {
          sl.addText(s.kicker.toUpperCase(), { x:M, y:KY, w:CW, h:0.3, fontFace:FONT, fontSize:11, color:T.accent, bold:true, charSpacing:3, align:'center' });
        }
        sl.addText(s.title || '', { x:M, y:TY, w:CW, h:0.6, fontFace:FONT, fontSize:30, bold:true, color:T.text, align:'center' });

        var stats = s.stats || [];
        var statW = 2.4;
        var statGap = stats.length > 1 ? (CW - statW * stats.length) / (stats.length - 1) : 0;
        stats.forEach(function(st, i) {
          var sx = M + i * (statW + statGap);
          var stColor = (st.color || '${accent}').replace('#', '');
          sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:sx, y:BY, w:statW, h:1.6, fill:{color:T.cardBg}, rectRadius:0.12, shadow:shadow });
          sl.addText(st.value, { x:sx, y:BY+0.3, w:statW, h:0.6, fontFace:FONT, fontSize:36, bold:true, color:stColor, align:'center', valign:'middle' });
          sl.addText(st.label.toUpperCase(), { x:sx+0.2, y:BY+1.0, w:statW-0.4, h:0.4, fontFace:FONT, fontSize:10, color:T.textSoft, align:'center', charSpacing:1 });
        });
      }

      else if (s.type === 'content') {
        if (s.kicker) {
          sl.addText(s.kicker.toUpperCase(), { x:M, y:KY, w:CW, h:0.3, fontFace:FONT, fontSize:11, color:T.accent, bold:true, charSpacing:3 });
        }
        sl.addText(s.title || '', { x:M, y:TY, w:CW, h:0.5, fontFace:FONT, fontSize:26, bold:true, color:T.text });

        var bullets = s.bullets || [];
        bullets.forEach(function(b, i) {
          var by = SY + 0.2 + i * 0.55;
          sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:M, y:by, w:CW, h:0.48, fill:{color:T.cardBg}, rectRadius:0.06, shadow:shadow });
          sl.addText([
            { text:'\\u2713  ', options:{ color:T.accent, bold:true } },
            { text:b, options:{ color:T.text } }
          ], { x:M+0.25, y:by, w:CW-0.5, h:0.48, fontFace:FONT, fontSize:14, valign:'middle' });
        });
      }

      else if (s.type === 'quote') {
        sl.addShape(pres.shapes.LINE, { x:4.5, y:1.8, w:1, h:0, line:{color:T.accent, width:3} });
        sl.addText('\\u201C' + (s.quote || '') + '\\u201D', { x:1.5, y:2.2, w:7, h:1.2, fontFace:FONT, fontSize:22, italic:true, color:T.text, align:'center', lineSpacingMultiple:1.5 });
        if (s.attribution) {
          sl.addText('\\u2014 ' + s.attribution, { x:1.5, y:3.6, w:7, h:0.4, fontFace:FONT, fontSize:14, color:T.textSoft, align:'center' });
        }
      }
    });

    var themeName = isDark ? 'Dark' : 'Light';
    pres.writeFile({ fileName: '${esc(title).replace(/'/g, "\\'")} - ' + themeName + '.pptx' });
  }

  // Hash navigation
  var hash = window.location.hash;
  if (hash && hash.startsWith('#slide-')) {
    var n = parseInt(hash.replace('#slide-', '')) - 1;
    if (n >= 0 && n < total) { slides[0].classList.remove('active'); current = n; slides[current].classList.add('active'); }
  }

  update();
})();
  `;
}

export function generateStandaloneHTML(options: StandaloneHTMLOptions): string {
  const { title, slides, accentColor = '#FF5A28' } = options;

  const slidesHTML = slides.map((s, i) => generateSlideHTML(s, i, accentColor)).join('\n');
  const slidesJSON = JSON.stringify(slides);

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js"><\/script>
<style>${generateCSS(accentColor)}</style>
</head>
<body>
<script type="application/json" id="slide-data">${slidesJSON}<\/script>

<div class="deck" id="deck">
${slidesHTML}
</div>

<nav class="nav-bar">
  <div class="nav-logo">${esc(title)}</div>
  <div class="progress-track">
    <div class="progress-fill" id="progressFill" style="width:${(1 / slides.length) * 100}%"></div>
  </div>
  <div class="nav-controls">
    <button class="nav-btn" id="exportBtn" title="Export as PowerPoint">&#x2913;</button>
    <button class="nav-btn" id="themeToggle" title="Toggle theme">&#x2600;</button>
    <button class="nav-btn" id="fsBtn" title="Fullscreen">&#x26F6;</button>
    <button class="nav-btn" id="prevBtn" disabled>&larr;</button>
    <span class="slide-counter" id="slideCounter">1 / ${slides.length}</span>
    <button class="nav-btn" id="nextBtn">&rarr;</button>
  </div>
</nav>

<script>${generateJS(slides.length, title, accentColor)}<\/script>
</body>
</html>`;
}

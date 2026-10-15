/* Übungs-Engine für die Reihe "Mit Musik erzählen". Kein Speichern, keine Abhängigkeiten.
   Typen: match (Paare), sort (Kategorien), quiz (Multiple Choice). Niveau G/M/E wählbar. */
(function () {
  const $ = (s) => document.querySelector(s);
  const sh = (a) => [...a].sort(() => Math.random() - 0.5);
  const LV = ['G', 'M', 'E'];
  const COL = { Tempo: '#43A047', 'Lautstärke': '#E53935', 'Tonhöhe': '#1E88E5', Klangfarbe: '#FDD835' };
  const css = `
:root{--bg:#f1f1ee;--fg:#1c1c1a;--card:#fff;--line:#c9c9c4;--acc:#1E88E5;--ok:#2e9d4a;--bad:#d33}
@media (prefers-color-scheme:dark){:root{--bg:#161718;--fg:#ececea;--card:#222426;--line:#3b3e41}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:18px/1.4 "Trebuchet MS","Segoe UI",Arial,sans-serif}
main{max-width:860px;margin:0 auto;padding:14px}
h1{margin:4px 0;font-size:1.6rem}.sub{margin:0 0 10px;opacity:.75}.back{font-size:.9rem;color:var(--acc)}
button{font:inherit;color:inherit;cursor:pointer}
button:focus-visible{outline:3px solid #FDD835;outline-offset:2px}
.lv,.tabs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.lv button,.tabs button{padding:8px 14px;border:1px solid var(--line);border-radius:999px;background:var(--card)}
.lv button.on,.tabs button.on{background:var(--acc);border-color:var(--acc);color:#fff}
.box{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;min-height:260px}
.info,.intro{opacity:.8;margin-top:0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.col{display:grid;gap:8px;align-content:start}
.card{width:100%;min-height:52px;padding:10px 12px;text-align:left;border:2px solid var(--line);border-radius:10px;background:var(--bg)}
.card.sel,.chip.sel{border-color:var(--acc);box-shadow:0 0 0 3px #1E88E555}
.ok{border-color:var(--ok)!important;background:#2e9d4a33!important}
.bad{border-color:var(--bad)!important;animation:sh .4s}
@keyframes sh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@media (prefers-reduced-motion:reduce){.bad{animation:none}}
button:disabled{cursor:default;color:inherit}
.pool{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;min-height:50px}
.chip{padding:8px 14px;border:2px solid var(--line);border-radius:999px;background:var(--bg)}
.cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
.cat{border:2px solid var(--line);border-top-width:8px;border-radius:10px;padding:8px;cursor:pointer;min-height:110px}
.cat .chip{pointer-events:none}
.cat h3{margin:0 0 6px;font-size:1.05rem}.cat .in{display:flex;flex-wrap:wrap;gap:6px}
.q{margin:6px 0 12px}.prog{opacity:.7;margin:0}.opts{display:grid;gap:8px}.fb{min-height:1.4em;font-weight:700}
.next,.again{margin-top:10px;padding:9px 18px;border:0;border-radius:8px;background:var(--acc);color:#fff}
.end{font-weight:700;margin-top:14px}
@media (max-width:560px){.two{grid-template-columns:1fr}}`;

    const ICS = {tempo:`<g fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><circle cx="120" cy="140" r="80"/><path d="M120 140V90M120 140L160 160"/></g><g fill="currentColor"><rect x="100" y="18" width="40" height="22"/><rect x="112" y="38" width="16" height="22"/><circle cx="120" cy="140" r="10"/></g>`,laut:`<g fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><path d="M28 95H75L125 52V188L75 145H28Z"/><path d="M173.7 89.4A40 40 0 0 1 173.7 150.6"/><path d="M193 66.4A70 70 0 0 1 193 173.6"/><path d="M212.3 43.4A100 100 0 0 1 212.3 196.6"/></g>`,ton:`<path d="M25 210V170H70V130H115V90H160V50H215V210Z" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="round"/>`,farbe:`<g fill="none" stroke="currentColor" stroke-width="11"><ellipse cx="120" cy="122" rx="100" ry="77"/><circle cx="157" cy="142" r="17"/></g><g fill="currentColor"><circle cx="65" cy="95" r="15"/><circle cx="110" cy="75" r="15"/><circle cx="160" cy="88" r="15"/><circle cx="62" cy="145" r="15"/></g>`};
  const CI = { Tempo: 'tempo', 'Lautstärke': 'laut', 'Tonhöhe': 'ton', Klangfarbe: 'farbe' };
  let cfg, lv = 'M', cur = 0;
  function el(t, c, x) { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }

  function run(c) {
    cfg = c;
    const st = el('style'); st.textContent = css + '.cat h3 svg{width:24px;height:24px;vertical-align:-5px;margin-right:6px}'; document.head.append(st);
    document.title = c.title;
    const m = el('main');
    const back = el('a', 'back', '← Übersicht'); back.href = 'index.html';
    m.append(back, el('h1', 0, c.title));
    if (c.sub) m.append(el('p', 'sub', c.sub));
    const lvb = el('div', 'lv'); lvb.setAttribute('role', 'group'); lvb.setAttribute('aria-label', 'Niveau');
    [['G', 'G · Basis'], ['M', 'M · Mittel'], ['E', 'E · Erweitert']].forEach(([k, t]) => {
      const b = el('button', 0, t); b.dataset.k = k; b.onclick = () => { lv = k; draw(); }; lvb.append(b);
    });
    const tabs = el('nav', 'tabs');
    c.exercises.forEach((x, i) => { const b = el('button', 0, x.title); b.onclick = () => { cur = i; draw(); }; tabs.append(b); });
    const box = el('section', 'box'); box.id = 'ex'; box.setAttribute('aria-live', 'polite');
    m.append(lvb, tabs, box); document.body.append(m);
    draw();
  }

  function draw() {
    document.querySelectorAll('.lv button').forEach((b) => b.classList.toggle('on', b.dataset.k === lv));
    document.querySelectorAll('.tabs button').forEach((b, i) => b.classList.toggle('on', i === cur));
    const box = $('#ex'); box.replaceChildren();
    const x = cfg.exercises[cur];
    ({ match, sort, quiz })[x.type](x, box);
  }

  function end(box, t) {
    const d = el('p', 'end', t + ' '); const b = el('button', 'again', 'Nochmal');
    b.onclick = draw; d.append(b); box.append(d);
  }

  function match(x, box) {
    const base = (x.byLevel && x.byLevel[lv]) || x.pairs; const ps = base.slice(0, (x.n && x.n[lv]) || base.length);
    let sel = null, done = 0, err = 0;
    const g = el('div', 'two'), L = el('div', 'col'), R = el('div', 'col');
    const mk = (t, i, s) => { const b = el('button', 'card', t); b.dataset.i = i; b.dataset.s = s; return b; };
    ps.forEach((p, i) => L.append(mk(p[0], i, 'l')));
    sh(ps.map((p, i) => [p[1], i])).forEach(([t, i]) => R.append(mk(t, i, 'r')));
    g.append(L, R);
    box.append(el('p', 'info', 'Tippe links einen Begriff an, dann rechts die passende Erklärung.'), g);
    g.onclick = (ev) => {
      const b = ev.target.closest('.card'); if (!b || b.disabled) return;
      if (b.dataset.s === 'l') { L.querySelectorAll('.card').forEach((c) => c.classList.remove('sel')); sel = b; b.classList.add('sel'); return; }
      if (!sel) return;
      if (sel.dataset.i === b.dataset.i) {
        [sel, b].forEach((c) => { c.disabled = true; c.classList.remove('sel'); c.classList.add('ok'); });
        sel = null;
        if (++done === ps.length) end(box, err ? `Geschafft! ${err} Fehlversuch(e).` : 'Perfekt, ohne Fehler!');
      } else { err++; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 500); }
    };
  }

  function sort(x, box) {
    const catData = (x.byLevel && x.byLevel[lv]) || x.cats; const names = !x.byLevel && lv === 'G' && x.gcats ? x.gcats : Object.keys(catData);
    const items = sh(names.flatMap((k) => catData[k].map((t) => ({ t, k }))));
    let sel = null, left = items.length, err = 0;
    const pool = el('div', 'pool'), cats = el('div', 'cats');
    box.append(el('p', 'info', 'Tippe ein Wort an, dann den passenden Kasten.'), pool, cats);
    items.forEach((o) => {
      const b = el('button', 'chip', o.t);
      b.onclick = () => { pool.querySelectorAll('.chip').forEach((c) => c.classList.remove('sel')); sel = { b, o }; b.classList.add('sel'); };
      pool.append(b);
    });
    names.forEach((k) => {
      const c = el('div', 'cat'); const h3 = el('h3'); if (CI[k]) h3.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 240 240">' + ICS[CI[k]] + '</svg>'); h3.append(k); c.append(h3);
      if (COL[k]) c.style.borderTopColor = COL[k];
      const l = el('div', 'in'); c.append(l);
      c.onclick = () => {
        if (!sel) return;
        const { b, o } = sel;
        if (o.k === k) {
          b.classList.remove('sel'); b.classList.add('ok'); b.disabled = true; l.append(b); sel = null;
          if (--left === 0) end(box, err ? `Geschafft! ${err} Fehlversuch(e).` : 'Perfekt, ohne Fehler!');
        } else { err++; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 500); }
      };
      cats.append(c);
    });
  }

  function quiz(x, box) {
    const qs = x.qs.filter((q) => (q.for ? q.for.includes(lv) : LV.indexOf(q.lv || 'G') <= LV.indexOf(lv)));
    let i = 0, pts = 0;
    const show = () => {
      box.replaceChildren();
      if (i >= qs.length) { box.append(el('h2', 'q', `${pts} von ${qs.length} richtig`)); end(box, 'Gut gemacht!'); return; }
      const q = qs[i];
      box.append(el('p', 'prog', `Frage ${i + 1} von ${qs.length}`), el('h2', 'q', q.q));
      const opts = sh(q.a.map((t, k) => ({ t, ok: k === q.c })));
      const wrap = el('div', 'opts'), fb = el('p', 'fb');
      opts.forEach((o) => {
        const b = el('button', 'card', o.t);
        b.onclick = () => {
          [...wrap.children].forEach((c) => (c.disabled = true));
          b.classList.add(o.ok ? 'ok' : 'bad');
          if (o.ok) pts++; else wrap.children[opts.findIndex((z) => z.ok)].classList.add('ok');
          fb.textContent = o.ok ? 'Richtig!' : 'Leider nicht.' + (q.x ? ' ' + q.x : '');
          const nx = el('button', 'next', i + 1 < qs.length ? 'Weiter' : 'Auswertung');
          nx.onclick = () => { i++; show(); }; box.append(nx);
        };
        wrap.append(b);
      });
      box.append(wrap, fb);
    };
    show();
  }

  window.Engine = { run };
})();

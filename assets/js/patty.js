/* Patty Art Tattoo: topo, menu, entradas, fumaça, vídeos com fala, portfólio, pets, ficha do WhatsApp. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = '5547999308417';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const zapLink = msg => `https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`;

  const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();

  /* links de WhatsApp com mensagem pronta */
  $$('[data-zap]').forEach(a => { a.href = zapLink(a.dataset.zap); a.target = '_blank'; a.rel = 'noopener'; });

  /* entrada do hero depois das fontes (ou 1,2 s, o que vier antes) */
  const hero = $('.hero');
  if (hero) {
    let foi = false;
    const entrar = () => { if (foi) return; foi = true; requestAnimationFrame(() => hero.classList.add('entrou')); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(entrar);
    setTimeout(entrar, 1200);
  }

  /* topo: sólido depois do hero, some ao descer e volta ao subir; WhatsApp flutuante */
  const topo = $('#topo'), zap = $('.zap-flut'), gaveta = $('#gaveta'), menuBtn = $('.menu-btn');
  let yAnt = 0;
  function rolar() {
    const y = scrollY, lim = hero ? hero.offsetHeight * .6 : 80;
    topo.classList.toggle('solido', y > 40);
    const aberta = gaveta && gaveta.classList.contains('aberta');
    topo.classList.toggle('some', !aberta && y > lim && y > yAnt + 2);
    if (y < yAnt - 2 || y < lim) topo.classList.remove('some');
    zap && zap.classList.toggle('ve', y > lim && !aberta);
    yAnt = y;
  }
  addEventListener('scroll', rolar, { passive: true }); rolar();

  /* link ativo no menu */
  const links = $$('.topo nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(ents => ents.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const s = $(a.getAttribute('href')); s && io.observe(s); });
  }

  /* menu do celular */
  function gavetaAbrir(abrir) {
    if (!gaveta) return;
    menuBtn.setAttribute('aria-expanded', abrir);
    menuBtn.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    if (abrir) {
      gaveta.hidden = false; document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => gaveta.classList.add('aberta')));
      topo.classList.add('solido'); topo.classList.remove('some');
    } else {
      gaveta.classList.remove('aberta'); document.documentElement.style.overflow = '';
      setTimeout(() => { if (!gaveta.classList.contains('aberta')) gaveta.hidden = true; }, 380);
      rolar();
    }
  }
  menuBtn && menuBtn.addEventListener('click', () => gavetaAbrir(menuBtn.getAttribute('aria-expanded') !== 'true'));
  gaveta && $$('a', gaveta).forEach(a => a.addEventListener('click', () => gavetaAbrir(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && gaveta && !gaveta.hidden) gavetaAbrir(false); });
  addEventListener('resize', () => { if (innerWidth > 1100 && gaveta && !gaveta.hidden) gavetaAbrir(false); });

  /* entradas ao rolar */
  const io = 'IntersectionObserver' in window && !reduz
    ? new IntersectionObserver(ents => ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 })
    : null;
  const observar = el => io ? io.observe(el) : el.classList.add('visto');
  $$('.revela').forEach(observar);

  /* contadores */
  $$('[data-conta]').forEach(el => {
    const fim = +el.dataset.conta; if (reduz || fim < 3) return;
    el.textContent = '0';
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return; o.disconnect();
      const t0 = performance.now(), dur = 1400;
      const passo = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(fim * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }, { threshold: .6 }).observe(el);
  });

  /* manifesto: as palavras acendem conforme a frase sobe na tela */
  const man = $('[data-palavras]');
  if (man) {
    const destaque = ['histórias'];
    man.innerHTML = man.textContent.trim().split(/\s+/).map(w => `<span class="p${destaque.some(d => w.startsWith(d)) ? ' v' : ''}">${w}</span>`).join(' ');
    const ps = $$('.p', man);
    if (reduz) ps.forEach(p => p.classList.add('on'));
    else {
      const pinta = () => {
        const r = man.getBoundingClientRect(), vh = innerHeight;
        const k = Math.min(1, Math.max(0, (vh * .86 - r.top) / (r.height + vh * .38)));
        const n = Math.round(k * ps.length);
        ps.forEach((p, i) => p.classList.toggle('on', i < n));
      };
      addEventListener('scroll', pinta, { passive: true }); addEventListener('resize', pinta); pinta();
    }
  }

  /* paralaxe leve nas fotos da artista */
  const par = $$('.artista-fotos img');
  if (par.length && !reduz) {
    let pend = false;
    const mexe = () => {
      pend = false; const vh = innerHeight;
      par.forEach((img, i) => {
        const r = img.parentNode.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const k = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = `scale(1.08) translateY(${(k * (i === 1 ? -5 : 5)).toFixed(2)}%)`;
      });
    };
    addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(mexe); } }, { passive: true }); mexe();
  }

  /* fumaça (assets/js/fumaca.js): ao vivo em WebGL no desktop; em telas de toque, o MP4 do mesmo
     shader (em pé ou deitado). Só anima quando está na tela; com "reduzir movimento" fica um quadro parado. */
  const toque = matchMedia('(hover: none), (pointer: coarse)').matches;
  $$('[data-fumaca]').forEach(box => {
    const cv = $('canvas', box), vid = $('video', box);
    const ver = cb => 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: '200px 0px' }).observe(box)
      : cb(true);
    if (toque) {
      if (!vid) return;
      box.classList.add('em-video');
      ver(dentro => {
        if (dentro) {
          if (!vid.src) {
            vid.src = innerWidth > innerHeight ? box.dataset.vDeitado : box.dataset.vPe;
            vid.addEventListener('playing', () => box.classList.add('viva'), { once: true });
          }
          if (!reduz) { const p = vid.play(); if (p && p.catch) p.catch(() => {}); }
          else vid.addEventListener('loadeddata', () => box.classList.add('viva'), { once: true });
        } else vid.pause();
      });
      return;
    }
    if (!cv || !window.fumacaGL) return;
    let T = null;
    try { T = fumacaGL(cv, { modo: +box.dataset.fumaca, forca: +box.dataset.forca }); } catch (e) { T = null; }
    if (!T) return;
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); box.classList.remove('viva'); T = null; });
    const CICLO = (+box.dataset.ciclo || 24) * 1000;
    let esc = Math.min(devicePixelRatio || 1, 2) * .5;
    const ajusta = () => { if (!T) return; T.tamanho(Math.max(2, Math.round(box.clientWidth * esc)), Math.max(2, Math.round(box.clientHeight * esc))); T.desenhar(fase); };
    let fase = 1.2;
    ajusta(); addEventListener('resize', ajusta);
    if (reduz) { T.desenhar(1.2); box.classList.add('viva'); return; }
    let ve = false, ult = 0, soma = 0, n = 0;
    const t0 = performance.now();
    const quadro = t => {
      if (!T) return;
      requestAnimationFrame(quadro);
      if (!ve || document.hidden) { ult = 0; return; }
      if (ult) { soma += t - ult; n++; }
      ult = t;
      if (n === 40) { if (soma / n > 22 && esc > .3) { esc *= .8; ajusta(); } soma = 0; n = 0; }
      fase = ((t - t0) % CICLO) / CICLO * 6.283185307179586;
      T.desenhar(fase);
      box.classList.add('viva');
    };
    ver(dentro => { ve = dentro; ult = 0; });
    requestAnimationFrame(quadro);
  });

  /* vídeos com fala: tocam mudos quando estão na tela; o botão liga o som do início,
     e só um fica com som por vez */
  const comFala = [];
  $$('.tela-video').forEach(tela => {
    const v = $('video', tela), btn = $('.som', tela);
    if (!v) return;
    const item = { v, comSom: false };
    const tocar = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    item.mudo = () => { item.comSom = false; v.muted = true; v.loop = true; btn && btn.setAttribute('aria-pressed', 'false'); };
    comFala.push(item);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; if (!reduz || item.comSom) tocar(); }
        else { v.pause(); if (item.comSom) item.mudo(); }
      }, { threshold: .35 }).observe(v);
    }
    btn && btn.addEventListener('click', () => {
      if (item.comSom) { item.mudo(); return; }
      comFala.forEach(o => { if (o !== item && o.comSom) o.mudo(); });
      item.comSom = true; v.muted = false; v.currentTime = 0; v.loop = false; tocar();
      btn.setAttribute('aria-pressed', 'true');
    });
    v.addEventListener('ended', () => { item.mudo(); tocar(); });
  });

  /* portfólio: grade 4:5 com filtros e "ver mais" */
  const CATS = { todos: 'Todos', real: 'Realismo', fine: 'Fine line', pets: 'Pets', cob: 'Coberturas' };
  const galeria = $('#galeria'), obras = window.OBRAS || [], mais = $('#ver-mais');
  let filtroAtual = 'todos', limite = galeria ? +galeria.dataset.limite : 12, visiveis = [];
  if (galeria && obras.length) {
    galeria.innerHTML = obras.map((o, i) => `<figure class="obra" data-c="${o.c}" data-i="${i}">
      <button type="button" aria-label="Ampliar: ${o.a}"><img src="assets/img/obras/${o.id}-640.webp" srcset="assets/img/obras/${o.id}-640.webp 640w, assets/img/obras/${o.id}-1080.webp ${o.w}w" sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 300px" alt="${o.a}" loading="lazy" width="640" height="800"></button>
      <figcaption>${o.a}</figcaption></figure>`).join('');
    const filtros = $('.filtros');
    filtros.innerHTML = Object.entries(CATS).map(([k, v]) => `<button type="button" data-f="${k}" aria-pressed="${k === 'todos'}">${v}</button>`).join('');
    const itens = $$('.obra', galeria);
    function filtrar(cat) {
      filtroAtual = cat; visiveis = [];
      let n = 0, total = 0;
      itens.forEach(el => {
        const ok = cat === 'todos' || el.dataset.c === cat;
        if (ok) total++;
        const mostra = ok && n < limite;
        el.hidden = !mostra;
        if (mostra) { n++; visiveis.push(+el.dataset.i); el.classList.remove('visto'); observar(el); }
      });
      $$('button', filtros).forEach(b => b.setAttribute('aria-pressed', b.dataset.f === cat));
      if (mais) mais.parentNode.hidden = total <= n;
    }
    filtros.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; limite = +galeria.dataset.limite; filtrar(b.dataset.f); });
    mais && mais.addEventListener('click', () => { limite += 12; filtrar(filtroAtual); });
    filtrar('todos');
    /* os cartões de estilo filtram o portfólio */
    $$('[data-filtro]').forEach(a => a.addEventListener('click', () => { if (a.getAttribute('href') === '#trabalhos') { limite = +galeria.dataset.limite; filtrar(a.dataset.filtro); } }));
    galeria.addEventListener('click', e => { const f = e.target.closest('.obra'); if (f) abrirLuz(visiveis.indexOf(+f.dataset.i)); });
  }

  /* tela cheia do portfólio */
  const luz = $('#luz'), luzImg = $('#luz-img'), luzLeg = $('#luz-leg'), luzZap = $('#luz-zap');
  let li = 0, foco = null;
  function pintarLuz() {
    const o = obras[visiveis[li]]; if (!o) return;
    luzImg.style.opacity = 0;
    const src = `assets/img/obras/${o.id}-1080.webp`, tmp = new Image();
    tmp.onload = () => { luzImg.src = src; luzImg.alt = o.a; luzImg.style.opacity = 1; };
    tmp.src = src;
    luzLeg.textContent = o.a;
    luzZap.href = zapLink(`Oi, Patty! Vi no site o trabalho "${o.a}" e queria fazer algo nessa linha.`); luzZap.target = '_blank'; luzZap.rel = 'noopener';
  }
  function abrirLuz(i) {
    if (!luz || i < 0) return;
    li = i; foco = document.activeElement; pintarLuz();
    luz.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => luz.classList.add('aberta'));
    $('.luz-fechar', luz).focus();
  }
  function fecharLuz() {
    luz.classList.remove('aberta'); document.documentElement.style.overflow = '';
    setTimeout(() => { luz.hidden = true; }, 300);
    foco && foco.focus();
  }
  const passa = d => { li = (li + d + visiveis.length) % visiveis.length; pintarLuz(); };
  if (luz) {
    $('.luz-fechar', luz).addEventListener('click', fecharLuz);
    $('.luz-ant', luz).addEventListener('click', () => passa(-1));
    $('.luz-prox', luz).addEventListener('click', () => passa(1));
    luz.addEventListener('click', e => { if (e.target === luz) fecharLuz(); });
    addEventListener('keydown', e => {
      if (luz.hidden) return;
      if (e.key === 'Escape') fecharLuz(); else if (e.key === 'ArrowRight') passa(1); else if (e.key === 'ArrowLeft') passa(-1);
    });
    let x0 = null;
    luz.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    luz.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) passa(dx < 0 ? 1 : -1); x0 = null; });
  }

  /* trilho dos pets */
  const trilho = $('#pets-trilho');
  $$('[data-trilho]').forEach(b => b.addEventListener('click', () => {
    const f = $('figure', trilho); const passo = f ? f.getBoundingClientRect().width + 16 : 300;
    trilho.scrollBy({ left: passo * +b.dataset.trilho * 2, behavior: reduz ? 'auto' : 'smooth' });
  }));

  /* ficha: monta a mensagem e abre o WhatsApp */
  const ficha = $('#ficha');
  ficha && ficha.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(ficha));
    const nome = ficha.elements.nome;
    if (!d.nome.trim()) { nome.classList.add('erro'); nome.focus(); return; }
    nome.classList.remove('erro');
    const linhas = [`Oi, Patty! Meu nome é ${d.nome.trim()} e vim pelo site.`, `Estilo: ${d.estilo}`];
    if (d.ideia.trim()) linhas.push(`Ideia: ${d.ideia.trim()}`);
    if (d.local.trim()) linhas.push(`Local do corpo: ${d.local.trim()}`);
    if (d.tamanho.trim()) linhas.push(`Tamanho aproximado: ${d.tamanho.trim()} cm`);
    linhas.push('Vou mandar as referências e a foto do local em seguida.');
    window.open(zapLink(linhas.join('\n')), '_blank', 'noopener');
  });
})();

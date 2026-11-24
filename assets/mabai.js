/* MABAI · boceto de rebranding — comportamiento compartido por todas las páginas.
   Cada bloque se activa solo si su elemento existe en la página. */
(function(){
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function $(s, r){ return (r || document).querySelector(s); }
  function $$(s, r){ return [].slice.call((r || document).querySelectorAll(s)); }
  function clamp(v){ return Math.max(0, Math.min(1, v)); }

  /* scroll suave */
  var lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href'); if (id.length < 2 || !$(id)) return;
      e.preventDefault(); closeSheet();
      if (lenis) lenis.scrollTo(id, { offset: -20 }); else $(id).scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* menú: desplegables (hover en compu, toque en celular) */
  var dds = $$('[data-dd]');
  function closeDds(){ dds.forEach(function(d){ d.classList.remove('open'); $('button', d).setAttribute('aria-expanded', 'false'); }); }
  dds.forEach(function(d){
    var b = $('button', d);
    b.addEventListener('click', function(e){ e.stopPropagation(); var o = !d.classList.contains('open'); closeDds(); d.classList.toggle('open', o); b.setAttribute('aria-expanded', o); });
    if (fine){ d.addEventListener('mouseenter', function(){ closeDds(); d.classList.add('open'); b.setAttribute('aria-expanded','true'); });
               d.addEventListener('mouseleave', function(){ d.classList.remove('open'); b.setAttribute('aria-expanded','false'); }); }
  });
  document.addEventListener('click', closeDds);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ closeDds(); closeSheet(); } });

  /* menú de celular */
  var burger = $('.nav-burger'), sheet = $('.nav-sheet');
  function closeSheet(){ if (!sheet) return; sheet.classList.remove('open'); burger && burger.setAttribute('aria-expanded', 'false'); }
  if (burger && sheet){
    burger.addEventListener('click', function(e){ e.stopPropagation(); var o = !sheet.classList.contains('open'); sheet.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); });
    sheet.addEventListener('click', function(e){ e.stopPropagation(); });
    document.addEventListener('click', closeSheet);
  }

  /* agendar: si el embed de Cal cargó, abre su ventana y el link no abre otra pestaña;
     si no cargó (bloqueado o caído), el link lleva a cal.com */
  $$('a[data-cal-link]').forEach(function(a){
    a.addEventListener('click', function(e){ if (window.Cal && window.Cal.version) e.preventDefault(); });
  });

  /* cinta de logos: duplica el set para el loop */
  var set = $('#mq-set');
  if (set){ var copy = set.cloneNode(true); copy.removeAttribute('id'); copy.setAttribute('aria-hidden', 'true'); set.parentNode.appendChild(copy); }

  /* aparición al bajar */
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
  $$('[data-reveal]').forEach(function(el){ io.observe(el); });

  /* frase que se enciende palabra por palabra */
  var frase = $('[data-words]'), words = [];
  if (frase){
    var stops = [[255,164,92],[245,156,178],[227,157,244]];
    var mix = function(t){ var a = t < .5 ? stops[0] : stops[1], b = t < .5 ? stops[1] : stops[2], u = t < .5 ? t*2 : (t-.5)*2;
      return 'rgb(' + a.map(function(v,i){ return Math.round(v + (b[i]-v)*u); }).join(',') + ')'; };
    var out = [];
    [].slice.call(frase.childNodes).forEach(function(n){
      var grad = n.nodeType === 1 && n.hasAttribute('data-grad');
      var parts = n.textContent.split(/(\s+)/), real = parts.filter(function(w){ return w.trim(); }).length, k = 0;
      parts.forEach(function(w){
        if (!w.trim()){ out.push(w); return; }
        out.push('<span class="w"' + (grad ? ' style="color:' + mix(real > 1 ? k/(real-1) : 0) + '"' : '') + '>' + w + '</span>'); k++;
      });
    });
    frase.innerHTML = out.join('');
    words = $$('.w', frase);
  }

  /* sección fija con pasos de costado */
  var how = $('[data-pin]'), pin = how && $('.how-pin', how), track = how && $('.how-track', how);
  var bar = how && $('.progress i', how), cnt = how && $('.counter b', how);
  var steps = track ? track.children.length : 0, horizontal = false, dist = 0;
  function layout(){
    if (!how) return onScroll();
    horizontal = innerWidth > 1020;
    if (horizontal){
      dist = track.scrollWidth - innerWidth;
      how.style.height = (innerHeight + dist) + 'px';
      pin.style.position = 'sticky'; pin.style.top = '0'; pin.style.height = '100vh';
      track.style.height = (innerHeight - track.offsetTop) + 'px';
    } else {
      how.style.height = ''; pin.style.position = ''; pin.style.height = ''; track.style.height = ''; track.style.transform = '';
    }
    onScroll();
  }
  function onScroll(){
    if (frase){
      var r = frase.getBoundingClientRect();
      var p = reduced ? 1 : clamp((innerHeight*0.88 - r.top) / (r.height + innerHeight*0.38));
      var lit = Math.round(p * words.length);
      words.forEach(function(w,i){ w.classList.toggle('on', i < lit); });
    }
    if (how && horizontal){
      var hr = how.getBoundingClientRect();
      var q = clamp(-hr.top / (how.offsetHeight - innerHeight));
      track.style.transform = 'translate3d(' + (-q*dist) + 'px,0,0)';
      if (bar) bar.style.transform = 'scaleX(' + q + ')';
      if (cnt) cnt.textContent = '0' + Math.min(steps, Math.floor(q*steps*0.999) + 1);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', layout);
  addEventListener('load', layout);
  layout();

  /* botones magnéticos */
  if (fine && !reduced){
    $$('.magnetic').forEach(function(m){
      m.addEventListener('pointermove', function(e){ var b = m.getBoundingClientRect();
        m.style.transform = 'translate(' + ((e.clientX-b.left-b.width/2)*.22) + 'px,' + ((e.clientY-b.top-b.height/2)*.3) + 'px)'; });
      m.addEventListener('pointerleave', function(){ m.style.transform = ''; });
    });
  }

  /* chat animado del celular: el guion va en data-guion (JSON) o usa el de la home */
  var chat = $('#chat');
  if (chat){
    var status = $('#ph-status'), chipTop = $('#chip-top'), chipBottom = $('#chip-bottom');
    var guion = chat.dataset.guion ? JSON.parse(chat.dataset.guion) : [
      { de:'c', t:'Hola! Vi el anuncio, ¿tienen stock?' },
      { de:'a', t:'¡Hola Sofía! Sí, ¿qué talle buscás?' },
      { de:'c', t:'Talle M. ¿Hacen envíos?' },
      { de:'a', t:'Sí, enviamos a todo el país. ¿Te lo reservo?' },
      { de:'c', t:'Dale, gracias 🙌' }
    ];
    var wait = function(ms, fn){ setTimeout(fn, reduced ? 0 : ms); };
    var add = function(el){ chat.appendChild(el); while (chat.scrollHeight > chat.clientHeight + 2 && chat.children.length > 1) chat.removeChild(chat.firstChild); };
    var bub = function(m){ var d = document.createElement('div'); d.className = 'bub ' + m.de; d.textContent = m.t; return d; };
    var hide = function(el, v){ if (el) el.classList.toggle('hide', v); };
    var run = function(){
      chat.innerHTML = ''; hide(chipTop, true); hide(chipBottom, true);
      var i = 0;
      (function next(){
        if (i >= guion.length){ hide(chipBottom, false); return wait(5200, run); }
        var m = guion[i];
        if (m.de === 'a'){
          if (status) status.textContent = 'Agente IA · escribiendo…';
          if (i === 1) hide(chipTop, false);
          var t = document.createElement('div'); t.className = 'bub a typing'; t.innerHTML = '<i></i><i></i><i></i>'; add(t);
          wait(1100 + Math.min(m.t.length*14, 900), function(){ t.remove(); add(bub(m)); if (status) status.textContent = 'Agente IA · en línea'; i++; wait(1200, next); });
        } else { add(bub(m)); i++; wait(1000, next); }
      })();
    };
    wait(900, run);
  }
})();

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var story = $('[data-story]');
  if (!story) return;

  var caps = $$('[data-cap]');
  var imgs = $$('[data-img]');
  var tlis = $$('[data-tli]');
  var ticks = $$('[data-tick]');
  var mobiles = $$('[data-step-btn]');
  var chat = $('[data-chat]');
  var who = $('[data-who]');
  var st = $('[data-st]');
  var ava = $('[data-ava]');
  var clock = $('[data-clock]');
  var clockText = $('[data-clock-text]');
  var phoneTime = $('[data-ptime]');
  var src = $('[data-src]');
  var idx = $('[data-idx]');
  var tlFill = $('[data-tl-fill]');
  var hint = $('[data-hint]');
  var top = $('[data-top]');

  var steps = [
    {
      t: '19:00',
      label: 'закат',
      who: ['ЛидПилот', 'ИИ-менеджер · на связи', 'Л', '#FF4757'],
      chat: [
        ['chips', ['Telegram', 'WhatsApp', 'Авито', 'Циан', 'Сайт', 'ВКонтакте', 'MAX', 'E-mail']],
        ['sys', 'ИИ-менеджер включён · 8 каналов']
      ]
    },
    {
      t: '23:00',
      label: 'ночь',
      who: ['Клиент', 'Telegram', 'К', '#2AABEE'],
      chat: [
        ['them', 'Здравствуйте! Автомобиль сломался, завтра можно?', '23:00'],
        ['me', 'Да, есть 10:00 и 14:00. Какое время удобнее?', '23:01'],
        ['them', '10:00.', '23:01'],
        ['me', 'Записал на 10:00, напомню за час.', '23:02'],
        ['sys', 'Запись на 10:00 – в календаре']
      ]
    },
    {
      t: '08:00',
      label: 'рассвет',
      who: ['Пациент', 'Чат на сайте', 'П', '#5B6BFF'],
      chat: [
        ['them', 'Здравствуйте! Всю ночь болел зуб. Можно сегодня?', '08:00'],
        ['me', 'Доброе утро! Есть 10:30 и 14:00. Какое удобнее?', '08:00'],
        ['them', '10:30.', '08:01'],
        ['me', 'Записал на 10:30, напомню за час.', '08:01'],
        ['sys', 'Запись на 10:30 – в календаре']
      ]
    },
    {
      t: '09:00',
      label: 'утро',
      who: ['ЛидПилот · отчёт', 'Telegram', 'Л', '#FF4757'],
      chat: [
        ['rep', '<b>Доброе утро! За ночь:</b> 3 диалога · 2 записи · отчёт готов']
      ]
    }
  ];

  var CH = { 'Telegram': '#2AABEE', 'WhatsApp': '#25D366', 'Авито': '#00AAFF', 'Циан': '#8B5CF6', 'Сайт': '#5B6BFF', 'ВКонтакте': '#0077FF', 'MAX': '#6B4EFF', 'E-mail': '#FF6B4A' };
  var cur = -1;

  function chips(list) {
    var box = document.createElement('div');
    list.forEach(function (name) {
      var chip = document.createElement('span');
      chip.className = 'chat__chip';
      var dot = document.createElement('i');
      dot.style.setProperty('--c', CH[name] || '#FF8A3D');
      chip.appendChild(dot);
      chip.appendChild(document.createTextNode(name));
      box.appendChild(chip);
    });
    return box;
  }

  function render(s) {
    chat.innerHTML = '';

    var day = document.createElement('div');
    day.className = 'chat__day';
    day.textContent = 'Сегодня';
    chat.appendChild(day);

    s.chat.forEach(function (m, k) {
      var b = document.createElement('div');
      b.className = 'chat__b chat__b--' + m[0];
      b.style.animationDelay = (0.05 + k * 0.18) + 's';

      if (m[0] === 'rep') {
        b.innerHTML = m[1];
        var t = document.createElement('time');
        t.textContent = '09:00';
        b.appendChild(t);
      } else if (m[0] === 'chips') {
        b.classList.add('chat__b--chips');
        b.appendChild(chips(m[1]));
      } else {
        b.appendChild(document.createTextNode(m[1]));
        if (m[2]) {
          var time = document.createElement('time');
          time.textContent = m[2];
          b.appendChild(time);
        }
        if (m[0] === 'me') {
          var tick = document.createElement('span');
          tick.className = 'chat__tick';
          tick.textContent = '✓✓';
          b.appendChild(tick);
        }
      }
      chat.appendChild(b);
    });

    chat.scrollTop = chat.scrollHeight;
  }

  function show(i) {
    i = clamp(i, 0, steps.length - 1);
    if (i === cur) return;
    cur = i;

    var s = steps[i];

    if (clock) {
      clock.textContent = s.t;
      clock.classList.remove('is-swap');
      void clock.offsetWidth;
      clock.classList.add('is-swap');
    }
    if (clockText) clockText.textContent = s.t;
    if (phoneTime) phoneTime.textContent = s.t;
    if (src) src.textContent = s.label;
    if (idx) idx.textContent = ('0' + (i + 1)).slice(-2);

    imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });

    caps.forEach(function (c, k) {
      var on = k === i;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-hidden', on ? 'false' : 'true');
    });

    tlis.forEach(function (it, k) {
      it.classList.toggle('is-on', k === i);
      it.classList.toggle('is-done', k < i);
    });

    ticks.forEach(function (t, k) {
      t.classList.toggle('is-on', k === i);
      t.setAttribute('aria-current', k === i ? 'step' : 'false');
    });

    mobiles.forEach(function (m, k) {
      m.classList.toggle('is-on', k === i);
      m.setAttribute('aria-current', k === i ? 'step' : 'false');
    });

    if (who) who.textContent = s.who[0];
    if (st) st.textContent = s.who[1];
    if (ava) {
      ava.textContent = s.who[2];
      ava.style.background = s.who[3];
    }
    if (hint) hint.style.opacity = i === 0 ? '1' : '0';

    render(s);
    chat.setAttribute('data-step', i);
  }

  function isMobile() {
    return window.matchMedia('(max-width: 980px)').matches;
  }

  function progress() {
    if (isMobile()) return;

    var r = story.getBoundingClientRect();
    var total = story.offsetHeight - window.innerHeight;
    var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;

    if (tlFill) tlFill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    show(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.9999)));
  }

  var plan = $('[data-steps]');
  var planFill = $('[data-steps-fill]');
  var planItems = $$('.step', plan || document);

  function planProgress() {
    if (!plan || !planFill) return;
    var r = plan.getBoundingClientRect();
    var start = window.innerHeight * .9;
    var end = window.innerHeight * .36;
    var p = clamp((start - r.top) / Math.max(1, start - end), 0, 1);
    planFill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    plan.style.setProperty('--p', p.toFixed(4));
    planItems.forEach(function (item, i) {
      item.classList.toggle('is-on', p >= i / Math.max(1, planItems.length - 1));
    });
  }

  var raf = 0;
  function requestProgress() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      progress();
      planProgress();
    });
  }

  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress);

  function scrollToStep(i) {
    if (isMobile()) {
      show(i);
      return;
    }

    var total = story.offsetHeight - window.innerHeight;
    var y = story.offsetTop + total * (i / steps.length) + 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  ticks.forEach(function (t) {
    t.addEventListener('click', function () {
      scrollToStep(parseInt(t.getAttribute('data-tick'), 10));
    });
  });

  mobiles.forEach(function (m) {
    m.addEventListener('click', function () {
      show(parseInt(m.getAttribute('data-step-btn'), 10));
    });
  });

  // header shadow
  function headerState() {
    if (!top) return;
    top.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', headerState, { passive: true });
  headerState();

  // reveal on scroll
  var reveal = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('in'); });
  }

  show(0);
  progress();
  planProgress();
})();

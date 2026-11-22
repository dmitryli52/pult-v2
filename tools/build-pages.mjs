import fs from 'node:fs';
import path from 'node:path';

const OUT = 'D:/NPr/pult-v2';
const BUILT = 'D:/NPr/sajt/dist/noch';

const SITE = {
  name: 'ЛидПилот',
  tagline: 'ИИ-менеджер продаж во всех каналах',
  telegram: 'https://t.me/dmitrylysenkov',
  tgLabel: '@dmitrylysenkov',
  email: 'info@lid-pilot.ru',
};

const NAV = [
  { key: 'home', label: 'Главная', href: '/#top' },
  { key: 'vozmozhnosti', label: 'Возможности', href: '/vozmozhnosti/' },
  { key: 'tarify', label: 'Тарифы', href: '/tarify/' },
  { key: 'keysy', label: 'Кейсы', href: '/keysy/' },
  { key: 'blog', label: 'Блог', href: '/blog/' },
  { key: 'kontakty', label: 'Контакты', href: '/kontakty/' },
];

const PAGES = {
  vozmozhnosti: {
    built: 'vozmozhnosti/index.html', out: 'vozmozhnosti/index.html', active: 'vozmozhnosti',
    id: 'LP-02', label: 'ВОЗМОЖНОСТИ', asideLabel: 'КОНТУР 02',
    image: '/assets/city-sunset.webp', kicker: 'Возможности',
    asideNote: '12 инструментов в одном контуре',
    bottom: 'SCREEN 02 · CAPABILITIES',
    ctaHero: true,
  },  tarify: {
    built: 'tarify/index.html', out: 'tarify/index.html', active: 'tarify',
    id: 'LP-03', label: 'ТАРИФЫ', asideLabel: 'КОНТУР 03',
    image: '/assets/city-dawn.webp', kicker: 'Тарифы',
    asideNote: '2 тарифа · запуск 3–5 дней',
    bottom: 'SCREEN 03 · PRICING',
    ctaHero: true,
  },
  keysy: {
    built: 'keysy/index.html', out: 'keysy/index.html', active: 'keysy',
    id: 'LP-04', label: 'КЕЙСЫ', asideLabel: 'КОНТУР 04',
    image: '/assets/city-sunset.webp', kicker: 'Кейсы',
    asideNote: '8 ниш · цифры из кабинетов',
    bottom: 'SCREEN 04 · CASES',
    ctaHero: true,
  },
  blog: {
    built: 'blog/index.html', out: 'blog/index.html', active: 'blog',
    id: 'LP-05', label: 'БЛОГ', asideLabel: 'КОНТУР 05',
    image: '/assets/city-night.webp', kicker: 'Блог',
    asideNote: '6 статей · 5 рубрик',
    bottom: 'SCREEN 05 · JOURNAL',
    ctaHero: true,
    actions: [
      { label: 'Читать статьи', href: '#blog' },
      { label: 'Обсудить запуск', href: 'https://t.me/dmitrylysenkov', external: true },
    ],
  },
  kontakty: {
    built: 'kontakty/index.html', out: 'kontakty/index.html', active: 'kontakty',
    id: 'LP-06', label: 'КОНТАКТЫ', asideLabel: 'КОНТУР 06',
    image: '/assets/city-night.webp', kicker: 'Контакты',
    asideNote: '1 человек на связи',
    bottom: 'SCREEN 06 · CONTACT',
    ctaHero: true,
    actions: [
      { label: 'Оставить заявку', href: '#form' },
      { label: 'Написать в Telegram', href: 'https://t.me/dmitrylysenkov', external: true },
    ],
  },
  platforma: {
    built: 'platforma/index.html', out: 'platforma/index.html', active: '',
    id: 'LP-07', label: 'ПЛАТФОРМА', asideLabel: 'КОНТУР 07',
    image: '/assets/city-day.webp', kicker: 'Платформа',
    asideNote: 'официальный партнёр Лидгены',
    bottom: 'SCREEN 07 · PLATFORM',
    actions: [
      { label: 'Смотреть возможности', href: '/vozmozhnosti/' },
      { label: 'Обсудить запуск', href: 'https://t.me/dmitrylysenkov', external: true },
    ],
  },
};

function read(file) { return fs.readFileSync(file, 'utf8'); }
function stripTags(s) { return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
function attr(s) { return s.replace(/"/g, '&quot;'); }
function fixHref(h) {
  return h
    .replace(/^\/noch\/$/, '/')
    .replace(/^\/noch\/#/, '/#')
    .replace(/^\/noch\//, '/')
    .replace(/^\/noch$/, '/');
}
function rewrite(s) {
  return s
    .replace(/href="\/noch\/#/g, 'href="/#')
    .replace(/href="\/noch\//g, 'href="/')
    .replace(/href="\/noch"/g, 'href="/"')
    .replace(/\/assets\/noch\//g, '/assets/')
    .replace(/\/images\/avtor\.webp/g, '/assets/avtor.webp')
    .replace(/src="\/images\//g, 'src="/assets/')
    .replace(/srcset="\/images\//g, 'srcset="/assets/')
    .replace(/loading="lazy"/g, 'loading="eager"');
}

function updateCopy(s) {
  return s
    .replace(/149\s*000/g, '124 000')
    .replace(/99\s*000/g, '79 000')
    .replace(/74\s*400/g, '60 900')
    .replace(/Все каналы: WhatsApp, Авито, Циан, чат на сайте/g, 'Все каналы: Telegram, WhatsApp, Авито, Циан, сайт, ВКонтакте, MAX, E-mail')
    .replace(/Telegram, WhatsApp, на Авито, Циан и сайте/g, 'Telegram, WhatsApp, на Авито, Циан, сайте, ВКонтакте, в MAX и e-mail');
}

function contactContent(content) {
  const form = ((content.match(/<form class="form" data-demo>([\s\S]*?)<\/form>/i) || [])[1] || '')
    .replace(/<p class="form__note">[\s\S]*?<\/p>/i, '<p class="form__note">Демо-форма: данные не отправляются. Для связи – Telegram или почта.</p>');
  return `<section class="sec" id="people">
  <div class="wrap">
    <article class="about-panel" data-in>
      <div class="about-panel__media">
        <img class="about-panel__ph" src="/assets/avtor.webp" alt="Дмитрий Лысенков" width="240" height="280" loading="eager">
        <div>
          <span class="about-panel__label">Основатель</span>
          <h2>Дмитрий Лысенков</h2>
          <p class="about-panel__role">Основатель ЛидПилота, официальный партнёр программы платформы Лидгены.</p>
        </div>
      </div>
      <div class="about-panel__body">
        <span class="about-panel__label">Связь</span>
        <a class="about-panel__link" href="https://t.me/dmitrylysenkov" target="_blank" rel="noopener">Telegram · @dmitrylysenkov</a>
        <a class="about-panel__link" href="mailto:info@lid-pilot.ru">info@lid-pilot.ru</a>
        <p class="about-panel__note">Отвечаю всем без менеджеров. В будни – в течение дня, в выходные – если не за рулём. Работаем по всей России, онлайн.</p>
      </div>
    </article>

    <div class="device form-device" id="form" data-in style="--d:.08s">
      <i class="screw screw--tl screw--dark" aria-hidden="true"></i>
      <i class="screw screw--tr screw--dark" aria-hidden="true"></i>
      <i class="screw screw--bl screw--dark" aria-hidden="true"></i>
      <i class="screw screw--br screw--dark" aria-hidden="true"></i>
      <div class="device__label"><span>ЗАЯВКА · ПАНЕЛЬ 06</span><span class="device__scan"><i class="led led--pulse"></i> СВЯЗЬ</span></div>
      <div class="device__screen form-device__screen">
        <div class="formcard formcard--panel">
          <div class="formcard__head">
            <span class="kicker kicker--light">Заявка</span>
            <h2>Расскажите о задаче</h2>
            <p>Заполните – и я вернусь с вопросами по каналам. Или сразу напишите в Telegram, так быстрее.</p>
          </div>
          <form class="form" data-demo>${form}</form>
        </div>
      </div>
      <div class="device__bottom"><div class="vents" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="mono">FORM 06 · CONTACT</span><span class="mono">LP-06 · ЗАЯВКА</span></div>
    </div>
  </div>
</section>`;
}

function finalPanel(content) {
  const m = content.match(/<section class="final" id="cta">([\s\S]*?)<\/section>/i);
  if (!m) return content;
  let inner = m[1]
    .replace(/<div class="wrap final__in">/i, '<div class="final__in final__in--panel">')
    .replace(/(<div class="final__in[^>]*>)/i, '<div class="final__scan" aria-hidden="true"></div>$1');
  const block = `<section class="final final--panel" id="cta">
  <div class="wrap">
    <div class="device device--final final-device" data-in>
      <i class="screw screw--tl screw--dark" aria-hidden="true"></i>
      <i class="screw screw--tr screw--dark" aria-hidden="true"></i>
      <i class="screw screw--bl screw--dark" aria-hidden="true"></i>
      <i class="screw screw--br screw--dark" aria-hidden="true"></i>
      <div class="device__label"><span>ЭКРАН 04 · РАССВЕТ</span><span class="device__scan"><i class="led led--pulse"></i> 09:00</span></div>
      <div class="device__screen final__screen">${inner}</div>
      <div class="device__bottom"><div class="vents" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="mono">LP-01 · MORNING REPORT</span><span class="mono">8 КАНАЛОВ</span></div>
    </div>
  </div>
</section>`;
  return content.slice(0, m.index) + block + content.slice(m.index + m[0].length);
}

function dialogsDevice(content) {
  const m = content.match(/<section class="sec sec_dark" id="dialogs">([\s\S]*?)<\/section>/i);
  if (!m) return content;
  const inner = m[1].trim()
    .replace(/^<div class="wrap">/i, '')
    .replace(/<\/div>\s*$/i, '');
  const block = `<section class="sec dialogs-sec" id="dialogs">
  <div class="wrap">
    <div class="device dialogs-device" data-in>
      <i class="screw screw--tl screw--dark" aria-hidden="true"></i>
      <i class="screw screw--tr screw--dark" aria-hidden="true"></i>
      <i class="screw screw--bl screw--dark" aria-hidden="true"></i>
      <i class="screw screw--br screw--dark" aria-hidden="true"></i>
      <div class="device__label"><span>ЭКРАН 04 · ЖИВЫЕ ПЕРЕПИСКИ</span><span class="device__scan"><i class="led led--pulse"></i> LIVE</span></div>
      <div class="device__screen device__screen--pad dialogs-device__screen">${inner}</div>
      <div class="device__bottom"><div class="vents" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="mono">DIALOG LOG · 02 / 02</span><span class="mono">LP-04 · CASES</span></div>
    </div>
  </div>
</section>`;
  return content.slice(0, m.index) + block + content.slice(m.index + m[0].length);
}

function logo() {
  return `<a class="logo" href="/" aria-label="ЛидПилот – на главную">
  <span class="logo__mark" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7h5l3 5 3-5h5v10"/><path d="M8 21h8"/></svg>
  </span>
  <span class="logo__text">ЛидПилот</span>
  <span class="logo__tag">ПУЛЬТ 01</span>
</a>`;
}

function header(active = '') {
  const links = NAV.map(l => {
    const on = l.key === active;
    return `<a href="${l.href}"${on ? ' class="is-active" aria-current="page"' : ''}>${l.label}</a>`;
  }).join('');
  return `<header class="top" data-top>
  <div class="wrap top__in">
    ${logo()}
    <nav class="nav nav--site" aria-label="Разделы сайта">${links}</nav>
    <span class="status"><i class="led led--pulse" aria-hidden="true"></i> СИСТЕМА НА СВЯЗИ</span>
    <a class="btn btn--hot btn--header" href="${SITE.telegram}" target="_blank" rel="noopener">Обсудить запуск</a>
    <button class="menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="mnav"><i aria-hidden="true"></i> Меню</button>
  </div>
</header>

<div class="mnav" id="mnav" data-menu hidden>
  <nav class="mnav__nav" aria-label="Мобильное меню">${NAV.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}<a href="/platforma/">Платформа</a></nav>
  <p class="mnav__note">ИИ-менеджер продаж в Telegram, WhatsApp, на Авито, Циан, сайте, ВКонтакте, в MAX и в почте. Официальный партнёр платформы Лидгены.</p>
  <div class="mnav__cta">
    <a class="btn btn--hot" href="${SITE.telegram}" target="_blank" rel="noopener">Обсудить запуск</a>
    <a class="btn btn--ghost" href="mailto:${SITE.email}">${SITE.email}</a>
  </div>
</div>`;
}

function footer() {
  return `<footer class="site-foot">
  <div class="wrap">
    <div class="site-foot__top">
      <div class="site-foot__brand">
        ${logo()}
        <p>ИИ-менеджер продаж во всех каналах. Пишет первым, отвечает на входящие, квалифицирует и доводит до разговора с человеком.</p>
        <span class="site-foot__status"><i class="led led--pulse" aria-hidden="true"></i> СИСТЕМА НА СВЯЗИ · 24/7</span>
      </div>
      <div class="site-foot__col">
        <b>Разделы</b>
        <nav>${NAV.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}<a href="/platforma/">Платформа</a></nav>
      </div>
      <div class="site-foot__col">
        <b>Связь</b>
        <nav>
          <a href="${SITE.telegram}" target="_blank" rel="noopener">Telegram · ${SITE.tgLabel}</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="/kontakty/">Оставить заявку</a>
        </nav>
      </div>
    </div>
    <div class="site-foot__bottom">
      <span>© 2026 ЛидПилот · lid-pilot.ru</span>
      <a href="/politika-konfidencialnosti/">Политика конфиденциальности</a>
      <span>Официальный партнёр платформы Лидгены</span>
      <a class="up" href="#top">Наверх ↑</a>
    </div>
  </div>
</footer>`;
}

function crumbs(items, extra = '') {
  return `<div class="page-crumbs${extra ? ' ' + extra : ''}">${items.map((it, i) =>
    i === items.length - 1
      ? `<span>${it.label}</span>`
      : `<a href="${it.href}">${it.label}</a><i aria-hidden="true"></i>`
  ).join('')}</div>`;
}

function pageHeroCta({ kicker, title, lead, actions = [], crumbs: cr, image }) {
  const actionsHTML = actions.length
    ? `<div class="page-actions">${actions.map((a, i) => `<a class="btn ${i === 0 ? 'btn--hot' : 'btn--ghost btn--ghost-dark'}" href="${a.href}"${a.external ? ' target="_blank" rel="noopener"' : ''}>${a.label}</a>`).join('')}</div>`
    : '';
  return `<section class="page-hero page-hero--cta">
  <img class="page-hero__bg" src="${image}" alt="" width="1920" height="1080" decoding="async">
  <div class="page-hero__shade" aria-hidden="true"></div>
  <div class="page-hero__grid" aria-hidden="true"></div>
  <div class="page-hero__scan" aria-hidden="true"></div>
  <div class="wrap page-hero__wrap">
    ${crumbs(cr, 'page-crumbs--light')}
    <span class="kicker kicker--light">${kicker}</span>
    <h1>${title}</h1>
    <p class="page-lead">${lead}</p>
    ${actionsHTML}
  </div>
</section>`;
}

function pageHero({ id, label, kicker, title, lead, facts = [], actions = [], crumbs: cr, image, meta = '', asideLabel, asideNote, asideHTML, article = false }) {
  const actionsHTML = actions.length
    ? `<div class="page-actions">${actions.map((a, i) => `<a class="btn ${i === 0 ? 'btn--hot' : 'btn--ghost'}" href="${a.href}"${a.external ? ' target="_blank" rel="noopener"' : ''}>${a.label}</a>`).join('')}</div>`
    : '';
  const factsHTML = asideHTML || (facts.length ? `<aside class="page-facts">
      <span class="page-facts__label"><i class="led led--pulse" aria-hidden="true"></i> ${asideLabel}</span>
      <div class="page-facts__list">${facts.map(f => `<div class="page-facts__item">${f}</div>`).join('')}</div>
      <p class="page-facts__note">${asideNote}</p>
    </aside>` : '');
  return `<section class="page-hero${article ? ' page-hero--article' : ''}">
  <div class="wrap">
    <div class="panel panel--page">
      <i class="screw screw--tl" aria-hidden="true"></i>
      <i class="screw screw--tr" aria-hidden="true"></i>
      <i class="screw screw--bl" aria-hidden="true"></i>
      <i class="screw screw--br" aria-hidden="true"></i>
      <div class="panel__top">
        <span class="panel__id">${id}</span>
        <span class="panel__name">${label}</span>
        <span class="panel__live"><i class="led led--pulse" aria-hidden="true"></i> LIVE</span>
      </div>
      <div class="panel__screen page-screen">
        <img class="page-screen__bg" src="${image}" alt="" width="1920" height="1080" decoding="async">
        <div class="page-screen__shade" aria-hidden="true"></div>
        <div class="page-screen__grid" aria-hidden="true"></div>
        <div class="page-hero__in">
          <div class="page-hero__plate">
            ${crumbs(cr)}
            <span class="kicker">${kicker}</span>
            <h1>${title}</h1>
            <p class="page-lead">${lead}</p>
            ${meta ? `<div class="page-meta">${meta}</div>` : ''}
            ${actionsHTML}
          </div>
          ${factsHTML}
        </div>
      </div>
      <div class="panel__bottom page-bottom">
        <span class="mono">${id} · ${label}</span>
        <span class="mono" style="margin-left:auto">ONLINE · 24/7</span>
      </div>
    </div>
  </div>
</section>`;
}

function extractPage(rel) {
  const raw = read(path.join(BUILT, rel));
  const main = (raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || '';
  const phero = (main.match(/<section class="phero[\s\S]*?<\/section>/i) || [])[0] || '';
  const h1 = (phero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  const lead = (phero.match(/<p class="lead"[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || '';
  const factsBlock = (phero.match(/<p class="phero__facts"[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || '';
  const facts = [...factsBlock.matchAll(/<span>([\s\S]*?)<\/span>/gi)].map(m => m[1].trim());
  const ctaBlock = (phero.match(/<div class="cta[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || '';
  const actions = [...ctaBlock.matchAll(/<a class="([^"]*)" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({
    href: fixHref(m[2]),
    label: m[3].trim(),
    external: /https?:/.test(m[2]),
  }));
  const image = (phero.match(/<img[^>]*class="phero__bg"[^>]*src="([^"]+)"/i) || phero.match(/<img[^>]*src="([^"]+)"[^>]*class="phero__bg"/i) || [])[1] || '/assets/city-sunset.webp';
  const meta = (phero.match(/<div class="article__meta"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || '';
  const title = (raw.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const description = (raw.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '';
  const content = rewrite(main.replace(phero, '').trim());
  return { raw, h1, lead, facts, actions, image: rewrite(image), meta: rewrite(meta), title: title.trim(), description, content, phero };
}

function shell({ title, description, active, hero, content, bodyClass = 'page', scripts = '' }) {
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<meta name="description" content="${attr(description)}">
<meta name="theme-color" content="#DDE3EA">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
<link rel="stylesheet" href="/assets/v2.css">
<link rel="stylesheet" href="/assets/pages.css">
<script>document.documentElement.classList.add('js');</script>
</head>
<body class="${bodyClass}">
<div class="grain" aria-hidden="true"></div>
${header(active)}
<main id="top" class="page-main">
${hero}
${content}
</main>
${footer()}
${scripts}
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

function writeOut(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
  console.log('+', rel);
}

// --- обычные разделы ---
for (const [key, cfg] of Object.entries(PAGES)) {
  const p = extractPage(cfg.built);
  const title = p.title || `${cfg.kicker} | ЛидПилот`;
  const description = updateCopy(p.description || '');
  let facts = p.facts;
  if (!facts.length) {
    facts = key === 'blog'
      ? ['<b>6 статей</b> в блоге', '<b>5 рубрик</b> практики', '<b>3–5 дней</b> до запуска']
      : [];
  }
  const hero = cfg.ctaHero
    ? pageHeroCta({
        kicker: cfg.kicker,
        title: p.h1,
        lead: p.lead,
        actions: cfg.actions || p.actions,
        crumbs: [{ label: 'Главная', href: '/' }, { label: cfg.kicker }],
        image: p.image,
      })
    : pageHero({
        id: cfg.id,
        label: cfg.label,
        kicker: cfg.kicker,
        title: p.h1,
        lead: p.lead,
        facts,
        actions: cfg.actions || p.actions,
        crumbs: [{ label: 'Главная', href: '/' }, { label: cfg.kicker }],
        image: p.image,
        asideLabel: cfg.asideLabel,
        asideNote: cfg.asideNote,
      });
  let content = updateCopy(p.content);
  if (key === 'kontakty') content = contactContent(content);
  if (key === 'keysy') content = dialogsDevice(content);
  if (key !== 'kontakty') content = finalPanel(content);
  writeOut(cfg.out, shell({ title, description, active: cfg.active, hero, content }));
}

// --- статьи ---
const blogFiles = fs.readdirSync(path.join(BUILT, 'blog'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

const articleIndex = [];
for (const slug of blogFiles) {
  const rel = `blog/${slug}/index.html`;
  const p = extractPage(rel);
  const phero = p.phero;
  const crumbBlock = (phero.match(/class="phero__meta"[^>]*>([\s\S]*?)<\/(?:nav|div)>/i) || [])[1] || '';
  const cat = stripTags((crumbBlock.match(/<span>([\s\S]*?)<\/span>/i) || [])[1] || 'Блог');
  const metaTexts = [...(p.meta || '').matchAll(/<span>([\s\S]*?)<\/span>/gi)].map(m => stripTags(m[1]));
  const date = metaTexts[0] || '';
  const readTime = (metaTexts[1] || '').replace(/\s*чтения$/i, '').trim();
  const author = metaTexts[2] || 'Проверил Дмитрий Лысенков';
  const aside = `<aside class="page-facts">
      <span class="page-facts__label"><i class="led led--pulse" aria-hidden="true"></i> МАТЕРИАЛ</span>
      <div class="page-facts__list">
        <div class="page-facts__item"><b>${cat}</b>рубрика</div>
        <div class="page-facts__item"><b>${readTime || '6 мин'}</b>чтения</div>
        <div class="page-facts__item"><b>${date || '2026'}</b>публикация</div>
      </div>
      <p class="page-facts__note"><a class="page-facts__link" href="/blog/">Все статьи блога →</a></p>
    </aside>`;
  const hero = pageHero({
    id: 'LP-05',
    label: 'БЛОГ · СТАТЬЯ',
    kicker: cat,
    title: p.h1,
    lead: p.lead,
    meta: p.meta,
    crumbs: [{ label: 'Главная', href: '/' }, { label: 'Блог', href: '/blog/' }, { label: cat }],
    image: p.image,
    asideHTML: aside,
    article: true,
  });
  const title = p.title || `${stripTags(p.h1)} | ЛидПилот`;
  writeOut(`blog/${slug}/index.html`, shell({
    title,
    description: updateCopy(p.description),
    active: 'blog',
    hero,
    content: finalPanel(updateCopy(p.content)),
    bodyClass: 'page page-article',
  }));
  articleIndex.push({ slug, title: stripTags(p.h1), description: p.description, cat, date, readTime });
}

// --- политика ---
const privacy = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Политика конфиденциальности | ЛидПилот</title>
<meta name="description" content="Политика обработки персональных данных сайта ЛидПилот в соответствии с Федеральным законом №152-ФЗ «О персональных данных».">
<meta name="theme-color" content="#DDE3EA">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
<link rel="stylesheet" href="/assets/v2.css">
<link rel="stylesheet" href="/assets/pages.css">
<script>document.documentElement.classList.add('js');</script>
</head>
<body class="page page-policy">
<div class="grain" aria-hidden="true"></div>
${header('')}
<main id="top" class="page-main">
<section class="page-hero">
  <div class="wrap">
    <div class="panel panel--page">
      <i class="screw screw--tl" aria-hidden="true"></i><i class="screw screw--tr" aria-hidden="true"></i><i class="screw screw--bl" aria-hidden="true"></i><i class="screw screw--br" aria-hidden="true"></i>
      <div class="panel__top"><span class="panel__id">LP-08</span><span class="panel__name">ДОКУМЕНТ</span><span class="panel__live"><i class="led led--pulse" aria-hidden="true"></i> LIVE</span></div>
      <div class="panel__screen page-screen">
        <img class="page-screen__bg" src="/assets/city-day.webp" alt="" width="1920" height="1080" decoding="async">
        <div class="page-screen__shade" aria-hidden="true"></div><div class="page-screen__grid" aria-hidden="true"></div>
        <div class="page-hero__in">
          <div class="page-hero__plate">
            ${crumbs([{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }])}
            <span class="kicker">Документ</span>
            <h1>Политика конфиденциальности</h1>
            <p class="page-lead">Как ЛидПилот обрабатывает и защищает персональные данные посетителей сайта.</p>
            <div class="page-meta"><span>Действует с 20 ноября 2026</span><span>152-ФЗ</span></div>
          </div>
          <aside class="page-facts">
            <span class="page-facts__label"><i class="led led--pulse" aria-hidden="true"></i> ДОКУМЕНТ</span>
            <div class="page-facts__list">
              <div class="page-facts__item"><b>152-ФЗ</b>правовая база</div>
              <div class="page-facts__item"><b>1 файл</b>без мелкого шрифта</div>
            </div>
            <p class="page-facts__note">Оператор: Лысенков Дмитрий Иванович · ИНН 526201052704</p>
          </aside>
        </div>
      </div>
      <div class="panel__bottom page-bottom"><span class="mono">LP-08 · ДОКУМЕНТ</span><span class="mono" style="margin-left:auto">ONLINE · 24/7</span></div>
    </div>
  </div>
</section>
<section class="legal-page">
  <div class="wrap">
    <div class="legal">
      <p>Политика определяет порядок обработки и защиты персональных данных посетителей сайта lid-pilot.ru (далее – Сайт) в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».</p>
      <h2>1. Какие данные мы обрабатываем</h2>
      <p>Данные, которые вы сами указываете в форме заявки: имя и контакт для связи (телефон или имя пользователя в Telegram). Кроме того, автоматически могут собираться обезличенные данные о посещении: cookie и данные Яндекс.Метрики.</p>
      <h2>2. Зачем</h2>
      <ul><li>чтобы связаться с вами по заявке и обсудить подключение ИИ-менеджера продаж;</li><li>чтобы подготовить предложение и прогноз под ваш бизнес;</li><li>чтобы улучшать работу Сайта.</li></ul>
      <h2>3. Правовое основание</h2>
      <p>Ваше согласие, которое вы даёте, отмечая галочку и отправляя форму.</p>
      <h2>4. Передача третьим лицам</h2>
      <p>Мы не передаём ваши персональные данные третьим лицам, кроме случаев, предусмотренных законодательством РФ. Для статистики посещений используется Яндекс.Метрика – только если вы не отказались от cookie в баннере на Сайте.</p>
      <h2>5. Хранение и защита</h2>
      <p>Данные хранятся не дольше, чем требуется для целей обработки или по закону. Мы принимаем организационные и технические меры, чтобы защитить их от несанкционированного доступа.</p>
      <h2>6. Ваши права</h2>
      <p>Вы можете узнать, какие ваши данные мы обрабатываем, потребовать уточнить, заблокировать или удалить их, а также отозвать согласие – напишите нам по контактам ниже.</p>
      <h2>7. Оператор и контакты</h2>
      <p>Оператор персональных данных: Лысенков Дмитрий Иванович, ИНН 526201052704, г. Нижний Новгород.</p>
      <p>По вопросам обработки персональных данных: e-mail <a href="mailto:info@lid-pilot.ru">info@lid-pilot.ru</a>, Telegram <a href="https://t.me/dmitrylysenkov" target="_blank" rel="noopener">@dmitrylysenkov</a>.</p>
    </div>
  </div>
</section>
</main>
${footer()}
<script src="/assets/site.js"></script>
</body>
</html>`;
writeOut('politika-konfidencialnosti/index.html', privacy);

// --- 404 ---
const notFound = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Страница не найдена | ЛидПилот</title>
<meta name="theme-color" content="#DDE3EA">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css"><link rel="stylesheet" href="/assets/v2.css"><link rel="stylesheet" href="/assets/pages.css">
<script>document.documentElement.classList.add('js');</script>
</head>
<body class="page"><div class="grain" aria-hidden="true"></div>
${header('')}
<main id="top" class="page-main"><section class="error-page"><div class="wrap"><div class="error-card">
<span class="kicker"><i class="led led--red" aria-hidden="true"></i> ОШИБКА 404</span>
<h1>404</h1>
<p>Такой страницы нет. Возможно, ссылка устарела или в адресе опечатка. Вернитесь на главную или откройте разделы сайта.</p>
<div class="cta"><a class="btn btn--hot" href="/">На главную</a><a class="btn btn--ghost" href="/blog/">Блог</a><a class="btn btn--ghost" href="/kontakty/">Контакты</a></div>
</div></div></section></main>
${footer()}<script src="/assets/site.js"></script></body></html>`;
writeOut('404.html', notFound);

console.log('articles:', articleIndex.length);




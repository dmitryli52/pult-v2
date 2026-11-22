(function () {
  document.documentElement.classList.add('js');

  var q = function (s) { return document.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var btn = q('[data-menu-btn]');
  var menu = q('[data-menu]');
  function setMenu(open) {
    if (!menu || !btn) return;
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  if (btn && menu) {
    btn.addEventListener('click', function () { setMenu(menu.hidden); });
    qa('[data-menu] a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) setMenu(false);
    });
  }

  var items = qa('[data-in]');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  qa('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('.form__ok');
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      f.querySelectorAll('input,textarea,select,button').forEach(function (el) { el.disabled = true; });
    });
  });
})();

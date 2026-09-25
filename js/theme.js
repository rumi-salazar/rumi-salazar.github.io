/* Light/dark theme toggle.

   The page follows the system theme until the button in the masthead is
   used. A chosen theme is remembered in localStorage. Choosing the theme
   that matches the system again clears the memory, so the page follows
   the system from then on. This file is loaded synchronously in <head>
   so a remembered theme applies before the first paint. */
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var colours = { light: '#ffffff', dark: '#000000' };

  function stored() {
    try {
      var t = localStorage.getItem('theme');
      return t === 'light' || t === 'dark' ? t : null;
    } catch (e) {
      return null;
    }
  }

  function system() {
    return media.matches ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', colours[theme]);
    var button = document.querySelector('.theme-toggle');
    if (button) {
      var label = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    }
  }

  apply(stored() || system());

  function onSystemChange() {
    if (!stored()) apply(system());
  }
  if (media.addEventListener) media.addEventListener('change', onSystemChange);
  else if (media.addListener) media.addListener(onSystemChange);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-toggle');
    if (!button) return;
    button.hidden = false;
    apply(root.getAttribute('data-theme'));
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try {
        if (next === system()) localStorage.removeItem('theme');
        else localStorage.setItem('theme', next);
      } catch (e) {}
      apply(next);
    });
  });
})();

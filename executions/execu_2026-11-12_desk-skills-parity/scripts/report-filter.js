(function () {
  var buttons = [].slice.call(document.querySelectorAll('.tally button'));
  var rows = [].slice.call(document.querySelectorAll('#rows tr'));
  var active = null;
  function apply() {
    var shown = {};
    rows.forEach(function (r) {
      if (r.classList.contains('area')) return;
      var show = !active || r.getAttribute('data-k') === active;
      r.hidden = !show;
      if (show) shown[r.getAttribute('data-area')] = 1;
    });
    rows.forEach(function (r) { if (r.classList.contains('area')) r.hidden = !shown[r.getAttribute('data-area')]; });
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === active)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      active = active === f ? null : f;
      apply();
      if (active) document.getElementById('h-matrix').scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

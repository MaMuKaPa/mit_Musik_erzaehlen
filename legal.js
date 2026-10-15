/* ===== Hier eintragen: Adressen Ihrer Rechtstexte =====
   Liegen die Dateien im selben Ordner wie diese Seiten, genügen die Dateinamen.
   Liegen sie woanders, tragen Sie die komplette Adresse ein, z. B.
   'https://IHR-NAME.github.io/ANDERES-REPO/impressum.html'                         */
window.LEGAL = {
  impressum: 'impressum.html',
  datenschutz: 'datenschutz.html'
};
(function () {
  function add() {
    var f = document.createElement('footer');
    f.className = 'no-print';
    f.style.cssText = 'text-align:center;font:14px/1.4 system-ui,Arial,sans-serif;padding:16px 8px;opacity:.85';
    f.innerHTML = '<a href="' + LEGAL.impressum + '" style="color:inherit">Impressum</a> · <a href="' + LEGAL.datenschutz + '" style="color:inherit">Datenschutz</a>';
    document.body.appendChild(f);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();

(function () {
  'use strict';
  window.onload = function () {
    setTimeout(function () {
      let perfEntries = performance.getEntriesByType('navigation');
      if (perfEntries.length > 0) {
        let p = perfEntries[0];
        let loadTime = p.loadEventEnd - p.startTime;
        let serverTime = +document.getElementById('serverTime').value;
        let footer = document.querySelector('footer');
        let totalTime = loadTime + serverTime;
        if (footer) {
          footer.innerHTML += `<p>Время загрузки клиента: ${loadTime.toFixed()}ms | Время загрузки сервера: ${serverTime}ms | Полное время: ${totalTime.toFixed()}ms </p>`;
        }
      }
    }, 0); // Задержка в 0 мс гарантирует
  };
  // Подсветка ИМЕННО активного пункта меню
  let currentPage = document.location.pathname.split('/').pop();
  let navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach((link) => {
    let linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active'); /* Если совпадает */
    }
  });
})();


supertokens.init({
  appInfo: {
    apiDomain:
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? `:${window.location.port}` : ''),
    apiBasePath: '/api',
    appName: '...',
  },
  recipeList: [supertokensSession.init(), supertokensEmailPassword.init()],
});


supertokensSession
  .getAccessToken()
  .then(async () => {
    window.socket = io.connect('/');
    const userId = await supertokensSession.getUserId();
    console.log(userId);
    window.socket.emit('join-admin', userId);
  })
  .catch(console.log);
  async function logout() {
    await supertokensSession.signOut();
    window.location.href = '/';
}
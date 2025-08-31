// Simple HTML include utility (returns a Promise)
function include(selector, url){
  return fetch(url, { credentials: 'same-origin' })
    .then(function(r){ if(!r.ok) throw new Error('Include failed: '+url); return r.text(); })
    .then(function(html){
      var host = document.querySelector(selector);
      if (host) host.innerHTML = html;
      return html;
    });
}

// =============================================
// js/navigation.js — Ultra-reliable version
// =============================================

console.log('navigation.js file loaded successfully');

(function() {
  console.log('navigation.js: IIFE executing');
  
  function initNav() {
    console.log('navigation.js: initNav called');
    
    var nav = document.querySelector('.global-nav');
    
    if (!nav) {
      console.error('navigation.js: ERROR — .global-nav element not found in the DOM');
      return;
    }
    
    console.log('navigation.js: Found .global-nav element');
    
    // Build navigation HTML
    var html = '';
    html += '<a href="index.html" class="nav-brand">';
    html += '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:28px;height:28px;flex-shrink:0;">';
    html += '<rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>';
    html += '<rect x="18" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>';
    html += '<rect x="2" y="18" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>';
    html += '<rect x="18" y="18" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.3"/>';
    html += '<circle cx="24" cy="24" r="3" fill="currentColor"/>';
    html += '</svg>';
    html += 'IDEOGRID';
    html += '</a>';
    html += '<button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">';
    html += '<span></span><span></span><span></span>';
    html += '</button>';
    html += '<ul class="nav-links" role="menubar">';
    html += '<li role="none"><a href="index.html" role="menuitem">Home</a></li>';
    html += '<li role="none"><a href="research.html" role="menuitem">Research Lab</a></li>';
    html += '<li role="none"><a href="ideogrid.html" role="menuitem">The System</a></li>';
    html += '<li role="none"><a href="case-studies.html" role="menuitem">Case Studies</a></li>';
    html += '<li role="none"><a href="glossary.html" role="menuitem">Intervention Glossary</a></li>';
    html += '<li role="none"><a href="about.html" role="menuitem">About</a></li>';
    html += '<li role="none"><a href="contact.html" role="menuitem">Contact</a></li>';
    html += '<li role="none"><a href="resources.html" role="menuitem">Resources</a></li>';
    html += '</ul>';
    
    nav.innerHTML = html;
    console.log('navigation.js: Nav HTML injected');
    
    // Set active link
    var path = window.location.pathname;
    var page = path.split('/').pop();
    
    if (!page || page === '' || path === '/') {
      page = 'index.html';
    }
    
    console.log('navigation.js: Current page =', page);
    
    var links = nav.querySelectorAll('.nav-links a');
    var found = false;
    
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === page) {
        link.classList.add('active');
        found = true;
        console.log('navigation.js: Active link set for', href);
      }
    });
    
    if (!found) {
      console.log('navigation.js: No exact match, checking special pages');
      if (page === 'article.html') {
        links.forEach(function(link) {
          if (link.getAttribute('href') === 'research.html') {
            link.classList.add('active');
          }
        });
      }
      if (page === 'case-detail.html') {
        links.forEach(function(link) {
          if (link.getAttribute('href') === 'case-studies.html') {
            link.classList.add('active');
          }
        });
      }
    }
    
    // Mobile menu
    var toggle = nav.querySelector('.nav-toggle');
    var navList = nav.querySelector('.nav-links');
    
    if (toggle && navList) {
      toggle.addEventListener('click', function() {
        if (navList.classList.contains('open')) {
          navList.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        } else {
          navList.classList.add('open');
          toggle.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
          document.body.classList.add('nav-open');
        }
      });
      
      navList.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          navList.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        });
      });
      
      console.log('navigation.js: Mobile menu initialized');
    }
    
    console.log('navigation.js: Initialization complete');
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    console.log('navigation.js: Waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    console.log('navigation.js: DOM already ready, running initNav');
    initNav();
  }
  
})();
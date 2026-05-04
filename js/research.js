// =============================================
// js/research.js — Complete Research Hub Logic
// Fixed rendering with proper data loading
// =============================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const articlesContainer = document.getElementById('articles-container');
    const searchInput = document.getElementById('research-search');
    const paginationContainer = document.getElementById('pagination');
    const resultCount = document.getElementById('result-count');
    const sortSelect = document.getElementById('sort-select');
    const frameworkMapContainer = document.getElementById('framework-map');

    // Exit if we're not on the research page
    if (!articlesContainer) {
      console.log('Not on research page — articles container not found');
      return;
    }

    // Check data exists
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.articles || !SITE_DATA.articles.length) {
      articlesContainer.innerHTML = `
        <div class="empty-state">
          <p style="font-size:1.1rem;font-weight:500;">Unable to load research data.</p>
          <p class="text-sm">Please ensure the data file is properly loaded.</p>
        </div>`;
      return;
    }

    console.log('SITE_DATA loaded:', SITE_DATA.articles.length, 'articles found');

    // Data references
    const articles = SITE_DATA.articles;
    const frameworks = SITE_DATA.frameworks || [];

    // State
    let activeCategory = 'All';
    let activeType = 'all';
    let activeFramework = 'all';
    let activeAudience = 'all';
    let searchQuery = '';
    let currentPage = 1;
    let sortBy = 'newest';
    const perPage = 5;

    // Read URL parameters
    function readURLParams() {
      const params = new URLSearchParams(window.location.search);
      if (params.get('category')) activeCategory = params.get('category');
      if (params.get('type')) activeType = params.get('type');
      if (params.get('framework')) activeFramework = params.get('framework');
      if (params.get('audience')) activeAudience = params.get('audience');
      if (params.get('q')) searchQuery = params.get('q');
      if (params.get('page')) currentPage = parseInt(params.get('page')) || 1;
      if (params.get('sort')) sortBy = params.get('sort');
    }

    // Update URL without reload
    function updateURLParams() {
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (activeType !== 'all') params.set('type', activeType);
      if (activeFramework !== 'all') params.set('framework', activeFramework);
      if (activeAudience !== 'all') params.set('audience', activeAudience);
      if (searchQuery) params.set('q', searchQuery);
      if (currentPage > 1) params.set('page', currentPage);
      if (sortBy !== 'newest') params.set('sort', sortBy);
      const newPath = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newPath);
    }

    // Sync UI elements to match state
    function syncUI() {
      // Category pills
      document.querySelectorAll('.pill-filter').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === activeCategory);
      });
      
      // Type sidebar links
      document.querySelectorAll('.sidebar-nav a[data-type]').forEach(link => {
        link.classList.toggle('active', link.dataset.type === activeType);
      });
      
      // Framework sidebar links
      document.querySelectorAll('.framework-link').forEach(link => {
        link.classList.toggle('active', link.dataset.framework === activeFramework);
      });
      
      // Audience entry points
      document.querySelectorAll('.audience-link').forEach(link => {
        link.classList.toggle('active', link.dataset.audience === activeAudience);
      });

      // Search input
      if (searchInput && searchInput.value !== searchQuery) {
        searchInput.value = searchQuery;
      }

      // Sort select
      if (sortSelect && sortSelect.value !== sortBy) {
        sortSelect.value = sortBy;
      }
    }

    // Filter and sort articles
    function getFilteredArticles() {
      let filtered = [...articles];

      if (activeCategory !== 'All') {
        filtered = filtered.filter(a => a.category === activeCategory);
      }
      if (activeType !== 'all') {
        filtered = filtered.filter(a => a.type === activeType);
      }
      if (activeFramework !== 'all') {
        filtered = filtered.filter(a => a.framework === activeFramework);
      }
      if (activeAudience !== 'all') {
        filtered = filtered.filter(a => a.audience && a.audience.includes(activeAudience));
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(a => 
          (a.title && a.title.toLowerCase().includes(q)) ||
          (a.category && a.category.toLowerCase().includes(q)) ||
          (a.type && a.type.toLowerCase().includes(q)) ||
          (a.quickSummary && a.quickSummary.toLowerCase().includes(q)) ||
          (a.keyInsight && a.keyInsight.toLowerCase().includes(q)) ||
          (a.keywords && a.keywords.some(k => k.toLowerCase().includes(q)))
        );
      }

      // Sort
      switch(sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'longest':
          filtered.sort((a, b) => b.readTime - a.readTime);
          break;
        case 'shortest':
          filtered.sort((a, b) => a.readTime - b.readTime);
          break;
      }

      return filtered;
    }

    // Helper: get framework short name
    function getFrameworkLabel(frameworkId) {
      if (!frameworkId) return '';
      const fw = frameworks.find(f => f.id === frameworkId);
      return fw ? fw.shortName : '';
    }

    // Helper: get framework name
    function getFrameworkName(frameworkId) {
      if (!frameworkId) return '';
      const fw = frameworks.find(f => f.id === frameworkId);
      return fw ? fw.name : '';
    }

    // Helper: audience badges HTML
    function getAudienceBadges(audiences) {
      if (!audiences || !audiences.length) return '';
      const labels = {
        'researchers': 'For Researchers',
        'school-leaders': 'For School Leaders',
        'system-designers': 'For System Designers'
      };
      return audiences.map(a => 
        `<span class="audience-badge audience-${a}">${labels[a] || a}</span>`
      ).join('');
    }

    // Helper: type CSS class
    function getTypeClass(type) {
      switch(type) {
        case 'Case Study': return 'type-case-study';
        case 'Critical Essay': return 'type-essay';
        case 'System Design Paper': return 'type-system-design';
        default: return 'type-theoretical';
      }
    }

    // Main render function
    function render() {
      const filtered = getFilteredArticles();
      const totalPages = Math.ceil(filtered.length / perPage);
      const start = (currentPage - 1) * perPage;
      const pageArticles = filtered.slice(start, start + perPage);

      console.log('Rendering:', filtered.length, 'filtered articles, page', currentPage, 'of', totalPages);

      // Update result count
      if (resultCount) {
        resultCount.textContent = filtered.length + ' research paper' + (filtered.length !== 1 ? 's' : '') + ' found';
      }

      // Handle empty state
      if (filtered.length === 0) {
        articlesContainer.innerHTML = `
          <div class="empty-state">
            <p style="font-size:1.1rem;font-weight:500;">No research matches your current filters.</p>
            <p class="text-sm" style="margin-top:4px;">Try adjusting your search terms or clearing filters.</p>
            <div style="margin-top:16px;">
              <button class="btn btn-ghost btn-sm clear-all-filters">Clear all filters</button>
            </div>
          </div>`;
        
        // Wire up clear button
        const clearBtn = articlesContainer.querySelector('.clear-all-filters');
        if (clearBtn) {
          clearBtn.addEventListener('click', function() {
            window.location.search = '';
          });
        }

        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
      }

      // Build article cards
      articlesContainer.innerHTML = pageArticles.map((article, i) => {
        const isFirstPage = currentPage === 1;
        const isFirstItem = i === 0;
        const noActiveFilters = activeCategory === 'All' && activeType === 'all' && activeFramework === 'all' && activeAudience === 'all' && !searchQuery;
        const isFeatured = isFirstPage && isFirstItem && noActiveFilters;
        const featuredClass = isFeatured ? 'featured' : '';
        const frameworkLabel = getFrameworkLabel(article.framework);
        const frameworkName = getFrameworkName(article.framework);
        const audienceBadges = getAudienceBadges(article.audience);

        return `
          <article class="article-card ${featuredClass}">
            <!-- Header row: tags + download badge -->
            <div class="article-card-header">
              <div class="article-tags">
                <span class="tag">${article.category || 'Uncategorized'}</span>
                <span class="tag type-tag ${getTypeClass(article.type)}">${article.type || 'Paper'}</span>
                ${frameworkLabel ? `<span class="tag framework-tag" title="${frameworkName}">${frameworkLabel}</span>` : ''}
              </div>
              ${article.downloadAvailable ? `<span class="download-badge">Full paper available</span>` : ''}
            </div>
            
            <!-- Title -->
            <h3>
              <a href="article.html?id=${article.id}">${article.title}</a>
            </h3>

            <p class="article-author">${SITE_DATA.author.name} &mdash; ${SITE_DATA.author.affiliation}</p>
            
            <!-- Quick Summary -->
            ${article.quickSummary ? `
            <div class="article-quick-summary">
              <p>${article.quickSummary}</p>
            </div>
            ` : ''}
            
            <!-- Key Insight -->
            ${article.keyInsight ? `
            <div class="article-key-insight">
              <span class="insight-label">Key insight</span>
              <p>"${article.keyInsight}"</p>
            </div>
            ` : ''}
            
            <!-- Meta row: read time, date, audience -->
            <div class="article-meta-row">
              <div class="article-meta">
                <span>${article.readTime || '?'} min read</span>
                <span>${article.date ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
              </div>
              <div class="article-audience">
                ${audienceBadges}
              </div>
            </div>
            
            <!-- Actions -->
            <div class="article-actions">
              <a href="article.html?id=${article.id}" class="btn btn-ghost btn-sm">Read research</a>
              ${article.downloadAvailable ? `<span class="text-sm" style="color:var(--text-tertiary);">Full paper via request</span>` : ''}
            </div>
          </article>`;
      }).join('');

      // Build pagination
      if (paginationContainer && totalPages > 1) {
        let pagHTML = '';
        
        // Previous
        pagHTML += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" aria-label="Previous page">&larr; Previous</button>`;
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
          pagHTML += `<button data-page="1">1</button>`;
          if (startPage > 2) pagHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        
        for (let p = startPage; p <= endPage; p++) {
          pagHTML += `<button class="${p === currentPage ? 'active' : ''}" data-page="${p}" ${p === currentPage ? 'aria-current="page"' : ''}>${p}</button>`;
        }
        
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) pagHTML += `<span class="pagination-ellipsis">...</span>`;
          pagHTML += `<button data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // Next
        pagHTML += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" aria-label="Next page">Next &rarr;</button>`;
        
        paginationContainer.innerHTML = pagHTML;

        // Wire up pagination clicks
        paginationContainer.querySelectorAll('button:not([disabled])').forEach(btn => {
          btn.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            if (page >= 1 && page <= totalPages) {
              currentPage = page;
              updateURLParams();
              render();
              // Scroll to articles
              articlesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
      } else if (paginationContainer) {
        paginationContainer.innerHTML = '';
      }
    }

    // Render framework map
    function renderFrameworkMap() {
      if (!frameworkMapContainer) return;
      if (!frameworks.length) {
        frameworkMapContainer.innerHTML = '';
        return;
      }

      frameworkMapContainer.innerHTML = frameworks.map(fw => {
        // Find linked papers
        const linkedPapers = (fw.relatedPapers || [])
          .map(pid => articles.find(a => a.id === pid))
          .filter(Boolean);

        return `
          <div class="framework-map-card">
            <div class="framework-map-header">
              <span class="framework-shortname">${fw.shortName}</span>
              <h4>${fw.name}</h4>
            </div>
            <p class="framework-question">"${fw.coreQuestion}"</p>
            <p class="text-sm">${fw.description}</p>
            ${linkedPapers.length > 0 ? `
            <div class="framework-papers">
              <span class="text-sm" style="font-weight:500;">Connected research:</span>
              <div class="framework-paper-links">
                ${linkedPapers.map(paper => `
                  <a href="article.html?id=${paper.id}" class="framework-paper-link">${paper.title}</a>
                `).join('')}
              </div>
            </div>
            ` : ''}
            <button class="btn btn-ghost btn-sm filter-by-framework" data-framework="${fw.id}" style="margin-top:12px;">View all in this framework</button>
          </div>`;
      }).join('');

      // Wire framework filter buttons
      frameworkMapContainer.querySelectorAll('.filter-by-framework').forEach(btn => {
        btn.addEventListener('click', function() {
          const frameworkId = this.dataset.framework;
          activeFramework = frameworkId;
          activeCategory = 'All';
          activeType = 'all';
          activeAudience = 'all';
          currentPage = 1;
          updateURLParams();
          syncUI();
          render();
          // Scroll to articles
          const listSection = document.getElementById('research-list-section');
          if (listSection) {
            listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            articlesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    // ========== EVENT LISTENERS ==========

    // Category filter pills
    document.querySelectorAll('.pill-filter').forEach(pill => {
      pill.addEventListener('click', function() {
        activeCategory = this.dataset.category;
        currentPage = 1;
        updateURLParams();
        syncUI();
        render();
      });
    });

    // Type sidebar links
    document.querySelectorAll('.sidebar-nav a[data-type]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        activeType = this.dataset.type;
        currentPage = 1;
        updateURLParams();
        syncUI();
        render();
      });
    });

    // Framework sidebar links
    document.querySelectorAll('.framework-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        activeFramework = this.dataset.framework;
        activeCategory = 'All';
        activeType = 'all';
        currentPage = 1;
        updateURLParams();
        syncUI();
        render();
      });
    });

    // Audience entry points
    document.querySelectorAll('.audience-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        activeAudience = this.dataset.audience;
        currentPage = 1;
        updateURLParams();
        syncUI();
        render();
      });
    });

    // Search input with debounce
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          searchQuery = searchInput.value;
          currentPage = 1;
          updateURLParams();
          render();
        }, 300);
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        sortBy = this.value;
        currentPage = 1;
        updateURLParams();
        render();
      });
    }

    // Initialize
    readURLParams();
    syncUI();
    render();
    renderFrameworkMap();
    
    console.log('Research hub initialized successfully');
  });
})();
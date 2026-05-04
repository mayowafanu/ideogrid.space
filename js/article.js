// =============================================
// js/article.js — Updated Article Detail with new fields
// =============================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('article-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const article = (SITE_DATA.articles || []).find(a => a.id === articleId);
    const frameworks = SITE_DATA.frameworks || [];

    if (!article) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>Research not found</h2>
          <p>The paper you're looking for doesn't exist in the archive or may have been moved.</p>
          <div style="margin-top:16px;">
            <a href="research.html" class="btn btn-outline">Return to Research Lab</a>
          </div>
        </div>`;
      document.title = 'Research Not Found — IDEOGRID';
      return;
    }

    document.title = article.title + ' — IDEOGRID Research';

    // Find framework info
    const framework = frameworks.find(f => f.id === article.framework);
    const frameworkLabel = framework ? framework.shortName : '';
    const frameworkName = framework ? framework.name : '';

    // Find related articles from same framework
    const related = (SITE_DATA.articles || [])
      .filter(a => a.id !== article.id && a.framework === article.framework)
      .slice(0, 3);

    // If not enough from same framework, add from same category
    if (related.length < 3) {
      const categoryRelated = (SITE_DATA.articles || [])
        .filter(a => a.id !== article.id && a.category === article.category && !related.find(r => r.id === a.id))
        .slice(0, 3 - related.length);
      related.push(...categoryRelated);
    }

    // Audience labels
    const audienceLabels = {
      'researchers': 'Researchers',
      'school-leaders': 'School Leaders',
      'system-designers': 'System Designers'
    };

    // Citation generation
    const year = article.date ? article.date.split('-')[0] : '2025';
    const apa = `${article.title}. (${year}). Learning Systems Lab, IDEOGRID.`;
    const mla = `"${article.title}." Learning Systems Lab, IDEOGRID, ${year}.`;
    const bibtex = `@techreport{${article.id},\n  title = {${article.title}},\n  year = {${year}},\n  institution = {Learning Systems Lab, IDEOGRID}\n}`;

    container.innerHTML = `
      <!-- Breadcrumb -->
      <div class="article-breadcrumb">
        <a href="research.html">Research Lab</a>
        <span aria-hidden="true">/</span>
        ${frameworkLabel ? `<a href="research.html?framework=${article.framework}">${frameworkName}</a><span aria-hidden="true">/</span>` : ''}
        <span>${article.title.length > 60 ? article.title.substring(0,60) + '...' : article.title}</span>
      </div>

      <!-- Header -->
      <header class="article-header">
        <div class="article-tags" style="margin-bottom:12px;">
          <span class="tag">${article.category}</span>
          <span class="tag type-tag ${getTypeClass(article.type)}">${article.type}</span>
          ${frameworkLabel ? `<span class="tag framework-tag">${frameworkLabel}</span>` : ''}
          ${article.downloadAvailable ? `<span class="tag download-tag">Full paper available</span>` : ''}
        </div>
        <h1>${article.title}</h1>
        <div class="article-meta" style="margin-top:8px;">
          <span>${article.readTime} min read</span>
          <span>${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>


      <div class="article-author-block">
        <span class="author-name">${SITE_DATA.author.name}</span> -
        <span class="author-affiliation">${SITE_DATA.author.affiliation}</span>
        ${SITE_DATA.author.orcid ? `<a href="${SITE_DATA.author.orcid}" class="author-orcid" target="_blank" rel="noopener">ORCID</a>` : ''}
      </div>

      <!-- Quick Summary — prominent -->
      <div class="article-summary-block">
        <h3>Summary</h3>
        <p>${article.quickSummary}</p>
      </div>

      <!-- Key Insight — highlighted -->
      <div class="insight-block" style="font-style:normal;">
        <span class="insight-label" style="display:block;margin-bottom:8px;">Key Insight</span>
        <p style="font-size:1.15rem;">${article.keyInsight}</p>
      </div>

      <!-- Who this is for -->
      ${article.audience && article.audience.length ? `
      <div class="article-audience-section">
        <span class="text-sm" style="font-weight:500;display:block;margin-bottom:8px;">Audience</span>
        <div class="audience-badges">
          ${article.audience.map(a => `<span class="audience-badge audience-${a}">${audienceLabels[a] || a}</span>`).join('')}
        </div>
        <p class="text-sm" style="margin-top:8px;">${article.whoThisIsFor}</p>
      </div>
      ` : ''}

      <!-- Framework connection -->
      ${framework ? `
      <div class="article-framework-connection">
        <h4>Part of: ${framework.name} (${framework.shortName})</h4>
        <p class="text-sm">${framework.description}</p>
        <p class="text-sm" style="color:var(--accent);">Core question: "${framework.coreQuestion}"</p>
        <a href="research.html?framework=${framework.id}" class="btn btn-ghost btn-sm">View all papers in this framework</a>
      </div>
      ` : ''}

      <!-- Full content sections -->
      <div class="article-content">
        <section id="problem-context">
          <h2>Problem Context</h2>
          <p>${article.problemContext}</p>
        </section>
        
        <section id="observation">
          <h2>Observation from Real Systems</h2>
          <p>${article.observation}</p>
        </section>
        
        <section id="core-insight">
          <h2>Core Insight</h2>
          <p>${article.coreInsight}</p>
        </section>
        
        <section id="framework">
          <h2>Proposed Framework</h2>
          <p>${article.proposedFramework}</p>
        </section>
        
        <section id="implications">
          <h2>Implications for Education Systems</h2>
          <p>${article.implications}</p>
        </section>
        
        <section id="ideogrid-relation">
          <h2>Relation to IDEOGRID</h2>
          <p>${article.relationToIDEOGRID}</p>
        </section>
      </div>

      <!-- Citations -->
      ${article.citations && article.citations.length ? `
      <section class="article-citations">
        <h3>References</h3>
        <ol class="citation-list">
          ${article.citations.map(c => `<li>${c}</li>`).join('')}
        </ol>
      </section>
      ` : ''}

      <!-- Related research -->
      ${related.length > 0 ? `
      <section class="related-research">
        <h3>Related Research</h3>
        <div class="card-grid">
          ${related.map(r => `
            <a href="article.html?id=${r.id}" class="card related-card" style="text-decoration:none;color:inherit;">
              <span class="tag">${r.category}</span>
              <span class="tag framework-tag" style="margin-left:4px;">${getFrameworkLabel(r.framework)}</span>
              <h4 style="margin-top:8px;">${r.title}</h4>
              <p class="text-sm" style="margin-top:4px;">${r.quickSummary ? r.quickSummary.substring(0, 100) + '...' : ''}</p>
              <span class="text-sm" style="color:var(--text-tertiary);">${r.readTime} min read</span>
            </a>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Download CTA -->
      ${article.downloadAvailable ? `
      <div class="download-cta">
        <h3>Get the Full Paper</h3>
        <p class="text-sm">The complete research paper with detailed methodology and extended analysis is available upon request.</p>
        <a href="contact.html" class="btn btn-primary">Request Full Paper</a>
      </div>
      ` : ''}

      <!-- Actions -->
      <div class="article-footer-actions">
        <button class="btn btn-outline btn-sm" id="cite-btn">Cite This Paper</button>
        <a href="research.html" class="btn btn-ghost btn-sm">Back to Research Lab</a>
      </div>
    `;

    // Helper functions
    function getTypeClass(type) {
      if (type === 'Case Study') return 'type-case-study';
      if (type === 'Critical Essay') return 'type-essay';
      if (type === 'System Design Paper') return 'type-system-design';
      return 'type-theoretical';
    }

    function getFrameworkLabel(frameworkId) {
      const fw = frameworks.find(f => f.id === frameworkId);
      return fw ? fw.shortName : '';
    }

    // Citation modal
    const citeBtn = document.getElementById('cite-btn');
    if (citeBtn) {
      citeBtn.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay open';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Citation options');
        modal.innerHTML = `
          <div class="modal">
            <button class="modal-close" aria-label="Close citation modal">&times;</button>
            <h3>Cite This Paper</h3>
            <div style="margin-top:16px;">
              <p style="font-weight:600;">APA</p>
              <p class="text-sm" style="background:var(--bg-soft);padding:10px;border-radius:var(--radius-sm);">${apa}</p>
            </div>
            <div style="margin-top:12px;">
              <p style="font-weight:600;">MLA</p>
              <p class="text-sm" style="background:var(--bg-soft);padding:10px;border-radius:var(--radius-sm);">${mla}</p>
            </div>
            <div style="margin-top:12px;">
              <p style="font-weight:600;">BibTeX</p>
              <pre class="text-sm" style="background:var(--bg-soft);padding:10px;border-radius:var(--radius-sm);white-space:pre-wrap;font-family:monospace;">${bibtex}</pre>
            </div>
            <button class="btn btn-ghost btn-sm copy-citation" data-text="${bibtex}" style="margin-top:12px;">Copy BibTeX</button>
          </div>`;
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', function(e) {
          if (e.target === modal) modal.remove();
        });

        const copyBtn = modal.querySelector('.copy-citation');
        if (copyBtn) {
          copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(this.dataset.text).then(() => {
              this.textContent = 'Copied';
              setTimeout(() => { this.textContent = 'Copy BibTeX'; }, 2000);
            });
          });
        }

        document.addEventListener('keydown', function escClose(e) {
          if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escClose); }
        });
      });
    }
  });
})();
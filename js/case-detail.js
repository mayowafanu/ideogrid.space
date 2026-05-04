// =============================================
// js/case-detail.js — Case study detail page
// =============================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('case-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('id');
    const caseData = (SITE_DATA.caseStudies || []).find(c => c.id === caseId);

    if (!caseData) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>Case study not found</h2>
          <p>The case study you're looking for doesn't exist.</p>
          <a href="case-studies.html" class="btn btn-outline">View all case studies</a>
        </div>`;
      document.title = 'Case Study Not Found — IDEOGRID';
      return;
    }

    document.title = caseData.school + ' Case Study — IDEOGRID';

    container.innerHTML = `
      <span class="tag">Case Study</span>
      <h1>${caseData.school}</h1>
      <p class="subtitle">${caseData.location} · ${caseData.level} · ${caseData.students} students · ${caseData.teachers} teachers</p>
      
      <section style="margin-top:28px;">
        <h2>Context</h2>
        <p>${caseData.school} is a ${caseData.level.toLowerCase()} school in ${caseData.location} serving ${caseData.students} students with a teaching staff of ${caseData.teachers}. The school leadership sought a structured approach to student support after recognizing inconsistencies in how teachers identified and responded to struggling students.</p>
      </section>
      
      <section>
        <h2>Problem</h2>
        <p>${caseData.problem}</p>
      </section>
      
      <section>
        <h2>System Applied</h2>
        <ul style="margin-left:20px;color:var(--text-secondary);">
          ${caseData.systemApplied.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('')}
        </ul>
      </section>
      
      <section>
        <h2>Implementation</h2>
        <p>${caseData.implementationTimeline}</p>
      </section>
      
      <section>
        <h2>Observed Changes</h2>
        <ul style="margin-left:20px;color:var(--text-secondary);">
          ${caseData.observedChanges.map(c => `<li style="margin-bottom:6px;">${c}</li>`).join('')}
        </ul>
      </section>
      
      <section>
        <h2>Quantitative Outcomes</h2>
        <div class="card-grid">
          ${caseData.quantitativeOutcomes.map(o => `
            <div class="card" style="text-align:center;">
              <p style="font-size:2rem;font-weight:700;color:var(--accent);margin:0;">${o.value}</p>
              <p class="text-sm" style="margin:0;">${o.metric}</p>
            </div>
          `).join('')}
        </div>
      </section>
      
      ${caseData.qualitativeFeedback ? `
      <section>
        <h2>Teacher Feedback</h2>
        ${caseData.qualitativeFeedback.map(q => `
          <div class="insight-block" style="font-style:italic;">"${q}"</div>
        `).join('')}
      </section>` : ''}
      
      <section>
        <h2>Key Insights</h2>
        <p>${caseData.keyInsights}</p>
      </section>
      
      <section>
        <h2>Learnings for Future Systems</h2>
        <p>${caseData.learningsForFuture}</p>
      </section>
      
      ${caseData.relationToResearch ? `
      <section>
        <h2>Connection to Research</h2>
        <p>${caseData.relationToResearch}</p>
      </section>` : ''}
      
      <div style="margin-top:32px;">
        <a href="case-studies.html" class="btn btn-outline btn-sm">All Case Studies</a>
        <a href="research.html" class="btn btn-ghost btn-sm">Related Research</a>
      </div>
    `;
  });
})();
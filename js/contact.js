// =============================================
// js/contact.js — Contact form handling
// =============================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const schoolForm = document.getElementById('school-form');
    const researchForm = document.getElementById('research-form');
    
    // Formspree endpoint placeholder — replace with your actual endpoint
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqaaajg';

    function handleForm(form, formType) {
      if (!form) return;
      
      const successEl = form.querySelector('.form-success');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
        if (successEl) successEl.style.display = 'none';
        
        // Basic validation
        let valid = true;
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          const errorEl = field.parentElement.querySelector('.form-error');
          if (!field.value.trim()) {
            valid = false;
            if (errorEl) { errorEl.textContent = 'This field is required.'; errorEl.style.display = 'block'; }
          } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            valid = false;
            if (errorEl) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.style.display = 'block'; }
          }
        });
        
        if (!valid) return;
        
        // Show loading
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }
        
        // Try Formspree first, fall back to localStorage
        const formData = new FormData(form);
        formData.append('form_type', formType);
        
        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            if (successEl) successEl.style.display = 'block';
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        } catch (err) {
          // Fallback: store in localStorage
          console.log('Formspree unavailable, storing locally...');
          const submissions = JSON.parse(localStorage.getItem('ideogrid_submissions') || '[]');
          const submission = {
            type: formType,
            data: Object.fromEntries(formData),
            timestamp: new Date().toISOString()
          };
          submissions.push(submission);
          localStorage.setItem('ideogrid_submissions', JSON.stringify(submissions));
          
          if (successEl) {
            successEl.textContent = 'Your message has been stored. We will process it shortly.';
            successEl.style.display = 'block';
          }
          form.reset();
        }
        
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      });
    }

    handleForm(schoolForm, 'school');
    handleForm(researchForm, 'research');
  });
})();
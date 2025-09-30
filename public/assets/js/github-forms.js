// github-forms.js - Handle form submissions via GitHub Issues API
class GitHubFormHandler {
  constructor(config) {
    this.repoOwner = config.repoOwner;
    this.repoName = config.repoName;
    this.apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/issues`;
  }

  async submitForm(formType, formData) {
    try {
      const issueData = this.formatIssueData(formType, formData);
      
      // Get GitHub token from config (for local testing) FIXME:
      const token = window.__ACM_CONFIG__?.github?.token;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      };
      
      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        issueNumber: result.number,
        issueUrl: result.html_url
      };
    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  formatIssueData(formType, formData) {
    const timestamp = new Date().toISOString();
    
    const typeConfig = {
      contact: {
        title: `[CONTACT] Message from ${formData.name}`,
        labels: ['form-submission', 'contact'],
        template: `
**Form Type:** contact
**Name:** ${formData.name}
**Email:** ${formData.email}
**Message:** 
${formData.message}
**Submitted At:** ${timestamp}
        `.trim()
      },
      
      'print': {
        title: `[3D PRINT] Request from ${formData.name}`,
        labels: ['form-submission', '3d-print'],
        template: `
**Form Type:** 3d_print
**Name:** ${formData.name}
**Email:** ${formData.email}
**Material:** ${formData.material}
**Google Drive Link:** ${formData.drive_link}
**Notes:** 
${formData.notes || 'None'}
**Submitted At:** ${timestamp}
        `.trim()
      },
      
      'laptop': {
        title: `[LAPTOP] Request from ${formData.name}`,
        labels: ['form-submission', 'laptop-borrow'],
        template: `
**Form Type:** laptop_borrow
**Name:** ${formData.name}
**Email:** ${formData.email}
**Intended Use Period:** ${formData.dates}
**Purpose:** 
${formData.purpose}
**Agreement:** ${formData.agreement ? 'Agreed' : 'Not agreed'}
**Submitted At:** ${timestamp}
        `.trim()
      }
    };

    const config = typeConfig[formType];
    if (!config) {
      throw new Error(`Unknown form type: ${formType}`);
    }

    return {
      title: config.title,
      body: config.template,
      labels: config.labels
    };
  }
}

// Form submission handlers for each form
async function handleGitHubForm(form, formType, statusElementId) {
  const statusElement = document.getElementById(statusElementId);
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Show loading state
  statusElement.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    // Extract form data
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Handle checkbox for agreement
    if (formType === 'laptop') {
      data.agreement = form.querySelector('input[name="agreement"]').checked;
    }

    // Initialize GitHub handler using config from index.html
    const config = window.__ACM_CONFIG__?.github;
    if (!config) {
      throw new Error('GitHub configuration not found. Check __ACM_CONFIG__ in index.html');
    }
    
    const githubHandler = new GitHubFormHandler({
      repoOwner: config.repoOwner,
      repoName: config.repoName
    });

    // Submit to GitHub
    const result = await githubHandler.submitForm(formType, data);

    if (result.success) {
      statusElement.innerHTML = `
        ✅ Thanks! Your submission has been received. 
        <a href="${result.issueUrl}" target="_blank" rel="noopener">Track your request</a>
      `;
      form.reset();
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        const modal = form.closest('.modal');
        if (modal) {
          modal.setAttribute('aria-hidden', 'true');
        }
      }, 3000);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    statusElement.textContent = `❌ Error: ${error.message}. Please try again or contact us directly.`;
  } finally {
    submitBtn.disabled = false;
  }
}

// Initialize form handlers when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGitHubForm(contactForm, 'contact', 'contactStatus');
    });
  }

  // 3D Print form
  const printForm = document.getElementById('printForm');
  if (printForm) {
    printForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGitHubForm(printForm, 'print', 'printStatus');
    });
  }

  // Laptop borrow form
  const laptopForm = document.getElementById('laptopForm');
  if (laptopForm) {
    laptopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGitHubForm(laptopForm, 'laptop', 'laptopStatus');
    });
  }
});
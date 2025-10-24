// _scripts/replace-search.js

function initializeCustomSearch() {
  // --- 1. Define the resources for your custom search ---
  const cssUrls = [
    'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev/nlweb-dropdown-chat.css',
    'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev/common-chat-styles.css'
  ];
  const moduleUrl = 'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev/nlweb-dropdown-chat.js';

  // --- 2. Dynamically add the required CSS to the document's head ---
  cssUrls.forEach(url => {
    // Avoid adding duplicate stylesheets on client-side navigation
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  });

  // --- 3. Find and replace the default search bar ---
  // The selector targets the form Mintlify uses for its search bar in the header.
  const originalSearchForm = document.querySelector('header form[role="search"]');

  if (originalSearchForm && originalSearchForm.parentElement) {
    // Hide the original search bar
    originalSearchForm.style.display = 'none';
    const parentContainer = originalSearchForm.parentElement;

    // --- 4. Create and inject your custom search container ---
    // Check if our container already exists to avoid duplicates on re-renders
    if (!document.getElementById('docs-search-container')) {
      const newSearchContainer = document.createElement('div');
      newSearchContainer.id = 'docs-search-container';
      // Place the new container right before the old (now hidden) search form
      parentContainer.insertBefore(newSearchContainer, originalSearchForm);

      // --- 5. Load and initialize the JavaScript module for the search component ---
      const script = document.createElement('script');
      script.type = 'module';
      script.textContent = `
        try {
          import { NLWebDropdownChat } from '${moduleUrl}';

          // Initialize the custom search on the container we just created
          new NLWebDropdownChat({
            containerId: 'docs-search-container',
            site: 'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev',
            placeholder: 'Search for docs...',
            endpoint: 'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev'
          });
        } catch (error) {
          console.error('Failed to initialize custom search component:', error);
        }
      `;
      document.body.appendChild(script);
    }
  } else {
    console.warn('Mintlify default search bar not found. Custom search cannot be loaded.');
  }
}

// --- Run the script after the initial page load ---
// We add a small delay to ensure all of Mintlify's elements are rendered.
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeCustomSearch, 500);
});
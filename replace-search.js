// content/custom-search.js

// Use a self-invoking function to avoid polluting the global scope
(function() {
  // We only want this script to run in the browser, not during server-side builds.
  if (typeof window === 'undefined') {
    return;
  }

  // This function will set everything up.
  function initializeCustomSearch() {
    // --- 1. Define resources ---
    const cssUrls = [
      'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev/nlweb-dropdown-chat.css',
      'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev/common-chat-styles.css'
    ];
    const moduleUrl = 'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev/nlweb-dropdown-chat.js';
    
    // This will hold the instance of our chat component once it's loaded.
    let chatInstance = null;

    // --- 2. Load CSS files ---
    cssUrls.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // --- 3. Replace the original search bar ---
    const originalSearchForm = document.querySelector('header form[role="search"]');
    if (!originalSearchForm || !originalSearchForm.parentElement) {
      console.warn("Mintlify's default search bar was not found.");
      return;
    }

    // Hide the original search form
    originalSearchForm.style.display = 'none';
    const parentContainer = originalSearchForm.parentElement;

    // Create the placeholder for our custom search, but only if it's not already there.
    if (!document.getElementById('docs-search-container')) {
      const newSearchContainer = document.createElement('div');
      newSearchContainer.id = 'docs-search-container';
      parentContainer.insertBefore(newSearchContainer, originalSearchForm);

      // --- 4. Dynamically import and initialize the module ---
      // We do this once and store the instance.
      import(moduleUrl)
        .then(({ NLWebDropdownChat }) => {
          chatInstance = new NLWebDropdownChat({
            containerId: 'docs-search-container',
            site: 'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev',
            placeholder: 'Search for docs...',
            endpoint: 'https://ai-docs-vcf-nlweb.code-99-studios.workers.dev'
          });
        })
        .catch(error => {
          console.error('Failed to load or initialize custom search component:', error);
        });
    }

    // --- 5. Listen for the '/' keypress to trigger the search ---
    document.addEventListener('keydown', (event) => {
      // We check if the user is typing in an input field already.
      const isTyping = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';

      if (event.key === '/' && !isTyping) {
        // Prevent the default action (typing '/' in the browser).
        event.preventDefault();

        // If the chat component has been initialized, find its input and focus it.
        if (chatInstance) {
          const searchInput = document.querySelector('#docs-search-container input');
          if (searchInput) {
            searchInput.focus(); // Focusing the input will likely trigger the dropdown to open.
          }
        }
      }
    });
  }

  // Run our setup function after the page has fully loaded.
  // This ensures all of Mintlify's elements are on the page.
  document.addEventListener('DOMContentLoaded', initializeCustomSearch);

})();
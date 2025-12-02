document.addEventListener('DOMContentLoaded', function() {
    const loadComponent = (url, placeholderId) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                    // Find and execute any scripts within the loaded component
                    Array.from(placeholder.querySelectorAll("script")).forEach(oldScript => {
                        const newScript = document.createElement("script");
                        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                }
            })
            .catch(error => console.error(`Error loading component for ${placeholderId}:`, error));
    };

    // Chain the loading to ensure order if necessary, though here they can be parallel
    const headerPromise = loadComponent('header.html', 'header-placeholder');
    const footerPromise = loadComponent('footer.html', 'footer-placeholder');

    // Função para carregar um script dinamicamente
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script load error for ${src}`));
            document.body.appendChild(script);
        });
    };

    // After all components are loaded, you can initialize other scripts
    // that might depend on the new DOM elements.
    Promise.all([headerPromise, footerPromise]).then(() => {
        console.log('Header and Footer components loaded successfully.');
        // Carrega o script do chatbot APÓS o footer ter sido carregado
        loadScript('chatbot.js').then(() => console.log('Chatbot script loaded successfully.'));
    });
});
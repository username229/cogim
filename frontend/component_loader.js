// component_loader_refatorado.js
// Loader profissional para header/footer SEM redisparar DOMContentLoaded

(function () {
  "use strict";

  // ==============================
  // Utilitário para carregar HTML
  // ==============================
  async function loadComponent(url, placeholderId) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
    }
    const html = await res.text();

    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    placeholder.innerHTML = html;

    // Executa scripts embutidos no HTML carregado
    const scripts = Array.from(placeholder.querySelectorAll("script"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      // Copia atributos (src, type, etc.)
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      // Copia conteúdo inline
      if (!oldScript.src) {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
      // Aguarda scripts externos carregarem
      if (newScript.src) {
        await new Promise((resolve, reject) => {
          newScript.onload = resolve;
          newScript.onerror = () => reject(new Error(`Script load error: ${newScript.src}`));
        });
      }
    }
  }

  // ==============================
  // Utilitário para carregar JS
  // ==============================
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Evita carregar duas vezes
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Script load error for ${src}`));
      document.body.appendChild(s);
    });
  }

  // ==============================
  // Inicialização principal
  // ==============================
  async function init() {
    try {
      const headerPromise = loadComponent("header.html", "header-placeholder");
      const footerPromise = loadComponent("footer.html", "footer-placeholder");

      await Promise.all([headerPromise, footerPromise]);

      // Evento CUSTOMIZADO (correto)
      document.dispatchEvent(new Event("componentsLoaded"));

      // Scripts que dependem do footer/header
      await loadScript("chatbot.js");

      // Chamada direta de inicializadores, se existirem
      if (typeof window.initMenu === "function") window.initMenu();
      if (typeof window.initTranslations === "function") window.initTranslations();
      if (typeof window.initChatbot === "function") window.initChatbot();

      console.log("✅ Header, Footer e scripts inicializados com sucesso.");
    } catch (err) {
      console.error("❌ Erro ao inicializar componentes:", err);
    }
  }

  // Executa quando o DOM estiver pronto (uma única vez)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

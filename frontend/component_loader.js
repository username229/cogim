// component_loader_refatorado.js
// Loader profissional para header/footer
// ✅ Sem redisparar DOMContentLoaded
// ✅ Com evento customizado seguro
// ✅ Compatível com HTML e JS dinâmicos

(function () {
  "use strict";

  // ==============================
  // Carregar componente HTML
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

    // Executa scripts dentro do HTML carregado
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

      // Aguarda scripts externos
      if (newScript.src) {
        await new Promise((resolve, reject) => {
          newScript.onload = resolve;
          newScript.onerror = () =>
            reject(new Error(`Script load error: ${newScript.src}`));
        });
      }
    }
  }

  // ==============================
  // Carregar JS externo (1x)
  // ==============================
  function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error(`Script load error for ${src}`));
      document.body.appendChild(script);
    });
  }

  // ==============================
  // Inicialização principal
  // ==============================
  async function init() {
    try {
      // 1️⃣ Carrega header e footer
      await Promise.all([
        loadComponent("header.html", "header-placeholder"),
        loadComponent("footer.html", "footer-placeholder")
      ]);

      // 2️⃣ Carrega scripts dependentes
      await loadScript("chatbot.js");

      // 3️⃣ Inicializadores opcionais
      if (typeof window.initMenu === "function") window.initMenu();
      if (typeof window.initTranslations === "function") window.initTranslations();
      if (typeof window.initChatbot === "function") window.initChatbot();

      // 4️⃣ Flag global + evento FINAL
      window.__componentsReady = true;
      document.dispatchEvent(new Event("componentsLoaded"));

      console.log("✅ Header, footer e scripts carregados com sucesso.");
    } catch (err) {
      console.error("❌ Erro ao inicializar componentes:", err);
    }
  }

  // ==============================
  // Executa no momento certo
  // ==============================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

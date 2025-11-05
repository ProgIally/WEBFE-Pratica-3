/* js/main.js
   SPA via fetch + template extraction + validação de formulários
   Mantém cache dos templates e manipula history (pushState / popstate).
*/

(function () {
  "use strict";

  // --- Config / cache ---
  var cache = {}; // cache dos templates (página => {title, mainHtml})
  var navbar = null;
  var menuToggle = null;

  // --- Helpers ---
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  function fetchPage(url) {
    // usa cache quando disponível
    if (cache[url]) return Promise.resolve(cache[url]);

    return fetch(url, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("Falha ao carregar: " + url);
        return res.text();
      })
      .then(function (text) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "text/html");
        var title = (doc.querySelector("title") || {}).textContent || "";
        var main = doc.querySelector("#main");
        var mainHtml = main ? main.innerHTML : "";
        var result = { title: title, mainHtml: mainHtml, raw: text };
        cache[url] = result;
        return result;
      });
  }

  function setActiveNav(href) {
    $all(".nav-links a").forEach(function (a) {
      if (a.getAttribute("href") === href) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }

  function setMainContent(html) {
    var main = document.getElementById("main");
    if (!main) return;
    main.innerHTML = html;
    // after replacing content, run page init
    initPage();
    // ensure skip-link focus target exists
    var skip = document.querySelector(".skip-link");
    if (skip) skip.setAttribute("href", "#main");
  }

  // --- SPA load ---
  function loadPage(href, addToHistory) {
    addToHistory = addToHistory !== false;
    fetchPage(href)
      .then(function (data) {
        document.title = data.title || document.title;
        setMainContent(data.mainHtml);
        setActiveNav(href);
        if (addToHistory) {
          history.pushState({ url: href }, "", href);
        }
        window.scrollTo(0, 0);
        closeNavbarIfMobile();
      })
      .catch(function (err) {
        showToast("Erro ao carregar a página.");
        console.error(err);
      });
  }

  // --- Menu mobile ---
  function initMenu() {
    navbar = document.getElementById("navbar");
    menuToggle = document.getElementById("menu-toggle");

    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        if (!navbar) return;
        var open = navbar.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // fechar ao redimensionar >= 1024
    function adaptNav() {
      if (!navbar) return;
      if (window.innerWidth >= 1024) {
        navbar.classList.remove("open");
        navbar.style.display = "block";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      } else {
        navbar.style.display = "";
      }
    }
    adaptNav();
    window.addEventListener("resize", adaptNav);

    // fechar menu ao clicar em link (mobile)
    document.addEventListener("click", function (e) {
      var el = e.target;
      if (el.tagName === "A" && el.closest(".nav-links")) {
        if (window.innerWidth < 1024) {
          closeNavbarIfMobile();
        }
      }
    });
  }

  function closeNavbarIfMobile() {
    if (
      window.innerWidth < 1024 &&
      navbar &&
      navbar.classList.contains("open")
    ) {
      navbar.classList.remove("open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  // --- Toasts / Modal (utilitários) ---
  function showToast(msg, time) {
    time = time || 2500;
    var t = document.getElementById("site-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "site-toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () {
      t.classList.remove("show");
    }, time);
  }

  function initModal() {
    document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mb = document.getElementById("modal-backdrop");
        if (mb) mb.classList.remove("show");
      });
    });
    var mb = document.getElementById("modal-backdrop");
    if (mb) {
      mb.addEventListener("click", function (e) {
        if (e.target === mb) mb.classList.remove("show");
      });
    }
  }

  // --- Form validation (mensagens inline) ---
  function clearFieldError(field) {
    field.classList.remove("invalid");
    var msg =
      field.parentNode && field.parentNode.querySelector(".field-error");
    if (msg) msg.remove();
  }

  function setFieldError(field, message) {
    clearFieldError(field);
    field.classList.add("invalid");
    var span = document.createElement("div");
    span.className = "field-error";
    span.textContent = message;
    // insert after the field
    if (field.nextSibling)
      field.parentNode.insertBefore(span, field.nextSibling);
    else field.parentNode.appendChild(span);
  }

  function validateField(field) {
    clearFieldError(field);
    var v = field.validity;
    if (!v) return true;
    if (v.valid) return true;

    // mensagens amigáveis por tipo
    if (v.valueMissing) return setFieldError(field, "Campo obrigatório.");
    if (v.typeMismatch) {
      if (field.type === "email")
        return setFieldError(field, "Digite um e-mail válido.");
    }
    if (v.patternMismatch)
      return setFieldError(
        field,
        field.getAttribute("title") || "Formato inválido."
      );
    if (v.tooLong) return setFieldError(field, "Muito longo.");
    return setFieldError(field, "Campo inválido.");
  }

  function initFormValidation() {
    // adiciona listeners a todos os forms atuais no DOM
    document.querySelectorAll("form").forEach(function (form) {
      // limpa mensagens prévias
      form.querySelectorAll(".field-error").forEach(function (n) {
        n.remove();
      });
      form.querySelectorAll(".invalid").forEach(function (n) {
        n.classList.remove("invalid");
      });

      // validação ao mudar/blur
      form
        .querySelectorAll("input, textarea, select")
        .forEach(function (field) {
          field.addEventListener("input", function () {
            // remove mensagens enquanto usuário digita
            if (field.classList.contains("invalid")) validateField(field);
          });
          field.addEventListener("blur", function () {
            validateField(field);
          });
        });

      // submit custom
      form.addEventListener("submit", function (e) {
        var invalid = form.querySelector(":invalid");
        if (invalid) {
          e.preventDefault();
          // mostra mensagens para todos os campos inválidos
          form
            .querySelectorAll("input, textarea, select")
            .forEach(function (f) {
              if (!f.checkValidity()) validateField(f);
            });
          // foca primeiro inválido
          var first = form.querySelector(":invalid");
          if (first) first.focus();
          showToast("Por favor corrija os campos destacados.");
          return;
        }

        // simula envio e mostra modal/toast
        e.preventDefault();
        showToast("Formulário enviado. Obrigado!");
        var modal = document.getElementById("modal-backdrop");
        if (modal) modal.classList.add("show");
        // opcional: armazenar no localStorage
        try {
          var data = new FormData(form);
          var obj = {};
          data.forEach(function (v, k) {
            obj[k] = v;
          });
          // exemplo simples de armazenamento (nome do form -> array)
          var storeKey = "sci_form_submissions";
          var arr = JSON.parse(localStorage.getItem(storeKey) || "[]");
          arr.push({ at: new Date().toISOString(), data: obj });
          localStorage.setItem(storeKey, JSON.stringify(arr));
        } catch (err) {
          // se falhar, não atrapalha
          console.warn("Não foi possível salvar no localStorage.", err);
        }
      });
    });
  }

  // --- Init after content swapped ---
  function initPage() {
    // imagens não arrastáveis
    document.querySelectorAll("img").forEach(function (i) {
      i.setAttribute("draggable", "false");
    });

    // set up modal and toasts
    initModal();

    // set up form validation for any forms in the newly loaded content
    initFormValidation();

    // ensure internal links that are anchors to other pages inside .nav-links are intercepted
    setupNavInterception();
  }

  // --- Intercept nav links so SPA handles them ---
  function setupNavInterception() {
    $all(".nav-links a").forEach(function (a) {
      // remove existing listener duplicates by cloning node
      var clone = a.cloneNode(true);
      a.parentNode.replaceChild(clone, a);
      clone.addEventListener("click", function (e) {
        var href = clone.getAttribute("href");
        // se link interno (arquivo html) fazemos SPA
        if (href && href.endsWith(".html")) {
          e.preventDefault();
          if (
            location.pathname.endsWith(href) ||
            location.pathname === "/" + href
          ) {
            // já estamos nessa rota: só scroll e fechar menu
            closeNavbarIfMobile();
            return;
          }
          loadPage(href, true);
        }
      });
    });
  }

  // --- popstate (back/forward) ---
  window.addEventListener("popstate", function (e) {
    var url =
      (e.state && e.state.url) ||
      location.pathname.split("/").pop() ||
      "index.html";
    // se veio sem estado, tenta carregar a url atual
    loadPage(url, false);
  });

  // --- Bootstrapping: primário ao carregar a primeira página ---
  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    setupNavInterception();
    initModal();
    initPage(); // inicializa validações e modal no conteúdo atual

    // interceptar cliques em links dentro do main (por exemplo btns que apontam para .html)
    document.getElementById("main").addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href");
      if (href && href.endsWith(".html")) {
        // navegacao interna -> SPA
        e.preventDefault();
        loadPage(href, true);
      }
    });
  });
})();

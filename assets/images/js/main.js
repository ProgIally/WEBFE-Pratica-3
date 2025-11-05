(function () {
  "use strict";

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }
  function createEl(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs)
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") el.textContent = attrs[k];
        else el.setAttribute(k, attrs[k]);
      });
    return el;
  }

  var templates = {
    home: function () {
      return `
      <section class="hero" aria-labelledby="intro">
        <div class="hero-content">
          <h1 id="intro">Salve Corações Inundados</h1>
          <p class="lead">Apoiamos famílias e comunidades afetadas por desabamentos e inundações — com abrigo, mantimentos e acolhimento.</p>
          <p class="cta">
            <a class="btn btn-primary" href="#cadastro" data-route>Doar / Ajudar</a>
            <a class="btn btn-outline" href="#projetos" data-route>Ver Projetos</a>
          </p>
        </div>
        <figure class="hero-figure" aria-hidden="true">
          <img src="assets/images/hero.png" alt="Equipe ajudando comunidade após inundação" class="hero-image" loading="lazy" draggable="false" />
        </figure>
      </section>

      <section class="space-top" aria-labelledby="missao">
        <h2 id="missao">Nossa missão</h2>
        <p>Salvar vidas e reconstruir esperança oferecendo suporte emergencial, abrigo temporário e apoio contínuo às comunidades afetadas.</p>
      </section>

      <section class="space-top" aria-labelledby="contato">
        <h2 id="contato">Contato</h2>
        <address>
          <p>Email: <a href="mailto:SCI@gmail.com">SCI@gmail.com</a></p>
          <p>Telefone: <a href="tel:+551140028922">(11) 4002-8922</a></p>
          <p>Redes: <a href="#" aria-label="Facebook">Facebook</a> · <a href="#" aria-label="Instagram">Instagram</a></p>
        </address>
      </section>
      `;
    },

    projetos: function () {
      return `
      <h1>Projetos</h1>
      <div class="grid projects-grid" aria-live="polite">
        <article class="card project-card">
          <img src="assets/images/projeto-exemplo.jpg" alt="Abrigo emergencial montado" class="card-image" loading="lazy" draggable="false"/>
          <div class="card-body">
            <p class="meta">Projeto em execução</p>
            <h3>Ação: Abrigo Emergencial</h3>
            <p>Instalação de abrigos temporários e distribuição de kits de primeiros socorros e higiene.</p>
            <div class="card-footer">
              <span class="badge">Abrigo</span>
              <div class="card-actions">
                <a class="btn btn-primary" href="#cadastro" data-route>Ajudar</a>
                <button class="btn btn-outline btn-more" data-project="abrigo">Mais</button>
              </div>
            </div>
          </div>
        </article>

        <article class="card project-card">
          <img src="assets/images/voluntarios.jpg" alt="Voluntários" class="card-image" loading="lazy" draggable="false"/>
          <div class="card-body">
            <p class="meta">Parceria local</p>
            <h3>Ação: Apoio às Comunidades Indígenas</h3>
            <p>Projetos de apoio cultural e reconstrução com participação das lideranças locais.</p>
            <div class="card-footer">
              <span class="badge">Cultura</span>
              <div class="card-actions">
                <a class="btn btn-primary" href="#cadastro" data-route>Voluntariar</a>
                <button class="btn btn-outline btn-more" data-project="cultura">Detalhes</button>
              </div>
            </div>
          </div>
        </article>
      </div>
      `;
    },

    cadastro: function () {
      return `
      <h1>Doar / Cadastrar</h1>
      <section aria-labelledby="formsec">
        <h2 id="formsec">Formulário de Doação / Apoio</h2>

        <form id="form-doacao" class="form-card" novalidate>
          <fieldset>
            <legend>Dados Pessoais</legend>
            <label for="nome">Nome completo</label>
            <input id="nome" name="nome" type="text" required maxlength="100" />

            <div class="field-error" data-error-for="nome" aria-live="polite"></div>

            <label for="email">E-mail</label>
            <input id="email" name="email" type="email" required />

            <div class="field-error" data-error-for="email" aria-live="polite"></div>

            <label for="cpf">CPF</label>
            <input id="cpf" name="cpf" type="text" inputmode="numeric" placeholder="000.000.000-00" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" title="Formato: 000.000.000-00" required />

            <div class="field-error" data-error-for="cpf" aria-live="polite"></div>

            <label for="telefone">Telefone</label>
            <input id="telefone" name="telefone" type="tel" inputmode="tel" placeholder="(00) 90000-0000" pattern="\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}" title="Formato: (00) 90000-0000" required />

            <div class="field-error" data-error-for="telefone" aria-live="polite"></div>

            <label for="nascimento">Data de nascimento</label>
            <input id="nascimento" name="nascimento" type="date" required />

            <div class="field-error" data-error-for="nascimento" aria-live="polite"></div>
          </fieldset>

          <fieldset>
            <legend>Endereço</legend>
            <label for="endereco">Endereço</label>
            <input id="endereco" name="endereco" type="text" required />

            <div class="field-error" data-error-for="endereco" aria-live="polite"></div>

            <label for="cep">CEP</label>
            <input id="cep" name="cep" type="text" inputmode="numeric" placeholder="00000-000" pattern="\\d{5}-\\d{3}" title="Formato: 00000-000" required />

            <div class="field-error" data-error-for="cep" aria-live="polite"></div>

            <div class="row two-cols">
              <div>
                <label for="cidade">Cidade</label>
                <input id="cidade" name="cidade" type="text" required />
                <div class="field-error" data-error-for="cidade" aria-live="polite"></div>
              </div>

              <div>
                <label for="estado">Estado</label>
                <input id="estado" name="estado" type="text" maxlength="2" placeholder="SP" required />
                <div class="field-error" data-error-for="estado" aria-live="polite"></div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Preferência</legend>
            <p>Quem está se cadastrando:</p>
            <label class="radio-inline"><input type="radio" name="perfil" value="doador" checked /> Doador</label>
            <label class="radio-inline"><input type="radio" name="perfil" value="voluntario" /> Voluntário</label>
          </fieldset>

          <p class="form-actions">
            <button type="submit" class="btn btn-primary">Enviar</button>
            <button type="reset" class="btn btn-outline">Limpar</button>
          </p>
        </form>
      </section>
      `;
    },

    notFound: function () {
      return `
      <h1>Não encontrado</h1>
      <p>Página não existe. Volte para <a href="#home" data-route>Início</a>.</p>
      `;
    },
  };

  var Router = (function () {
    var routes = {
      "": "home",
      "#": "home",
      "#home": "home",
      "#projetos": "projetos",
      "#cadastro": "cadastro",
    };

    function getRouteFromHash(hash) {
      return routes[hash] || null;
    }

    function navigateTo(routeName, replaceHistory) {
      var main = qs("#main-content");
      if (!main) return;

      var html = templates[routeName]
        ? templates[routeName]()
        : templates.notFound();
      main.innerHTML = html;

      postRender(routeName);

      main.focus();

      qsa(".nav-link").forEach(function (a) {
        var href = a.getAttribute("href") || "";
        a.classList.toggle("active", href === (location.hash || "#home"));
      });

      if (!replaceHistory) {
      }
    }

    function onHashChange() {
      var r = getRouteFromHash(location.hash);
      if (!r) r = "home";
      navigateTo(r);
    }

    function init() {
      window.addEventListener("hashchange", onHashChange);
      if (!location.hash) location.hash = "#home";
      onHashChange();

      document.body.addEventListener("click", function (e) {
        var a = e.target.closest("a[data-route]");
        if (!a) return;
        var href = a.getAttribute("href") || "#home";
        if (href.indexOf("#") === 0) {
          e.preventDefault();
          location.hash = href;
        }
      });
    }

    return { init: init, navigateTo: navigateTo };
  })();

  var Forms = (function () {
    var storageKey = "sci_submissions";

    function showFieldError(field, message) {
      field.classList.add("invalid");
      var el = document.querySelector('[data-error-for="' + field.id + '"]');
      if (el) el.textContent = message;
    }

    function clearFieldError(field) {
      field.classList.remove("invalid");
      var el = document.querySelector('[data-error-for="' + field.id + '"]');
      if (el) el.textContent = "";
    }

    function validateField(field) {
      if (!field.checkValidity()) {
        if (field.validity.valueMissing) return "Campo obrigatório.";
        if (field.validity.typeMismatch) return "Formato inválido.";
        if (field.validity.patternMismatch) return "Formato inválido.";
        if (field.validity.tooLong) return "Texto muito longo.";
        return "Campo inválido.";
      }

      if (field.id === "cpf") {
        var cpfClean = field.value.replace(/\D/g, "");
        if (cpfClean.length !== 11) return "CPF inválido (11 dígitos).";
      }
      return "";
    }

    function validateForm(form) {
      var fields = Array.from(
        form.querySelectorAll(
          "input[required], textarea[required], select[required]"
        )
      );
      var hasError = false;
      fields.forEach(function (f) {
        var msg = validateField(f);
        if (msg) {
          showFieldError(f, msg);
          if (!hasError) f.focus();
          hasError = true;
        } else {
          clearFieldError(f);
        }
      });
      return !hasError;
    }

    function saveSubmission(data) {
      var arr = [];
      try {
        arr = JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch (err) {
        arr = [];
      }
      arr.unshift({ data: data, createdAt: new Date().toISOString() });
      localStorage.setItem(storageKey, JSON.stringify(arr.slice(0, 50))); // keep last 50
    }

    function attachFormHandlers() {
      var form = qs("#form-doacao");
      if (!form) return;

      qsa("#form-doacao input").forEach(function (inp) {
        inp.addEventListener("input", function () {
          clearFieldError(inp);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!validateForm(form)) {
          showToast("Por favor corrija os campos destacados.");
          return;
        }

        var fd = new FormData(form);
        var obj = {};
        fd.forEach(function (v, k) {
          obj[k] = v;
        });

        saveSubmission(obj);

        showToast("Formulário enviado. Obrigado!");

        var modal = document.getElementById("modal-backdrop");
        if (modal) modal.classList.add("show");

        form.reset();
      });
    }

    return {
      attachFormHandlers: attachFormHandlers,
    };
  })();

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

  function attachGlobalUI() {
    document.body.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-modal-close]");
      if (btn) {
        var mb = document.getElementById("modal-backdrop");
        if (mb) mb.classList.remove("show");
      }
    });

    var mb = document.getElementById("modal-backdrop");
    if (mb)
      mb.addEventListener("click", function (ev) {
        if (ev.target === mb) mb.classList.remove("show");
      });

    qsa("img").forEach(function (i) {
      i.setAttribute("draggable", "false");
    });

    var menuToggle = document.getElementById("menu-toggle");
    var navbar = document.getElementById("navbar");
    function toggleMenu() {
      var open = navbar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (menuToggle) menuToggle.addEventListener("click", toggleMenu);

    document.body.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-route]");
      if (a && navbar && navbar.classList.contains("open")) {
        navbar.classList.remove("open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function postRender(routeName) {
    qsa(".btn-more").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var projectKey = btn.getAttribute("data-project");
        var modal = document.getElementById("modal-backdrop");
        var title = "Detalhes do Projeto";
        var text = "Informações adicionais sobre o projeto.";
        if (projectKey === "abrigo") {
          title = "Abrigo Emergencial";
          text =
            "Montamos abrigos temporários e distribuímos kits de higiene e primeiros socorros para as famílias afetadas.";
        } else if (projectKey === "cultura") {
          title = "Apoio Cultural";
          text =
            "Trabalhamos com lideranças locais para reconstrução cultural e suporte comunitário.";
        }
        if (modal) {
          var t = modal.querySelector("#modal-title");
          var txt = modal.querySelector("#modal-text");
          if (t) t.textContent = title;
          if (txt) txt.textContent = text;
          modal.classList.add("show");
        }
      });
    });

    if (routeName === "cadastro") {
      Forms.attachFormHandlers();
    }

    qsa("img").forEach(function (i) {
      i.setAttribute("draggable", "false");
    });
  }

  function init() {
    attachGlobalUI();
    Router.init();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

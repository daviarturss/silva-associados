/* ==========================================================================
   Silva & Associados Advogados — main.js
   JavaScript vanilla, sem dependências.
   --------------------------------------------------------------------------
   Recursos:
   - Header com estado ao rolar + scrollspy
   - Menu mobile acessível (foco, ESC, travamento de scroll)
   - Animações de entrada com IntersectionObserver
   - Carrossel de depoimentos (botões, teclado, dots e swipe)
   - Máscara de telefone
   - Validação e envio do formulário (com fallback demonstrativo)
   - Ano automático no rodapé
   ========================================================================== */
(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;

  /* ------------------------------------------------------------------------
     Header: altura dinâmica, sombra ao rolar e scrollspy
     ------------------------------------------------------------------------ */
  const header = $("[data-header]");
  const nav = $("#primary-nav");
  const navToggle = $("[data-nav-toggle]");
  const navLabel = $("[data-nav-label]");
  const navLinks = $$(".nav__link");
  const pageSections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.getElementById(id.slice(1)) : null;
    })
    .filter(Boolean);

  let scrollTicking = false;

  function syncHeaderHeight() {
    if (!header) return;
    const height = header.offsetHeight;
    if (height) {
      document.documentElement.style.setProperty("--header-h", `${height}px`);
    }
  }

  function updateHeaderState() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }
    scrollTicking = false;
  }

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateHeaderState);
  }

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (header) {
    syncHeaderHeight();
    updateHeaderState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncHeaderHeight, { passive: true });

    if ("ResizeObserver" in window) {
      new ResizeObserver(syncHeaderHeight).observe(header);
    }

    if (hasIO) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveLink(entry.target.id);
          });
        },
        { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
      );

      pageSections.forEach((section) => spy.observe(section));
    }
  }

  /* ------------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------------ */
  let menuOpen = false;

  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setMenu(open, { moveFocus = false, returnFocus = false } = {}) {
    if (!nav || !navToggle) return;
    menuOpen = open;

    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);

    if (navLabel) {
      navLabel.textContent = open ? "Fechar menu" : "Abrir menu";
    }

    if (open && moveFocus) {
      const firstLink = $(".nav__link", nav);
      if (firstLink) {
        // Aguarda o painel ficar visível e pintado antes de mover o foco.
        window.setTimeout(() => {
          if (menuOpen) firstLink.focus({ preventScroll: true });
        }, 180);
      }
    }

    if (!open && returnFocus) {
      navToggle.focus();
    }
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", (event) => {
      const willOpen = !menuOpen;
      setMenu(willOpen, { moveFocus: willOpen && event.detail === 0 });
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("click", (event) => {
      if (!menuOpen) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (!menuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setMenu(false, { returnFocus: true });
        return;
      }

      if (event.key === "Tab" && header) {
        const focusables = $$(focusableSelector, header).filter(
          (element) => element.getClientRects().length > 0
        );

        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (menuOpen && window.innerWidth > 900) {
        setMenu(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Animações de entrada
     ------------------------------------------------------------------------ */
  const revealElements = $$(".reveal");

  if (!hasIO || prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* ------------------------------------------------------------------------
     Carrossel de depoimentos
     ------------------------------------------------------------------------ */
  function initCarousel(root) {
    const track = $("[data-carousel-track]", root);
    const slides = track ? Array.from(track.children) : [];
    const previousButton = $("[data-carousel-prev]", root);
    const nextButton = $("[data-carousel-next]", root);
    const dots = $$("[data-slide-to]", root);
    const status = $("[data-carousel-status]", root);
    const viewport = $("[data-carousel-viewport]", root);

    if (!track || slides.length < 2) return;

    let currentIndex = 0;

    function render(announce) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.setAttribute("aria-hidden", String(!isActive));

        if (isActive) {
          slide.removeAttribute("inert");
        } else {
          slide.setAttribute("inert", "");
        }
      });

      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle("is-active", isActive);
        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });

      if (announce && status) {
        status.textContent = `Depoimento ${currentIndex + 1} de ${slides.length}`;
      }
    }

    function goTo(index, announce = true) {
      currentIndex = (index + slides.length) % slides.length;
      render(announce);
    }

    if (previousButton) {
      previousButton.addEventListener("click", () => goTo(currentIndex - 1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => goTo(currentIndex + 1));
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const target = Number(dot.dataset.slideTo);
        if (Number.isInteger(target)) goTo(target);
      });
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex + 1);
      }
    });

    if (viewport) {
      let startX = 0;
      let startY = 0;
      let pointerActive = false;

      viewport.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        startX = event.clientX;
        startY = event.clientY;
        pointerActive = true;
      });

      viewport.addEventListener("pointerup", (event) => {
        if (!pointerActive) return;
        pointerActive = false;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
        goTo(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
      });

      viewport.addEventListener("pointercancel", () => {
        pointerActive = false;
      });
    }

    render(false);
  }

  $$("[data-carousel]").forEach(initCarousel);

  /* ------------------------------------------------------------------------
     Formulário: máscara, validação e envio
     ------------------------------------------------------------------------ */
  const form = $("[data-form]");

  if (form) {
    const submitButton = $("[data-form-submit]", form);
    const submitLabel = $("[data-submit-label]", form);
    const formSuccess = $("[data-form-success]");
    const formError = $("[data-form-error]", form);
    const resetButton = $("[data-form-reset]");
    const phoneInput = $("#telefone", form);
    const originalSubmitLabel = submitLabel ? submitLabel.textContent : "Enviar mensagem";

    function onlyDigits(value) {
      return value.replace(/\D/g, "");
    }

    function formatPhone(value) {
      const digits = onlyDigits(value).slice(0, 11);

      if (!digits) return "";
      if (digits.length <= 2) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      }
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        phoneInput.value = formatPhone(phoneInput.value);
      });
    }

    function errorElementFor(name) {
      return form.querySelector(`[data-error-for="${name}"]`);
    }

    function fieldWrapperFor(input) {
      return input.closest(".field");
    }

    function clearError(name) {
      const input = form.elements[name];
      if (!input) return;

      const wrapper = fieldWrapperFor(input);
      const error = errorElementFor(name);

      if (wrapper) wrapper.classList.remove("is-invalid");
      if (error) {
        error.textContent = "";
        error.classList.remove("is-visible");
      }
      input.removeAttribute("aria-invalid");
    }

    function showError(name, message) {
      const input = form.elements[name];
      if (!input) return;

      const wrapper = fieldWrapperFor(input);
      const error = errorElementFor(name);

      if (wrapper) wrapper.classList.add("is-invalid");
      if (error) {
        error.textContent = message;
        error.classList.add("is-visible");
      }
      input.setAttribute("aria-invalid", "true");
    }

    function validateField(name) {
      const input = form.elements[name];
      if (!input) return true;

      const value = typeof input.value === "string" ? input.value.trim() : "";
      let message = "";

      switch (name) {
        case "nome":
          if (value.length < 3) message = "Informe seu nome completo (mínimo de 3 caracteres).";
          break;
        case "email":
          if (!value) {
            message = "Informe seu e-mail para contato.";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            message = "Informe um e-mail válido, como nome@empresa.com.br.";
          }
          break;
        case "telefone": {
          const digits = onlyDigits(value);
          if (digits.length < 10) {
            message = "Informe um telefone com DDD, no formato (11) 99999-9999.";
          }
          break;
        }
        case "area":
          if (!value) message = "Selecione a área de interesse.";
          break;
        case "mensagem":
          if (value.length < 20) {
            message = "Descreva brevemente sua situação (mínimo de 20 caracteres).";
          }
          break;
        case "lgpd":
          if (!input.checked) message = "É necessário autorizar o contato para enviar a mensagem.";
          break;
        default:
          break;
      }

      if (message) {
        showError(name, message);
        return false;
      }

      clearError(name);
      return true;
    }

    const requiredFields = ["nome", "email", "telefone", "area", "mensagem", "lgpd"];

    requiredFields.forEach((name) => {
      const input = form.elements[name];
      if (!input) return;

      const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";

      input.addEventListener(eventName, () => {
        if (input.getAttribute("aria-invalid") === "true") {
          validateField(name);
        }
      });
    });

    if (formError) {
      formError.hidden = true;
    }

    function setLoading(isLoading) {
      if (submitButton) {
        submitButton.disabled = isLoading;
        submitButton.setAttribute("aria-busy", String(isLoading));
      }
      if (submitLabel) {
        submitLabel.textContent = isLoading ? "Enviando..." : originalSubmitLabel;
      }
    }

    function delay(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    async function sendForm(payload) {
      const endpoint = form.dataset.endpoint;

      // Sem endpoint configurado, o envio é apenas demonstrativo.
      if (!endpoint) {
        await delay(700);
        return { demo: true };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Falha no envio (${response.status})`);
      }

      return { demo: false };
    }

    function showSuccess() {
      if (formSuccess) {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.focus();
      }
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (formError) formError.hidden = true;

      // Honeypot: se preenchido, interrompe silenciosamente (provável bot).
      const honeypot = form.elements.website;
      if (honeypot && honeypot.value) return;

      const results = requiredFields.map((name) => validateField(name));
      const firstInvalid = requiredFields.find((name, index) => !results[index]);

      if (firstInvalid) {
        const input = form.elements[firstInvalid];
        if (input) {
          input.focus();
          input.scrollIntoView({ block: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
        return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());
      delete payload.website;

      setLoading(true);

      try {
        await sendForm(payload);
        form.reset();
        requiredFields.forEach(clearError);
        showSuccess();
      } catch (error) {
        if (formError) {
          formError.textContent =
            "Não foi possível enviar sua mensagem agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.";
          formError.hidden = false;
          formError.focus?.();
        }
      } finally {
        setLoading(false);
      }
    });

    if (resetButton && formSuccess) {
      resetButton.addEventListener("click", () => {
        formSuccess.hidden = true;
        form.hidden = false;
        form.reset();
        requiredFields.forEach(clearError);
        setLoading(false);
        if (formError) formError.hidden = true;

        const firstName = $("#nome", form);
        if (firstName) firstName.focus();
      });
    }
  }

  /* ------------------------------------------------------------------------
     Ano atual no rodapé
     ------------------------------------------------------------------------ */
  $$("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();

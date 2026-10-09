// ICT251 Activity 3: interactive features for the personal website.
// Remember to test each feature in your browser after editing the page.

document.addEventListener("DOMContentLoaded", function () {
  // Keep the footer year current.
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  // Feature 1: contact form validation and on-page preview.
  const form = document.getElementById("contact-form");
  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const preview = document.getElementById("form-preview");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, errorId, message) {
      document.getElementById(errorId).textContent = message;
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    [nameInput, emailInput, messageInput].forEach(function (input) {
      input.addEventListener("input", function () {
        const errorId = input.id + "-error";
        if (input.value.trim() !== "") {
          showError(input, errorId, "");
        }
        if (!preview.hidden) preview.hidden = true;
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      let isValid = true;

      showError(nameInput, "name-error", "");
      showError(emailInput, "email-error", "");
      showError(messageInput, "message-error", "");

      if (name === "") {
        showError(nameInput, "name-error", "Please enter your name.");
        isValid = false;
      }
      if (!emailPattern.test(email)) {
        showError(emailInput, "email-error", "Please enter a valid email address.");
        isValid = false;
      }
      if (message === "") {
        showError(messageInput, "message-error", "Please enter a message.");
        isValid = false;
      }

      if (!isValid) {
        preview.hidden = true;
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Use textContent rather than innerHTML for user-entered information.
      preview.replaceChildren();
      const heading = document.createElement("h4");
      heading.textContent = "Your form has been validated!";
      const nameLine = document.createElement("p");
      nameLine.textContent = "Name: " + name;
      const emailLine = document.createElement("p");
      emailLine.textContent = "Email: " + email;
      const messageLine = document.createElement("p");
      messageLine.textContent = "Message: " + message;
      const note = document.createElement("p");
      note.className = "preview-note";
      note.textContent = "Browser demonstration only — no message is sent.";
      preview.append(heading, nameLine, emailLine, messageLine, note);
      preview.hidden = false;
      preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // Feature 2: expand or collapse project details.
  document.querySelectorAll(".details-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const details = document.getElementById(button.getAttribute("aria-controls"));
      const isOpening = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(isOpening));
      details.hidden = !isOpening;
      button.querySelector("span").textContent = isOpening ? "−" : "＋";
      button.firstChild.textContent = isOpening ? "Hide details " : "View details ";
    });
  });

  // Feature 3: search/filter projects and skills.
  const searchInput = document.getElementById("project-search");
  const clearButton = document.getElementById("clear-search");
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const searchStatus = document.getElementById("search-status");
  const emptyState = document.getElementById("empty-state");

  function filterProjects() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(function (card) {
      const searchableText = (card.textContent + " " + card.dataset.search).toLowerCase();
      const matches = searchableText.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount++;
    });

    searchStatus.textContent = "Showing " + visibleCount + " of " + projectCards.length + " examples.";
    emptyState.hidden = visibleCount !== 0;
  }

  if (searchInput) searchInput.addEventListener("input", filterProjects);
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      filterProjects();
      searchInput.focus();
    });
  }

  // Feature 4: open photos in a larger gallery viewer.
  const galleryDialog = document.getElementById("gallery-dialog");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeLightbox = document.getElementById("lightbox-close");

  document.querySelectorAll(".gallery-open").forEach(function (button) {
    button.addEventListener("click", function () {
      lightboxImage.src = button.dataset.image;
      lightboxImage.alt = button.querySelector("img").alt;
      lightboxCaption.textContent = button.dataset.caption;
      if (typeof galleryDialog.showModal === "function") {
        galleryDialog.showModal();
      } else {
        // Fallback for browsers without dialog support.
        galleryDialog.setAttribute("open", "");
      }
    });
  });

  function closeGallery() {
    if (typeof galleryDialog.close === "function" && galleryDialog.open) {
      galleryDialog.close();
    } else {
      galleryDialog.removeAttribute("open");
    }
  }
  if (closeLightbox) closeLightbox.addEventListener("click", closeGallery);
  if (galleryDialog) {
    galleryDialog.addEventListener("click", function (event) {
      if (event.target === galleryDialog) closeGallery();
    });
  }

  // Bonus feature: mobile navigation.
  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  // Bonus feature: switch between dark and light themes.
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isLight = document.body.classList.toggle("light-theme");
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.innerHTML = isLight ? "<span aria-hidden=\\"true\\">◑</span> Light theme" : "<span aria-hidden=\\"true\\">◐</span> Dark theme";
    });
  }
});

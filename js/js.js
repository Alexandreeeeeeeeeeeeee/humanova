document.addEventListener("DOMContentLoaded", function () {
  // Menu Toggle
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");
  const menuIcon = toggle ? toggle.querySelector("i") : null;

  if (toggle && nav && menuIcon) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("active");
      if (nav.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
      } else {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
      }
    });
  } else {
    console.error(
      'Erro: Elementos do menu não encontrados. Verifique os IDs "menu-toggle" e "nav-links".'
    );
  }

  // Rolagem suave para links do menu superior e rodapé
  document
    .querySelectorAll(".nav-links a, .footer-column .case-link")
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth",
          });
        }
        // Fechar o menu no mobile após clicar (apenas para links do menu superior)
        if (
          this.closest(".nav-links") &&
          nav &&
          nav.classList.contains("active")
        ) {
          nav.classList.remove("active");
          if (menuIcon) {
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
          }
        }
      });
    });

  // Animação de visibilidade das seções
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Para de observar após a animação
        }
      });
    },
    { threshold: 0.1 } // 10% da seção visível para disparar
  );

  sections.forEach((section) => observer.observe(section));

// Envio do formulário com validação + integração com Make
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validação dos campos
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Envio via Make Webhook
    const formData = new FormData(this);
    fetch("https://hook.us2.make.com/n6msmee7gpgyqf7nfmj9apewkh1dgh91", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          const formContainer = document.getElementById("form-container");
          if (formContainer) {
            formContainer.innerHTML = `
              <div class="success-message">
                <h3>Mensagem enviada com sucesso!</h3>
                <p>Agradecemos pelo seu contato. Responderemos em breve.</p>
              </div>
            `;
          }
        } else {
          throw new Error("Erro ao enviar a mensagem");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert(
          "Houve um problema ao enviar sua mensagem. Por favor, tente novamente mais tarde."
        );
      });
  });
}
});

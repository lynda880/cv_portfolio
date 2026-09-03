/* =========================================================
   SCRIPT.JS — Vanilla JS, aucune dépendance
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Année automatique dans le footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile (hamburger) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Ferme le menu mobile après le clic sur un lien
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Effet "terminal" animé (élément signature du hero) ----------
     Modifie le tableau TERMINAL_LINES ci-dessous pour changer le contenu affiché.
     Format : { prompt: "commande tapée", output: "résultat affiché" }
  ------------------------------------------------------------------------- */
  const TERMINAL_LINES = [
    { prompt: 'luulynda@linuxdebian:~$', output: 'Luu-Lynda PHAM — Support & Cybersécurité' },
    { prompt: 'luulynda@linuxdebian:~/portfolio$', output: 'Helpdesk · Gestion des incidents · Réseaux' },
    { prompt: 'luulynda@linuxdebian:~/profile$', output: '● active (running)' },
    { prompt: '_', output: '' }
  ];

  const terminalBody = document.getElementById('terminalBody');

  function typeTerminal(el, lines) {
    if (!el) return;
    let lineIndex = 0;
    let charIndex = 0;
    let currentLineEl = null;
    let phase = 'prompt'; // 'prompt' -> tape la commande, puis 'output' -> affiche le résultat

    const TYPE_SPEED = 45;
    const LINE_PAUSE = 550;

    function step() {
      const line = lines[lineIndex];
      if (!line) {
        // Fin réelle de l'animation : on ajoute le curseur clignotant maintenant,
        // et seulement maintenant (plus de délai fixe déconnecté de la frappe réelle).
        const cursorLine = document.createElement('div');
        cursorLine.className = 'terminal__line';
        cursorLine.innerHTML = '<span class="terminal__prompt">$ </span><span class="terminal__cursor"></span>';
        el.appendChild(cursorLine);
        return;
      }

      if (!currentLineEl) {
        currentLineEl = document.createElement('div');
        currentLineEl.className = 'terminal__line';
        currentLineEl.innerHTML = '<span class="terminal__prompt">$ </span><span class="terminal__typed"></span>';
        el.appendChild(currentLineEl);
      }

      const typedSpan = currentLineEl.querySelector('.terminal__typed');

      if (phase === 'prompt') {
        if (charIndex < line.prompt.length) {
          typedSpan.textContent += line.prompt.charAt(charIndex);
          charIndex++;
          setTimeout(step, TYPE_SPEED);
        } else {
          phase = 'output';
          setTimeout(step, LINE_PAUSE);
        }
      } else if (phase === 'output') {
        if (line.output) {
          const outputEl = document.createElement('div');
          outputEl.className = 'terminal__line terminal__output';
          outputEl.textContent = line.output;
          el.appendChild(outputEl);
        }
        // passe à la ligne suivante
        lineIndex++;
        charIndex = 0;
        phase = 'prompt';
        currentLineEl = null;
        setTimeout(step, LINE_PAUSE);
      }
    }

    step();
  }

  // Respecte la préférence "réduire les animations" de l'utilisateur
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (terminalBody) {
    if (prefersReducedMotion) {
      terminalBody.innerHTML = TERMINAL_LINES
        .map(l => `<div class="terminal__line"><span class="terminal__prompt">$ </span>${l.prompt}</div>` +
                   (l.output ? `<div class="terminal__line terminal__output">${l.output}</div>` : ''))
        .join('');
    } else {
      typeTerminal(terminalBody, TERMINAL_LINES);
    }
  }

  /* ---------- Copie rapide de l'adresse email ---------- */
  const emailBtn = document.getElementById('emailCopyBtn');
  const emailText = document.getElementById('emailCopyText');

  if (emailBtn) {
    emailBtn.addEventListener('click', async () => {
      const email = emailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        const original = emailText.textContent;
        emailText.textContent = 'Adresse copiée ✓';
        emailBtn.querySelector('i').className = 'fa-solid fa-check';
        setTimeout(() => {
          emailText.textContent = original;
          emailBtn.querySelector('i').className = 'fa-solid fa-copy';
        }, 2000);
      } catch (err) {
        // Fallback si l'API Clipboard n'est pas disponible
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ---------- Bouton "retour en haut" ---------- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mise en avant du lien de nav actif au scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent-cyan)' : '';
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  /* ---------- Révélation douce des cartes au scroll ---------- */
  const revealTargets = document.querySelectorAll('.skill-card, .project-card, .timeline__item');

  if (revealTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

});
// ====== THEME TOGGLE ======
document.addEventListener('DOMContentLoaded', () => {
  // Detectar tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Aplicar tema inicial
  if (initialTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Actualizar ícono del tema
  updateThemeIcon(initialTheme);

  // Theme toggle button handler
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
    localStorage.setItem('theme', newTheme);
  });
});

// Función para actualizar ícono del tema
function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  
  if (theme === 'dark') {
    // Mostrar ícono de luna
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  } else {
    // Mostrar ícono de sol
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  }
}

// ====== HAMBURGER MENU ======
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const nav = document.querySelector('nav');
  let isMenuOpen = false;

  // Toggle menu
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active', isMenuOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && nav && !nav.contains(e.target)) {
      isMenuOpen = false;
      navLinks.classList.remove('active');
    }
  });

  // Close menu on window resize (for responsiveness)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
      isMenuOpen = false;
      navLinks.classList.remove('active');
    }
  });
});

// ====== FORM HANDLING ======
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');
  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;
    isSubmitting = true;

    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span>';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      // Formspree returns 200 for successful submissions
      if (response.ok || response.status === 200) {
        form.reset();
        successMsg.style.display = 'block';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 6000);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      errorMsg.style.display = 'block';
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      isSubmitting = false;
    }
  });
});

// ====== PHONE INPUT FORMATTING ======
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    // Format on input
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '').slice(0, 10);
      e.target.value = value;
    });
    
    // Prevent paste of invalid characters
    phoneInput.addEventListener('paste', (e) => {
      setTimeout(() => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      }, 0);
    });
  }
});

// ====== TOUCH INTERACTIONS ======
document.addEventListener('DOMContentLoaded', () => {
  // Improve touch interactions
  document.querySelectorAll('a, button, .radio-option').forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    });
    el.addEventListener('touchend', function() {
      this.style.opacity = '1';
    });
  });

  // Prevent zooming on input focus (iOS optimization)
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, false);
});

// ====== SMOOTH SCROLL LINKS ======
document.addEventListener('DOMContentLoaded', () => {
  // Handle smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Only handle actual section links
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// ====== PERFORMANCE OPTIMIZATIONS ======
// Lazy load images if any (future implementation)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ====== ACCESSIBILITY ENHANCEMENTS ======
document.addEventListener('DOMContentLoaded', () => {
  // Ensure form fields have proper labels
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    const input = group.querySelector('input, textarea, select');
    const label = group.querySelector('label');
    
    if (input && label) {
      const id = input.id || `form-field-${index}`;
      input.id = id;
      label.setAttribute('for', id);
    }
  });

  // Add focus indicator for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
});

// ====== CONSOLE BANNER ======
console.log('%cE-MarketPro Landing Page', 'color: #2563eb; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cDeveloped with Vanilla HTML/CSS/JavaScript', 'color: #6366f1; font-size: 14px;');
console.log('%cVersion: 2.0 | Responsive & Optimized', 'color: #38bdf8; font-size: 12px;');

/**
 * Praveenkumar M - Personal Portfolio Scripts
 * Handles premium animations, canvas particles, form validation, and scroll interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initScrollProgressBar();
  initCanvasParticles();
  initTypingEffect();
  initActiveNavObserver();
  initCountersObserver();
  initSkillBarsObserver();
  init3DTilt();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   STICKY HEADER TRANSITION
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = scrollPercentage + '%';
    });
  }
}

/* ==========================================================================
   CANVAS PARTICLES BACKGROUND
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      // Gold-like hue/opacity colors
      this.color = `rgba(230, 184, 0, ${Math.random() * 0.4 + 0.15})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Keep inside canvas bounds
      if (this.x < 0 || this.x > w) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > h) this.speedY = -this.speedY;

      // Mouse interactive movement (attract/push slightly)
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          // Attract towards mouse slightly
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.floor((w * h) / 14000); // Responsive particle count
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 95) {
          opacityValue = 1 - distance / 95;
          ctx.strokeStyle = `rgba(230, 184, 0, ${opacityValue * 0.11})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    // Draw background gradient (radial mesh look)
    const grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, Math.max(w, h));
    grad.addColorStop(0, '#0d0d0f');
    grad.addColorStop(1, '#050506');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* ==========================================================================
   TYPING SUBHEADER EFFECT
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typed-title');
  if (!target) return;

  const roles = [
    'Java Developer',
    'ECE Graduate',
    'IoT Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   ACTIVE NAVIGATION LINK HIGHLIGHTING
   ========================================================================== */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const options = {
    threshold: 0.35, // Trigger when 35% of the section is visible
    rootMargin: "-80px 0px 0px 0px" // Account for header height
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   COUNTER COUNT-UP ANIMATION
   ========================================================================== */
function initCountersObserver() {
  const counters = document.querySelectorAll('.counter-num');
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const speed = 200; // Lower is faster
    const increment = Math.ceil(target / speed);
    let current = 0;

    const updateVal = () => {
      current += increment;
      if (current < target) {
        counter.textContent = current + '+';
        setTimeout(updateVal, 10);
      } else {
        counter.textContent = target + '+';
      }
    };
    updateVal();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.8 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   SKILLS PROGRESS BAR SLIDE ANIMATION
   ========================================================================== */
function initSkillBarsObserver() {
  const progressBars = document.querySelectorAll('.progress-bar');
  if (progressBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-progress');
        bar.style.width = width;
        observer.unobserve(bar); // Animate only once
      }
    });
  }, { threshold: 0.1 });

  progressBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   3D HOVER / TILT EFFECTS
   ========================================================================== */
function init3DTilt() {
  const profileCard = document.getElementById('profile-card-3d');
  const projectCard = document.getElementById('project-card-tilt');

  function applyTilt(element) {
    if (!element) return;

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 15 degrees)
      const rotateX = ((centerY - y) / centerY) * 15;
      const rotateY = ((x - centerX) / centerX) * 15;

      element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  applyTilt(profileCard);
  applyTilt(projectCard);
}

/* ==========================================================================
   CONTACT FORM VALIDATION & HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');
  const messageInput = document.getElementById('form-message');
  const feedback = document.getElementById('form-feedback-message');
  const submitBtn = document.getElementById('form-submit-btn');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    if (phone === '') return true; // Optional field
    // Basic phone regex (allows international codes, minimum 10 digits)
    const re = /^\+?[0-9\s\-()]{10,20}$/;
    return re.test(phone);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset validations
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
      input.classList.remove('invalid');
    });
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    // Validate Name
    if (nameInput.value.trim() === '') {
      nameInput.classList.add('invalid');
      isValid = false;
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      isValid = false;
    }

    // Validate Phone
    if (!validatePhone(phoneInput.value.trim())) {
      phoneInput.classList.add('invalid');
      isValid = false;
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
      messageInput.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) {
      // Shake effect on form panel
      const panel = form.parentElement;
      panel.classList.add('shake');
      setTimeout(() => panel.classList.remove('shake'), 400);
      return;
    }

    // Success Simulation
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    // Simulate Server Request (e.g. EmailJS, Webhook, Formspree)
    setTimeout(() => {
      submitBtn.innerHTML = 'Sent <i class="fa-solid fa-check"></i>';
      feedback.textContent = 'Thank you! Your message has been sent successfully.';
      feedback.classList.add('success');
      form.reset();

      // Restore submit button after 4s
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }, 4000);
    }, 1500);
  });

  // Dynamic Validation indicators as typing
  [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        let isCorrect = true;
        if (input === emailInput) isCorrect = validateEmail(input.value.trim());
        else if (input === phoneInput) isCorrect = validatePhone(input.value.trim());
        else isCorrect = input.value.trim() !== '';

        if (isCorrect) input.classList.remove('invalid');
      }
    });
  });
}

/* ==========================================================================
   BACK TO TOP BUTTON WITH SVG RADIAL PROGRESS RING
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const circle = document.querySelector('.progress-ring-circle');
  if (!backToTopBtn || !circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (window.scrollY / scrollHeight) * 100;
    
    // Set circle active percentage
    setProgress(scrollPercentage);

    // Toggle button visibility
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Client-side password, typed animation, and lightbox
// Updated typed lines to user-provided letter
document.addEventListener('DOMContentLoaded', function () {
  // --- CONFIG: change the password here if you want ---
  const PASSWORD = 'ruth1:16'; // client-side only; visible in page source
  const UNLOCK_KEY = 'myjolie_unlocked_v1';

  // Elements
  const overlay = document.getElementById('passwordOverlay');
  const pwInput = document.getElementById('pwInput');
  const pwSubmit = document.getElementById('pwSubmit');
  const siteContent = document.getElementById('siteContent');

  function unlockUI() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.display = 'none';
    siteContent.classList.remove('hidden-until-unlocked');
    siteContent.classList.add('unlocked');
    siteContent.removeAttribute('aria-hidden');
    // start the typed animation once visible
    startTyped();
  }

  // check sessionStorage first
  if (sessionStorage.getItem(UNLOCK_KEY) === '1') {
    unlockUI();
  } else {
    overlay.setAttribute('aria-hidden', 'false');
    pwInput.focus();
  }

  pwSubmit.addEventListener('click', tryPassword);
  pwInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryPassword();
  });

  function tryPassword() {
    if (pwInput.value === PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, '1');
      unlockUI();
    } else {
      pwInput.value = '';
      pwInput.placeholder = 'Try again';
      pwInput.focus();
      // small shake animation
      overlay.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 220 });
    }
  }

  // --- Typed animation for the opening line(s) ---
  const typedEl = document.getElementById('typedLine');
  const lines = [
    'To you my Jolie',
    "I hope you always remember this, that no matter how heavy your days get or how quiet you become, my love for you doesn't shrink.",
    "I'll choose you on the happy days, the hard days, and every day in between.",
    "You never have to earn my love as it is yours, and I'll keep showing up for you.",
    'Where you go I will go, and where you stay I will stay. ❤️',
    'From Thato'
  ];

  function startTyped() {
    // If typed already filled (e.g., user returned), don't repeat
    if (!typedEl) return;
    if (typedEl.dataset.typed === '1') return;

    typedEl.textContent = '';
    let lineIndex = 0;
    let charIndex = 0;

    function typeChar() {
      const line = lines[lineIndex];
      if (!line) return;
      typedEl.textContent = line.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex >= line.length) {
        // pause, then next line (or finish)
        lineIndex++;
        charIndex = 0;
        if (lineIndex >= lines.length) {
          typedEl.dataset.typed = '1';
          return;
        }
        setTimeout(typeChar, 700);
      } else {
        setTimeout(typeChar, 65 + Math.random() * 50);
      }
    }
    // start after short pause
    setTimeout(typeChar, 400);
  }

  // --- Lightbox for photos ---
  const thumbs = document.querySelectorAll('.thumb');
  const lightbox = document.getElementById('lightbox');
  const lbImage = lightbox && lightbox.querySelector('.lb-image');
  const lbClose = lightbox && lightbox.querySelector('.lb-close');

  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-full');
      const alt = btn.querySelector('img')?.alt || '';
      if (!lbImage) return;
      lbImage.src = src;
      lbImage.alt = alt;
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lbImage.src = '';
    });
  }

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox) {
        lightbox.setAttribute('aria-hidden', 'true');
        if (lbImage) lbImage.src = '';
      }
    }
  });

  // close when clicking background
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.setAttribute('aria-hidden', 'true');
        if (lbImage) lbImage.src = '';
      }
    });
  }

  // If unlocked already, start typed (for cases where sessionStorage had it)
  if (sessionStorage.getItem(UNLOCK_KEY) === '1') {
    startTyped();
  }
});

const SITE_PASSWORD = 'dolphins';
const AUTH_FLAG = 'sixers-site-access';

function setAccessAllowed() {
  sessionStorage.setItem(AUTH_FLAG, 'true');
  localStorage.setItem(AUTH_FLAG, 'true');
}

function accessAllowed() {
  return sessionStorage.getItem(AUTH_FLAG) === 'true' || localStorage.getItem(AUTH_FLAG) === 'true';
}

function allowDirectInternalReferrer() {
  const referrer = document.referrer;
  if (!referrer) {
    return;
  }

  try {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.origin === window.location.origin && referrerUrl.href !== window.location.href) {
      setAccessAllowed();
    }
  } catch (error) {
    // Ignore invalid referrers.
  }
}

function promptForPassword() {
  let attempts = 0;
  while (attempts < 3 && !accessAllowed()) {
    const answer = prompt('Enter the password to access this page:');
    if (answer === null) {
      break;
    }
    if (answer === SITE_PASSWORD) {
      setAccessAllowed();
      return;
    }
    attempts += 1;
    alert('Incorrect password. Please try again.');
  }

  if (!accessAllowed()) {
    document.body.innerHTML = '<div class="password-blocked" style="padding: 3rem; text-align: center;"><h1>Access denied</h1><p>You must enter the correct password to view this site.</p></div>';
  }
}

document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href]');
  if (!anchor) {
    return;
  }

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
    return;
  }

  if (anchor.target && anchor.target !== '_self') {
    return;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin === window.location.origin) {
      setAccessAllowed();
    }
  } catch (error) {
    // Ignore invalid URLs.
  }
});

allowDirectInternalReferrer();
if (!accessAllowed()) {
  promptForPassword();
}

document.addEventListener('DOMContentLoaded', () => {
  initComedySlideshow();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelectors = [
    'header h1',
    '.subtitle',
    'nav li',
    '.section',
    '.section-title',
    '.section-subtitle',
    '.news-card',
    '.event-card',
    '.interview-card',
    '.spotlight-profile',
    '.bulletin-item',
    '.comedy-container',
    '.article-card',
    '.simulation-card',
    '.gallery-item',
    '.video-item',
    '.home-video-wrap',
    'footer p'
  ];





  const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(',')));

  if (!revealElements.length) {
    return;
  }

  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${(index % 10) * 70}ms`);

    // Alternate direction so cards slide in from left and right while scrolling.
    if (index % 2 === 1) {
      el.classList.add('from-right');
    }

    if (index % 5 === 0) {
      el.classList.add('from-up');
    }
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
});

function initComedySlideshow() {
  const slideshow = document.querySelector('.comedy-slideshow');
  if (!slideshow) {
    return;
  }

  const slides = Array.from(slideshow.querySelectorAll('.joke-slide'));
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  const indicator = document.querySelector('.slide-indicator');
  const dotsWrap = document.querySelector('.slide-dots');
  const revealAudio = document.getElementById('jokeRevealAudio');

  if (!slides.length || !prevBtn || !nextBtn || !indicator || !dotsWrap) {
    return;
  }

  let currentIndex = slides.findIndex((slide) => slide.classList.contains('active'));
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  function resetSlideReveal(slide) {
    const ending = slide.querySelector('.joke-ending');
    const revealBtn = slide.querySelector('.joke-reveal-btn');
    if (ending) {
      ending.hidden = true;
    }
    if (revealBtn) {
      revealBtn.textContent = 'Reveal the ending';
    }
    slide.classList.remove('is-revealed');
  }

  function updateIndicator() {
    indicator.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      if (!isActive) {
        resetSlideReveal(slide);
      }
    });
    updateIndicator();
    updateDots();
  }

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to joke ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsWrap.appendChild(dot);

    const revealBtn = slide.querySelector('.joke-reveal-btn');
    const ending = slide.querySelector('.joke-ending');
    if (!revealBtn || !ending) {
      return;
    }

    revealBtn.addEventListener('click', () => {
      ending.hidden = false;
      slide.classList.add('is-revealed');
      revealBtn.textContent = 'Ending revealed';

      if (revealAudio) {
        revealAudio.currentTime = 0;
        revealAudio.play().catch(() => {
          // Ignore play errors caused by browser media policies.
        });
      }
    });
  });

  prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

  slideshow.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showSlide(currentIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      showSlide(currentIndex + 1);
    }
  });

  showSlide(currentIndex);
}


fetch("../footer.html")
    .then(response => response.text())
    .then(data => {
    document.getElementById("footer").innerHTML = data;
});
fetch("../nav.html")
    .then(response => response.text())
    .then(data => {
    document.getElementById("nav").innerHTML = data;
    const currentPageType = typeof type !== 'undefined' ? type : null;
    switch (currentPageType) {
    case "0":
        document.querySelector("#nav a[href='index.html']").classList.add("active");
        break;
    case "1":
        document.querySelector("#nav a[href='news.html']").classList.add("active");
        break;
    case "2":
        document.querySelector("#nav a[href='comedy.html']").classList.add("active");
        break;
    case "3":
        document.querySelector("#nav a[href='fun-facts.html']").classList.add("active");
        break;
    case "4":
        document.querySelector("#nav a[href='credits.html']").classList.add("active");
        break;
    case "5":
        document.querySelector("#nav a[href='spotlight.html']").classList.add("active");
        break;
    case "6":
        document.querySelector("#nav a[href='about.html']").classList.add("active");
        break;
    case "7":
        document.querySelector("#nav a[href='Boom-trip-photos.html']").classList.add("active");
        break;  
}
});





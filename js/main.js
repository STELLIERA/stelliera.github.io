document.addEventListener('DOMContentLoaded', () => {

  const targetSections = document.querySelectorAll('.fade-in');

  const options = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add('is-show');
        observer.unobserve(entry.target);
      }

    });

  }, options);

  targetSections.forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });

});

// ==============================
// ハンバーガーメニュー
// ==============================

document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__nav a');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {

    hamburger.classList.toggle('is-active');
    nav.classList.toggle('is-open');

    // メニューが開いているときはスクロール禁止
    document.body.classList.toggle('menu-open');

  });

  // メニュー内のリンクをクリックしたら閉じる
  navLinks.forEach(link => {

    link.addEventListener('click', () => {

      hamburger.classList.remove('is-active');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');

    });

  });

});
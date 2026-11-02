/* ============================================================
   works.js
   ============================================================ */
(() => {
  'use strict';

  const PER_PAGE = 12;

  // 追加作品をここに登録してください。
  // 外部サイトへのリンクを付けないデザイン作品は modalImage を指定します。
  const worksData = [
    /*
    {
      href: 'https://実際のサイトURL/',
      target: '_blank',
      img: 'images/作品画像.png',
      dataLabel: 'Site',
      label: 'Site',
      title: '作品名',
      role: 'Design / Coding / WordPress'
    },
    {
      img: 'images/デザイン画像.png',
      modalImage: 'images/デザイン画像.png',
      dataLabel: 'Design',
      label: 'Design',
      title: '作品名',
      role: 'Design'
    }
    */
  ];

  let loadedCount = 0;
  let lastTrigger = null;
  let previousBodyOverflow = '';

  const createModalElement = (data, modalId) => {
    const modal = document.createElement('div');
    modal.className = 'works-detail__modal';
    modal.id = modalId;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', `${data.title}の制作実績`);

    const overlay = document.createElement('div');
    overlay.className = 'works-detail__modal-overlay js-modal-close';

    const content = document.createElement('div');
    content.className = 'works-detail__modal-content';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'works-detail__modal-close js-modal-close';
    closeButton.setAttribute('aria-label', 'モーダルを閉じる');
    closeButton.textContent = '×';

    const image = document.createElement('img');
    image.className = 'works-detail__modal-image';
    image.src = data.modalImage;
    image.alt = `${data.title}のWebサイトデザイン`;

    content.append(closeButton, image);
    modal.append(overlay, content);

    return modal;
  };

  const createItemElement = (data, index) => {
    const item = document.createElement('div');
    item.className = 'works-detail__item is-added';

    const hasModal = Boolean(data.modalImage);
    const hasLink = Boolean(data.href);
    let card;

    if (hasModal) {
      const modalId = `works-modal-${index}`;

      card = document.createElement('button');
      card.type = 'button';
      card.className = 'works-detail__link js-modal-open';
      card.dataset.modalTarget = modalId;
      card.setAttribute('aria-controls', modalId);
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-haspopup', 'dialog');

      document.body.append(createModalElement(data, modalId));
    } else if (hasLink) {
      card = document.createElement('a');
      card.className = 'works-detail__link';
      card.href = data.href;

      if (data.target === '_blank') {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      }
    } else {
      // リンク先もモーダル画像もない作品
      card = document.createElement('div');
      card.className = 'works-detail__link';
    }

    const imgWrap = document.createElement('div');
    imgWrap.className = 'works-detail__img';

    const image = document.createElement('img');
    image.src = data.img;
    image.alt = '';

    const body = document.createElement('div');
    body.className = 'works-detail__body';

    // works__label に統一。ラベル文字はHTMLテキストだけで表示します。
    const label = document.createElement('p');
    label.className = 'works__label';
    label.dataset.label = data.dataLabel || '';
    label.textContent = data.label || '';

    const bodyText = document.createElement('div');
    bodyText.className = 'works-detail__body-text';

    const title = document.createElement('h2');
    title.className = 'works-detail__title';
    title.textContent = data.title || '';

    bodyText.append(title);

    if (data.role) {
      const role = document.createElement('p');
      role.className = 'works-detail__role';
      role.textContent = data.role;
      bodyText.append(role);
    }

    imgWrap.append(image);
    body.append(label, bodyText);
    card.append(imgWrap, body);
    item.append(card);

    return item;
  };

  const openModal = (trigger) => {
    const modal = document.getElementById(trigger.dataset.modalTarget);
    if (!modal) return;

    lastTrigger = trigger;
    previousBodyOverflow = document.body.style.overflow;

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    modal.querySelector('.works-detail__modal-close')?.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;

    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;

    const trigger = lastTrigger;
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }

    lastTrigger = null;
  };

  const initModalEvents = () => {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('.js-modal-open');

      if (trigger) {
        openModal(trigger);
        return;
      }

      const closeButton = event.target.closest('.js-modal-close');
      if (closeButton) {
        closeModal(closeButton.closest('.works-detail__modal'));
      }
    });

    document.addEventListener('keydown', (event) => {
      const activeModal = document.querySelector(
        '.works-detail__modal.is-active'
      );

      if (!activeModal) return;

      if (event.key === 'Escape') {
        closeModal(activeModal);
        return;
      }

      // Tabキーのフォーカスを開いているモーダル内に保つ
      if (event.key !== 'Tab') return;

      const focusable = activeModal.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  };

  const initMoreButton = () => {
    const list = document.getElementById('js-works-list');
    const moreWrap = document.getElementById('js-works-more');
    const moreButton = document.getElementById('js-works-more-btn');

    if (!list || !moreWrap || !moreButton) return;

    if (worksData.length === 0) {
      moreWrap.classList.add('is-hidden');
      return;
    }

    moreButton.addEventListener('click', () => {
      const nextItems = worksData.slice(
        loadedCount,
        loadedCount + PER_PAGE
      );

      const fragment = document.createDocumentFragment();

      nextItems.forEach((data, index) => {
        const itemIndex = loadedCount + index + 1;
        fragment.append(createItemElement(data, itemIndex));
      });

      list.append(fragment);
      loadedCount += nextItems.length;

      if (loadedCount >= worksData.length) {
        moreWrap.classList.add('is-hidden');
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initModalEvents();
    initMoreButton();
  });
})();
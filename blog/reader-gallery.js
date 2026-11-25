/* The published figures in reading order, including individual images in pairs. */
window.setupReaderGallery = function (article, language) {
  const images = Array.from(article.querySelectorAll('img'));
  const dialog = document.createElement('dialog');
  dialog.className = 'reader-gallery';
  dialog.innerHTML = `<header><span class="gallery-count"></span><span class="gallery-name" aria-live="polite"></span><button class="gallery-close" type="button"></button></header>
    <div class="gallery-stage"><img alt=""></div>
    <footer><button class="gallery-prev" type="button"></button><button class="gallery-next" type="button"></button></footer>`;
  document.body.append(dialog);
  const previous = dialog.querySelector('.gallery-prev');
  const next = dialog.querySelector('.gallery-next');
  const close = dialog.querySelector('.gallery-close');
  const displayed = dialog.querySelector('img');
  const name = dialog.querySelector('.gallery-name');
  const count = dialog.querySelector('.gallery-count');
  let selected = 0;
  const localized = (zh, en) => language() === 'en' ? en : zh;

  function select(index) {
    if (index < 0 || index >= images.length) return;
    selected = index;
    const source = images[index];
    displayed.src = source.currentSrc || source.src;
    displayed.alt = source.alt;
    name.textContent = source.alt;
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
    previous.disabled = index === 0;
    next.disabled = index === images.length - 1;
  }

  images.forEach((img, index) => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'reader-figure-open';
    trigger.setAttribute('aria-haspopup', 'dialog');
    img.before(trigger);
    trigger.append(img);
    trigger.addEventListener('click', () => {
      dialog.setAttribute('aria-label', localized('文章配图', 'Article figures'));
      previous.textContent = localized('上一张', 'Previous');
      next.textContent = localized('下一张', 'Next');
      close.textContent = localized('关闭', 'Close');
      select(index);
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => select(selected - 1));
  next.addEventListener('click', () => select(selected + 1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target.classList.contains('gallery-stage')) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(selected + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
};

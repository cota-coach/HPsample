const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  });
});

document.querySelectorAll('[data-day-slider]').forEach((slider) => {
  const track = slider.querySelector('.day-slider-track');
  const slides = [...slider.querySelectorAll('.day-slide')];
  const previousButton = slider.querySelector('[data-day-prev]');
  const nextButton = slider.querySelector('[data-day-next]');
  const currentLabel = slider.querySelector('[data-day-current]');

  if (!track || slides.length === 0) return;

  const currentIndex = () => {
    const trackLeft = track.getBoundingClientRect().left;
    return slides.reduce((closest, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
  };

  const updateControls = () => {
    const index = currentIndex();
    if (currentLabel) currentLabel.textContent = String(index + 1).padStart(2, '0');
    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === slides.length - 1;
  };

  const moveTo = (index) => {
    slides[Math.max(0, Math.min(slides.length - 1, index))].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  previousButton?.addEventListener('click', () => moveTo(currentIndex() - 1));
  nextButton?.addEventListener('click', () => moveTo(currentIndex() + 1));
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
});

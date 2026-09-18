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

  let activeIndex = 0;
  let programmaticScrollTimer;
  let isProgrammaticScroll = false;

  const showActiveSlide = () => {
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('is-active', isActive);
      if (isActive) slide.setAttribute('aria-current', 'true');
      else slide.removeAttribute('aria-current');
    });
  };

  const currentIndex = () => {
    const maximumScroll = track.scrollWidth - track.clientWidth;
    if (maximumScroll <= 0) return 0;
    return Math.round((track.scrollLeft / maximumScroll) * (slides.length - 1));
  };

  const updateControls = () => {
    if (isProgrammaticScroll) return;
    activeIndex = currentIndex();
    if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
    if (previousButton) previousButton.disabled = activeIndex === 0;
    if (nextButton) nextButton.disabled = activeIndex === slides.length - 1;
    showActiveSlide();
  };

  const moveTo = (index) => {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    const maximumScroll = track.scrollWidth - track.clientWidth;
    isProgrammaticScroll = true;
    window.clearTimeout(programmaticScrollTimer);
    track.scrollTo({
      left: maximumScroll * (activeIndex / (slides.length - 1)),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
    if (previousButton) previousButton.disabled = activeIndex === 0;
    if (nextButton) nextButton.disabled = activeIndex === slides.length - 1;
    showActiveSlide();
    programmaticScrollTimer = window.setTimeout(() => {
      isProgrammaticScroll = false;
    }, 650);
  };

  previousButton?.addEventListener('click', () => moveTo(activeIndex - 1));
  nextButton?.addEventListener('click', () => moveTo(activeIndex + 1));
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
});

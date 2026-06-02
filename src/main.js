import './styles.css';

const quizStage = document.querySelector('[data-quiz-stage]');
const quizStepLabel = document.querySelector('[data-quiz-step-label]');
const quizProgress = document.querySelector('.quiz-panel__progress');

if (quizStage && quizStepLabel && quizProgress) {
  const assetUrl = (fileName) => new URL(`../assets/${fileName}`, import.meta.url).href;

  const serviceIcons = {
    light: assetUrl('quiz-format-light-sign.jpg'),
    letters: assetUrl('quiz-format-volume-letters.jpg'),
    store: assetUrl('quiz-business-store.jpg'),
    cafe: assetUrl('quiz-business-cafe.jpg'),
    salon: assetUrl('quiz-business-salon.jpg'),
    office: assetUrl('quiz-business-office.jpg'),
    clinic: assetUrl('quiz-business-clinic.jpg'),
    other: assetUrl('quiz-business-other.jpg'),
    entrance: assetUrl('quiz-format-entrance-group.jpg'),
    facade: assetUrl('quiz-format-facade-design.jpg'),
    interior: assetUrl('quiz-format-interior-sign.jpg'),
    navigation: assetUrl('service-navigation-icon.png'),
  };

  const steps = [
    {
      key: 'format',
      title: 'Какой тип вывески вам нужен?',
      options: [
        { label: 'Световая вывеска', icon: serviceIcons.light },
        { label: 'Объемные буквы', icon: serviceIcons.letters },
        { label: 'Входная группа', icon: serviceIcons.entrance },
        { label: 'Оформление фасада', icon: serviceIcons.facade },
        { label: 'Интерьерная вывеска', icon: serviceIcons.interior },
        { label: 'Пока не знаю', icon: serviceIcons.navigation },
      ],
    },
    {
      key: 'business',
      title: 'Для какого бизнеса нужна вывеска?',
      options: [
        { label: 'Магазин / торговая точка', icon: serviceIcons.store },
        { label: 'Кафе / ресторан', icon: serviceIcons.cafe },
        { label: 'Салон красоты / студия', icon: serviceIcons.salon },
        { label: 'Офис / компания', icon: serviceIcons.office },
        { label: 'Медицинский центр / клиника', icon: serviceIcons.clinic },
        { label: 'Другое', icon: serviceIcons.other },
      ],
    },
    {
      key: 'place',
      title: 'Где будет установлена вывеска?',
      options: [
        'На фасаде здания',
        'Над входом',
        'Внутри помещения',
        'На ТЦ / бизнес-центре',
        'На отдельно стоящей конструкции',
        'Пока не определились',
      ],
    },
    {
      key: 'design',
      title: 'Есть ли у вас готовый дизайн или логотип?',
      options: [
        'Да, есть макет',
        'Есть логотип, но нужен дизайн вывески',
        'Нужно разработать с нуля',
        'Нужно адаптировать старую вывеску',
        'Пока не знаю',
      ],
    },
    {
      key: 'size',
      title: 'Какой размер вывески планируете?',
      options: [
        'До 1 метра',
        '1–2 метра',
        '2–4 метра',
        'Больше 4 метров',
        'Нужно замерить на месте',
        'Пока не знаю',
      ],
    },
    {
      key: 'install',
      title: 'Нужен ли монтаж?',
      options: [
        'Да, нужен под ключ',
        'Только изготовление',
        'Нужен демонтаж старой вывески',
        'Нужен замер и консультация',
        'Пока не знаю',
      ],
    },
    {
      key: 'deadline',
      title: 'В какие сроки нужна вывеска?',
      options: [
        'Срочно, как можно быстрее',
        'В течение недели',
        'В течение 2–3 недель',
        'В течение месяца',
        'Сроки пока не важны',
      ],
    },
    {
      key: 'budget',
      title: 'Какой бюджет рассматриваете?',
      options: [
        'До 30 000 ?',
        '30 000–60 000 ?',
        '60 000–100 000 ?',
        '100 000–200 000 ?',
        'Более 200 000 ?',
        'Хочу сначала понять стоимость',
      ],
    },
    {
      key: 'contact',
      title: 'Куда отправить расчёт и подбор вариантов?',
      contact: true,
    },
  ];

  const state = {};
  let currentStep = 0;
  let advanceTimer = null;

  const renderProgress = () => {
    quizStepLabel.textContent = `Шаг ${currentStep + 1} / ${steps.length}`;
    const dots = [...quizProgress.querySelectorAll('span')];
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentStep);
    });
  };

  const renderStep = () => {
    const step = steps[currentStep];
    const useImageLayout = step.key === 'format' || step.key === 'business';
    renderProgress();

    if (step.contact) {
      quizStage.innerHTML = `
        <div class="quiz-panel__question">${step.title}</div>
        <form class="quiz-panel__contact-form">
          <div class="quiz-panel__contact-grid">
            <label class="quiz-panel__field">
              <span>Имя</span>
              <input type="text" name="name" placeholder="Как к вам обращаться?" autocomplete="name" />
            </label>
            <label class="quiz-panel__field">
              <span>Телефон</span>
              <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" />
            </label>
            <fieldset class="quiz-panel__field quiz-panel__field--full quiz-panel__field--radio">
              <legend>Куда отправить расчет?</legend>
              <div class="quiz-panel__delivery-options">
                <label class="quiz-panel__delivery-option">
                  <input type="radio" name="delivery" value="max" checked />
                  <span>MAX</span>
                </label>
                <label class="quiz-panel__delivery-option">
                  <input type="radio" name="delivery" value="sms" />
                  <span>SMS</span>
                </label>
              </div>
            </fieldset>
            <label class="quiz-panel__consent">
              <input type="checkbox" name="consent" checked />
              <span>Нажимая кнопку, вы соглашаетесь с <a href="#contacts">политикой конфиденциальности</a></span>
            </label>
          </div>
          <div class="quiz-panel__actions">
            <button class="button button--secondary quiz-panel__back" type="button" data-quiz-back>Назад</button>
            <button class="button button--primary quiz-panel__next" type="submit">Отправить заявку</button>
          </div>
        </form>
      `;

      const form = quizStage.querySelector('.quiz-panel__contact-form');
      const backButton = quizStage.querySelector('[data-quiz-back]');

      backButton?.addEventListener('click', () => {
        currentStep = Math.max(0, currentStep - 1);
        renderStep();
      });

      form?.addEventListener('submit', (event) => {
        event.preventDefault();
        window.location.hash = '#contacts';
      });

      return;
    }

    const options = step.options
      .map((option, index) => {
        const entry = typeof option === 'string' ? { label: option, icon: null } : option;
        const value = entry.label;
        const icon = entry.icon;
        const isUnknown = step.key === 'format' && value === 'Пока не знаю';
        const isImageOption = useImageLayout && !isUnknown;
        const checked = state[step.key] === value || (index === 0 && state[step.key] == null) ? 'checked' : '';
        const optionClass = useImageLayout
          ? `quiz-panel__option ${isUnknown ? 'quiz-panel__option--text-only' : 'quiz-panel__option--image'}`
          : 'quiz-panel__option quiz-panel__option--text-only';

        return `
          <input id="quiz-${step.key}-${index}" class="quiz-panel__radio" type="radio" name="${step.key}" value="${value}" ${checked} />
          <label class="${optionClass}" for="quiz-${step.key}-${index}">
            ${
              isImageOption
                ? `<span class="quiz-panel__option-icon" aria-hidden="true">${icon ? `<img src="${icon}" alt="" />` : ''}</span>`
                : ''
            }
            <span class="quiz-panel__option-text">${value.replace(' / ', ' /<br />')}</span>
          </label>
        `;
      })
      .join('');

    quizStage.innerHTML = `
      <div class="quiz-panel__question">${step.title}</div>
      <div class="quiz-panel__options ${useImageLayout ? 'quiz-panel__options--image' : ''}" role="list" aria-label="Варианты ответа">
        ${options}
      </div>
      <div class="quiz-panel__actions">
        <button class="button button--secondary quiz-panel__back" type="button" data-quiz-back ${currentStep === 0 ? 'disabled' : ''}>Назад</button>
        <button class="button button--primary quiz-panel__next" type="button" data-quiz-next>Далее</button>
      </div>
    `;

    const backButton = quizStage.querySelector('[data-quiz-back]');
    const nextButton = quizStage.querySelector('[data-quiz-next]');

    backButton?.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep -= 1;
        renderStep();
      }
    });

    nextButton?.addEventListener('click', () => {
      const selected = quizStage.querySelector(`input[name="${step.key}"]:checked`);
      if (!selected) return;

      state[step.key] = selected.value;
      currentStep = Math.min(steps.length - 1, currentStep + 1);
      renderStep();
    });
  };

  quizStage.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'radio') {
      const step = steps[currentStep];
      state[step.key] = target.value;

      if (!step.contact && currentStep < steps.length - 1) {
        if (advanceTimer) {
          clearTimeout(advanceTimer);
        }

        advanceTimer = window.setTimeout(() => {
          currentStep += 1;
          renderStep();
          advanceTimer = null;
        }, 200);
      }
    }
  });

  renderStep();
}

const worksShowcase = document.querySelector('.works-showcase');
const worksLightbox = document.querySelector('[data-works-lightbox]');

if (worksShowcase instanceof HTMLElement && worksLightbox instanceof HTMLElement) {
  const worksLightboxMedia = worksLightbox.querySelector('[data-works-lightbox-media]');
  const worksLightboxPrev = worksLightbox.querySelector('[data-works-lightbox-prev]');
  const worksLightboxNext = worksLightbox.querySelector('[data-works-lightbox-next]');
  const worksLightboxFirstClose = worksLightbox.querySelector('[data-works-lightbox-close]');
  const worksLightboxCloseButtons = Array.from(worksLightbox.querySelectorAll('[data-works-lightbox-close]'));
  const openButtons = Array.from(worksShowcase.querySelectorAll('[data-works-showcase-open]'));
  const showcaseNavButtons = Array.from(worksShowcase.querySelectorAll('[data-works-showcase-nav]'));
  const showcaseTrack = worksShowcase.querySelector('.works-showcase__track');
  const showcaseThumbButtons = Array.from(worksShowcase.querySelectorAll('.works-showcase__thumb'));
  const showcaseThumbs = worksShowcase.querySelector('.works-showcase__thumbs');
  const workCardOpenButtons = Array.from(document.querySelectorAll('[data-work-card-open]'));
  const workCardSliderButtons = Array.from(document.querySelectorAll('[data-work-card-slider]'));
  const worksPanelMoreButton = document.querySelector('[data-works-panel-more]');
  const dragScrollTargets = document.querySelectorAll('[data-drag-scroll]');
  const radioButtons = Array.from(worksShowcase.querySelectorAll('.works-showcase__radio'));
  const body = document.body;

  const items = [
    {
      title: 'Фото 1',
      thumbClass: 'works-lightbox__thumb--gallery-01',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-01.jpg") center 24%/contain no-repeat',
    },
    {
      title: 'Фото 2',
      thumbClass: 'works-lightbox__thumb--gallery-21',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-21.jpg") center 18%/contain no-repeat',
    },
    {
      title: 'Фото 3',
      thumbClass: 'works-lightbox__thumb--gallery-03',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-03.jpg") center 16%/contain no-repeat',
    },
    {
      title: 'Фото 4',
      thumbClass: 'works-lightbox__thumb--gallery-19',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-19.jpg") center 18%/contain no-repeat',
    },
    {
      title: 'Фото 5',
      thumbClass: 'works-lightbox__thumb--gallery-20',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-20.jpg") center 20%/contain no-repeat',
    },
    {
      title: 'Фото 6',
      thumbClass: 'works-lightbox__thumb--gallery-04',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-04.jpg") center 18%/contain no-repeat',
    },
    {
      title: 'Фото 7',
      thumbClass: 'works-lightbox__thumb--gallery-18',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-18.jpg") center 20%/contain no-repeat',
    },
    {
      title: 'Фото 8',
      thumbClass: 'works-lightbox__thumb--gallery-06',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-06.jpg") center 18%/contain no-repeat',
    },
    {
      title: 'Фото 9',
      thumbClass: 'works-lightbox__thumb--gallery-10',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-10.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 10',
      thumbClass: 'works-lightbox__thumb--gallery-11',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-11.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 11',
      thumbClass: 'works-lightbox__thumb--gallery-12',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-12.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 12',
      thumbClass: 'works-lightbox__thumb--gallery-13',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-13.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 13',
      thumbClass: 'works-lightbox__thumb--gallery-14',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-14.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 14',
      thumbClass: 'works-lightbox__thumb--gallery-15',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-15.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 15',
      thumbClass: 'works-lightbox__thumb--gallery-16',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-16.jpg") center 18%/contain no-repeat' ,
    },
    {
      title: 'Фото 16',
      thumbClass: 'works-lightbox__thumb--gallery-17',
      mediaBackground:
        'linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("/assets/gallery/gallery-17.jpg") center 18%/contain no-repeat' ,
    }
  ];

  let activeIndex = 0;
  let lastFocus = null;
  let lightboxMode = 'gallery';
  let customLightboxItems = [];
  let customLightboxIndex = 0;
  worksShowcase.style.setProperty('--works-showcase-count', String(items.length));

  const parseWorkCardSliderItems = (slider) => {
    try {
      const raw = slider.getAttribute('data-work-card-slider-images');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const updateWorkCardSlider = (slider, index) => {
    if (!(slider instanceof HTMLElement)) return;

    const sliderItems = parseWorkCardSliderItems(slider);
    if (!sliderItems.length) return;

    const safeIndex = ((index % sliderItems.length) + sliderItems.length) % sliderItems.length;
    const item = sliderItems[safeIndex];
    slider.dataset.workCardSliderIndex = String(safeIndex);
    slider.style.setProperty('--work-card-image', `url("${item.image}")`);
    slider.style.setProperty('--work-card-position', item.position || '50% 50%');

    const openButton = slider.querySelector('[data-work-card-slider-open]');
    if (openButton instanceof HTMLButtonElement) {
      openButton.setAttribute('aria-label', `Увеличить фото ${item.title || 'Фото'}`);
      openButton.setAttribute('data-work-card-image', item.image);
      openButton.setAttribute('data-work-card-position', item.position || '50% 50%');
      openButton.setAttribute('data-work-card-title', item.title || 'Фото');
    }
  };

  const buildWorkCardLightboxItem = (source) => {
    const image = source instanceof HTMLElement
      ? source.getAttribute('data-work-card-image') || ''
      : source?.image || '';
    const position = source instanceof HTMLElement
      ? source.getAttribute('data-work-card-position') || '50% 50%'
      : source?.position || '50% 50%';
    const title = source instanceof HTMLElement
      ? source.getAttribute('data-work-card-title') ||
        source.querySelector('.work-card__caption h3')?.textContent?.trim() ||
        source.getAttribute('aria-label') ||
        'Фото'
      : source?.title || 'Фото';
    const subtitle = source instanceof HTMLElement
      ? source.querySelector('.work-card__caption p')?.textContent?.trim()
      : source?.subtitle;

    return {
      title,
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${image}") ${position}/contain no-repeat`,
      subtitle,
    };
  };

  const readWorkCardSliderItems = (slider) => parseWorkCardSliderItems(slider);

  const scrollShowcaseThumbIntoView = (index) => {
    const thumb = showcaseThumbButtons[index];
    if (!(thumb instanceof HTMLElement)) return;
    thumb.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const updateShowcaseTrack = (index) => {
    if (!(showcaseTrack instanceof HTMLElement)) return;

    const slideWidth = 100 / items.length;
    showcaseTrack.style.transform = `translateX(-${slideWidth * index}%)`;
  };

  const updateShowcaseThumbState = (index) => {
    showcaseThumbButtons.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('is-active', thumbIndex === index);
    });
  };

  const syncShowcaseRadio = (index) => {
    const radio = radioButtons[index];
    if (radio instanceof HTMLInputElement) {
      radio.checked = true;
    }

    activeIndex = index;
    updateShowcaseTrack(index);
    updateShowcaseThumbState(index);
    scrollShowcaseThumbIntoView(index);
  };

  syncShowcaseRadio(0);

  const renderWorksLightbox = () => {
    const item = lightboxMode === 'custom' ? customLightboxItems[customLightboxIndex] : items[activeIndex];
    if (!item) return;

    if (worksLightboxMedia instanceof HTMLElement) {
      worksLightboxMedia.style.background = item.mediaBackground;
      worksLightboxMedia.setAttribute('aria-label', item.title);
    }

    if (worksLightboxPrev instanceof HTMLButtonElement) {
      worksLightboxPrev.hidden = lightboxMode === 'custom'
        ? customLightboxItems.length < 2
        : items.length < 2;
    }

    if (worksLightboxNext instanceof HTMLButtonElement) {
      worksLightboxNext.hidden = lightboxMode === 'custom'
        ? customLightboxItems.length < 2
        : items.length < 2;
    }
  };

  workCardSliderButtons.forEach((slider) => {
    updateWorkCardSlider(slider, Number(slider.dataset.workCardSliderIndex || 0));

    slider.querySelectorAll('[data-work-card-slider-nav]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const direction = button.getAttribute('data-work-card-slider-nav');
        const currentIndex = Number(slider.dataset.workCardSliderIndex || 0);
        const nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        updateWorkCardSlider(slider, nextIndex);
      });
    });

    const openButton = slider.querySelector('[data-work-card-slider-open]');
    openButton?.addEventListener('click', () => {
      const sliderItems = readWorkCardSliderItems(slider);
      const currentIndex = Number(slider.dataset.workCardSliderIndex || 0);
      openWorkCardLightbox(sliderItems, currentIndex);
    });
  });

  const openWorkCardLightbox = (source, index = 0) => {
    const lightboxItems = Array.isArray(source)
      ? source.map((item) => buildWorkCardLightboxItem(item))
      : [buildWorkCardLightboxItem(source)];

    customLightboxItems = lightboxItems;
    customLightboxIndex = Math.max(0, Math.min(index, lightboxItems.length - 1));
    lightboxMode = 'custom';
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    renderWorksLightbox();
    worksLightbox.hidden = false;
    requestAnimationFrame(() => {
      worksLightbox.classList.add('is-open');
      body.classList.add('is-modal-open');
      if (worksLightboxFirstClose instanceof HTMLButtonElement) {
        worksLightboxFirstClose.focus();
      }
    });
  };

  const openWorksLightbox = (index = 0) => {
    lightboxMode = 'gallery';
    customLightboxItems = [];
    customLightboxIndex = 0;
    activeIndex = Math.max(0, Math.min(index, items.length - 1));
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    syncShowcaseRadio(activeIndex);
    renderWorksLightbox();
    worksLightbox.hidden = false;
    requestAnimationFrame(() => {
      worksLightbox.classList.add('is-open');
      body.classList.add('is-modal-open');
      if (worksLightboxFirstClose instanceof HTMLButtonElement) {
        worksLightboxFirstClose.focus();
      }
    });
  };

  const closeWorksLightbox = () => {
    worksLightbox.classList.remove('is-open');
    body.classList.remove('is-modal-open');
    lightboxMode = 'gallery';
    customLightboxItems = [];
    customLightboxIndex = 0;

    window.setTimeout(() => {
      worksLightbox.hidden = true;
    }, 220);

    if (lastFocus) {
      lastFocus.focus();
      lastFocus = null;
    }
  };

  const moveWorksLightbox = (direction) => {
    if (lightboxMode === 'custom') {
      if (customLightboxItems.length < 2) return;
      customLightboxIndex = (customLightboxIndex + direction + customLightboxItems.length) % customLightboxItems.length;
      renderWorksLightbox();
      return;
    }

    if (items.length < 2) return;
    activeIndex = (activeIndex + direction + items.length) % items.length;
    syncShowcaseRadio(activeIndex);
    renderWorksLightbox();
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-works-showcase-index'));
      openWorksLightbox(Number.isFinite(index) ? index : 0);
    });
  });

  workCardOpenButtons.forEach((button) => {
    button.addEventListener('click', () => {
      openWorkCardLightbox(button);
    });
  });

  const hiddenWorkCards = Array.from(document.querySelectorAll('.works-grid .work-card[hidden]'));
  if (worksPanelMoreButton instanceof HTMLButtonElement) {
    if (!hiddenWorkCards.length) {
      worksPanelMoreButton.hidden = true;
    } else {
      worksPanelMoreButton.addEventListener('click', () => {
        hiddenWorkCards.forEach((card) => {
          card.hidden = false;
        });
        worksPanelMoreButton.hidden = true;
      });
    }
  }

  showcaseNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.getAttribute('data-works-showcase-nav');
      const currentIndex = radioButtons.findIndex((radio) => radio instanceof HTMLInputElement && radio.checked);
      const safeIndex = currentIndex >= 0 ? currentIndex : activeIndex;
      const nextIndex = direction === 'prev'
        ? (safeIndex - 1 + radioButtons.length) % radioButtons.length
        : (safeIndex + 1) % radioButtons.length;

      activeIndex = nextIndex;
      syncShowcaseRadio(activeIndex);
      renderWorksLightbox();
    });
  });

  radioButtons.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      syncShowcaseRadio(index);
      renderWorksLightbox();
    });
  });

  worksLightboxCloseButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      closeWorksLightbox();
    });
  });

  worksLightboxPrev?.addEventListener('click', () => moveWorksLightbox(-1));
  worksLightboxNext?.addEventListener('click', () => moveWorksLightbox(1));

  document.addEventListener('keydown', (event) => {
    if (worksLightbox.hidden) return;

    if (event.key === 'Escape') {
      closeWorksLightbox();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveWorksLightbox(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveWorksLightbox(1);
    }
  });

  const enableDragScroll = (element) => {
    if (!(element instanceof HTMLElement)) return;

    let isDragging = false;
    let dragStarted = false;
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let targetScrollLeft = 0;
    let releaseVelocity = 0;
    let animationFrame = 0;
    let suppressClick = false;

    element.style.cursor = 'grab';

    const clampScrollLeft = (value) => {
      const maxScrollLeft = Math.max(0, element.scrollWidth - element.clientWidth);
      return Math.min(Math.max(0, value), maxScrollLeft);
    };

    const stopAnimation = () => {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const animate = () => {
      const currentScrollLeft = element.scrollLeft;

      if (!isDragging) {
        targetScrollLeft += releaseVelocity;
        releaseVelocity *= 0.92;
      }

      targetScrollLeft = clampScrollLeft(targetScrollLeft);

      const nextScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * (isDragging ? 0.35 : 0.22);
      element.scrollLeft = nextScrollLeft;

      const distance = Math.abs(targetScrollLeft - nextScrollLeft);
      const hasMomentum = !isDragging && Math.abs(releaseVelocity) > 0.08;
      if (distance > 0.5 || hasMomentum) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      element.scrollLeft = targetScrollLeft;
      releaseVelocity = 0;
      animationFrame = 0;
    };

    element.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      isDragging = true;
      dragStarted = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = element.scrollLeft;
      targetScrollLeft = element.scrollLeft;
      releaseVelocity = 0;
      suppressClick = false;

      stopAnimation();
    });

    element.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== pointerId) return;

      const deltaX = event.clientX - startX;
      if (!dragStarted && Math.abs(deltaX) > 6) {
        dragStarted = true;
        element.setPointerCapture(pointerId);
        element.style.cursor = 'grabbing';
      }

      if (!dragStarted) return;

      const nextTarget = clampScrollLeft(startScrollLeft - deltaX);
      releaseVelocity = nextTarget - targetScrollLeft;
      targetScrollLeft = nextTarget;

      suppressClick = true;

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    });

    const finishDrag = (event) => {
      if (!isDragging || event.pointerId !== pointerId) return;

      isDragging = false;
      pointerId = null;

      if (dragStarted && element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      element.style.cursor = 'grab';

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }

      window.setTimeout(() => {
        suppressClick = false;
        dragStarted = false;
      }, 0);
    };

    element.addEventListener('pointerup', finishDrag);
    element.addEventListener('pointercancel', finishDrag);

    element.addEventListener(
      'click',
      (event) => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
  };

  dragScrollTargets.forEach((element) => enableDragScroll(element));
}


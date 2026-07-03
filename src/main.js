import './styles.css';

const siteHeader = document.querySelector('.header');
if (siteHeader instanceof HTMLElement) {
  const syncHeaderState = () => {
    const stickyOffset = window.innerWidth <= 768 ? 220 : 24;
    siteHeader.classList.toggle('is-sticky', window.scrollY > stickyOffset);
  };

  if (window.innerWidth > 768) {
    syncHeaderState();
  } else {
    siteHeader.classList.remove('is-sticky');
  }

  window.addEventListener('scroll', syncHeaderState, { passive: true });
}

const PHONE_MASK_PREFIX = '+7 ';
const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';

const normalizePhoneDigits = (value) => {
  let digits = String(value || '').replace(/\D/g, '');

  // The country code is fixed in the mask, so duplicate leading 7/8 is ignored.
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
};

const formatPhoneValue = (value) => {
  const digits = normalizePhoneDigits(value);
  const parts = [];

  if (digits.length > 0) {
    parts.push(`(${digits.slice(0, 3)}`);
  }

  if (digits.length >= 4) {
    parts[0] += ')';
    parts.push(digits.slice(3, 6));
  }

  if (digits.length >= 7) {
    parts.push(digits.slice(6, 8));
  }

  if (digits.length >= 9) {
    parts.push(digits.slice(8, 10));
  }

  return [PHONE_MASK_PREFIX.trim(), ...parts].join(' ').trimEnd();
};

const applyPhoneMask = (input) => {
  if (!(input instanceof HTMLInputElement)) return;

  const formatted = formatPhoneValue(input.value);
  input.value = formatted === '+7' ? PHONE_MASK_PREFIX : formatted;
};

const initPhoneMask = (input) => {
  if (!(input instanceof HTMLInputElement) || input.dataset.phoneMaskInitialized === 'true') {
    return;
  }

  input.dataset.phoneMaskInitialized = 'true';
  input.placeholder = PHONE_PLACEHOLDER;
  input.autocomplete = 'tel';
  input.inputMode = 'tel';

  applyPhoneMask(input);

  input.addEventListener('focus', () => {
    if (!input.value.trim()) {
      input.value = PHONE_MASK_PREFIX;
    }
  });

  input.addEventListener('input', () => {
    applyPhoneMask(input);
  });

  input.addEventListener('paste', (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    input.value = formatPhoneValue(pastedText);
  });

  input.addEventListener('blur', () => {
    if (normalizePhoneDigits(input.value).length === 0) {
      input.value = '';
    }
  });
};

const initPhoneMasks = (root = document) => {
  if (!(root instanceof Document || root instanceof Element)) return;
  root.querySelectorAll('input[type="tel"]').forEach((input) => {
    initPhoneMask(input);
  });
};

initPhoneMasks();

const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider instanceof HTMLElement) {
  const track = heroSlider.querySelector('[data-hero-slider-track]');
  const prevButton = heroSlider.querySelector('[data-hero-slider-prev]');
  const nextButton = heroSlider.querySelector('[data-hero-slider-next]');
  const sourceCards = Array.from(document.querySelectorAll('.works-grid .work-card')).reverse();
  const autoplayDelay = 5000;
  let currentSlideIndex = 0;
  let autoplayId = null;
  let slides = [];

  if (track instanceof HTMLElement) {
    sourceCards.forEach((card, index) => {
      const slide = document.createElement('figure');
      slide.className = `hero-slider__slide${index === 0 ? ' is-active' : ''}`;
      slide.setAttribute('data-hero-slide', '');
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

      const clone = card.cloneNode(true);
      if (clone instanceof HTMLElement) {
        clone.classList.add('hero-slider__card');

        clone.querySelectorAll('.work-card__nav').forEach((button) => {
          button.remove();
        });

        const photo = clone.querySelector('.work-card__photo');
        if (photo instanceof HTMLElement) {
          photo.classList.add('hero-slider__card-photo');
        }

        const caption = clone.querySelector('.work-card__caption');
        if (caption instanceof HTMLElement) {
          caption.classList.add('hero-slider__caption');
        }
      }

      slide.append(clone);
      track.append(slide);
    });

    slides = Array.from(heroSlider.querySelectorAll('[data-hero-slide]'));
  }

  const updateHeroSlider = (index) => {
    if (!(track instanceof HTMLElement) || slides.length === 0) return;

    currentSlideIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentSlideIndex);
      slide.setAttribute('aria-hidden', slideIndex === currentSlideIndex ? 'false' : 'true');
    });
  };

  const stopHeroSliderAutoplay = () => {
    if (!autoplayId) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  };

  const startHeroSliderAutoplay = () => {
    stopHeroSliderAutoplay();
    if (slides.length < 2) return;
    autoplayId = window.setInterval(() => {
      updateHeroSlider(currentSlideIndex + 1);
    }, autoplayDelay);
  };

  prevButton?.addEventListener('click', () => {
    updateHeroSlider(currentSlideIndex - 1);
    startHeroSliderAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    updateHeroSlider(currentSlideIndex + 1);
    startHeroSliderAutoplay();
  });

  heroSlider.addEventListener('mouseenter', stopHeroSliderAutoplay);
  heroSlider.addEventListener('mouseleave', startHeroSliderAutoplay);
  heroSlider.addEventListener('focusin', stopHeroSliderAutoplay);
  heroSlider.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && heroSlider.contains(event.relatedTarget)) {
      return;
    }
    startHeroSliderAutoplay();
  });

  updateHeroSlider(0);
  startHeroSliderAutoplay();
}

const heroMiniForm = document.querySelector('[data-hero-mini-form]');
if (heroMiniForm instanceof HTMLFormElement) {
  const stages = {
    upload: heroMiniForm.querySelector('[data-hero-stage="upload"]'),
    phone: heroMiniForm.querySelector('[data-hero-stage="phone"]'),
    success: heroMiniForm.querySelector('[data-hero-stage="success"]'),
  };
  const fileInput = heroMiniForm.querySelector('[data-hero-file]');
  const phoneInput = heroMiniForm.querySelector('[data-hero-phone]');
  const fileName = heroMiniForm.querySelector('[data-hero-file-name]');
  const submitButton = heroMiniForm.querySelector('[data-hero-submit]');
  const buttonLabel = heroMiniForm.querySelector('[data-hero-button-label]');
  const timerNode = heroMiniForm.querySelector('[data-hero-timer]');
  const successText = heroMiniForm.querySelector('[data-hero-success-text]');
  const consentInput = heroMiniForm.querySelector('[data-hero-consent]');
  const headerPhone = document.querySelector('.header__contacts .phone')?.textContent?.trim() || '';
  let currentHeroStage = 'upload';
  let heroTimerId = null;

  const setHeroStage = (stage) => {
    currentHeroStage = stage;
    Object.entries(stages).forEach(([key, node]) => {
      if (!(node instanceof HTMLElement)) return;
      node.hidden = key !== stage;
    });

    if (!(buttonLabel instanceof HTMLElement) || !(submitButton instanceof HTMLButtonElement)) return;

    if (stage === 'upload') {
      buttonLabel.textContent = 'Рассчитать за 15 минут';
      submitButton.hidden = false;
      return;
    }

    if (stage === 'phone') {
      buttonLabel.textContent = 'Отправить на расчет';
      submitButton.hidden = false;
      phoneInput?.focus();
      return;
    }

    submitButton.hidden = true;
  };

  const updateHeroTimer = (totalSeconds) => {
    if (!(timerNode instanceof HTMLElement)) return;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerNode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startHeroTimer = () => {
    let remainingSeconds = 15 * 60;
    updateHeroTimer(remainingSeconds);
    if (successText instanceof HTMLElement) {
      successText.textContent = 'Уже рассчитываем вывеску. В ближайшие минуты с Вами свяжется менеджер';
    }

    if (heroTimerId) {
      clearInterval(heroTimerId);
    }

    heroTimerId = window.setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      updateHeroTimer(remainingSeconds);

      if (remainingSeconds === 0 && heroTimerId) {
        clearInterval(heroTimerId);
        heroTimerId = null;
        if (successText instanceof HTMLElement) {
          successText.textContent = `Если менеджер еще не связался с Вами, пожалуйста позвоните нам по номеру: ${headerPhone}`;
        }
      }
    }, 1000);
  };

  fileInput?.addEventListener('change', () => {
    const selectedFile = fileInput.files?.[0];
    if (!(fileName instanceof HTMLElement)) return;
    fileName.textContent = selectedFile?.name || 'PNG, JPG или WEBP';
  });

  submitButton?.addEventListener('click', () => {
    if (currentHeroStage === 'upload') {
      if (!fileInput?.files?.length) {
        fileInput?.focus();
        return;
      }

      setHeroStage('phone');
      return;
    }

    if (currentHeroStage === 'phone') {
      if (!phoneInput?.value.trim()) {
        phoneInput?.focus();
        return;
      }

      if (consentInput instanceof HTMLInputElement && !consentInput.checked) {
        consentInput.focus();
        return;
      }

      setHeroStage('success');
      startHeroTimer();
    }
  });
}

const processCtaForm = document.querySelector('[data-process-cta-form]');
if (processCtaForm instanceof HTMLFormElement) {
  const fileInput = processCtaForm.querySelector('[data-process-cta-file]');
  const phoneInput = processCtaForm.querySelector('[data-process-cta-phone]');
  const fileName = processCtaForm.querySelector('[data-process-cta-file-name]');
  const successPanel = processCtaForm.querySelector('[data-process-cta-success]');
  const successText = processCtaForm.querySelector('[data-process-cta-text]');
  const timerNode = processCtaForm.querySelector('[data-process-cta-timer]');
  const submitButton = processCtaForm.querySelector('[data-process-cta-submit]');
  const formFields = Array.from(processCtaForm.querySelectorAll('[data-process-cta-field]'));
  const headerPhone = document.querySelector('.header__contacts .phone')?.textContent?.trim() || '';
  let processCtaTimerId = null;

  const updateProcessCtaTimer = (totalSeconds) => {
    if (!(timerNode instanceof HTMLElement)) return;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerNode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startProcessCtaTimer = () => {
    let remainingSeconds = 15 * 60;
    updateProcessCtaTimer(remainingSeconds);

    if (successText instanceof HTMLElement) {
      successText.textContent = 'Уже рассчитываем вывеску. В ближайшие минуты с Вами свяжется менеджер';
    }

    if (processCtaTimerId) {
      clearInterval(processCtaTimerId);
    }

    processCtaTimerId = window.setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      updateProcessCtaTimer(remainingSeconds);

      if (remainingSeconds === 0 && processCtaTimerId) {
        clearInterval(processCtaTimerId);
        processCtaTimerId = null;

        if (successText instanceof HTMLElement) {
          successText.textContent = `Если менеджер еще не связался с Вами, пожалуйста позвоните нам по номеру: ${headerPhone}`;
        }
      }
    }, 1000);
  };

  fileInput?.addEventListener('change', () => {
    const selectedFile = fileInput.files?.[0];
    if (!(fileName instanceof HTMLElement)) return;
    fileName.textContent = selectedFile?.name || 'PNG, JPG или WEBP';
  });

  processCtaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!(fileInput instanceof HTMLInputElement) || !fileInput.files?.length) {
      fileInput?.focus();
      return;
    }

    if (!(phoneInput instanceof HTMLInputElement) || !phoneInput.value.trim()) {
      phoneInput?.focus();
      return;
    }

    formFields.forEach((field) => {
      if (field instanceof HTMLElement) {
        field.hidden = true;
      }
    });

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.hidden = true;
    }

    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = false;
    }

    processCtaForm.classList.add('is-success');
    startProcessCtaTimer();
  });
}

const quizStage = document.querySelector('[data-quiz-stage]');
const quizStepLabel = document.querySelector('[data-quiz-step-label]');
const quizProgress = document.querySelector('.quiz-panel__progress');
const quizSection = document.querySelector('.quiz-panel');
const quizCard = document.querySelector('.quiz-panel__card');
const assetModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default',
});

const resolveAssetPath = (path) => {
  if (!path) return '';
  if (/^(?:https?:|data:|blob:)/.test(path)) return path;

  const candidate = path.startsWith('/assets/')
    ? `..${path}`
    : path.startsWith('../')
      ? path
      : `../${path}`;

  return assetModules[candidate] || path;
};

if (quizStage && quizStepLabel && quizProgress) {
  const assetUrl = (fileName) => new URL(`../assets/${fileName}`, import.meta.url).href;
  const uploadOptionLabel = 'Загрузите фото фасада или места установки';
  const headerPhone = document.querySelector('.header__contacts .phone')?.textContent?.trim() || '';

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
    navigation: assetUrl('quiz-format-navigation-sign.png'),
    standalone: assetUrl('quiz-business-other.jpg'),
    undecided: assetUrl('quiz-question.jpg'),
  };

  const steps = [
    {
      key: 'format',
      title: 'Какой тип вывески вам нужен?',
      options: [
        { label: 'Световая вывеска', icon: serviceIcons.light },
        { label: 'Объёмные буквы', icon: serviceIcons.letters },
        { label: 'Световой короб', icon: serviceIcons.salon },
        { label: 'Оформление фасада или входной группы', icon: serviceIcons.facade },
        { label: 'Интерьерная вывеска', icon: serviceIcons.interior },
        { label: 'Навигация, таблички, указатели', icon: serviceIcons.navigation },
        'Пока не знаю — нужна консультация',
      ],
    },
    {
      key: 'place',
      title: 'Где будет установлена вывеска?',
      options: [
        { label: 'На фасаде здания', icon: serviceIcons.facade },
        { label: 'Над входом', icon: serviceIcons.entrance },
        { label: 'В торговом центре', icon: serviceIcons.store },
        { label: 'Внутри помещения', icon: serviceIcons.interior },
        { label: 'На отдельно стоящей конструкции', icon: serviceIcons.standalone },
        { label: 'Ещё не определились', icon: serviceIcons.undecided },
        { label: 'Загрузите фото фасада или места установки', icon: '/assets/add-image.svg' },
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
  let quizSuccessTimerId = null;

  quizProgress.innerHTML = steps.map((_, index) => `<span${index === 0 ? ' class="is-active"' : ''}></span>`).join('');

  const buildQuizFormData = (form) => {
    const formData = new FormData();
    const fields = new FormData(form);

    fields.forEach((value, key) => {
      formData.append(key, value);
    });

    steps.forEach((step) => {
      if (step.contact || typeof state[step.key] === 'undefined') {
        return;
      }

      formData.append(`quiz_${step.key}`, state[step.key]);
    });

    if (state.placePhoto instanceof File) {
      formData.append('place_photo', state.placePhoto, state.placePhoto.name);
    }

    formData.append(
      'quiz_answers',
      JSON.stringify(
        steps
          .filter((step) => !step.contact && typeof state[step.key] !== 'undefined')
          .map((step) => ({
            question: step.title,
            answer: state[step.key],
          })),
      ),
    );

    return formData;
  };

  const submitQuizRequest = async (form) => {
    const endpoint = form.getAttribute('action')?.trim();
    const formData = buildQuizFormData(form);

    if (!endpoint) {
      return;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Quiz submit failed: ${response.status}`);
    }
  };

  const updateQuizTimer = (totalSeconds) => {
    const timerNode = quizStage.querySelector('[data-quiz-success-timer]');
    if (!(timerNode instanceof HTMLElement)) return;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerNode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startQuizSuccessTimer = () => {
    let remainingSeconds = 15 * 60;
    const successText = quizStage.querySelector('[data-quiz-success-text]');

    updateQuizTimer(remainingSeconds);

    if (successText instanceof HTMLElement) {
      successText.textContent = 'Уже рассчитываем вывеску. В ближайшие минуты с Вами свяжется менеджер';
    }

    if (quizSuccessTimerId) {
      clearInterval(quizSuccessTimerId);
    }

    quizSuccessTimerId = window.setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      updateQuizTimer(remainingSeconds);

      if (remainingSeconds === 0 && quizSuccessTimerId) {
        clearInterval(quizSuccessTimerId);
        quizSuccessTimerId = null;

        if (successText instanceof HTMLElement) {
          successText.textContent = `Если менеджер еще не связался с Вами, пожалуйста позвоните нам по номеру: ${headerPhone}`;
        }
      }
    }, 1000);
  };

  const renderQuizSuccess = () => {
    const cardTop = quizCard.querySelector('.quiz-panel__card-top');
    if (cardTop instanceof HTMLElement) {
      cardTop.hidden = true;
    }

    quizStage.innerHTML = `
      <div class="quiz-panel__success">
        <div class="hero-mini-form__success">
          <span class="hero-mini-form__check" aria-hidden="true"></span>
          <div class="hero-mini-form__success-copy">
            <span class="hero-mini-form__timer" data-quiz-success-timer>15:00</span>
            <strong data-quiz-success-text>Уже рассчитываем вывеску. В ближайшие минуты с Вами свяжется менеджер</strong>
          </div>
        </div>
      </div>
    `;

    startQuizSuccessTimer();
  };

  const renderProgress = () => {
    quizStepLabel.textContent = `Шаг ${currentStep + 1} / ${steps.length}`;
    const dots = [...quizProgress.querySelectorAll('span')];
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentStep);
    });
  };

  const renderStep = () => {
    const step = steps[currentStep];
    const useImageLayout = step.key === 'format' || step.key === 'place';
    const cardTop = quizCard.querySelector('.quiz-panel__card-top');

    if (cardTop instanceof HTMLElement) {
      cardTop.hidden = false;
    }

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
              <span>Нажимая кнопку, вы соглашаетесь с <a href="/privacy-policy/index.html" target="_blank" rel="noreferrer">политикой конфиденциальности</a></span>
            </label>
            ${state.placePhoto instanceof File ? `<p class="quiz-panel__file-note">Фото приложено: ${state.placePhoto.name}</p>` : ''}
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

      form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('.quiz-panel__next');
        const phoneField = form.querySelector('input[name="phone"]');
        const consentField = form.querySelector('input[name="consent"]');

        if (phoneField instanceof HTMLInputElement && !phoneField.value.trim()) {
          phoneField.focus();
          return;
        }

        if (consentField instanceof HTMLInputElement && !consentField.checked) {
          consentField.focus();
          return;
        }

        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = true;
          submitButton.textContent = 'Отправляем...';
        }

        try {
          await submitQuizRequest(form);
          renderQuizSuccess();
        } catch (error) {
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявку';
          }
        }
      });

      initPhoneMasks(form);

      return;
    }

    const options = step.options
      .map((option, index) => {
        const entry = typeof option === 'string' ? { label: option, icon: null } : option;
        const value = entry.label;
        const icon = entry.icon;
        const isUploadOption = step.key === 'place' && value === uploadOptionLabel;
        const isUnknown =
          step.key === 'format' && (value === 'Пока не знаю' || value === 'Пока не знаю — нужна консультация');
        const isImageOption = Boolean(icon) && !isUnknown;
        const checked = state[step.key] === value || (index === 0 && state[step.key] == null) ? 'checked' : '';
        const optionClass = isImageOption
          ? 'quiz-panel__option quiz-panel__option--image'
          : 'quiz-panel__option quiz-panel__option--text-only';
        const optionText = isUploadOption && state.placePhoto instanceof File ? state.placePhoto.name : value;

        return `
          <input id="quiz-${step.key}-${index}" class="quiz-panel__radio" type="radio" name="${step.key}" value="${value}" ${checked} />
          <label class="${optionClass}${isUploadOption ? ' quiz-panel__option--upload' : ''}" for="quiz-${step.key}-${index}" ${isUploadOption ? 'data-quiz-upload-trigger' : ''}>
            ${
              isImageOption
                ? `<span class="quiz-panel__option-icon" aria-hidden="true">${icon ? `<img src="${icon}" alt="" />` : ''}</span>`
                : ''
            }
            <span class="quiz-panel__option-text">${optionText.replace(' / ', ' /<br />')}</span>
            ${isUploadOption ? '<span class="quiz-panel__option-hint">JPG, PNG, WEBP</span>' : ''}
          </label>
        `;
      })
      .join('');

    quizStage.innerHTML = `
      <div class="quiz-panel__question">${step.title}</div>
      <div class="quiz-panel__options ${useImageLayout ? 'quiz-panel__options--image' : ''}" role="list" aria-label="Варианты ответа">
        ${options}
      </div>
      ${step.key === 'place' ? '<input class="quiz-panel__file-input" type="file" accept="image/*" data-quiz-file-input hidden />' : ''}
      <div class="quiz-panel__actions">
        <button class="button button--secondary quiz-panel__back" type="button" data-quiz-back ${currentStep === 0 ? 'disabled' : ''}>Назад</button>
        <button class="button button--primary quiz-panel__next" type="button" data-quiz-next>Далее</button>
      </div>
    `;

    const backButton = quizStage.querySelector('[data-quiz-back]');
    const nextButton = quizStage.querySelector('[data-quiz-next]');
    const uploadTrigger = quizStage.querySelector('[data-quiz-upload-trigger]');
    const uploadInput = quizStage.querySelector('[data-quiz-file-input]');

    backButton?.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep -= 1;
        renderStep();
      }
    });

    nextButton?.addEventListener('click', () => {
      const selected = quizStage.querySelector(`input[name="${step.key}"]:checked`);
      if (!selected) return;

      if (step.key === 'place' && selected.value === uploadOptionLabel && !(state.placePhoto instanceof File)) {
        const uploadInput = quizStage.querySelector('[data-quiz-file-input]');
        if (uploadInput instanceof HTMLInputElement) {
          uploadInput.click();
        }
        return;
      }

      state[step.key] = selected.value;
      currentStep = Math.min(steps.length - 1, currentStep + 1);
      renderStep();
    });

    uploadTrigger?.addEventListener('click', (event) => {
      if (!(uploadInput instanceof HTMLInputElement)) {
        return;
      }

      event.preventDefault();

      const relatedRadioId = uploadTrigger.getAttribute('for');
      const relatedRadio = relatedRadioId ? quizStage.querySelector(`#${relatedRadioId}`) : null;

      if (relatedRadio instanceof HTMLInputElement) {
        relatedRadio.checked = true;
      }

      uploadInput.click();
    });

    uploadInput?.addEventListener('change', () => {
      if (!(uploadInput instanceof HTMLInputElement)) {
        return;
      }

      const [file] = uploadInput.files || [];

      if (!file) {
        if (!(state.placePhoto instanceof File)) {
          delete state.place;
          renderStep();
        }

        return;
      }

      state.place = uploadOptionLabel;
      state.placePhoto = file;
      currentStep = Math.min(steps.length - 1, currentStep + 1);
      renderStep();
    });

  };

  quizStage.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'radio') {
      const step = steps[currentStep];
      const isUploadOption = step.key === 'place' && target.value === uploadOptionLabel;

      if (isUploadOption) {
        if (advanceTimer) {
          clearTimeout(advanceTimer);
          advanceTimer = null;
        }

        return;
      }

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

const servicePopup = document.querySelector('[data-service-popup]');

if (servicePopup instanceof HTMLElement) {
  const body = document.body;
  const popupTitle = servicePopup.querySelector('[data-service-popup-title-target]');
  const popupImage = servicePopup.querySelector('[data-service-popup-image]');
  const popupForm = servicePopup.querySelector('[data-service-popup-form]');
  const popupPhone = popupForm?.querySelector('input[name="phone"]');
  const openButtons = Array.from(document.querySelectorAll('[data-service-popup-open]'));
  const closeButtons = Array.from(servicePopup.querySelectorAll('[data-service-popup-close]'));
  let lastFocusedElement = null;

  const resolvePopupImageFromButton = (button) => {
    const serviceCard = button.closest('.service-card');
    const serviceCardImage = serviceCard?.querySelector('.service-card__image');

    if (serviceCardImage instanceof HTMLImageElement) {
      return {
        src: serviceCardImage.currentSrc || serviceCardImage.src,
        alt: serviceCardImage.alt,
      };
    }

    const workCard = button.closest('.work-card');

    if (!(workCard instanceof HTMLElement)) {
      return { src: '', alt: '' };
    }

    const slider = workCard.querySelector('[data-work-card-slider-images]');
    if (slider instanceof HTMLElement) {
      try {
        const rawItems = slider.getAttribute('data-work-card-slider-images');
        const items = rawItems ? JSON.parse(rawItems) : [];
        const currentIndex = Number(slider.getAttribute('data-work-card-slider-index') || 0);
        const currentItem = items[currentIndex] || items[0];

        if (currentItem?.image) {
          return {
            src: currentItem.image,
            alt: currentItem.title || '',
          };
        }
      } catch {
        return { src: '', alt: '' };
      }
    }

    const workCardOpen = workCard.querySelector('[data-work-card-image]');
    if (workCardOpen instanceof HTMLElement) {
      return {
        src: workCardOpen.getAttribute('data-work-card-image') || '',
        alt: workCard.querySelector('.work-card__caption h3')?.textContent?.trim() || '',
      };
    }

    return { src: '', alt: '' };
  };

  const closeServicePopup = () => {
    servicePopup.classList.remove('is-open');
    body.classList.remove('is-modal-open');

    window.setTimeout(() => {
      servicePopup.hidden = true;
    }, 220);

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const openServicePopup = (title, imageSrc = '', imageAlt = '') => {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (popupTitle instanceof HTMLElement) {
      popupTitle.textContent = title;
    }

    if (popupImage instanceof HTMLImageElement) {
      if (imageSrc) {
        popupImage.src = imageSrc;
        popupImage.alt = imageAlt;
        popupImage.hidden = false;
      } else {
        popupImage.hidden = true;
        popupImage.removeAttribute('src');
        popupImage.alt = '';
      }
    }

    if (popupForm instanceof HTMLFormElement) {
      popupForm.reset();
    }

    servicePopup.hidden = false;
    requestAnimationFrame(() => {
      servicePopup.classList.add('is-open');
      body.classList.add('is-modal-open');
      if (popupPhone instanceof HTMLInputElement) {
        popupPhone.focus();
      }
    });
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const title = button.getAttribute('data-service-popup-title') || 'Узнать стоимость вывески';
      const { src, alt } = resolvePopupImageFromButton(button);
      openServicePopup(title, src, alt);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeServicePopup();
    });
  });

  popupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeServicePopup();
    window.location.hash = '#contacts';
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && servicePopup.classList.contains('is-open')) {
      closeServicePopup();
    }
  });
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
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-01.jpg')}") center 24%/contain no-repeat`,
    },
    {
      title: 'Фото 2',
      thumbClass: 'works-lightbox__thumb--gallery-21',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-21.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 3',
      thumbClass: 'works-lightbox__thumb--gallery-03',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-03.jpg')}") center 16%/contain no-repeat`,
    },
    {
      title: 'Фото 4',
      thumbClass: 'works-lightbox__thumb--gallery-19',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-19.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 5',
      thumbClass: 'works-lightbox__thumb--gallery-20',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-20.jpg')}") center 20%/contain no-repeat`,
    },
    {
      title: 'Фото 6',
      thumbClass: 'works-lightbox__thumb--gallery-04',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-04.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 7',
      thumbClass: 'works-lightbox__thumb--gallery-18',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-18.jpg')}") center 20%/contain no-repeat`,
    },
    {
      title: 'Фото 8',
      thumbClass: 'works-lightbox__thumb--gallery-06',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-06.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 9',
      thumbClass: 'works-lightbox__thumb--gallery-10',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-10.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 10',
      thumbClass: 'works-lightbox__thumb--gallery-11',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-11.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 11',
      thumbClass: 'works-lightbox__thumb--gallery-12',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-12.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 12',
      thumbClass: 'works-lightbox__thumb--gallery-13',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-13.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 13',
      thumbClass: 'works-lightbox__thumb--gallery-14',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-14.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 14',
      thumbClass: 'works-lightbox__thumb--gallery-15',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-15.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 15',
      thumbClass: 'works-lightbox__thumb--gallery-16',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-16.jpg')}") center 18%/contain no-repeat`,
    },
    {
      title: 'Фото 16',
      thumbClass: 'works-lightbox__thumb--gallery-17',
      mediaBackground:
        `linear-gradient(180deg, rgba(7, 11, 27, 0.08), rgba(7, 11, 27, 0.08)), url("${resolveAssetPath('/assets/gallery/gallery-17.jpg')}") center 18%/contain no-repeat`,
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
      return raw ? JSON.parse(raw).map((item) => ({
        ...item,
        image: resolveAssetPath(item.image),
      })) : [];
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
      ? resolveAssetPath(source.getAttribute('data-work-card-image') || '')
      : resolveAssetPath(source?.image || '');
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

  const syncShowcaseRadio = (index, { scrollThumb = true } = {}) => {
    const radio = radioButtons[index];
    if (radio instanceof HTMLInputElement) {
      radio.checked = true;
    }

    activeIndex = index;
    updateShowcaseTrack(index);
    updateShowcaseThumbState(index);
    if (scrollThumb) {
      scrollShowcaseThumbIntoView(index);
    }
  };

  syncShowcaseRadio(0, { scrollThumb: false });

  const normalizeWorkCardAssets = () => {
    workCardOpenButtons.forEach((button) => {
      const image = resolveAssetPath(button.getAttribute('data-work-card-image') || '');
      if (image) {
        button.setAttribute('data-work-card-image', image);
      }
    });

    workCardSliderButtons.forEach((slider) => {
      const items = parseWorkCardSliderItems(slider).map((item) => ({
        ...item,
        image: resolveAssetPath(item.image),
      }));

      if (items.length) {
        slider.setAttribute('data-work-card-slider-images', JSON.stringify(items));
        updateWorkCardSlider(slider, Number(slider.dataset.workCardSliderIndex || 0));
      }
    });
  };

  normalizeWorkCardAssets();

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

  const workGridCards = Array.from(document.querySelectorAll('.works-grid .work-card'));
  const hiddenWorkCards = workGridCards.slice(8);

  hiddenWorkCards.forEach((card) => {
    card.hidden = true;
  });

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

const reviewsTrack = document.querySelector('[data-reviews-track]');
const reviewsDots = document.querySelector('[data-reviews-dots]');
const reviewsPrev = document.querySelector('[data-reviews-prev]');
const reviewsNext = document.querySelector('[data-reviews-next]');
const reviewsPlatformButtons = Array.from(document.querySelectorAll('[data-reviews-platform]'));

if (
  reviewsTrack instanceof HTMLElement &&
  reviewsDots instanceof HTMLElement &&
  reviewsPrev instanceof HTMLButtonElement &&
  reviewsNext instanceof HTMLButtonElement &&
  reviewsPlatformButtons.length
) {
  const reviewSets = {
    avito: [
      {
        author: 'Ирина и Павел',
        subtitle: 'Кафе, световая вывеска',
        initial: 'И',
        initialBg: '#6f8498',
        text: 'Все договорённости по срокам и монтажу выполнили. Макет согласовали быстро, на объекте монтажники работали аккуратно и после установки убрали за собой. Вывеска получилась заметной и вечером выглядит особенно хорошо.',
      },
      {
        author: 'Егор',
        subtitle: 'Магазин, объёмные буквы',
        initial: 'Е',
        initialBg: '#e0ad53',
        rating: 4.5,
        text: 'Нужно было сделать вывеску заметной, но не выходить за установленный бюджет. Предложили несколько вариантов, показали визуализацию на фасаде и помогли выбрать оптимальный. Результат полностью устроил.',
      },
      {
        author: 'Марина',
        subtitle: 'Салон красоты, оформление фасада',
        initial: 'М',
        initialBg: '#8a83f1',
        text: 'Понравилась коммуникация. На каждом этапе было понятно, что уже сделано, что находится в работе и когда планируется монтаж. Не приходилось постоянно звонить и уточнять статус заказа.',
      },
      {
        author: 'Сергей',
        subtitle: 'Автосервис, световой короб',
        initial: 'С',
        initialBg: '#7d9c89',
        text: 'Монтаж был непростой из-за расположения фасада, но команда всё заранее осмотрела и подготовила. Приехали без опозданий, установили конструкцию аккуратно и без задержек.',
      },
      {
        author: 'Алексей',
        subtitle: 'Магазин строительных материалов',
        initial: 'А',
        initialBg: '#c98a68',
        text: 'Обратились за изготовлением вывески и оформлением входной группы. Нам предложили единый вариант дизайна, чтобы всё выглядело аккуратно и не было ощущения, что элементы сделаны в разное время. Получилось хорошо.',
      },
      {
        author: 'Ольга',
        subtitle: 'Цветочный магазин, объёмные буквы',
        initial: 'О',
        initialBg: '#5f92d8',
        text: 'Хотелось, чтобы вывеска выглядела нежно, но при этом была заметной с дороги. Дизайнер понял задачу, предложил подходящий цвет и подсветку. После монтажа фасад стал выглядеть намного привлекательнее.',
      },
      {
        author: 'Дмитрий',
        subtitle: 'Магазин автозапчастей',
        initial: 'Д',
        initialBg: '#9b76ff',
        text: 'Заказывали замену старой вывески. Специалисты сами приехали на замер, оценили состояние фасада и предложили более надёжный вариант крепления. Всё сделали в согласованные сроки.',
      },
      {
        author: 'Наталья',
        subtitle: 'Медицинский центр, интерьерная вывеска',
        initial: 'Н',
        initialBg: '#66a38a',
        text: 'Нам было важно, чтобы оформление выглядело спокойно и профессионально. Сделали аккуратную вывеску в фирменных цветах, без лишней яркости. К качеству изготовления и монтажа вопросов нет.',
      },
      {
        author: 'Андрей',
        subtitle: 'Ресторан, входная группа',
        initial: 'А',
        initialBg: '#d08a5c',
        text: 'Понравилось, что нам не пытались продать самый дорогой вариант. Объяснили разницу между материалами и подсветкой, после чего подобрали решение под наш бюджет. Итог выглядит достойно.',
      },
      {
        author: 'Екатерина',
        subtitle: 'Шоурум одежды',
        initial: 'Е',
        initialBg: '#7b88b8',
        rating: 4.5,
        text: 'Макет сделали быстро и сразу показали, как вывеска будет смотреться на фотографии фасада. После небольшой корректировки запустили производство. В реальности получилось практически так же, как на визуализации.',
      },
      {
        author: 'Михаил',
        subtitle: 'Сеть продуктовых магазинов',
        initial: 'М',
        initialBg: '#b8874f',
        text: 'Работали сразу по нескольким объектам. Важно было сохранить одинаковый внешний вид вывесок и уложиться в график открытий. Все конструкции изготовили и установили последовательно, без срывов.',
      },
      {
        author: 'Виктория',
        subtitle: 'Студия маникюра',
        initial: 'В',
        initialBg: '#8a83f1',
        text: 'Это была наша первая вывеска, поэтому мы практически не понимали, какие материалы и размеры нужны. Нам всё объяснили простыми словами, помогли с дизайном и подготовили готовое решение под ключ.',
      },
      {
        author: 'Артём',
        subtitle: 'Фитнес-студия',
        initial: 'А',
        initialBg: '#5d9b8f',
        text: 'Вывеска хорошо читается и днём, и вечером. Подсветка равномерная, отдельные буквы не отличаются по яркости. После установки всё проверили и показали, как правильно включать оборудование.',
      },
      {
        author: 'Роман',
        subtitle: 'Производственная компания',
        initial: 'Р',
        initialBg: '#c98a68',
        text: 'Заказывали фасадную вывеску для нового офиса. Понравилось, что заранее получили понятный расчёт без неожиданных доплат после монтажа. Стоимость осталась такой, как согласовали.',
      },
      {
        author: 'Светлана',
        subtitle: 'Пекарня',
        initial: 'С',
        initialBg: '#6f8498',
        rating: 4.5,
        text: 'Сначала думали установить обычный световой короб, но после замера нам предложили другой вариант. Он оказался немного дороже, зато лучше подошёл к фасаду. Сейчас понимаем, что решение было правильным.',
      },
    ],
    yandex: [
      {
        author: 'Николай',
        subtitle: 'Сервисный центр',
        initial: 'Н',
        initialBg: '#6f8498',
        text: 'Работу выполнили аккуратно. При монтаже не повредили облицовку фасада, проводку спрятали, никаких лишних кабелей не осталось. Вывеска выглядит как часть здания, а не отдельная конструкция.',
      },
      {
        author: 'Анастасия',
        subtitle: 'Салон мебели',
        initial: 'А',
        initialBg: '#e0ad53',
        text: 'Заказывали объёмные буквы и оформление витрин. Дизайн получился современным и при этом хорошо сочетается с нашим интерьером. Клиенты стали чаще замечать салон с дороги.',
      },
      {
        author: 'Павел',
        subtitle: 'Кофейня',
        initial: 'П',
        initialBg: '#8a83f1',
        text: 'Работали в сжатые сроки перед открытием. Сразу предупредили, что реально успеть, а какие идеи лучше оставить на второй этап. Основную вывеску изготовили и установили вовремя.',
      },
      {
        author: 'Юлия',
        subtitle: 'Детский центр',
        initial: 'Ю',
        initialBg: '#7d9c89',
        text: 'Для нас было важно, чтобы оформление получилось ярким, но не выглядело слишком пёстро. Предложенный дизайн понравился и нам, и родителям. Отдельное спасибо за аккуратный монтаж.',
      },
      {
        author: 'Константин',
        subtitle: 'Юридическая компания',
        initial: 'К',
        initialBg: '#c98a68',
        rating: 4.5,
        text: 'Нужна была сдержанная интерьерная вывеска для зоны ресепшена. Сделали несколько вариантов визуализации и помогли подобрать материал. Итог выглядит дорого и соответствует стилю офиса.',
      },
      {
        author: 'Лариса',
        subtitle: 'Магазин косметики',
        initial: 'Л',
        initialBg: '#5f92d8',
        text: 'Очень удобно, что всё сделали в одном месте: замер, макет, производство и установку. Не пришлось отдельно искать дизайнера и монтажников. По срокам тоже всё прошло нормально.',
      },
      {
        author: 'Илья',
        subtitle: 'Барбершоп',
        initial: 'И',
        initialBg: '#9b76ff',
        text: 'Хотели нестандартную вывеску с контражурной подсветкой. Команда помогла доработать нашу идею и подобрать конструкцию, которая подходила фасаду. Вечером смотрится отлично.',
      },
      {
        author: 'Татьяна',
        subtitle: 'Аптека',
        initial: 'Т',
        initialBg: '#66a38a',
        text: 'Нам требовалось заменить старую конструкцию и сохранить привычные фирменные цвета. Новый вариант получился заметнее и аккуратнее предыдущего. Работа выполнена без остановки магазина.',
      },
      {
        author: 'Вадим',
        subtitle: 'Автомойка',
        initial: 'В',
        initialBg: '#d08a5c',
        text: 'Вывеска находится на открытом месте, поэтому переживали за крепление и устойчивость к погоде. На замере всё проверили, предложили усиленную конструкцию. После установки никаких проблем не возникло.',
      },
      {
        author: 'Елена',
        subtitle: 'Туристическое агентство',
        initial: 'Е',
        initialBg: '#7b88b8',
        text: 'Оперативно отвечали на сообщения и не затягивали согласование. Все правки в макет внесли без споров и дополнительных сложностей. В результате получили именно тот вариант, который хотели.',
      },
      {
        author: 'Денис',
        subtitle: 'Магазин электроники',
        initial: 'Д',
        initialBg: '#b8874f',
        text: 'Сравнивали предложения нескольких компаний. Здесь понравился подробный расчёт и то, что сразу объяснили, из чего складывается стоимость. По факту качество соответствует цене.',
      },
      {
        author: 'Кристина',
        subtitle: 'Кондитерская',
        initial: 'К',
        initialBg: '#8a83f1',
        text: 'Вывеска получилась очень аккуратной, особенно понравилась тёплая подсветка. Она не бьёт в глаза, но название хорошо видно с противоположной стороны улицы.',
      },
      {
        author: 'Максим',
        subtitle: 'Офис продаж застройщика',
        initial: 'М',
        initialBg: '#5d9b8f',
        text: 'Работали по брендбуку, поэтому было важно точно попасть в цвета и пропорции логотипа. Перед производством согласовали образцы и визуализацию. Готовая конструкция соответствует требованиям.',
      },
      {
        author: 'Анна',
        subtitle: 'Магазин товаров для дома',
        initial: 'А',
        initialBg: '#c98a68',
        rating: 4.5,
        text: 'После первой консультации стало понятно, какой вариант нам нужен и сколько он будет стоить. Никаких сложных терминов и давления. Спокойно согласовали проект и получили готовую вывеску.',
      },
      {
        author: 'Владимир',
        subtitle: 'Ресторан быстрого питания',
        initial: 'В',
        initialBg: '#6f8498',
        text: 'Заказывали комплексное оформление: вывеску, таблички и навигацию. Все элементы выполнены в одном стиле, посетителям стало проще находить вход и зону выдачи. Работой довольны.',
      },
    ],
  };

  const renderReviewStars = (rating = 5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let index = 0; index < 5; index += 1) {
      let modifier = 'review-card__star--empty';

      if (index < fullStars) {
        modifier = 'review-card__star--full';
      } else if (index === fullStars && hasHalfStar) {
        modifier = 'review-card__star--half';
      }

      stars.push(`<span class="review-card__star ${modifier}">★</span>`);
    }

    return stars.join('');
  };

  let activePlatform = 'avito';
  let currentPage = 0;

  const getVisibleCount = () => {
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const getActiveReviews = () => reviewSets[activePlatform] || [];

  const renderReviews = () => {
    const reviews = getActiveReviews();
    const visibleCount = getVisibleCount();
    const totalPages = Math.max(1, reviews.length - visibleCount + 1);
    currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));
    const visibleReviews = reviews.slice(currentPage, currentPage + visibleCount);

    reviewsTrack.innerHTML = visibleReviews
      .map(
        (review) => `
          <article class="review-card">
            <div class="review-card__top">
              <span class="review-card__initial" style="background-color: ${review.initialBg}">${review.initial}</span>
              <div>
                <p class="review-card__author">${review.author}</p>
                <p class="review-card__subtitle">${review.subtitle}</p>
              </div>
            </div>
            <div class="review-card__stars"><span class="review-card__stars-list">${renderReviewStars(review.rating || 5)}</span><strong>${review.rating || 5}/5</strong></div>
            <p class="review-card__text">${review.text}</p>
          </article>
        `,
      )
      .join('');

    reviewsTrack.style.gridTemplateColumns = `repeat(${visibleReviews.length}, minmax(0, 1fr))`;

    reviewsDots.innerHTML = Array.from({ length: totalPages })
      .map(
        (_, index) =>
          `<button class="reviews-panel__dot${index === currentPage ? ' is-active' : ''}" type="button" data-reviews-dot="${index}" aria-label="Перейти к отзыву ${index + 1}"></button>`,
      )
      .join('');

    reviewsPrev.disabled = currentPage === 0;
    reviewsNext.disabled = currentPage >= totalPages - 1;
  };

  reviewsPlatformButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextPlatform = button.getAttribute('data-reviews-platform');
      if (!nextPlatform || nextPlatform === activePlatform) return;

      activePlatform = nextPlatform;
      currentPage = 0;
      reviewsPlatformButtons.forEach((node) => {
        node.classList.toggle('is-active', node === button);
      });
      renderReviews();
    });
  });

  reviewsPrev.addEventListener('click', () => {
    currentPage -= 1;
    renderReviews();
  });

  reviewsNext.addEventListener('click', () => {
    currentPage += 1;
    renderReviews();
  });

  reviewsDots.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const index = Number(target.getAttribute('data-reviews-dot'));
    if (Number.isNaN(index)) return;
    currentPage = index;
    renderReviews();
  });

  window.addEventListener('resize', renderReviews);
  renderReviews();
}


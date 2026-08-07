// ===========================================================
// GO-LOG — отправка формы заявки через Formspree (без перезагрузки)
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const consentPersonalData = document.getElementById('consentPersonalData');
  const consentPolicy = document.getElementById('consentPolicy');

  function updateSubmitState() {
    if (!submitBtn) return;
    const canSubmit = Boolean(consentPersonalData && consentPolicy && consentPersonalData.checked && consentPolicy.checked);
    submitBtn.disabled = !canSubmit;
  }

  if (consentPersonalData && consentPolicy) {
    [consentPersonalData, consentPolicy].forEach(function (checkbox) {
      checkbox.addEventListener('change', updateSubmitState);
    });
  }

  updateSubmitState();

  // Создаём блоки для сообщений об успехе/ошибке (один раз)
  const successBox = document.createElement('div');
  successBox.className = 'form-success';
  successBox.textContent = 'Спасибо! Заявка отправлена — мы свяжемся с вами в ближайшее время.';

  const errorBox = document.createElement('div');
  errorBox.className = 'form-error';
  errorBox.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам по телефону.';

  form.appendChild(successBox);
  form.appendChild(errorBox);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    successBox.classList.remove('is-visible');
    errorBox.classList.remove('is-visible');

    if (!consentPersonalData || !consentPolicy || !consentPersonalData.checked || !consentPolicy.checked) {
      errorBox.textContent = 'Чтобы отправить заявку, отметьте оба согласия.';
      errorBox.classList.add('is-visible');
      return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          updateSubmitState();
          successBox.classList.add('is-visible');
        } else {
          errorBox.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам по телефону.';
          errorBox.classList.add('is-visible');
        }
      })
      .catch(function () {
        errorBox.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам по телефону.';
        errorBox.classList.add('is-visible');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        updateSubmitState();
      });
  });
});
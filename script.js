// ===========================================================
// GO-LOG — отправка формы заявки через Formspree (без перезагрузки)
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

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

    const submitBtn = form.querySelector('button[type="submit"]');
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
          successBox.classList.add('is-visible');
        } else {
          errorBox.classList.add('is-visible');
        }
      })
      .catch(function () {
        errorBox.classList.add('is-visible');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
  });
});
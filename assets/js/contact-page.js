(function () {
  const form = document.getElementById('contact-message-form');
  if (!form) return;

  const phone = document.getElementById('contact-phone');
  let phonePicker = null;
  if (phone && window.intlTelInput) {
    try {
      phonePicker = window.intlTelInput(phone, {
        initialCountry: 'eg',
        separateDialCode: true,
        countrySearch: true,
        strictMode: true,
        countryOrder: ['eg', 'sa', 'ae', 'gb', 'us'],
        loadUtils: function () {
          return import('https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.0/dist/js/utils.js');
        }
      });

      const syncPhone = function () {
        const country = phonePicker.getSelectedCountryData();
        document.getElementById('contact-phone-full').value = phone.value ? phonePicker.getNumber() : '';
        document.getElementById('contact-phone-country').value = country ? country.iso2 : '';
      };

      phone.addEventListener('input', syncPhone);
      phone.addEventListener('countrychange', syncPhone);
      syncPhone();
    } catch (error) {
      phonePicker = null;
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (phonePicker && phone.value) {
      document.getElementById('contact-phone-full').value = phonePicker.getNumber();
    }
    const success = form.querySelector('.contact-form__success');
    success.classList.add('is-visible');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

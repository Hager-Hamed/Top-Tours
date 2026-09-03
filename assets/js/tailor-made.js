(function () {
  const form = document.getElementById('tailor-request-form');
  if (!form) return;

  form.querySelectorAll('select').forEach(function (select) {
    const control = select.closest('.tailor-control');
    if (!control) return;
    const custom = document.createElement('div');
    custom.className = 'tailor-custom-select';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tailor-custom-select__button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    const list = document.createElement('div');
    list.className = 'tailor-custom-select__menu';
    list.setAttribute('role', 'listbox');

    Array.from(select.options).forEach(function (option) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'tailor-custom-select__option';
      item.textContent = option.textContent;
      item.dataset.value = option.value;
      item.setAttribute('role', 'option');
      item.disabled = option.disabled;
      if (option.selected) item.classList.add('is-selected');
      item.addEventListener('click', function () {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        button.textContent = option.textContent;
        button.classList.toggle('is-placeholder', !option.value);
        list.querySelectorAll('.is-selected').forEach(function (selected) { selected.classList.remove('is-selected'); });
        item.classList.add('is-selected');
        custom.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      });
      list.appendChild(item);
    });

    const selectedOption = select.options[select.selectedIndex];
    button.textContent = selectedOption ? selectedOption.textContent : 'Select an option';
    button.classList.toggle('is-placeholder', !select.value);
    button.addEventListener('click', function () {
      document.querySelectorAll('.tailor-custom-select.is-open').forEach(function (openSelect) {
        if (openSelect !== custom) openSelect.classList.remove('is-open');
      });
      const isOpen = custom.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
    custom.append(button, list);
    control.appendChild(custom);
    select.classList.add('tailor-native-select');
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('.tailor-custom-select')) return;
    document.querySelectorAll('.tailor-custom-select.is-open').forEach(function (custom) {
      custom.classList.remove('is-open');
      custom.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.tailor-custom-select.is-open').forEach(function (custom) {
      custom.classList.remove('is-open');
      custom.querySelector('button').focus();
    });
  });

  form.querySelectorAll('.traveller-card').forEach(function (card) {
    const output = card.querySelector('output');
    const input = card.querySelector('input[type="hidden"]');
    const minimum = card.dataset.traveller === 'adults' ? 1 : 0;

    card.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const current = Number(input.value);
      const next = button.dataset.action === 'plus' ? Math.min(current + 1, 20) : Math.max(current - 1, minimum);
      input.value = next;
      output.textContent = next;
    });
  });

  const phone = document.getElementById('tailor-phone');
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
        document.getElementById('tailor-phone-full').value = phone.value ? phonePicker.getNumber() : '';
        document.getElementById('tailor-phone-country').value = country ? country.iso2 : '';
      };
      phone.addEventListener('input', syncPhone);
      phone.addEventListener('countrychange', syncPhone);
      syncPhone();
    } catch (error) {
      phonePicker = null;
    }
  }

  const arrival = form.elements.arrival;
  const departure = form.elements.departure;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayValue = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  let departurePicker = null;
  if (window.flatpickr) {
    departurePicker = window.flatpickr(departure, {
      minDate: today,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'F j, Y',
      disableMobile: true
    });
    window.flatpickr(arrival, {
      minDate: today,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'F j, Y',
      disableMobile: true,
      onChange: function (selectedDates) {
        const minimum = selectedDates[0] || today;
        departurePicker.set('minDate', minimum);
        if (departurePicker.selectedDates[0] && selectedDates[0] && departurePicker.selectedDates[0] < selectedDates[0]) {
          departurePicker.clear();
        }
        if (!departure.value) departurePicker.open();
      }
    });
  } else {
    [arrival, departure].forEach(function (input) {
      input.type = 'date';
      input.readOnly = false;
      input.min = todayValue;
    });
    arrival.addEventListener('change', function () {
      departure.min = arrival.value || todayValue;
      if (departure.value && departure.value < departure.min) departure.value = '';
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (phonePicker && phone.value) {
      document.getElementById('tailor-phone-full').value = phonePicker.getNumber();
    }
    const message = form.querySelector('.tailor-form__success');
    message.classList.add('is-visible');
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

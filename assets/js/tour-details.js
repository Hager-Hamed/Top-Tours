(() => {
  // Itinerary Accordion
  const days = document.querySelectorAll('.itinerary-day');
  days.forEach((day) => {
    const button = day.querySelector('button');
    const icon = button?.querySelector(':scope > i');
    if (!button) return;
    button.addEventListener('click', () => {
      const willOpen = !day.classList.contains('is-open');
      days.forEach((item) => {
        item.classList.remove('is-open');
        const itemButton = item.querySelector('button');
        const itemIcon = itemButton?.querySelector(':scope > i');
        itemButton?.setAttribute('aria-expanded', 'false');
        itemIcon?.classList.replace('fa-minus', 'fa-plus');
      });
      if (willOpen) {
        day.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        icon?.classList.replace('fa-plus', 'fa-minus');
      }
    });
  });

  // Toggle All Days
  const toggleAllBtn = document.getElementById('toggleAllItinerary');
  let allOpen = false;
  toggleAllBtn?.addEventListener('click', () => {
    allOpen = !allOpen;
    days.forEach((day) => {
      const button = day.querySelector('button');
      const icon = button?.querySelector(':scope > i');
      if (allOpen) {
        day.classList.add('is-open');
        button?.setAttribute('aria-expanded', 'true');
        icon?.classList.replace('fa-plus', 'fa-minus');
      } else {
        day.classList.remove('is-open');
        button?.setAttribute('aria-expanded', 'false');
        icon?.classList.replace('fa-minus', 'fa-plus');
      }
    });
    toggleAllBtn.innerHTML = allOpen 
      ? '<i class="fas fa-compress-alt"></i> Collapse all days' 
      : '<i class="fas fa-expand-alt"></i> Expand all days';
  });

  // Booking Form Submission Feedback
  const bookingForm = document.querySelector('.tour-booking__form');
  const bookingPhone = document.getElementById('tour-phone');
  let bookingPhonePicker = null;

  if (bookingPhone && window.intlTelInput) {
    try {
      bookingPhonePicker = window.intlTelInput(bookingPhone, {
        initialCountry: 'eg',
        separateDialCode: true,
        countrySearch: true,
        strictMode: true,
        countryOrder: ['eg', 'sa', 'ae', 'kw', 'qa', 'gb', 'us'],
        loadUtils: () => import('https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.0/dist/js/utils.js')
      });

      const syncBookingPhone = () => {
        const selectedCountry = bookingPhonePicker.getSelectedCountryData();
        const fullPhone = document.getElementById('tour-phone-full');
        const phoneCountry = document.getElementById('tour-phone-country');
        if (fullPhone) fullPhone.value = bookingPhone.value ? bookingPhonePicker.getNumber() : '';
        if (phoneCountry) phoneCountry.value = selectedCountry?.iso2 || '';
      };
      bookingPhone.addEventListener('input', syncBookingPhone);
      bookingPhone.addEventListener('countrychange', syncBookingPhone);
      syncBookingPhone();
    } catch (error) {
      bookingPhonePicker = null;
    }
  }

  if (window.flatpickr) {
    try {
      window.flatpickr('#tour-travel-date', {
        minDate: 'today',
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'F j, Y',
        disableMobile: true,
        monthSelectorType: 'static'
      });
    } catch (error) {
      document.getElementById('tour-travel-date')?.setAttribute('type', 'date');
    }
  } else {
    document.getElementById('tour-travel-date')?.setAttribute('type', 'date');
  }

  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const status = bookingForm.querySelector('.tour-booking__status');
    if (bookingPhonePicker && bookingPhone.value) {
      document.getElementById('tour-phone-full').value = bookingPhonePicker.getNumber();
    }
    const button = bookingForm.querySelector('.tour-booking__submit');
    if (!button) return;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Request...';
    button.style.background = 'linear-gradient(135deg, var(--tour-teal), #006377)';
    button.style.color = '#fff';
    if (status) status.textContent = 'Your request is ready — taking you to confirmation…';

    setTimeout(() => {
      window.location.href = './thank-you.html';
    }, 900);
  });

  // Save and share actions
  const saveTourButton = document.getElementById('saveTour');
  const shareTourButton = document.getElementById('shareTour');
  const storageKey = 'saved-tour-timeless-egypt';
  try {
    const isSaved = window.localStorage.getItem(storageKey) === 'true';
    saveTourButton?.setAttribute('aria-pressed', String(isSaved));
    if (isSaved && saveTourButton) {
      saveTourButton.querySelector('i')?.classList.replace('far', 'fas');
      saveTourButton.querySelector('span').textContent = 'Saved';
    }
  } catch (error) { /* Storage may be unavailable. */ }

  saveTourButton?.addEventListener('click', () => {
    const next = saveTourButton.getAttribute('aria-pressed') !== 'true';
    saveTourButton.setAttribute('aria-pressed', String(next));
    saveTourButton.querySelector('i')?.classList.toggle('far', !next);
    saveTourButton.querySelector('i')?.classList.toggle('fas', next);
    saveTourButton.querySelector('span').textContent = next ? 'Saved' : 'Save';
    try { window.localStorage.setItem(storageKey, String(next)); } catch (error) { /* no-op */ }
  });

  shareTourButton?.addEventListener('click', async () => {
    const shareData = { title: document.title, text: '13 Days of Timeless Egypt & Nile Cruise', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        shareTourButton.querySelector('span').textContent = 'Link copied';
        window.setTimeout(() => { shareTourButton.querySelector('span').textContent = 'Share'; }, 1800);
      }
    } catch (error) { /* The user may cancel sharing. */ }
  });

  // Traveler counters
  document.querySelectorAll('[data-counter]').forEach((counter) => {
    const output = counter.querySelector('output');
    const input = counter.querySelector('input[type="hidden"]');
    const decrease = counter.querySelector('[data-decrease]');
    const increase = counter.querySelector('[data-increase]');
    const min = Number(counter.dataset.min || 0);
    const max = Number(counter.dataset.max || 20);
    if (!output || !input || !decrease || !increase) return;
    const update = (nextValue) => {
      const value = Math.min(max, Math.max(min, nextValue));
      output.value = value;
      output.textContent = value;
      input.value = value;
      decrease.disabled = value <= min;
      increase.disabled = value >= max;
    };
    decrease?.addEventListener('click', () => update(Number(input.value) - 1));
    increase?.addEventListener('click', () => update(Number(input.value) + 1));
    update(Number(input.value));
  });

  // Sticky Tabs Scrollspy Observer
  const sections = [...document.querySelectorAll('.tour-main > section[id]')];
  const links = [...document.querySelectorAll('.tour-tabs a')];
  if ('IntersectionObserver' in window && sections.length && links.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isTarget = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', isTarget);
        });
      });
    }, { rootMargin: '-20% 0px -65%' });
    sections.forEach((section) => observer.observe(section));
  }

  // ==========================================
  // Interactive Gallery Lightbox Controller
  // ==========================================
  const galleryPhotos = [
    {
      src: "assets/images/New folder/vEgypt Luxury Vacation.webp",
      title: "Luxury Egypt Vacation & Private Nile Cruise Experience",
      caption: "5★ Signature Luxury Tour"
    },
    {
      src: "assets/images/New folder/giza.png",
      title: "The Great Pyramids of Giza & The Sphinx",
      caption: "Cairo & Giza Plateau"
    },
    {
      src: "assets/images/New folder/Egypt Nile Cruise.webp",
      title: "5-Star Deluxe Nile Cruise Sailing",
      caption: "Luxor, Edfu, Kom Ombo to Aswan"
    },
    {
      src: "assets/images/New folder/istockphoto-1173359888-612x612-webp.webp",
      title: "Pristine Red Sea Beachfront Resort",
      caption: "Hurghada Coastal Escape"
    },
    {
      src: "assets/images/New folder/image-473-webp.webp",
      title: "The Grand Egyptian Museum (GEM)",
      caption: "Ancient Egyptian Royal Antiquities"
    },
    {
      src: "assets/images/New folder/Cairo Day Tou.jpg",
      title: "Historic Cairo, Citadel & Vibrant Bazaars",
      caption: "Cairo Cultural Exploration"
    }
  ];

  let currentPhotoIndex = 0;
  const lightbox = document.getElementById('tourLightbox');
  const lightboxImg = document.getElementById('tourLightboxImage');
  const lightboxTitle = document.getElementById('tourLightboxTitle');
  const lightboxCounter = document.getElementById('tourLightboxCounter');
  const lightboxThumbs = document.getElementById('tourLightboxThumbs');
  const btnClose = document.getElementById('tourLightboxClose');
  const btnPrev = document.getElementById('tourLightboxPrev');
  const btnNext = document.getElementById('tourLightboxNext');
  const backdrop = document.getElementById('tourLightboxBackdrop');
  const openGalleryBtn = document.getElementById('openTourLightbox');
  const galleryItems = document.querySelectorAll('.tour-gallery__item');

  // Build Lightbox Thumbnails
  if (lightboxThumbs) {
    lightboxThumbs.innerHTML = galleryPhotos.map((photo, i) => `
      <div class="tour-lightbox__thumb ${i === 0 ? 'is-active' : ''}" data-index="${i}">
        <img src="${photo.src}" alt="${photo.title}">
      </div>
    `).join('');
  }

  function updateLightboxView(index) {
    currentPhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[currentPhotoIndex];
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.title;
        lightboxImg.style.opacity = '1';
      }, 150);
    }
    if (lightboxTitle) lightboxTitle.textContent = photo.title;
    if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryPhotos.length}`;

    // Update thumbnail highlights
    document.querySelectorAll('.tour-lightbox__thumb').forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === currentPhotoIndex);
    });
  }

  function openLightbox(index = 0) {
    if (!lightbox) return;
    updateLightboxView(index);
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners for Gallery
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-gallery-index'), 10) || 0;
      openLightbox(idx);
    });
  });

  openGalleryBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(0);
  });

  btnClose?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);

  btnPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxView(currentPhotoIndex - 1);
  });

  btnNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxView(currentPhotoIndex + 1);
  });

  lightboxThumbs?.addEventListener('click', (e) => {
    const thumb = e.target.closest('.tour-lightbox__thumb');
    if (thumb) {
      const idx = parseInt(thumb.getAttribute('data-index'), 10) || 0;
      updateLightboxView(idx);
    }
  });
  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxView(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxView(currentPhotoIndex + 1);
  });
})();

(() => {
  const gallery = document.querySelector('.tour-gallery');
  if (!gallery) return;

  const main = gallery.querySelector('[data-gallery-main]');
  const figure = gallery.querySelector('.tour-gallery__main');
  const caption = gallery.querySelector('[data-gallery-caption]');
  const current = gallery.querySelector('[data-gallery-current]');
  const thumbs = [...gallery.querySelectorAll('.tour-gallery__thumb')];
  let activeIndex = 0;

  const showImage = (index) => {
    activeIndex = (index + thumbs.length) % thumbs.length;
    const thumb = thumbs[activeIndex];
    figure?.classList.add('is-changing');
    window.setTimeout(() => {
      main.src = thumb.dataset.image;
      main.alt = thumb.dataset.alt || '';
      if (caption) caption.textContent = thumb.dataset.caption || '';
      if (current) current.textContent = String(activeIndex + 1).padStart(2, '0');
      const progress = gallery.querySelector('[data-gallery-progress]');
      if (progress) progress.style.width = `${((activeIndex + 1) / thumbs.length) * 100}%`;
      thumbs.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === activeIndex));
      figure?.classList.remove('is-changing');
    }, 160);
  };

  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => showImage(index)));
  gallery.querySelector('[data-gallery-prev]')?.addEventListener('click', () => showImage(activeIndex - 1));
  gallery.querySelector('[data-gallery-next]')?.addEventListener('click', () => showImage(activeIndex + 1));
  document.getElementById('openTourLightboxNew')?.addEventListener('click', () => {
    document.getElementById('openTourLightbox')?.click();
  });
})();

// ==========================================================================
// INTERACTIVE TOUR ROUTE LEAFLET MAP
// ==========================================================================
(() => {
  const mapElement = document.getElementById('tourInteractiveMap');
  if (!mapElement || typeof L === 'undefined') return;

  // Egypt Tour Stops Data
  const tourStops = [
    {
      id: 'cairo',
      number: '1',
      name: 'Cairo & Giza Plateau',
      days: 'Days 1–3',
      stay: '5★ Luxury Hotel Cairo',
      lat: 29.9792,
      lng: 31.1342,
      zoom: 11,
      image: 'assets/images/New folder/giza.png',
      desc: 'Stand before the Great Pyramids & Sphinx, explore Saqqara Step Pyramid and the treasures of the Grand Egyptian Museum.'
    },
    {
      id: 'luxor',
      number: '2',
      name: 'Luxor & Ancient Thebes',
      days: 'Days 4–5',
      stay: '5★ Deluxe Nile Cruise Ship',
      lat: 25.6995,
      lng: 32.6396,
      zoom: 12,
      image: 'assets/images/New folder/Egypt Nile Cruise.webp',
      desc: 'Marvel at Karnak, Luxor Temple, Valley of the Kings, Hatshepsut Temple, and board your 5★ deluxe cruise.'
    },
    {
      id: 'aswan',
      number: '3',
      name: 'Aswan & Nile Temples',
      days: 'Days 6–7',
      stay: '5★ Deluxe Nile Cruise Ship',
      lat: 24.0889,
      lng: 32.8998,
      zoom: 12,
      image: 'assets/images/New folder/royal-cleopatra-dahabiya-10-webp.webp',
      desc: 'Visit Philae Island Temple, sail the Nile on a private felucca, and explore Edfu and Kom Ombo en route.'
    },
    {
      id: 'hurghada',
      number: '4',
      name: 'Hurghada & Red Sea',
      days: 'Days 8–10',
      stay: '5★ Steigenberger Beach Resort',
      lat: 27.2579,
      lng: 33.8116,
      zoom: 12,
      image: 'assets/images/New folder/istockphoto-1173359888-612x612-webp.webp',
      desc: 'Rest and rejuvenate along turquoise Red Sea shores, private beach cabanas, snorkeling reefs and desert safari.'
    },
    {
      id: 'cairo-return',
      number: '5',
      name: 'Cairo Farewell & Departure',
      days: 'Days 11–13',
      stay: '5★ Luxury Hotel Cairo',
      lat: 30.0444,
      lng: 31.2357,
      zoom: 12,
      image: 'assets/images/New folder/egyptian-museum-webp.webp',
      desc: 'Saladin Citadel, Mosque of Muhammad Ali, celebratory Nile-view farewell dinner and VIP airport sendoff.'
    }
  ];

  // Initialize Map
  const map = L.map('tourInteractiveMap', {
    center: [27.2, 32.3],
    zoom: 6,
    scrollWheelZoom: false, // Prevents unintended zoom on page scroll
    zoomControl: true,
    attributionControl: false
  });

  // Base Map Tiles: Esri World Street Map (Crisp, luxury travel style, free without watermark)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: '&copy; Esri'
  }).addTo(map);

  // Markers and LatLng collection
  const markers = {};
  const latLngs = [];

  tourStops.forEach(stop => {
    latLngs.push([stop.lat, stop.lng]);

    // Custom HTML Pin
    const customIcon = L.divIcon({
      className: 'tour-custom-marker',
      html: `
        <div class="tour-marker-pin">
          <span>${stop.number}</span>
          <div class="tour-marker-pulse"></div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -22]
    });

    // Custom Popup Content
    const popupHtml = `
      <div class="tour-popup-card">
        <div class="tour-popup-card__img">
          <img src="${stop.image}" alt="${stop.name}" loading="lazy" />
          <span class="tour-popup-card__day">${stop.days}</span>
        </div>
        <div class="tour-popup-card__content">
          <h4>${stop.name}</h4>
          <div class="tour-popup-card__stay"><i class="fas fa-bed"></i> ${stop.stay}</div>
          <p class="tour-popup-card__highlights">${stop.desc}</p>
        </div>
      </div>
    `;

    const marker = L.marker([stop.lat, stop.lng], { icon: customIcon })
      .bindPopup(popupHtml, { maxWidth: 300, minWidth: 260 })
      .addTo(map);

    marker.on('click', () => {
      setActiveStop(stop.id, false);
    });

    markers[stop.id] = marker;
  });

  // Route Paths (Polylines)
  // Leg 1: Flight Cairo -> Luxor
  const flightCairoLuxor = L.polyline([
    [29.9792, 31.1342],
    [27.8, 32.1],
    [25.6995, 32.6396]
  ], {
    color: '#e0b86d',
    weight: 3.5,
    dashArray: '7, 8',
    opacity: 0.9
  }).addTo(map);

  // Leg 2: Nile Cruise Luxor -> Edfu -> Kom Ombo -> Aswan
  const cruiseLuxorAswan = L.polyline([
    [25.6995, 32.6396],
    [25.29, 32.55],
    [24.9785, 32.8755],
    [24.4533, 32.9287],
    [24.0889, 32.8998]
  ], {
    color: '#00829b',
    weight: 4,
    opacity: 0.95
  }).addTo(map);

  // Leg 3: Scenic Transfer Aswan -> Hurghada
  const roadAswanHurghada = L.polyline([
    [24.0889, 32.8998],
    [25.6995, 32.6396],
    [26.15, 33.3],
    [27.2579, 33.8116]
  ], {
    color: '#6c828c',
    weight: 3.5,
    dashArray: '4, 6',
    opacity: 0.85
  }).addTo(map);

  // Leg 4: Return Flight Hurghada -> Cairo
  const flightHurghadaCairo = L.polyline([
    [27.2579, 33.8116],
    [28.8, 32.6],
    [30.0444, 31.2357]
  ], {
    color: '#e0b86d',
    weight: 3.5,
    dashArray: '7, 8',
    opacity: 0.9
  }).addTo(map);

  // Route group for fitting bounds
  const routeBounds = L.featureGroup([
    flightCairoLuxor,
    cruiseLuxorAswan,
    roadAswanHurghada,
    flightHurghadaCairo
  ]);

  const fitFullRoute = () => {
    map.fitBounds(routeBounds.getBounds(), {
      padding: [45, 45],
      animate: true
    });
  };

  // Initial fit
  fitFullRoute();

  // Active Stop Highlighting
  const stopButtons = document.querySelectorAll('.tour-map__stop-btn');
  const destCards = document.querySelectorAll('.tour-map__dest-card');

  function setActiveStop(stopId, shouldFly = true) {
    stopButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-stop-id') === stopId);
    });

    if (stopId === 'all') {
      fitFullRoute();
      map.closePopup();
      return;
    }

    const stopData = tourStops.find(s => s.id === stopId);
    if (stopData && markers[stopId]) {
      if (shouldFly) {
        map.flyTo([stopData.lat, stopData.lng], stopData.zoom || 11, {
          duration: 1.2
        });
      }
      markers[stopId].openPopup();
    }
  }

  // Event Listeners for Stop Buttons
  stopButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const stopId = btn.getAttribute('data-stop-id');
      setActiveStop(stopId, true);
    });
  });

  // Event Listeners for Destination Cards
  destCards.forEach(card => {
    const targetId = card.getAttribute('data-stop-target');
    const focusBtn = card.querySelector('.dest-focus-btn');

    const handleFocus = (e) => {
      e.preventDefault();
      setActiveStop(targetId, true);
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    focusBtn?.addEventListener('click', handleFocus);
    card.addEventListener('click', (e) => {
      if (e.target.closest('.dest-focus-btn')) return;
      handleFocus(e);
    });
  });

  // Reset Button
  document.getElementById('tourMapResetBtn')?.addEventListener('click', () => {
    setActiveStop('all', false);
  });

  // Invalidate size when user clicks on "#map" tab in the navigation
  document.querySelectorAll('a[href="#map"]').forEach(tab => {
    tab.addEventListener('click', () => {
      window.setTimeout(() => {
        map.invalidateSize();
        fitFullRoute();
      }, 300);
    });
  });

  window.addEventListener('resize', () => {
    map.invalidateSize();
  });
})();

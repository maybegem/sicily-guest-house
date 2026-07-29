/**
 * Sicily Guest House - Client Application Logic
 * WhatsApp Integration with Unified Range Date Picker (Clean Text Format)
 */

document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '393288160754'; // Destination WhatsApp Number

  // Calculate default dates (tomorrow to +3 days)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextThreeDays = new Date(today);
  nextThreeDays.setDate(nextThreeDays.getDate() + 4);

  let selectedDatesRange = [tomorrow, nextThreeDays];

  // ------------------------------------------------------------------
  // 1. Initialize Flatpickr Single-Range Calendar
  // ------------------------------------------------------------------
  const dateRangeInput = document.getElementById('date-range');
  let rangePicker = null;

  if (dateRangeInput && typeof flatpickr !== 'undefined') {
    rangePicker = flatpickr("#date-range", {
      mode: "range",
      minDate: "today",
      dateFormat: "d/m/Y",
      locale: "it",
      // Show 2 months on desktop, 1 month on mobile for maximum comfort
      showMonths: window.innerWidth > 768 ? 2 : 1,
      defaultDate: selectedDatesRange,
      animate: true,
      onChange: function(selectedDates) {
        selectedDatesRange = selectedDates;
      }
    });

    // Adjust months on window resize
    window.addEventListener('resize', () => {
      if (rangePicker) {
        rangePicker.set('showMonths', window.innerWidth > 768 ? 2 : 1);
      }
    });
  }

  // ------------------------------------------------------------------
  // 2. WhatsApp Form Handler (Clean Text without Emojis)
  // ------------------------------------------------------------------
  const bookingForm = document.getElementById('whatsapp-booking-form');
  const guestsSelect = document.getElementById('guests');
  const roomSelect = document.getElementById('room-choice');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!selectedDatesRange || selectedDatesRange.length < 2) {
        alert('Per favore seleziona sia la data di Check-in che di Check-out sul calendario!');
        if (rangePicker) rangePicker.open();
        return;
      }

      const checkinFormatted = formatDateItalian(selectedDatesRange[0]);
      const checkoutFormatted = formatDateItalian(selectedDatesRange[1]);
      const nights = Math.round((selectedDatesRange[1] - selectedDatesRange[0]) / (1000 * 60 * 60 * 24));
      const guestsCount = guestsSelect ? guestsSelect.value : '2 persone';
      const selectedRoom = roomSelect ? roomSelect.value : 'qualsiasi camera';

      // Clean, professional plain-text WhatsApp message
      const message = `Ciao Sicily Guest House!\n` +
                      `Vorrei verificare la disponibilità per un soggiorno a Palermo:\n\n` +
                      `- Check-in: ${checkinFormatted}\n` +
                      `- Check-out: ${checkoutFormatted} (${nights} nott${nights === 1 ? 'e' : 'i'})\n` +
                      `- Ospiti: ${guestsCount}\n` +
                      `- Sistemazione: ${selectedRoom}\n\n` +
                      `Potete darmi conferma sulla disponibilità e sui prezzi? Grazie!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');
    });
  }

  function formatDateItalian(dateObj) {
    if (!dateObj) return '';
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // ------------------------------------------------------------------
  // 3. Sticky Header Scroll & Active Link Tracking
  // ------------------------------------------------------------------
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-list a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // ------------------------------------------------------------------
  // 4. Mobile Navigation Drawer Toggle
  // ------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }

  // ------------------------------------------------------------------
  // 5. Lightbox Photo Gallery Modal
  // ------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryItems.length && lightboxModal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-src');
        const captionText = item.getAttribute('data-caption');

        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText || '';
        lightboxModal.style.display = 'flex';
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightboxModal.style.display = 'none';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
      }
    });
  }

  // ------------------------------------------------------------------
  // 6. FAQ Accordion Toggle
  // ------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });

      faqItem.classList.toggle('active');
    });
  });

});

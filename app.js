/**
 * Sicily Guest House - Client Application Logic
 * WhatsApp Integration & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------
  // 1. WhatsApp Dynamic Booking Form Handler
  // ------------------------------------------------------------------
  const bookingForm = document.getElementById('whatsapp-booking-form');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const guestsSelect = document.getElementById('guests');
  const roomSelect = document.getElementById('room-choice');

  const WHATSAPP_NUMBER = '393288160754'; // Destination WhatsApp Number

  // Set intelligent default dates if empty
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextThreeDays = new Date(today);
  nextThreeDays.setDate(nextThreeDays.getDate() + 4);

  if (checkinInput && checkoutInput) {
    checkinInput.valueAsDate = tomorrow;
    checkoutInput.valueAsDate = nextThreeDays;
    checkinInput.min = today.toISOString().split('T')[0];
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkinDate = formatDateItalian(checkinInput.value);
      const checkoutDate = formatDateItalian(checkoutInput.value);
      const guestsCount = guestsSelect.value;
      const selectedRoom = roomSelect.value;

      // Construct friendly WhatsApp message
      const message = `Ciao Sicily Guest House! 👋\n` +
                      `Vorrei verificare la disponibilità per un soggiorno a Palermo:\n\n` +
                      `📅 Check-in: ${checkinDate}\n` +
                      `📅 Check-out: ${checkoutDate}\n` +
                      `👥 Ospiti: ${guestsCount}\n` +
                      `🛏️ Sistemazione: ${selectedRoom}\n\n` +
                      `Potete darmi maggiori informazioni e prezzi? Grazie mille!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');
    });
  }

  function formatDateItalian(dateString) {
    if (!dateString) return 'Data non indicata';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  }

  // ------------------------------------------------------------------
  // 2. Sticky Header Scroll Effect
  // ------------------------------------------------------------------
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Navigation Link Highlight
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
  // 3. Mobile Navigation Drawer Toggle
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

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }

  // ------------------------------------------------------------------
  // 4. Lightbox Photo Gallery Modal
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
  // 5. FAQ Accordion Toggle
  // ------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      
      // Close other active FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });

      // Toggle current FAQ
      faqItem.classList.toggle('active');
    });
  });

});

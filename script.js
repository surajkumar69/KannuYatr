/* 
 * Kannu Yatri - Luxury Travel Booking Website JS Controller (English Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- PRELOADER REMOVAL ---
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1000); // 1 second buffer to show premium load animations
  });

  // Fallback in case load event does not fire
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 3500);

  // --- SCROLL PROGRESS & STICKY HEADER ---
  const header = document.getElementById('main-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update progress bar width
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    // Header scrolled state
    if (winScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (winScroll > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }

    // Active navigation highlight on scroll
    highlightNavLinkOnScroll();
  });

  // Back to Top Click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- MOBILE NAVIGATION BAR ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'bx bx-x';
      } else {
        icon.className = 'bx bx-menu';
      }
    });
  }

  // Close mobile menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').className = 'bx bx-menu';
      }
    });
  });

  // Navigation active highlighting on scroll
  function highlightNavLinkOnScroll() {
    const sections = document.querySelectorAll('section, footer');
    let scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    
    sections.forEach(currLink => {
      const top = currLink.offsetTop - 120;
      const bottom = top + currLink.offsetHeight;
      const id = currLink.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --- 3D TILT ANIMATION FOR CARDS ---
  const tiltCards = document.querySelectorAll('.booking-card, .package-card, .why-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      // Calculate rotation angles
      const rotateX = (yc - y) / 12; // tilt vertical
      const rotateY = (x - xc) / 12; // tilt horizontal
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --- ANIMATED COUNTERS FOR STATS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  const speed = 150;
  
  if (statNumbers.length > 0) {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      
      const animate = () => {
        const currentText = counter.innerText.replace('+', '');
        const count = +currentText;
        const increment = Math.ceil(target / speed);
        
        if (count < target) {
          counter.innerText = Math.min(target, count + increment);
          setTimeout(animate, 15);
        } else {
          counter.innerText = target;
        }
      };

      const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
          animate();
          observer.unobserve(counter);
        }
      }, { threshold: 0.6 });

      observer.observe(counter);
    });
  }

  // --- INITIALIZE CAB DATES TO TODAY ---
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.min = today;
    input.value = today;
  });

});

// --- TOAST NOTIFICATIONS ---
function showToast(message, iconClass = 'bx bx-check-circle') {
  const toastBox = document.getElementById('toast-box');
  if (!toastBox) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${message}</span>
  `;
  toastBox.appendChild(toast);
  
  // Remove element after 4s
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s reverse forwards ease-in';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// --- BOOKING TAB SWITCHERS ---
function switchBookingTab(tabName) {
  // Reset tab buttons
  document.querySelectorAll('.booking-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  // Reset panels
  document.querySelectorAll('.booking-content-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  // Activate selected
  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  const activePanel = document.getElementById(`panel-${tabName}`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');

  const tabTitle = tabName === 'cab' ? 'Cab' : tabName === 'bus' ? 'Bus' : 'Hotel';
  showToast(`${tabTitle} booking panel activated`, 'bx bx-navigation');
}

function setActiveBookingTab(tabName) {
  // Scrolls to booking section
  const section = document.getElementById('booking-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    switchBookingTab(tabName);
  }
}

// --- CAB SUB TAB SWITCHERS ---
function switchCabSubTab(subTabName) {
  // Reset sub buttons
  document.querySelectorAll('.cab-sub-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  // Reset sub forms
  document.querySelectorAll('.cab-form-panel').forEach(form => {
    form.classList.remove('active');
  });

  // Activate selected
  const activeBtn = document.getElementById(`sub-cab-${subTabName}`);
  const activeForm = document.getElementById(`form-cab-${subTabName}`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activeForm) activeForm.classList.add('active');
}

// Driver Charges Calculator (Est. Distance * 2 INR)
function calculateDriverCharge(distance) {
  const totalBox = document.getElementById('driver-charge-calc-box');
  const totalText = document.getElementById('driver-charge-total');
  
  if (distance && distance > 0) {
    const charge = distance * 2;
    totalText.innerText = `₹${charge.toLocaleString('en-IN')}`;
    totalBox.style.display = 'flex';
  } else {
    totalBox.style.display = 'none';
  }
}

// Scroll to section helper
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- GALLERY FILTERS ---
function filterGallery(category) {
  // Active state buttons
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`.gallery-filter-btn[onclick="filterGallery('${category}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Filter items
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (category === 'all') {
      item.style.display = 'block';
    } else {
      if (item.classList.contains(category)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  });
}

// --- FAQ ACCORDION TOGGLER ---
function toggleFaq(index) {
  const faqItem = document.getElementById(`faq-item-${index}`);
  const isOpen = faqItem.classList.contains('active');
  
  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
    const answer = item.querySelector('.faq-answer');
    answer.style.maxHeight = null;
  });

  // Open the target one if not already open
  if (!isOpen) {
    faqItem.classList.add('active');
    const answer = faqItem.querySelector('.faq-answer');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// --- TESTIMONIAL SLIDER ---
let currentReviewIndex = 0;
const reviewsSlider = document.getElementById('reviews-slider');
const totalReviews = 3; // Slides count

function updateReviewSlider() {
  if (reviewsSlider) {
    reviewsSlider.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
  }
}

function nextReview() {
  currentReviewIndex = (currentReviewIndex + 1) % totalReviews;
  updateReviewSlider();
}

function prevReview() {
  currentReviewIndex = (currentReviewIndex - 1 + totalReviews) % totalReviews;
  updateReviewSlider();
}

// Auto scroll testimonials every 6 seconds
setInterval(nextReview, 6000);

// --- FORMS SUBMIT HANDLERS ---
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const phone = document.getElementById('contact-phone').value;
  const subject = document.getElementById('contact-subject').value;
  
  // Custom feedback notification
  showToast(`Thank you, ${name}. Your message has been received.`, 'bx bx-badge-check');
  showToast(`Our representative will contact you shortly.`, 'bx bx-chat');
  
  document.getElementById('main-contact-form').reset();
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  showToast(`Subscription successful! Registered ${email}.`, 'bx bx-mail-send');
  document.getElementById('newsletter-form').reset();
}

// --- INTERACTIVE SEARCH MODAL HANDLERS ---
const modalOverlay = document.getElementById('search-modal');
const modalTitle = document.getElementById('modal-title-text');
const modalBody = document.getElementById('modal-body-content');

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = 'auto'; // Release scroll
  }
}

// Closing modal on overlay click
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

function handleSearch(type, subtype, event) {
  if (event) event.preventDefault();
  
  openModal();
  
  // Inject Loading Spinner
  modalTitle.innerText = "Searching...";
  modalBody.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 0;">
      <i class="bx bx-loader-alt bx-spin" style="font-size: 3.5rem; color: var(--color-gold); margin-bottom: 20px;"></i>
      <p style="color: var(--color-text-muted);">Fetching premium travel options from Kannu Yatri servers...</p>
    </div>
  `;

  // Simulate server response delay of 1.2 seconds for realistic loading
  setTimeout(() => {
    renderSearchResults(type, subtype);
  }, 1200);
}

function renderSearchResults(type, subtype) {
  if (type === 'cab') {
    modalTitle.innerText = `Available Cab Options (${subtype === 'oneway' ? 'One Way' : subtype === 'round' ? 'Round Trip' : 'Driver Only'})`;
    
    // Cabs mockup list
    let pickupVal = document.getElementById(`cab-${subtype === 'oneway' ? 'ow' : subtype === 'round' ? 'rt' : 'dr'}-pickup`).value;
    let dropVal = document.getElementById(`cab-${subtype === 'oneway' ? 'ow' : subtype === 'round' ? 'rt' : 'dr'}-drop`).value;
    
    modalBody.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 15px;">
        <span style="color:var(--color-gold); font-size:0.9rem; font-weight:600;">ROUTE:</span>
        <strong style="color:#FFF; font-size:1.1rem;">${pickupVal} ➔ ${dropVal}</strong>
      </div>
      <div class="modal-results-list">
        
        <div class="result-item glass-panel">
          <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Luxury Sedan">
          <div class="result-details">
            <h4>Maruti Dzire / Hyundai Xcent (Sedan)</h4>
            <div class="result-meta">
              <span><i class="bx bx-user"></i> 4+1 Seats</span>
              <span><i class="bx bx-check-shield"></i> AC & Luggage Space</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 4.8</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">Clean interiors, background-verified driver, and real-time GPS tracking.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹${subtype === 'round' ? '18/KM' : '10/KM'}</span>
            <button class="btn-gold" onclick="confirmBooking('cab', 'Sedan', '${pickupVal}', '${dropVal}')">Book Cab</button>
          </div>
        </div>

        <div class="result-item glass-panel">
          <img src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Luxury SUV">
          <div class="result-details">
            <h4>Maruti Ertiga / Toyota Innova (SUV)</h4>
            <div class="result-meta">
              <span><i class="bx bx-user"></i> 6+1 Seats</span>
              <span><i class="bx bx-check-shield"></i> Dual AC & Roof Carrier</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 4.9</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">Excellent family utility vehicle designed for comfortable long-distance tours.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹${subtype === 'round' ? '22/KM' : '14/KM'}</span>
            <button class="btn-gold" onclick="confirmBooking('cab', 'SUV', '${pickupVal}', '${dropVal}')">Book Cab</button>
          </div>
        </div>

        <div class="result-item glass-panel">
          <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Premium SUV">
          <div class="result-details">
            <h4>Toyota Innova Crysta (Premium SUV)</h4>
            <div class="result-meta">
              <span><i class="bx bx-user"></i> 6+1 Seats</span>
              <span><i class="bx bx-crown"></i> VIP Captain Seats & Premium Rides</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 5.0</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">Premium interior layout with shock-absorbent suspension for a royal commute.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹${subtype === 'round' ? '26/KM' : '18/KM'}</span>
            <button class="btn-gold" onclick="confirmBooking('cab', 'Innova Crysta', '${pickupVal}', '${dropVal}')">Book Cab</button>
          </div>
        </div>

      </div>
    `;
  }
  
  else if (type === 'bus') {
    modalTitle.innerText = "Available Bus Options";
    let busFrom = document.getElementById('bus-from').value;
    let busTo = document.getElementById('bus-to').value;
    
    modalBody.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 15px;">
        <span style="color:var(--color-gold); font-size:0.9rem; font-weight:600;">ROUTE:</span>
        <strong style="color:#FFF; font-size:1.1rem;">${busFrom} ➔ ${busTo}</strong>
      </div>
      <div class="modal-results-list">
        
        <div class="result-item glass-panel">
          <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: rgba(212,175,55,0.05); border-radius: 6px; font-size: 2.2rem; color: var(--color-gold); border: 1px solid var(--color-border);">
            <i class="bx bx-bus"></i>
          </div>
          <div class="result-details">
            <h4>Kannu Yatri Sleeper 2+1 A/C Coach</h4>
            <div class="result-meta">
              <span><i class="bx bx-time-five"></i> 9:30 PM Departs</span>
              <span><i class="bx bx-couch"></i> 12 Seats Left</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 4.7</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">USB charging sockets, sterilized blankets, and packaged mineral water included.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹850</span>
            <button class="btn-gold" onclick="selectBusSeats('Volvo AC 2+1')">Select Seats</button>
          </div>
        </div>

        <div class="result-item glass-panel">
          <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: rgba(212,175,55,0.05); border-radius: 6px; font-size: 2.2rem; color: var(--color-gold); border: 1px solid var(--color-border);">
            <i class="bx bx-bus"></i>
          </div>
          <div class="result-details">
            <h4>Kannu Yatri Volvo Multi-Axle Ultra VIP</h4>
            <div class="result-meta">
              <span><i class="bx bx-time-five"></i> 10:15 PM Departs</span>
              <span><i class="bx bx-couch"></i> 8 Seats Left</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 4.9</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">Premium air suspension system, clean cabins, and flatbed sleeper berths.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹1,200</span>
            <button class="btn-gold" onclick="selectBusSeats('Volvo Multi-Axle VIP')">Select Seats</button>
          </div>
        </div>

      </div>
    `;
  }
  
  else if (type === 'hotel') {
    modalTitle.innerText = "Available Hotel Options";
    let city = document.getElementById('hotel-city').value;
    
    modalBody.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 15px;">
        <span style="color:var(--color-gold); font-size:0.9rem; font-weight:600;">CITY:</span>
        <strong style="color:#FFF; font-size:1.1rem;">${city}</strong>
      </div>
      <div class="modal-results-list">
        
        <div class="result-item glass-panel">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Deluxe Room">
          <div class="result-details">
            <h4>Kannu Yatri Palace Heritage Resort</h4>
            <div class="result-meta">
              <span><i class="bx bx-wifi"></i> Free High-speed Wi-Fi</span>
              <span><i class="bx bx-restaurant"></i> Breakfast Included</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 4.8</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">Royal Rajputana-themed spacious accommodations with beautiful garden views.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹3,499 / night</span>
            <button class="btn-gold" onclick="confirmBooking('hotel', 'Heritage Resort', '${city}')">Book Now</button>
          </div>
        </div>

        <div class="result-item glass-panel">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Luxury Suite">
          <div class="result-details">
            <h4>Lake View Luxury Suites & Villas</h4>
            <div class="result-meta">
              <span><i class="bx bx-swim"></i> Swimming Pool Access</span>
              <span><i class="bx bx-coffee"></i> VIP lounge & Minibar</span>
              <span><i class="bx bxs-star" style="color:var(--color-gold);"></i> 5.0</span>
            </div>
            <p style="font-size:0.75rem; margin-top:5px; color:var(--color-text-muted);">Scenic lakefront balconies with premium room layout and personal butler services.</p>
          </div>
          <div class="result-action">
            <span class="result-price">₹6,499 / night</span>
            <button class="btn-gold" onclick="confirmBooking('hotel', 'Lake View Luxury Suite', '${city}')">Book Now</button>
          </div>
        </div>

      </div>
    `;
  }
}

// --- SEAT PICKER FOR BUS BOOKING ---
let selectedSeats = [];
const seatPrice = 850;

function selectBusSeats(busModel) {
  modalTitle.innerText = `Select Seats - ${busModel}`;
  selectedSeats = [];
  
  let seatGridHTML = '';
  // Generate 24 Mock Seats (4x6 layout)
  for (let i = 1; i <= 24; i++) {
    const isOccupied = i === 3 || i === 7 || i === 12 || i === 18 || i === 22;
    seatGridHTML += `
      <div class="seat ${isOccupied ? 'occupied' : ''}" 
           onclick="${isOccupied ? '' : `toggleSeatSelect(this, ${i})`}" 
           data-seat-num="${i}">
        ${i}
      </div>
    `;
  }

  modalBody.innerHTML = `
    <div class="seat-map-container">
      <div style="background: rgba(255,255,255,0.05); width: 100%; text-align: center; padding: 8px; border-radius: 4px; color: var(--color-gold); font-size: 0.8rem; letter-spacing: 1px; border: 1px solid var(--color-border-light);">
        DRIVER CABIN / FRONT
      </div>
      
      <div class="seat-grid">
        ${seatGridHTML}
      </div>

      <div class="seat-legend">
        <div class="legend-item"><div class="box"></div><span>Available</span></div>
        <div class="legend-item sel"><div class="box"></div><span>Selected</span></div>
        <div class="legend-item occ"><div class="box"></div><span>Occupied</span></div>
      </div>

      <div style="width: 100%; border-top: 1px solid var(--color-border-light); padding-top: 20px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.85rem; color: var(--color-text-muted);">Selected Seats: <strong id="selected-seats-num" style="color:var(--color-gold);">-</strong></span>
          <br>
          <span style="font-size: 1.1rem; color: #FFF; font-weight:600;">Total Fare: <strong id="total-seat-price" style="color:var(--color-gold);">₹0</strong></span>
        </div>
        <button class="btn-gold" id="btn-confirm-seats" onclick="confirmBusBooking('${busModel}')" disabled>Confirm Seats</button>
      </div>
    </div>
  `;
}

function toggleSeatSelect(seatElement, seatNumber) {
  if (seatElement.classList.contains('selected')) {
    seatElement.classList.remove('selected');
    selectedSeats = selectedSeats.filter(s => s !== seatNumber);
  } else {
    seatElement.classList.add('selected');
    selectedSeats.push(seatNumber);
  }

  const seatsNum = document.getElementById('selected-seats-num');
  const totalPrice = document.getElementById('total-seat-price');
  const confirmBtn = document.getElementById('btn-confirm-seats');

  if (selectedSeats.length > 0) {
    seatsNum.innerText = selectedSeats.join(', ');
    totalPrice.innerText = `₹${(selectedSeats.length * seatPrice).toLocaleString('en-IN')}`;
    confirmBtn.removeAttribute('disabled');
  } else {
    seatsNum.innerText = '-';
    totalPrice.innerText = '₹0';
    confirmBtn.setAttribute('disabled', 'true');
  }
}

// --- BOOKING CONFIRMATIONS ---
function confirmBusBooking(busModel) {
  const seats = selectedSeats.join(', ');
  const total = selectedSeats.length * seatPrice;
  const bookingID = 'KYB' + Math.floor(100000 + Math.random() * 900000);
  
  modalTitle.innerText = "Booking Successful!";
  modalBody.innerHTML = `
    <div style="text-align: center; padding: 30px 10px;">
      <i class="bx bxs-check-circle" style="font-size: 4.5rem; color: #25D366; margin-bottom: 20px;"></i>
      <h3 style="font-family: var(--font-body); font-weight:700; font-size:1.5rem; margin-bottom: 10px; color:#FFF;">Ticket Booked Successfully</h3>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width:550px; margin: 0 auto 25px;">
        Seat number(s) <strong>${seats}</strong> registered under Reference ID: <strong>${bookingID}</strong>.
      </p>

      <div class="glass-panel" style="padding: 20px; max-width:480px; margin: 0 auto 30px; text-align: left; border: 1px dashed var(--color-gold);">
        <h4 style="color:var(--color-gold); margin-bottom: 10px;"><i class="bx bx-info-circle"></i> Important Instructions:</h4>
        <p style="font-size: 0.85rem; line-height: 1.6;">
          • The complete travel ticket details have been sent to your registered mobile number via SMS / WhatsApp.<br>
          • For instant payment confirmation or assistance, please contact our support lines:<br>
          <strong style="color: var(--color-gold); font-size: 1rem;"><i class="bx bx-phone-call"></i> +91 9131964831 / +91 9680480116</strong>
        </p>
      </div>

      <div style="display:flex; justify-content:center; gap:15px;">
        <a href="https://wa.me/919131964831?text=Booking%20Confirmation%20Request%20ID%20${bookingID}" target="_blank" class="btn-gold" style="background:#25D366; border-color:#25D366; color:#FFF!important;">
          <i class="bx bxl-whatsapp"></i> Confirm on WhatsApp
        </a>
        <button class="btn-outline" onclick="closeModal()">Close Window</button>
      </div>
    </div>
  `;
  showToast("Bus booking request submitted successfully!", "bx bx-check-double");
}

function confirmBooking(serviceType, modelName, loc1, loc2 = '') {
  const bookingID = 'KYC' + Math.floor(100000 + Math.random() * 900000);
  modalTitle.innerText = "Booking Request Registered!";
  
  let detailsText = '';
  if (serviceType === 'cab') {
    detailsText = `You selected a <strong>${modelName}</strong> cab for the route <strong>${loc1} ➔ ${loc2}</strong>.`;
  } else if (serviceType === 'hotel') {
    detailsText = `You selected a reservation at <strong>${modelName}</strong> in <strong>${loc1}</strong>.`;
  }

  modalBody.innerHTML = `
    <div style="text-align: center; padding: 30px 10px;">
      <i class="bx bxs-calendar-check" style="font-size: 4.5rem; color: var(--color-gold); margin-bottom: 20px;"></i>
      <h3 style="font-family: var(--font-body); font-weight:700; font-size:1.5rem; margin-bottom: 10px; color:#FFF;">Request Successfully Registered</h3>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width:550px; margin: 0 auto 25px;">
        ${detailsText} Reference ID: <strong>${bookingID}</strong>. Our booking desk will contact you shortly to confirm arrangements and rates.
      </p>

      <div class="glass-panel" style="padding: 20px; max-width:480px; margin: 0 auto 30px; text-align: left; border: 1px dashed var(--color-gold);">
        <h4 style="color:var(--color-gold); margin-bottom: 10px;"><i class="bx bx-info-circle"></i> Booking Conditions:</h4>
        <p style="font-size: 0.85rem; line-height: 1.6;">
          • An advance payment of 20% is required to secure bookings outbound from Pratapgarh district.<br>
          • To verify payment details and finalize the reservation, contact our help desk:<br>
          <strong style="color: var(--color-gold); font-size: 1rem;"><i class="bx bx-phone-call"></i> +91 9131964831 / +91 9680480116</strong>
        </p>
      </div>

      <div style="display:flex; justify-content:center; gap:15px;">
        <a href="https://wa.me/919131964831?text=Booking%20Request%20ID%20${bookingID}%20for%20${modelName}%20from%20${loc1}%20to%20${loc2}" target="_blank" class="btn-gold" style="background:#25D366; border-color:#25D366; color:#FFF!important;">
          <i class="bx bxl-whatsapp"></i> Confirm on WhatsApp
        </a>
        <button class="btn-outline" onclick="closeModal()">Close Window</button>
      </div>
    </div>
  `;
  showToast("Booking request registered!", "bx bx-badge-check");
}

// --- HOLIDAY PACKAGE DETAILS AND ITINERARY MODAL ---
const packageDetailsData = {
  religious: {
    title: "🛕 Religious Tours (Kedarnath & Varanasi Tour)",
    duration: "6 Days / 5 Nights",
    price: "₹14,999 / person",
    image: "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: "Day 1", title: "Varanasi Arrival & Evening Ganga Aarti", desc: "Arrive in Varanasi, check-in to a luxury hotel, and view the iconic Ganga Aarti ceremony from a private boat." },
      { day: "Day 2", title: "Kashi Vishwanath Darshan & Sarnath", desc: "Enjoy VIP Darshan passes at Kashi Vishwanath Temple, visit Annapurna Temple, and tour the historic Buddhist site Sarnath." },
      { day: "Day 3", title: "Travel to Haridwar & Rishikesh", desc: "Transit to Haridwar/Rishikesh. Attend Har Ki Pauri Aarti and explore Laxman Jhula in Rishikesh." },
      { day: "Day 4", title: "Drive to Sonprayag (Kedarnath Base)", desc: "Scenic mountain drive along the Mandakini river to Sonprayag base camp." },
      { day: "Day 5", title: "Kedarnath Temple Darshan & Trek", desc: "Trek to Kedarnath Temple (helicopter, pony, or walking options available). Attend evening prayer rituals and rest at the shrine." },
      { day: "Day 6", title: "Return Journey & Haridwar Departure", desc: "Descend from the shrine and transfer to Haridwar/Delhi airport or railway station for departure." }
    ],
    inclusions: ["Verified Private Cab throughout", "3-Star Deluxe Hotel Stays", "Daily Breakfast & Dinner", "VIP Darshan Passes", "24/7 Backstage Support"]
  },
  historical: {
    title: "🏰 Historical Tours (Royal Rajasthan Tour)",
    duration: "5 Days / 4 Nights",
    price: "₹12,499 / person",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: "Day 1", title: "Arrival in Udaipur (City of Lakes)", desc: "Pickup from Udaipur airport/railway station by private cab. Check-in to a premium lakefront hotel and enjoy a sunset cruise on Lake Pichola." },
      { day: "Day 2", title: "Udaipur City Palace & Sightseeing", desc: "Guided tour of Udaipur City Palace, Saheliyon-ki-Bari gardens, Jagdish Temple, and sunset at Sajjangarh Monsoon Palace." },
      { day: "Day 3", title: "Chittorgarh Fort Tour to Pratapgarh", desc: "Travel to Chittorgarh Fort, the largest fortress in India, followed by evening arrival in Pratapgarh." },
      { day: "Day 4", title: "Pratapgarh Sights & Traditional Thewa Art", desc: "Tour the historic Deogarh Palace and meet local artisans executing traditional 'Thewa' gold-on-glass engraving art." },
      { day: "Day 5", title: "Jaipur Sightseeing & Drop", desc: "Drive to Jaipur, tour Hawa Mahal and Amer Fort, followed by airport/railway station departure drop." }
    ],
    inclusions: ["Dedicated Toyota Innova Cab", "Heritage Haveli Accommodation", "Breakfast at all Hotels", "Certified Tour Guide in Chittor", "Local Thewa Art Demo Pass"]
  },
  hill: {
    title: "🏔 Hill Station Tours (Leh Ladakh & Manali Trek)",
    duration: "7 Days / 6 Nights",
    price: "₹19,999 / person",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: "Day 1", title: "Manali Arrival & Mall Road", desc: "Arrive in Manali, check-in to a luxury hotel, and visit Hidimba Devi Temple and local markets on Mall Road." },
      { day: "Day 2", title: "Solang Valley Adventures", desc: "Day trip to Solang Valley for paragliding and snow sports. Drive through the historic Atal Tunnel to Lahaul Valley." },
      { day: "Day 3", title: "Scenic Drive to Jispa via Rohtang Pass", desc: "Drive through Rohtang Pass glaciers. Enjoy mountain camping, star-gazing, and bonfire nights in Jispa." },
      { day: "Day 4", title: "Jispa to Leh Mountain Road Trip", desc: "Road trip along the high-altitude Baralacha La and Nakee La passes to arrive in Leh Ladakh." },
      { day: "Day 5", title: "Pangong Lake Day Trip", desc: "Travel to Pangong Lake, famous for its shifting blue waters. Experience local wildlife and monastery sights." },
      { day: "Day 6", title: "Khardung La Pass (Highest Motor Road)", desc: "Excursion to Khardung La, one of the highest drivable passes in the world. Visit Leh Palace." },
      { day: "Day 7", title: "Leh Airport Departure Drop", desc: "Drop off at Leh airport for your onward journey." }
    ],
    inclusions: ["Custom 4x4 SUV (Scorpio/Fortuner)", "Luxury Swiss Camps & Cottages", "All Meals (Veg breakfast/dinner)", "Permits & Inner Line Clearance", "Oxygen Cylinder in Cab"]
  },
  wildlife: {
    title: "🐅 Wildlife Tours (Ranthambore Tiger Safari)",
    duration: "3 Days / 2 Nights",
    price: "₹8,999 / person",
    image: "https://images.unsplash.com/photo-1608933221976-59b3ec709fdf?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: "Day 1", title: "Arrival in Ranthambore & Fort Tour", desc: "Pickup from Sawai Madhopur station, check-in to a forest resort. Hike up to the UNESCO heritage site Ranthambore Fort and Trinetra Ganesha Temple." },
      { day: "Day 2", title: "Morning Tiger Safari & Jungle Walk", desc: "Enter Ranthambore National Park in an open gypsy. Spot Royal Bengal Tigers, leopards, and crocodiles. Evening nature hike." },
      { day: "Day 3", title: "Resort Breakfast & Departure Drop", desc: "Leisurely breakfast by the pool, final photography sessions, and transfer to the railway station for departure." }
    ],
    inclusions: ["AC Cab Pick-Drop", "Premium Jungle Resort stay", "All meals included", "1 Open Gypsy Safari Ticket", "Park Entrance Fees"]
  },
  family: {
    title: "👨‍👩‍👧‍👦 Family Tours (Kerala Houseboat & Hills)",
    duration: "6 Days / 5 Nights",
    price: "₹15,499 / person",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: "Day 1", title: "Cochin Pick-up & Drive to Munnar", desc: "Warm welcome at Cochin airport. Scenic drive to Munnar passing Cheeyappara and Valara waterfalls." },
      { day: "Day 2", title: "Munnar Tea Gardens Tour", desc: "Spend the day touring tea estate museums, Mattupetty Dam, Eco Point, and boating on Kundala Lake." },
      { day: "Day 3", title: "Munnar to Thekkady Safari", desc: "Drive to Thekkady. Tour local spice plantations and take a boat safari on Periyar Lake to spot wild elephants." },
      { day: "Day 4", title: "Alleppey Luxury Houseboat Check-in", desc: "Board a private luxury houseboat in Alleppey backwaters. Relax as you cruise past rural Kerala villages. Dine onboard." },
      { day: "Day 5", title: "Kovalam Beach Excursion", desc: "Travel to Kovalam beach resort. Climb the lighthouse monument and watch the sunset over the Arabian Sea." },
      { day: "Day 6", title: "Cochin Shopping & Departure", desc: "Transfer back to Cochin for local shopping and onward departure drop." }
    ],
    inclusions: ["Air Conditioned Private Ertiga Cab", "Premium Hotels & 1 Night Private Houseboat", "Breakfast at hotels, All Meals on Houseboat", "Traditional Kerala Spice Tour Pass", "Taxes & Driver Allowances"]
  },
  honeymoon: {
    title: "❤️ Honeymoon Tours (Romantic Udaipur Resorts)",
    duration: "5 Days / 4 Nights",
    price: "₹16,999 / person",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: "Day 1", title: "Romantic Welcome in Udaipur", desc: "VIP pickup at Udaipur airport. Check-in to a luxury lake-view villa resort. Enjoy a private candlelit dinner under the stars." },
      { day: "Day 2", title: "Lake Cruise & Island Palace visit", desc: "Tour the beautiful Saheliyon-ki-Bari gardens and enjoy a private boat cruise to Jag Mandir Island Palace for afternoon tea." },
      { day: "Day 3", title: "Kumbhalgarh Fortress Excursion", desc: "Day trip to the majestic Kumbhalgarh Fort. Couples' photoshoot along the high battlements." },
      { day: "Day 4", title: "Resort Wellness & Couple's Spa", desc: "Unwind with a 1-hour professional Ayurvedic couple's spa session. Relax by the pool with traditional folk entertainment in the evening." },
      { day: "Day 5", title: "Traditional Handloom Shopping & Drop", desc: "Browse Udaipur handlooms and handicraft markets. Transfer to airport with a complimentary gift hamper." }
    ],
    inclusions: ["Luxury Audi/Dezire Cab", "5-Star Lake Face Pool Villa Resort", "All Breakfasts, 2 Special Candlelight Dinners", "1 Hour Couple Spa Therapy", "Flower Decoration & Honeymoon Cake"]
  }
};

function openPackageDetails(pkgKey) {
  const pkg = packageDetailsData[pkgKey];
  if (!pkg) return;

  openModal();
  modalTitle.innerText = pkg.title;

  let itineraryHTML = '';
  pkg.itinerary.forEach(step => {
    itineraryHTML += `
      <div style="margin-bottom: 20px; border-left: 2px solid var(--color-gold); padding-left: 15px; position:relative;">
        <span style="position:absolute; left:-7px; top:0; width:12px; height:12px; border-radius:50%; background:var(--color-gold);"></span>
        <strong style="color:var(--color-gold); font-size:0.95rem; text-transform:uppercase; display:block;">${step.day} - ${step.title}</strong>
        <p style="font-size:0.85rem; margin-top:5px; color:var(--color-text-muted);">${step.desc}</p>
      </div>
    `;
  });

  let inclusionsHTML = '';
  pkg.inclusions.forEach(inc => {
    inclusionsHTML += `
      <li style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#FFF; margin-bottom:8px;">
        <i class="bx bx-check-double" style="color:var(--color-gold); font-size:1.1rem;"></i> ${inc}
      </li>
    `;
  });

  modalBody.innerHTML = `
    <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:30px;">
      
      <div>
        <h4 style="color:#FFF; font-size:1.2rem; margin-bottom:20px; font-family:var(--font-heading);"><i class="bx bx-map-alt"></i> Travel Itinerary</h4>
        <div style="max-height: 400px; overflow-y:auto; padding-right:10px;">
          ${itineraryHTML}
        </div>
      </div>

      <div>
        <img src="${pkg.image}" alt="${pkg.title}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; border:1px solid var(--color-border-light); margin-bottom:20px;">
        
        <div class="glass-panel" style="padding: 20px; margin-bottom: 20px;">
          <h4 style="color:var(--color-gold); margin-bottom:12px; font-size:1rem;"><i class="bx bx-gift"></i> Package Inclusions</h4>
          <ul style="list-style:none;">
            ${inclusionsHTML}
          </ul>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; background:rgba(212,175,55,0.05); padding:20px; border-radius:8px; border:1px solid var(--color-border);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.85rem; color:var(--color-text-muted);">Duration: <strong>${pkg.duration}</strong></span>
            <span style="font-size:1.25rem; font-weight:700; color:var(--color-gold);">${pkg.price}</span>
          </div>
          
          <a href="https://wa.me/919131964831?text=Hi%20Kannu%20Yatri,%20I%20want%20to%20book%20the%20${encodeURIComponent(pkg.title)}%20package." target="_blank" class="btn-gold" style="background:#25D366; border-color:#25D366; color:#FFF!important; width:100%;">
            <i class="bx bxl-whatsapp"></i> Book This Package Now
          </a>
        </div>
      </div>

    </div>
  `;
}

// --- LEGAL MODALS DISPLAY ---
function openLegalModal(legalKey) {
  openModal();
  if (legalKey === 'privacy') {
    modalTitle.innerText = "Privacy Policy - Kannu Yatri";
    modalBody.innerHTML = `
      <div style="line-height:1.7; font-size:0.9rem; color:var(--color-text-muted);">
        <h3 style="color:#FFF; margin-bottom:15px;">Privacy Policy</h3>
        <p>At Kannu Yatri, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Kannu Yatri and how we use it.</p>
        <h4 style="color:var(--color-gold); margin: 15px 0 5px;">Information We Collect</h4>
        <p>When you register for a booking, we collect details like your full name, contact numbers, email address, pick-up locations, travel destinations and date times. This is purely to ensure safe logistics, driver allocations, and to verify identities.</p>
        <h4 style="color:var(--color-gold); margin: 15px 0 5px;">How We Use Your Information</h4>
        <p>We use the information we collect to operate and maintain our travel services, improve your passenger booking experience, communicate with you for ticket notifications, and prevent any fraudulent bookings.</p>
      </div>
    `;
  } else if (legalKey === 'refund') {
    modalTitle.innerText = "Refund Policy - Kannu Yatri";
    modalBody.innerHTML = `
      <div style="line-height:1.7; font-size:0.9rem; color:var(--color-text-muted);">
        <h3 style="color:#FFF; margin-bottom:15px;">Refund & Cancellation Policy</h3>
        <p>We believe in flexibility and ease for all our esteemed travelers. Below is our refund layout:</p>
        <h4 style="color:var(--color-gold); margin: 15px 0 5px;">Cancellation Timeline</h4>
        <ul style="margin-left: 20px; margin-bottom: 15px;">
          <li>Cancellation made 24 hours or more prior to journey: <strong>100% Refund</strong>.</li>
          <li>Cancellation made between 12 to 24 hours prior to journey: <strong>85% Refund</strong> (15% processing fee).</li>
          <li>Cancellation made less than 12 hours prior to journey: <strong>No Refund</strong> or voucher replacement (discretionary).</li>
        </ul>
        <h4 style="color:var(--color-gold); margin: 15px 0 5px;">How Refunds are Processed</h4>
        <p>Refunds are initiated instantly upon cancellation request verification and will reflect in your UPI/Bank Account within 2-3 working days.</p>
      </div>
    `;
  } else if (legalKey === 'terms') {
    modalTitle.innerText = "Terms & Conditions - Kannu Yatri";
    modalBody.innerHTML = `
      <div style="line-height:1.7; font-size:0.9rem; color:var(--color-text-muted);">
        <h3 style="color:#FFF; margin-bottom:15px;">Terms & Conditions</h3>
        <p>Welcome to Kannu Yatri. By booking with us, you agree to comply with and be bound by the following terms:</p>
        <h4 style="color:var(--color-gold); margin: 15px 0 5px;">General Rules</h4>
        <ul style="margin-left: 20px; margin-bottom: 15px;">
          <li>All passengers must behave respectfully towards the drivers and fellow passengers.</li>
          <li>We reserve the right to cancel bookings in cases of extreme weather conditions, road blocks, or political strikes. Full refund applies in such cases.</li>
          <li>Any damages to the vehicle interior caused by passengers will be charged as penalty.</li>
        </ul>
      </div>
    `;
  }
}

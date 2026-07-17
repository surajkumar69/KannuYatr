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
  window.initTiltAnimation = () => {
    const tiltCards = document.querySelectorAll('.booking-card, .package-card, .why-card');
    tiltCards.forEach(card => {
      // Remove any existing listeners to avoid doubling
      card.removeEventListener('mousemove', card._tiltMove);
      card.removeEventListener('mouseleave', card._tiltLeave);

      card._tiltMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        // Calculate rotation angles
        const rotateX = (yc - y) / 12; // tilt vertical
        const rotateY = (x - xc) / 12; // tilt horizontal
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      };

      card._tiltLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      };

      card.addEventListener('mousemove', card._tiltMove);
      card.addEventListener('mouseleave', card._tiltLeave);
    });
  };

  // Initialize dynamic databases and render packages on load
  initDatabase();
  renderPackages();
  renderCabs();
  window.initTiltAnimation();

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

// --- LOCAL STORAGE STATE MANAGEMENT (DYNAMIC DATABASES) ---
const DEFAULT_BUSES = [
  { id: 'bus_1', operator: 'Kannu Yatri Sleeper AC', route: 'Pratapgarh - Jaipur', time: '09:30 PM', price: 850, type: 'Volvo AC 2+1', seatsLeft: 12, inclusions: ['Sterilized Blankets', 'USB Ports', 'Mineral Water'] },
  { id: 'bus_2', operator: 'Kannu Yatri Volvo Multi-Axle', route: 'Pratapgarh - Udaipur', time: '10:15 PM', price: 1200, type: 'Volvo Multi-Axle VIP', seatsLeft: 8, inclusions: ['Flatbed Sleeper', 'Captain Seats', 'Pillow & Water'] },
  { id: 'bus_3', operator: 'Kannu Yatri Sleeper AC', route: 'Pratapgarh - Udaipur', time: '08:00 AM', price: 750, type: 'Volvo AC 2+1', seatsLeft: 14, inclusions: ['Reclining Sleeper', 'USB Charger', 'AC Coach'] },
  { id: 'bus_4', operator: 'Kannu Yatri Express Sleeper', route: 'Pratapgarh - Indore', time: '11:00 PM', price: 900, type: 'Non-AC Sleeper', seatsLeft: 16, inclusions: ['Sleeper Berths', 'USB Chargers', 'Fast Transit'] },
  { id: 'bus_5', operator: 'Kannu Yatri Royal Express', route: 'Pratapgarh - Chittorgarh', time: '07:30 AM', price: 350, type: 'AC Seater', seatsLeft: 22, inclusions: ['Luxury Seats', 'AC Cabin', 'Express Route'] }
];

const DEFAULT_PACKAGES = [
  {
    id: 'darshan',
    name: 'Sacred Darshan Tour (Pavitra Darshan Yatra)',
    tag: 'Religious',
    duration: '3 Days / 2 Nights',
    price: 3999,
    route: 'Pratapgarh - Eklingji - Nathdwara - Charbhuja Ji - Sawaliya Ji - Chittorgarh',
    image: 'asKNS.jpeg',
    hotelDetails: 'Comfortable AC Hotels in Nathdwara & Chittorgarh',
    vehicleDetails: 'AC Ertiga (7 Seater)',
    mealDetails: '5 Tasty Pure Veg Meals & 5 Breakfasts',
    inclusions: [
      'AC Ertiga Cab (7 Seater)',
      '2 Nights AC Hotel Room Stays',
      '5 Tasty Pure Veg Meals (Lunch/Dinner)',
      '5 Delicious Breakfasts',
      'Driver Allowance & Tolls Included',
      'Sightseeing of all Shrines',
      'Free ₹5,00,000 Accidental Insurance'
    ],
    exclusions: [
      'Special VIP Darshan ticket charges',
      'Personal shopping, laundry & telephone calls',
      'Guide charges inside temples',
      'Anything not mentioned in inclusions'
    ],
    sightseeing: [
      { name: 'Eklingji Temple', image: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Meera_temple_Eklingji.jpg' },
      { name: 'Nathdwara Temple', image: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Gateway_To_Temple%2C_Nathdwara.jpg' },
      { name: 'Charbhuja Temple', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Temple_in_Bundi_14.jpg/960px-Temple_in_Bundi_14.jpg' },
      { name: 'Sawaliya Ji Temple', image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Sanwaliaji3.JPG' },
      { name: 'Chittorgarh Fort', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chittorgarh_fort.JPG/960px-Chittorgarh_fort.JPG' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Pratapgarh Departure & Shrinathji Darshan', desc: 'Depart from Pratapgarh in a premium AC Ertiga cab. Arrive at Eklingji Temple for Shiva Darshan, then transfer to Nathdwara for the divine evening Shrinathji Darshan. Overnight stay at AC hotel.' },
      { day: 'Day 2', title: 'Charbhuja Ji & Savaliya Ji Pilgrimage', desc: 'Early morning travel to Charbhuja Ji Temple, followed by a serene visit to Savaliya Ji Seth Temple. Drive to Chittorgarh for dinner and overnight stay in AC hotel.' },
      { day: 'Day 3', title: 'Chittorgarh Fort Sightseeing & Return', desc: 'Explore Chittorgarh Fort (Vijay Stambh, Kirti Stambh, Padmini Palace, Rana Kumbha Palace) with a guide, then return to Pratapgarh in the evening.' }
    ]
  },
  {
    id: 'udaipur_abu',
    name: 'Udaipur, Haldighati & Mount Abu Special Tour',
    tag: 'Special Tour',
    duration: '3 Days / 2 Nights',
    price: 4499,
    route: 'Pratapgarh - Udaipur - Haldighati - Mount Abu',
    image: 'temple_pilgrimage.jpg',
    hotelDetails: 'Deluxe AC Hotel Stay (1 Night Udaipur, 1 Night Mount Abu)',
    vehicleDetails: 'AC Ertiga (7 Seater)',
    mealDetails: '5 Delicious Veg Meals & 5 Breakfasts',
    inclusions: [
      'AC Ertiga Cab (7 Seater)',
      '2 Nights AC Hotel Rooms (Deluxe)',
      '5 Delicious Veg Meals',
      '5 Healthy Breakfasts',
      'Driver Charges, Tolls & Parking Included',
      'Local Guide Support',
      'Free ₹5,00,000 Accidental Insurance'
    ],
    exclusions: [
      'Nakki Lake & Pichola Lake boating ticket charges',
      'Haldighati Museum & City Palace entry tickets',
      'Personal purchases, laundry, and guide tips',
      'Any extra sightseeing deviation requests'
    ],
    sightseeing: [
      { name: 'Haldighati', image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Haldighati_Pass.jpg' },
      { name: 'Maharana Pratap Memorial', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Statue_of_Maharana_Pratap_of_Mewar%2C_commemorating_the_Battle_of_Haldighati%2C_City_Palace%2C_Udaipur.jpg/960px-Statue_of_Maharana_Pratap_of_Mewar%2C_commemorating_the_Battle_of_Haldighati%2C_City_Palace%2C_Udaipur.jpg' },
      { name: 'Chetak Memorial', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Chetak_Samadhi.jpg/960px-Chetak_Samadhi.jpg' },
      { name: 'Haldighati Museum', image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Haldighati_Pass.jpg' },
      { name: 'Fateh Sagar Lake', image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Fatehsagar_nehrugarden.jpg' },
      { name: 'Pichola Lake', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Udaipur_Lake_India.JPG/960px-Udaipur_Lake_India.JPG' },
      { name: 'City Palace Udaipur', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/960px-Udaipur_City_Palace.jpg' },
      { name: 'Saheliyon Ki Bari', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Saheliyon-ki-Bari_Fountain.JPG/960px-Saheliyon-ki-Bari_Fountain.JPG' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Udaipur City Palace & Lake Pichola Cruise', desc: 'Pickup from Pratapgarh in AC Ertiga. Drive to Udaipur, check-in to hotel. Visit Udaipur City Palace, Jagdish Temple, and enjoy a sunset cruise on Lake Pichola.' },
      { day: 'Day 2', title: 'Haldighati Sights & Mount Abu Arrival', desc: 'Travel to Mount Abu via Haldighati. Tour Maharana Pratap Memorial, Chetak Smarak, and Haldighati Museum. Check-in to Mount Abu hotel and enjoy evening boating on Nakki Lake.' },
      { day: 'Day 3', title: 'Dilwara Temples, Guru Shikhar & Departure', desc: 'Visit Dilwara Jain Temple, Guru Shikhar Peak (highest point in Rajasthan), and sunset at Sunset Point. Drive back to Pratapgarh for final drop.' }
    ]
  },
  {
    id: 'desert',
    name: 'Jaisalmer & Jodhpur Desert Special Tour',
    tag: 'Desert Tour',
    duration: '3 Days / 2 Nights',
    price: 6999,
    route: 'Pratapgarh - Jaisalmer - Jodhpur - Pratapgarh',
    image: 'WhatsApp Image 2026-07-17 at 2.38.17 PM.jpeg',
    hotelDetails: 'Premium AC Hotels in Jaisalmer & Jodhpur',
    vehicleDetails: 'AC Ertiga Cab (7 Seater)',
    mealDetails: '5 Tasty Pure Veg Meals & 5 Breakfasts',
    inclusions: [
      'AC Ertiga Cab (7 Seater)',
      '2 Nights AC Hotel Room (1 Jaisalmer, 1 Jodhpur)',
      '5 Tasty Pure Veg Meals',
      '5 Delicious Breakfasts',
      'Sam Sand Dunes Camel Safari & Rajasthani Cultural Show',
      'Toll Tax, Parking & Driver Allowance Included',
      'Free ₹5,00,000 Accidental Insurance'
    ],
    exclusions: [
      'Jeep Safari or optional quad biking at Dunes',
      'Monument entrance tickets & local guide fees',
      'Personal purchases, shopping and laundry',
      'Anything not explicitly mentioned in inclusions'
    ],
    sightseeing: [
      { name: 'Jaisalmer Fort', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/960px-Jaisalmer_forteresse.jpg' },
      { name: 'Patwon Ki Haveli', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Patwon_Ki_Haveli_-_26140771308.jpg' },
      { name: 'Sam Sand Dunes', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Thar_desert_Rajasthan_India.jpg/960px-Thar_desert_Rajasthan_India.jpg' },
      { name: 'Gadisar Lake', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Main_entrance_of_Gadisar_Lake.jpg/960px-Main_entrance_of_Gadisar_Lake.jpg' },
      { name: 'Mehrangarh Fort', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Mehrangarh_Fort_sanhita.jpg/960px-Mehrangarh_Fort_sanhita.jpg' },
      { name: 'Jaswant Thada', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Jaswant_Thada_Dawn.jpg/960px-Jaswant_Thada_Dawn.jpg' },
      { name: 'Umaid Bhawan Palace', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/1996_-218-20A_Jodhpur_Hotel_Umaid_Bhawan_Palace_%282233393509%29.jpg/960px-1996_-218-20A_Jodhpur_Hotel_Umaid_Bhawan_Palace_%282233393509%29.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Pratapgarh to Jaisalmer & Sightseeing', desc: 'Depart from Pratapgarh. Arrive in Jaisalmer. Visit the world-famous golden Jaisalmer Fort, Patwon Ki Haveli, and Gadisar Lake. Overnight stay in Jaisalmer.' },
      { day: 'Day 2', title: 'Sam Sand Dunes & Travel to Jodhpur', desc: 'Enjoy breakfast. Experience the majestic Sam Sand Dunes, camel safari, and Rajasthani cultural program. Drive to Jodhpur, check-in, and visit Mehrangarh Fort and Jaswant Thada. Overnight in Jodhpur.' },
      { day: 'Day 3', title: 'Umaid Bhawan Palace & Return', desc: 'Breakfast. Visit the grand Umaid Bhawan Palace (external view) and local spice markets. Drive back to Pratapgarh with beautiful memories.' }
    ]
  },
  {
    id: 'ujjain_omkareshwar',
    name: 'Ujjain, Omkareshwar, Maheshwar, Mandu & Mandsaur Tour',
    tag: 'Religious',
    duration: '4 Days / 3 Nights',
    price: 5999,
    route: 'Pratapgarh - Ujjain - Omkareshwar - Maheshwar - Mandu - Mandsaur - Pratapgarh',
    image: 'WhatsApp Image 2026-07-17 at 2.38.18 PM.jpeg',
    hotelDetails: 'Premium AC Hotels (Ujjain & Mandu)',
    vehicleDetails: 'AC Ertiga Cab (7 Seater)',
    mealDetails: '8 Tasty Pure Veg Meals (4 simple + 4 special) & 8 Breakfasts',
    inclusions: [
      'AC Vehicle travel (7 Seater Ertiga)',
      '3 Nights AC Hotel Stays (Double sharing)',
      '8 Tasty Pure Veg Meals (4 Simple + 4 Special)',
      '8 Delicious Breakfasts',
      'Experienced driver with all allowances & tolls',
      'Toll tax & parking fees fully included',
      'Supporting staff assistance throughout the trip',
      'Free ₹5,00,000 Accidental Insurance'
    ],
    exclusions: [
      'VIP Quick Darshan ticket fees',
      'Bhasm Aarti registration fee',
      'Boating charges at Omkareshwar/Maheshwar Ghats',
      'Personal expenses (tips, laundry, shopping)'
    ],
    sightseeing: [
      { name: 'Shri Mahakaleshwar Jyotirlinga', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/960px-Mahakaleshwar_Temple%2C_Ujjain.jpg' },
      { name: 'Shri Omkareshwar Jyotirlinga', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Omkareswar_Jyotirlinga.jpg/960px-Omkareswar_Jyotirlinga.jpg' },
      { name: 'Narmada Ghat Maheshwar', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Maheshwar_fort.JPG/960px-Maheshwar_fort.JPG' },
      { name: 'Mandu Fort & Jahaz Mahal', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/A_beautiful_Jahaz_Mahal.jpg' },
      { name: 'Pashupatinath Temple Mandsaur', image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Pashupatinath_Mandsaur.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Pratapgarh to Ujjain & Mahakal Darshan', desc: 'Depart from Pratapgarh in a comfortable AC Ertiga. Arrive in Ujjain. Visit the holy Mahakaleshwar Temple for Jyotirlinga darshan and experience the divine Bhasm Aarti. Overnight stay in Ujjain.' },
      { day: 'Day 2', title: 'Omkareshwar Jyotirlinga Pilgrimage', desc: 'Early morning travel to Omkareshwar. Have a holy bath in the river Narmada and attend Omkareshwar Jyotirlinga darshan. Overnight stay in Omkareshwar.' },
      { day: 'Day 3', title: 'Maheshwar Fort & Mandu Exploration', desc: 'Visit Narmada Ghat and Maheshwar Fort. Drive to Mandu. Sightseeing at Mandu Fort, Jahaz Mahal, Hindola Mahal, and Baaz Bahadur Palace. Overnight stay in Mandu.' },
      { day: 'Day 4', title: 'Pashupatinath Mandsaur & Return', desc: 'Travel to Mandsaur, visit the world-famous eight-faced Pashupatinath Temple. Return journey to Pratapgarh.' }
    ]
  },
  {
    id: 'religious',
    name: 'Sacred Darshan Tours',
    tag: 'Religious',
    duration: '6 Days / 5 Nights',
    price: 14999,
    route: 'Varanasi - Haridwar - Rishikesh - Sonprayag - Kedarnath',
    image: 'temple_pilgrimage.jpg',
    hotelDetails: '3-Star Deluxe AC Hotels & Kedarnath Base Camps',
    vehicleDetails: 'Private AC Sedan/SUV Cab',
    mealDetails: 'Daily Buffet Breakfast & Dinner',
    inclusions: ['Private Verified Cab', '3-Star Deluxe Hotels', 'Daily Breakfast & Dinner', 'VIP Darshan Passes', '24/7 Ground Assistance', 'Free ₹5,00,000 Accidental Insurance'],
    exclusions: ['Helicopter, pony, or porter charges', 'Personal travel expenses', 'Anything not mentioned in inclusions'],
    sightseeing: [
      { name: 'Kashi Vishwanath', image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg' },
      { name: 'Ganga Aarti Haridwar', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg' },
      { name: 'Rishikesh Laxman Jhula', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/960px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg' },
      { name: 'Kedarnath Temple', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/960px-Kedarnath_Temple_in_Rainy_season.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Varanasi Arrival & Evening Ganga Aarti', desc: 'Arrive in Varanasi, check-in to a luxury hotel, and view the iconic Ganga Aarti ceremony from a private boat.' },
      { day: 'Day 2', title: 'Kashi Vishwanath Darshan & Sarnath', desc: 'Enjoy VIP Darshan passes at Kashi Vishwanath Temple, visit Annapurna Temple, and tour the historic Buddhist site Sarnath.' },
      { day: 'Day 3', title: 'Travel to Haridwar & Rishikesh', desc: 'Transit to Haridwar/Rishikesh. Attend Har Ki Pauri Aarti and explore Laxman Jhula in Rishikesh.' },
      { day: 'Day 4', title: 'Drive to Sonprayag (Kedarnath Base)', desc: 'Scenic mountain drive along the Mandakini river to Sonprayag base camp.' },
      { day: 'Day 5', title: 'Kedarnath Temple Darshan & Trek', desc: 'Trek to Kedarnath Temple (helicopter, pony, or walking options available). Attend evening prayer rituals and rest at the shrine.' },
      { day: 'Day 6', title: 'Return Journey & Haridwar Departure', desc: 'Descend from the shrine and transfer to Haridwar/Delhi airport or railway station for departure.' }
    ]
  },
  {
    id: 'historical',
    name: '🏰 Historical Tours (Royal Rajasthan Tour)',
    tag: 'Historical',
    duration: '5 Days / 4 Nights',
    price: 12499,
    route: 'Udaipur - Chittorgarh Fort - Pratapgarh - Deogarh Palace - Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    hotelDetails: 'Heritage Haveli & Boutique Resorts',
    vehicleDetails: 'Maruti Ertiga (7 Seater) AC',
    mealDetails: 'Daily Breakfast buffet',
    inclusions: ['AC Maruti Ertiga Cab', 'Heritage Haveli Stays', 'Daily Breakfast', 'Chittorgarh Fort Guide', 'Traditional Thewa Art Tour', 'Free ₹5,00,000 Accidental Insurance'],
    exclusions: ['Lunch, Dinner & personal drinks', 'Monument entry tickets', 'Camera fees and guide tips'],
    sightseeing: [
      { name: 'Udaipur Lake Pichola', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Udaipur_Lake_India.JPG/960px-Udaipur_Lake_India.JPG' },
      { name: 'Chittorgarh Fort', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chittorgarh_fort.JPG/960px-Chittorgarh_fort.JPG' },
      { name: 'Jaipur Hawa Mahal', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Udaipur', desc: 'Pickup from Udaipur airport/railway station by private cab. Check-in to a premium lakefront hotel and enjoy a sunset cruise on Lake Pichola.' },
      { day: 'Day 2', title: 'Udaipur Palace & Sightseeing', desc: 'Guided tour of Udaipur City Palace, Saheliyon-ki-Bari gardens, Jagdish Temple, and sunset at Sajjangarh Monsoon Palace.' },
      { day: 'Day 3', title: 'Chittorgarh Fort Tour to Pratapgarh', desc: 'Travel to Chittorgarh Fort, the largest fortress in India, followed by evening arrival in Pratapgarh.' },
      { day: 'Day 4', title: 'Pratapgarh Sights & Traditional Thewa Art', desc: 'Tour the historic Deogarh Palace and meet local artisans executing traditional "Thewa" gold-on-glass engraving art.' },
      { day: 'Day 5', title: 'Jaipur Sightseeing & Drop', desc: 'Drive to Jaipur, tour Hawa Mahal and Amer Fort, followed by airport/railway station departure drop.' }
    ]
  },
  {
    id: 'hill',
    name: 'Shimla – Kullu – Manali Premium Tour',
    tag: 'Hill Station',
    duration: '5 Days / 4 Nights',
    price: 17900,
    route: 'Pratapgarh - Shimla - Kullu - Manali',
    image: 'hill_station.jpg',
    hotelDetails: 'Premium 3-Star Hill View AC/Heated Resorts',
    vehicleDetails: 'Maruti Ertiga / AC Sedan Cab',
    mealDetails: 'Daily Breakfast & Dinner (Pure Veg/Non-Veg Options)',
    inclusions: [
      'AC Sedan/SUV Cab transport',
      '4 Nights Premium AC Hotel Room Stays',
      'Daily delicious Breakfast & Dinner',
      'Sightseeing of all major viewpoint sights',
      'Experienced driver and tolls/allowances included',
      'Free ₹5,00,000 Accidental Insurance'
    ],
    exclusions: [
      'Adventure activities (White-water rafting, skiing, paragliding)',
      'Rohtang Pass special permit fee (if applicable)',
      'Lunch, personal shopping & phone calls',
      'Anything not explicitly mentioned in inclusions'
    ],
    sightseeing: [
      { name: 'Mall Road Shimla', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Mall_Road_Shimla_1.jpg/960px-Mall_Road_Shimla_1.jpg' },
      { name: 'Kufri Valley', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Shimla_hills.jpg/960px-Shimla_hills.jpg' },
      { name: 'Hadimba Temple Manali', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Hidimba_Devi_Temple_-_North-east_View_-_Manali_2014-05-11_2648-2649.TIF/lossy-page1-960px-Hidimba_Devi_Temple_-_North-east_View_-_Manali_2014-05-11_2648-2649.TIF.jpg' },
      { name: 'Solang Valley', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Solang_Valley_%2CManali%2C_Himachal_Pardes%2C_India.JPG/960px-Solang_Valley_%2CManali%2C_Himachal_Pardes%2C_India.JPG' },
      { name: 'Atal Tunnel', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Atal_Tunnel_vrtmrgmpksk_%282%29.jpg/960px-Atal_Tunnel_vrtmrgmpksk_%282%29.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Pratapgarh to Shimla Arrival & Mall Road', desc: 'Start your premium journey from Pratapgarh in a comfortable AC cab. Scenic drive to Shimla. Check-in to your resort and enjoy a relaxed evening on the Mall Road.' },
      { day: 'Day 2', title: 'Shimla Kufri Excursion & Viewpoints', desc: 'After breakfast, explore Kufri, the winter sports capital. Visit the Himalayan Nature Park, enjoy horse riding, and view the snow-capped Himalayan peaks. Overnight in Shimla.' },
      { day: 'Day 3', title: 'Shimla to Manali via Kullu Valley', desc: 'Travel to Manali. En route, enjoy white-water rafting and paragliding in Kullu. Check-in to your Manali hotel and spend the evening shopping at local Tibetan markets.' },
      { day: 'Day 4', title: 'Solang Valley Adventure & Atal Tunnel Tour', desc: 'Excursion to Solang Valley for paragliding, zorbing, and quad biking. Drive through the famous Atal Tunnel. Visit Hadimba Temple, Vashisht Hot Springs, and Club House. Overnight in Manali.' },
      { day: 'Day 5', title: 'Return Journey to Pratapgarh', desc: 'Enjoy a hearty breakfast, pack your bags with beautiful memories, and begin the return journey to Pratapgarh.' }
    ]
  },
  {
    id: 'wildlife',
    name: 'Wildlife Tours',
    tag: 'Wildlife Safari',
    duration: '3 Days / 2 Nights',
    price: 8999,
    route: 'Sawai Madhopur - Ranthambore Fort - Jungle Safari',
    image: 'elephant_safari.jpg',
    hotelDetails: 'Premium Forest Resort & Luxury Tents',
    vehicleDetails: 'AC Ertiga / Gypsy for safari',
    mealDetails: 'All Meals (Breakfast, Lunch, Dinner)',
    inclusions: ['AC Cab Pickup/Drop', 'Premium Forest Resort stay', 'All Meals (Breakfast, Lunch, Dinner)', 'Open Gypsy Tiger Safari Ticket', 'Forest Guide & Entry Fees', 'Free ₹5,00,000 Accidental Insurance'],
    exclusions: ['Tips, laundry & alcoholic drinks', 'Personal cameras and gear charges', 'Anything not mentioned in inclusions'],
    sightseeing: [
      { name: 'Ranthambore Fort', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ranthambhore_Fort.jpg/960px-Ranthambhore_Fort.jpg' },
      { name: 'Tiger Safari', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg/960px-Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Ranthambore & Fort Tour', desc: 'Pickup from Sawai Madhopur station, check-in to forest resort. Hike up to the UNESCO heritage site Ranthambore Fort and Trinetra Ganesha Temple.' },
      { day: 'Day 2', title: 'Morning Tiger Safari & Jungle Walk', desc: 'Enter Ranthambore National Park in an open gypsy. Spot Royal Bengal Tigers, leopards, and crocodiles. Evening nature hike.' },
      { day: 'Day 3', title: 'Resort Breakfast & Departure Drop', desc: 'Leisurely breakfast by the pool, final photography sessions, and transfer to the railway station for departure.' }
    ]
  },
  {
    id: 'family',
    name: '👨‍👩‍👧‍👦 Family Tours (Kerala Houseboat & Hills)',
    tag: 'Family Special',
    duration: '6 Days / 5 Nights',
    price: 15499,
    route: 'Cochin - Munnar - Tea Gardens - Thekkady - Alleppey Backwaters - Kovalam Beach',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    hotelDetails: 'Premium Hotels & Private Luxury Houseboat',
    vehicleDetails: 'AC Private Ertiga Cab',
    mealDetails: 'Daily Breakfast & dinner, all meals on Houseboat',
    inclusions: ['AC Private Ertiga Cab', 'Premium Hotels & Houseboat', 'All Meals on Houseboat', 'Kerala Spice Garden Tour', 'Driver Allowances & Taxes', 'Free ₹5,00,000 Accidental Insurance'],
    exclusions: ['Activity tickets (Elephant ride, Kathakali show)', 'Personal items, tips & laundry'],
    sightseeing: [
      { name: 'Munnar Tea Gardens', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/960px-Munnar_Overview.jpg' },
      { name: 'Alleppey Backwaters', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alappuzha_Boat_Beauty_W.jpg/960px-Alappuzha_Boat_Beauty_W.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Cochin Pick-up & Drive to Munnar', desc: 'Warm welcome at Cochin airport. Scenic drive to Munnar passing Cheeyappara and Valara waterfalls.' },
      { day: 'Day 2', title: 'Munnar Tea Gardens Tour', desc: 'Spend the day touring tea estate museums, Mattupetty Dam, Eco Point, and boating on Kundala Lake.' },
      { day: 'Day 3', title: 'Munnar to Thekkady Safari', desc: 'Drive to Thekkady. Tour local spice plantations and take a boat safari on Periyar Lake to spot wild elephants.' },
      { day: 'Day 4', title: 'Alleppey Luxury Houseboat Check-in', desc: 'Board a private luxury houseboat in Alleppey backwaters. Relax as you cruise past rural Kerala villages. Dine onboard.' },
      { day: 'Day 5', title: 'Kovalam Beach Excursion', desc: 'Travel to Kovalam beach resort. Climb the lighthouse monument and watch the sunset over the Arabian Sea.' },
      { day: 'Day 6', title: 'Cochin Shopping & Departure', desc: 'Transfer back to Cochin for local shopping and onward departure drop.' }
    ]
  },
  {
    id: 'honeymoon',
    name: '❤️ Honeymoon Tours (Romantic Udaipur Resorts)',
    tag: 'Honeymoon',
    duration: '5 Days / 4 Nights',
    price: 16999,
    route: 'Udaipur - Lake Pichola Cruise - Kumbhalgarh Fort - Luxury Villa Spa',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    hotelDetails: '5-Star Lake Face Pool Resort & Villas',
    vehicleDetails: 'Luxury Sedan Cab (Ciaz/Honda City)',
    mealDetails: 'Daily Breakfast & Special Candlelight Dinners',
    inclusions: ['Luxury Sedan Cab', '5-Star Lake Face Pool Resort', 'Breakfast & Special Candlelight Dinners', '1 Hour Couple Spa Therapy', 'Honeymoon Cake & Room Decor', 'Free ₹5,00,000 Accidental Insurance'],
    exclusions: ['Sightseeing entry passes', 'Personal shopping and optional flights'],
    sightseeing: [
      { name: 'Lake Pichola Cruise', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Udaipur_Lake_India.JPG/960px-Udaipur_Lake_India.JPG' },
      { name: 'Kumbhalgarh Fort', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kumbhalgarh_055.jpg/960px-Kumbhalgarh_055.jpg' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Romantic Welcome in Udaipur', desc: 'VIP pickup at Udaipur airport. Check-in to a luxury lake-view villa resort. Enjoy a private candlelit dinner under the stars.' },
      { day: 'Day 2', title: 'Lake Cruise & Island Palace visit', desc: 'Tour the beautiful Saheliyon-ki-Bari gardens and enjoy a private boat cruise to Jag Mandir Island Palace for afternoon tea.' },
      { day: 'Day 3', title: 'Kumbhalgarh Fortress Excursion', desc: 'Day trip to the majestic Kumbhalgarh Fort. Couples\' photoshoot along the high battlements.' },
      { day: 'Day 4', title: 'Resort Wellness & Couple\'s Spa', desc: 'Unwind with a 1-hour professional Ayurvedic couple\'s spa session. Relax by the pool with traditional folk entertainment in the evening.' },
      { day: 'Day 5', title: 'Traditional Handloom Shopping & Drop', desc: 'Browse Udaipur handlooms and handicraft markets. Transfer to airport with a complimentary gift hamper.' }
    ]
  }
];

const DEFAULT_CABS = [
  {
    id: 'cab_udaipur',
    name: 'Pratapgarh to Udaipur Premium Swift Dzire Cab',
    tag: 'Cab Package',
    image: 'WhatsApp Image 2026-07-17 at 2.38.19 PM.jpeg',
    route: 'Pratapgarh ➔ Udaipur (Round Trip)',
    price: 4000,
    vehicle: 'Maruti Swift Dzire',
    duration: 'One Way & Two Way',
    hotelDetails: 'N/A (Day Tour/Transfer)',
    vehicleDetails: 'Maruti Swift Dzire AC',
    mealDetails: 'Breakfast for 2 passengers included',
    pricingDetails: 'Two Way: ₹4,000 | One Way: ₹2,500 (All-Inclusive)',
    inclusions: [
      'Toll Taxes & Parking Fees Included',
      'Professional Driver Charges & Allowance Included',
      'Complimentary Breakfast for 2 Passengers Included',
      'Free ₹5,00,000 Accidental Insurance (Mukhya/Group Leader)',
      'Luxury Travel Experience'
    ],
    exclusions: [
      'Sightseeing entrance charges',
      'Additional food or shopping'
    ],
    sightseeing: [
      { name: 'City Palace Udaipur', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/960px-Udaipur_City_Palace.jpg' },
      { name: 'Lake Pichola', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Udaipur_Lake_India.JPG/960px-Udaipur_Lake_India.JPG' },
      { name: 'Fateh Sagar Lake', image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Fatehsagar_nehrugarden.jpg' }
    ],
    itinerary: [
      { day: 'One Way', title: 'Pratapgarh to Udaipur Transfer', desc: 'Direct one-way transfer drop from Pratapgarh to any address/airport/railway station in Udaipur. Fare: ₹2,500.' },
      { day: 'Two Way', title: 'Round Trip local tour', desc: 'Pick up from Pratapgarh, transfer to Udaipur. Includes local sightseeing at City Palace, Lake Pichola boating, and return back. Fare: ₹4,000.' }
    ]
  },
  {
    id: 'cab_ahmedabad',
    name: 'Pratapgarh to Ahmedabad Premium Ertiga Cab',
    tag: 'Cab Package',
    image: 'WhatsApp Image 2026-07-17 at 2.38.18 PM (1).jpeg',
    route: 'Pratapgarh ➔ Ahmedabad',
    price: 4500,
    vehicle: 'Maruti Ertiga (7 Seater)',
    duration: 'One Way & Two Way',
    hotelDetails: 'N/A (Transfer Service)',
    vehicleDetails: 'Maruti Ertiga (7 Seater) AC',
    mealDetails: 'Breakfast for 2 passengers included',
    pricingDetails: 'One Way: ₹4,500 | Two Way: ₹6,500 (All-Inclusive)',
    inclusions: [
      'Toll Taxes & Highway Charges Included',
      'Professional Driver Charges & Allowance Included',
      'Complimentary Breakfast for 2 Passengers Included',
      'Free ₹5,00,000 Accidental Insurance (Mukhya/Group Leader)',
      'Clean & Punctual Luxury Cab Service'
    ],
    exclusions: [
      'Sightseeing monument entry fees',
      'Extra kilometers or route deviations',
      'Lunch and dinner meals'
    ],
    sightseeing: [
      { name: 'Sabarmati Riverfront', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80' },
      { name: 'Akshardham Temple', image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Akshardham_Gandhinagar.jpg' }
    ],
    itinerary: [
      { day: 'One Way', title: 'Single Journey Drop', desc: 'Direct one-way transfer from Pratapgarh to any address/airport in Ahmedabad. Fare: ₹4,500.' },
      { day: 'Two Way', title: 'Round Trip Journey', desc: 'Pick up from Pratapgarh, transfer to Ahmedabad, local sightseeing, and return back. Fare: ₹6,500.' }
    ]
  },
  {
    id: 'cab_selfdrive',
    name: 'Self Drive Car Hire (Alto, Ritz, Swift Dzire)',
    tag: 'Car Hire',
    image: 'WhatsApp Image 2026-07-17 at 2.38.18 PM (2).jpeg',
    route: 'Explore Anywhere (Self Drive)',
    price: 1.9,
    vehicle: 'Alto 800 / Ritz / Swift Dzire',
    duration: 'Per KM Basis',
    hotelDetails: 'N/A',
    vehicleDetails: 'Choose: Alto 800, Ritz, or Swift Dzire',
    mealDetails: 'N/A (Self Arranged)',
    pricingDetails: 'Alto 800: ₹1.90/KM | Ritz:  ₹2.10/KM | Swift Dzire: ₹2.50/KM',
    inclusions: [
      'New, sanitized and well-maintained vehicles',
      'Free ₹5,00,000 Accidental Insurance (Mukhya/Group Leader)',
      '24x7 Emergency roadside assistance',
      'Easy and transparent booking process',
      'Ride as per your own conditions'
    ],
    exclusions: [
      'Toll Taxes (paid by party)',
      'Driver Charges (paid by party, if hired)',
      'Fuel/Petrol (paid by party)',
      'All other actual trip running expenses'
    ],
    sightseeing: [
      { name: 'Alto 800', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
      { name: 'Maruti Ritz', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80' },
      { name: 'Swift Dzire', image: 'swift_dzire.jpg' }
    ],
    itinerary: [
      { day: 'Alto 800', title: 'Economy Option', desc: 'Alto 800 self-drive hired at ₹1.90 per KM. Extremely fuel efficient.' },
      { day: 'Maruti Ritz', title: 'Mid-range Hatchback', desc: 'Maruti Ritz self-drive hired at ₹2.10 per KM. Great cabin space.' },
      { day: 'Swift Dzire', title: 'Comfort Sedan', desc: 'Swift Dzire self-drive hired at ₹2.50 per KM. Premium luxury comfort.' }
    ]
  }
];

function initDatabase() {
  const DB_VERSION = 'v4';
  const storedVersion = localStorage.getItem('kannu_db_version');
  if (storedVersion !== DB_VERSION) {
    localStorage.setItem('kannu_db_version', DB_VERSION);
    localStorage.setItem('kannu_packages', JSON.stringify(DEFAULT_PACKAGES));
    localStorage.setItem('kannu_cabs', JSON.stringify(DEFAULT_CABS));
    localStorage.setItem('kannu_buses', JSON.stringify(DEFAULT_BUSES));
  }

  const storedPkgs = localStorage.getItem('kannu_packages');
  if (storedPkgs) {
    try {
      const pkgs = JSON.parse(storedPkgs);
      const hasOldData = pkgs.some(p => 
        (p.id === 'religious' && (p.name.includes('Kedarnath') || p.image.includes('unsplash') || p.image.includes('photo-'))) ||
        (p.id === 'hill' && (p.name.includes('Leh') || p.image.includes('unsplash') || p.image.includes('photo-'))) ||
        (p.id === 'wildlife' && (p.name.includes('Ranthambore') || p.image.includes('unsplash') || p.image.includes('photo-')))
      );
      if (hasOldData) {
        pkgs.forEach(p => {
          if (p.id === 'religious') {
            p.name = 'Sacred Darshan Tours';
            p.image = 'temple_pilgrimage.jpg';
          } else if (p.id === 'hill') {
            p.name = 'Shimla – Kullu – Manali Premium Tour';
            p.image = 'hill_station.jpg';
          } else if (p.id === 'wildlife') {
            p.name = 'Wildlife Tours';
            p.image = 'elephant_safari.jpg';
          }
        });
        localStorage.setItem('kannu_packages', JSON.stringify(pkgs));
      }
    } catch (e) {
      localStorage.removeItem('kannu_packages');
    }
  }

  if (!localStorage.getItem('kannu_buses')) {
    localStorage.setItem('kannu_buses', JSON.stringify(DEFAULT_BUSES));
  }
  if (!localStorage.getItem('kannu_packages')) {
    localStorage.setItem('kannu_packages', JSON.stringify(DEFAULT_PACKAGES));
  }
  if (!localStorage.getItem('kannu_cabs')) {
    localStorage.setItem('kannu_cabs', JSON.stringify(DEFAULT_CABS));
  }
}

function getBuses() {
  return JSON.parse(localStorage.getItem('kannu_buses') || '[]');
}

function saveBuses(buses) {
  localStorage.setItem('kannu_buses', JSON.stringify(buses));
}

function getPackages() {
  return JSON.parse(localStorage.getItem('kannu_packages') || '[]');
}

function savePackages(packages) {
  localStorage.setItem('kannu_packages', JSON.stringify(packages));
}

// Render dynamic packages on homepage
function renderPackages() {
  const container = document.getElementById('packages-container');
  if (!container) return;
  
  const packages = getPackages();
  let html = '';
  
  packages.forEach(pkg => {
    let inclusionsHTML = '';
    const previewList = pkg.inclusions ? pkg.inclusions.slice(0, 3) : [];
    previewList.forEach(inc => {
      inclusionsHTML += `<li><i class="bx bx-check-double"></i> ${inc}</li>`;
    });
    if (pkg.inclusions && pkg.inclusions.length > 3) {
      inclusionsHTML += `<li><i class="bx bx-plus"></i> ${pkg.inclusions.length - 3} More</li>`;
    }

    html += `
      <div class="package-card glass-panel" id="pkg-${pkg.id}">
        <div class="package-img-wrapper">
          <img src="${pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}" alt="${pkg.name}" class="package-img">
          <span class="package-tag">${pkg.tag || 'Holiday'}</span>
        </div>
        <div class="package-info">
          <div class="package-meta">
            <span><i class="bx bx-time"></i> ${pkg.duration}</span>
            <span><i class="bx bx-star"></i> 4.9</span>
          </div>
          
          <div class="card-insurance-badge">
            <i class="bx bx-shield-quarter"></i> Free ₹5L Insurance for Group Leader
          </div>
          
          <h3 class="package-title">${pkg.name}</h3>
          
          <div class="package-route">
            <i class="bx bx-map"></i> <span><strong>Route:</strong> ${pkg.route}</span>
          </div>
          
          <ul class="package-inclusions-preview">
            ${inclusionsHTML}
          </ul>
          
          <div class="package-bottom">
            <div class="package-price">
              <span>Starting From</span>
              <strong>₹${Number(pkg.price).toLocaleString('en-IN')} / member</strong>
            </div>
            
            <div class="package-actions-row">
              <button class="btn-gold" onclick="openQuickBookPackage('${pkg.id}')">Book Now</button>
              <button class="btn-outline" onclick="openPackageDetails('${pkg.id}')">Details</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  if (window.initTiltAnimation) {
    window.initTiltAnimation();
  }
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
function handleHotelBookingSubmit(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('hotel-name').value;
  const phone = document.getElementById('hotel-phone').value;
  const from = document.getElementById('hotel-from').value;
  const destination = document.getElementById('hotel-destination').value;
  const checkIn = document.getElementById('hotel-in').value;
  const checkOut = document.getElementById('hotel-out').value;
  const guests = document.getElementById('hotel-guests').value;
  const rooms = document.getElementById('hotel-rooms').value;
  const category = document.getElementById('hotel-category').value;
  const specialRequest = document.getElementById('hotel-special').value || 'None';

  // Validate dates
  if (new Date(checkOut) < new Date(checkIn)) {
    if (typeof showToast === 'function') {
      showToast("Check-out date cannot be before check-in date!", "bx bx-error");
    } else {
      alert("Check-out date cannot be before check-in date!");
    }
    return;
  }

  const message = `🏨 *Hotel Booking Inquiry*

📍 Destination: ${destination}
📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
👥 Guests: ${guests}
🛏 Rooms: ${rooms}
⭐ Hotel Category: ${category}
📝 Special Request: ${specialRequest}
👤 Name: ${name}
📞 Phone: ${phone}

Please contact me regarding this hotel booking.`;

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = '919131964831';
  const webUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (typeof showToast === 'function') {
    showToast("Opening WhatsApp...", "bx bxl-whatsapp");
  }

  if (isMobile) {
    let appOpened = false;
    const handleBlur = () => {
      appOpened = true;
      window.removeEventListener('blur', handleBlur);
    };
    window.addEventListener('blur', handleBlur);

    // Try to open WhatsApp app via deep link
    window.location.href = appUrl;

    // Fallback if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.removeEventListener('blur', handleBlur);
      if (!appOpened) {
        window.open(webUrl, '_blank');
      }
    }, 1500);
  } else {
    window.open(webUrl, '_blank');
  }
}

function handleBusBookingSubmit(event) {
  if (event) event.preventDefault();

  const from = document.getElementById('bus-from').value;
  const to = document.getElementById('bus-to').value;
  const travelDate = document.getElementById('bus-date').value;
  const passengers = document.getElementById('bus-passengers').value;

  const message = `🚌 *Bus Booking Inquiry*

📍 From: ${from}
📍 To: ${to}
📅 Travel Date: ${travelDate}
👥 Passengers: ${passengers}

Please share the available buses, fare, and booking details.`;

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = '919131964831';
  const webUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (typeof showToast === 'function') {
    showToast("Opening WhatsApp...", "bx bxl-whatsapp");
  }

  if (isMobile) {
    let appOpened = false;
    const handleBlur = () => {
      appOpened = true;
      window.removeEventListener('blur', handleBlur);
    };
    window.addEventListener('blur', handleBlur);

    // Try to open WhatsApp app via deep link
    window.location.href = appUrl;

    // Fallback if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.removeEventListener('blur', handleBlur);
      if (!appOpened) {
        window.open(webUrl, '_blank');
      }
    }, 1500);
  } else {
    window.open(webUrl, '_blank');
  }
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
  // Insurance alert HTML to show on booking page
  const insuranceAlertHTML = `
    <div class="insurance-modal-alert">
      <i class="bx bx-shield-quarter"></i>
      <div>
        <strong>FREE ₹5,00,000 Travel Insurance Active</strong>
        The Group Leader (Mukhya) receives FREE ₹5,00,000 Travel Insurance during this trip. All travelers are covered for safety.
      </div>
    </div>
  `;

  if (type === 'cab') {
    modalTitle.innerText = `Available Cab Options (${subtype === 'oneway' ? 'One Way' : subtype === 'round' ? 'Round Trip' : 'Driver Only'})`;
    
    let pickupVal = document.getElementById(`cab-${subtype === 'oneway' ? 'ow' : subtype === 'round' ? 'rt' : 'dr'}-pickup`).value;
    let dropVal = document.getElementById(`cab-${subtype === 'oneway' ? 'ow' : subtype === 'round' ? 'rt' : 'dr'}-drop`).value;
    
    modalBody.innerHTML = `
      ${insuranceAlertHTML}
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 15px;">
        <span style="color:var(--color-gold); font-size:0.9rem; font-weight:600;">ROUTE:</span>
        <strong style="color:#FFF; font-size:1.1rem;">${pickupVal} ➔ ${dropVal}</strong>
      </div>
      <div class="modal-results-list">
        
        <div class="result-item glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 20px; margin-bottom: 15px;">
          <img src="swift_dzire.jpg" class="result-img" alt="Maruti Swift Dzire" style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px;">
          <div class="result-details" style="flex-grow: 1;">
            <h4>Maruti Swift Dzire</h4>
            <div class="result-meta" style="display: flex; gap: 15px; font-size: 0.8rem; margin: 5px 0; color: var(--color-gold);">
              <span><i class="bx bx-user"></i> 4+1 Seats</span>
              <span><i class="bx bx-check-shield"></i> AC & Luggage Space</span>
              <span><i class="bx bxs-star"></i> 4.8</span>
            </div>
            <p style="font-size:0.75rem; color:var(--color-text-muted);">Clean interiors, background-verified driver, and real-time GPS tracking.</p>
          </div>
          <div class="result-action" style="text-align: right; min-width: 120px;">
            <span class="result-price" style="display: block; font-size: 1.3rem; font-weight: 700; color: var(--color-gold); margin-bottom: 10px;">₹${subtype === 'round' ? '18/KM' : '10/KM'}</span>
            <button class="btn-gold" onclick="confirmBooking('cab', 'Maruti Swift Dzire', '${pickupVal}', '${dropVal}')">Book Cab</button>
          </div>
        </div>

        <div class="result-item glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 20px; margin-bottom: 15px;">
          <img src="maruti_ertiga.jpg" class="result-img" alt="Maruti Ertiga (7 Seater)" style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px;">
          <div class="result-details" style="flex-grow: 1;">
            <h4>Maruti Ertiga (7 Seater)</h4>
            <div class="result-meta" style="display: flex; gap: 15px; font-size: 0.8rem; margin: 5px 0; color: var(--color-gold);">
              <span><i class="bx bx-user"></i> 6+1 Seats</span>
              <span><i class="bx bx-check-shield"></i> Dual AC & Roof Carrier</span>
              <span><i class="bx bxs-star"></i> 4.9</span>
            </div>
            <p style="font-size:0.75rem; color:var(--color-text-muted);">Excellent family utility vehicle designed for comfortable long-distance tours.</p>
          </div>
          <div class="result-action" style="text-align: right; min-width: 120px;">
            <span class="result-price" style="display: block; font-size: 1.3rem; font-weight: 700; color: var(--color-gold); margin-bottom: 10px;">₹${subtype === 'round' ? '22/KM' : '14/KM'}</span>
            <button class="btn-gold" onclick="confirmBooking('cab', 'Maruti Ertiga (7 Seater)', '${pickupVal}', '${dropVal}')">Book Cab</button>
          </div>
        </div>

      </div>
    `;
  }
  
  else if (type === 'bus') {
    modalTitle.innerText = "Available Bus Options";
    let busFrom = document.getElementById('bus-from').value;
    let busTo = document.getElementById('bus-to').value;
    
    // Dynamic Filter
    const buses = getBuses();
    const filteredBuses = buses.filter(b => {
      const route = b.route.toLowerCase();
      const f = busFrom.toLowerCase().trim();
      const t = busTo.toLowerCase().trim();
      return route.includes(f) && route.includes(t);
    });

    let resultsHTML = '';
    const displayList = filteredBuses.length > 0 ? filteredBuses : buses;
    const isFallback = filteredBuses.length === 0;

    displayList.forEach(bus => {
      let inclHTML = bus.inclusions ? bus.inclusions.join(', ') : 'AC Sleeper';
      resultsHTML += `
        <div class="result-item glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 20px; margin-bottom: 15px;">
          <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: rgba(212,175,55,0.05); border-radius: 6px; font-size: 2.2rem; color: var(--color-gold); border: 1px solid var(--color-border); flex-shrink:0;">
            <i class="bx bx-bus"></i>
          </div>
          <div class="result-details" style="flex-grow: 1;">
            <h4>${bus.operator} (${bus.type})</h4>
            <div class="result-meta" style="display: flex; gap: 15px; font-size: 0.8rem; margin: 5px 0; color: var(--color-gold);">
              <span><i class="bx bx-time-five"></i> ${bus.time}</span>
              <span><i class="bx bx-couch"></i> ${bus.seatsLeft} Seats Left</span>
              <span><i class="bx bx-map"></i> ${bus.route}</span>
            </div>
            <p style="font-size:0.75rem; color:var(--color-text-muted);">${inclHTML} included.</p>
          </div>
          <div class="result-action" style="text-align: right; min-width: 120px;">
            <span class="result-price" style="display: block; font-size: 1.3rem; font-weight: 700; color: var(--color-gold); margin-bottom: 10px;">₹${bus.price}</span>
            <button class="btn-gold" onclick="selectBusSeats('${bus.operator}', ${bus.price})">Select Seats</button>
          </div>
        </div>
      `;
    });

    modalBody.innerHTML = `
      ${insuranceAlertHTML}
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 15px;">
        <span style="color:var(--color-gold); font-size:0.9rem; font-weight:600;">ROUTE:</span>
        <strong style="color:#FFF; font-size:1.1rem;">${busFrom} ➔ ${busTo}</strong>
        ${isFallback ? `<div style="color:var(--color-gold); font-size:0.8rem; margin-top:5px;"><i class="bx bx-info-circle"></i> Showing general routes (no specific bus found for "${busFrom} to ${busTo}").</div>` : ''}
      </div>
      <div class="modal-results-list">
        ${resultsHTML}
      </div>
    `;
  }
  
  else if (type === 'hotel') {
    modalTitle.innerText = "Available Hotel Options";
    let city = document.getElementById('hotel-city').value;
    
    modalBody.innerHTML = `
      ${insuranceAlertHTML}
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 15px;">
        <span style="color:var(--color-gold); font-size:0.9rem; font-weight:600;">CITY:</span>
        <strong style="color:#FFF; font-size:1.1rem;">${city}</strong>
      </div>
      <div class="modal-results-list">
        
        <div class="result-item glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 20px; margin-bottom: 15px;">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Deluxe Room" style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px;">
          <div class="result-details" style="flex-grow: 1;">
            <h4>Kannu Yatri Palace Heritage Resort</h4>
            <div class="result-meta" style="display: flex; gap: 15px; font-size: 0.8rem; margin: 5px 0; color: var(--color-gold);">
              <span><i class="bx bx-wifi"></i> Free High-speed Wi-Fi</span>
              <span><i class="bx bx-restaurant"></i> Breakfast Included</span>
              <span><i class="bx bxs-star"></i> 4.8</span>
            </div>
            <p style="font-size:0.75rem; color:var(--color-text-muted);">Royal Rajputana-themed spacious accommodations with beautiful garden views.</p>
          </div>
          <div class="result-action" style="text-align: right; min-width: 120px;">
            <span class="result-price" style="display: block; font-size: 1.3rem; font-weight: 700; color: var(--color-gold); margin-bottom: 10px;">₹3,499 / night</span>
            <button class="btn-gold" onclick="confirmBooking('hotel', 'Heritage Resort', '${city}')">Book Now</button>
          </div>
        </div>

        <div class="result-item glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 20px; margin-bottom: 15px;">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80" class="result-img" alt="Luxury Suite" style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px;">
          <div class="result-details" style="flex-grow: 1;">
            <h4>Lake View Luxury Suites & Villas</h4>
            <div class="result-meta" style="display: flex; gap: 15px; font-size: 0.8rem; margin: 5px 0; color: var(--color-gold);">
              <span><i class="bx bx-swim"></i> Swimming Pool Access</span>
              <span><i class="bx bx-coffee"></i> VIP lounge & Minibar</span>
              <span><i class="bx bxs-star"></i> 5.0</span>
            </div>
            <p style="font-size:0.75rem; color:var(--color-text-muted);">Scenic lakefront balconies with premium room layout and personal butler services.</p>
          </div>
          <div class="result-action" style="text-align: right; min-width: 120px;">
            <span class="result-price" style="display: block; font-size: 1.3rem; font-weight: 700; color: var(--color-gold); margin-bottom: 10px;">₹6,499 / night</span>
            <button class="btn-gold" onclick="confirmBooking('hotel', 'Lake View Luxury Suite', '${city}')">Book Now</button>
          </div>
        </div>

      </div>
    `;
  }
}

// --- SEAT PICKER FOR BUS BOOKING ---
let selectedSeats = [];
let activeBusPrice = 850;

function selectBusSeats(busModel, price) {
  modalTitle.innerText = `Select Seats - ${busModel}`;
  selectedSeats = [];
  activeBusPrice = price || 850;
  
  let seatGridHTML = '';
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
    <div class="seat-map-container" style="max-width: 450px; margin: 0 auto;">
      <div class="insurance-modal-alert" style="margin-bottom: 15px; padding: 10px 15px;">
        <i class="bx bx-shield-quarter" style="font-size: 1.6rem;"></i>
        <div style="font-size:0.78rem;">
          <strong>Travel Insurance Active</strong>
          Coverage of ₹5,00,000 for Group Leader & travelers.
        </div>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); width: 100%; text-align: center; padding: 8px; border-radius: 4px; color: var(--color-gold); font-size: 0.8rem; letter-spacing: 1px; border: 1px solid var(--color-border-light); margin-bottom: 15px;">
        DRIVER CABIN / FRONT
      </div>
      
      <div class="seat-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
        ${seatGridHTML}
      </div>

      <div class="seat-legend" style="display: flex; justify-content: space-around; font-size: 0.8rem; margin-bottom: 20px;">
        <div class="legend-item" style="display:flex; align-items:center; gap:5px;"><div class="box" style="width:15px; height:15px; background:var(--color-bg-dark); border:1px solid var(--color-border-light);"></div><span>Available</span></div>
        <div class="legend-item sel" style="display:flex; align-items:center; gap:5px;"><div class="box" style="width:15px; height:15px; background:var(--color-gold);"></div><span>Selected</span></div>
        <div class="legend-item occ" style="display:flex; align-items:center; gap:5px;"><div class="box" style="width:15px; height:15px; background:rgba(255,255,255,0.15); cursor:not-allowed;"></div><span>Occupied</span></div>
      </div>

      <div style="width: 100%; border-top: 1px solid var(--color-border-light); padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
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
    totalPrice.innerText = `₹${(selectedSeats.length * activeBusPrice).toLocaleString('en-IN')}`;
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
  const total = selectedSeats.length * activeBusPrice;
  const bookingID = 'KYB' + Math.floor(100000 + Math.random() * 900000);
  
  modalTitle.innerText = "Booking Successful!";
  modalBody.innerHTML = `
    <div style="text-align: center; padding: 20px 10px;">
      <i class="bx bxs-check-circle" style="font-size: 4.5rem; color: #25D366; margin-bottom: 20px;"></i>
      <h3 style="font-family: var(--font-body); font-weight:700; font-size:1.5rem; margin-bottom: 10px; color:#FFF;">Ticket Booked Successfully</h3>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width:550px; margin: 0 auto 20px;">
        Seat number(s) <strong>${seats}</strong> registered under Reference ID: <strong>${bookingID}</strong>.
      </p>

      <div class="insurance-checkout-badge">
        <i class="bx bx-shield-quarter"></i>
        <div>
          <strong>FREE ₹5,00,000 Travel Insurance Activated</strong>
          The Group Leader (Mukhya) and all travelers are covered with FREE ₹5,00,000 Travel Insurance during this journey.
        </div>
      </div>

      <div class="glass-panel" style="padding: 20px; max-width:480px; margin: 0 auto 30px; text-align: left; border: 1px dashed var(--color-gold);">
        <h4 style="color:var(--color-gold); margin-bottom: 10px;"><i class="bx bx-info-circle"></i> Important Instructions:</h4>
        <p style="font-size: 0.85rem; line-height: 1.6;">
          • The complete travel ticket details have been sent to your registered mobile number via SMS / WhatsApp.<br>
          • For instant payment confirmation or assistance, please contact our support lines:<br>
          <strong style="color: var(--color-gold); font-size: 1rem;"><i class="bx bx-phone-call"></i> +91 9131964831 / +91 9680480116</strong>
        </p>
      </div>

      <div style="display:flex; justify-content:center; gap:15px;">
        <a href="https://wa.me/919131964831?text=Booking%20Confirmation%20Request%20ID%20${bookingID}%20for%20${encodeURIComponent(busModel)}%20Seats%20${seats}" target="_blank" class="btn-gold" style="background:#25D366; border-color:#25D366; color:#FFF!important;">
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
    <div style="text-align: center; padding: 20px 10px;">
      <i class="bx bxs-calendar-check" style="font-size: 4.5rem; color: var(--color-gold); margin-bottom: 20px;"></i>
      <h3 style="font-family: var(--font-body); font-weight:700; font-size:1.5rem; margin-bottom: 10px; color:#FFF;">Request Successfully Registered</h3>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width:550px; margin: 0 auto 20px;">
        ${detailsText} Reference ID: <strong>${bookingID}</strong>. Our booking desk will contact you shortly to confirm arrangements and rates.
      </p>

      <div class="insurance-checkout-badge">
        <i class="bx bx-shield-quarter"></i>
        <div>
          <strong>FREE ₹5,00,000 Travel Insurance Activated</strong>
          The Group Leader (Mukhya) and all travelers are covered with FREE ₹5,00,000 Travel Insurance during this journey.
        </div>
      </div>

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
function getCabs() {
  return JSON.parse(localStorage.getItem('kannu_cabs') || '[]');
}

function saveCabs(cabs) {
  localStorage.setItem('kannu_cabs', JSON.stringify(cabs));
}

function renderCabs() {
  const container = document.getElementById('cabs-container');
  if (!container) return;

  const cabs = getCabs();
  let html = '';

  cabs.forEach(cab => {
    let priceText = '';
    if (cab.id === 'cab_selfdrive') {
      priceText = `Starting at ₹${cab.price} / KM`;
    } else {
      priceText = `Starting at ₹${Number(cab.price).toLocaleString('en-IN')}`;
    }

    html += `
      <div class="package-card glass-panel" id="cab-card-${cab.id}">
        <div class="package-img-wrapper">
          <img src="${cab.image}" alt="${cab.name}" class="package-img" style="width:100%; height:100%; object-fit:cover;">
          <span class="package-tag">${cab.tag}</span>
        </div>
        <div class="package-info">
          <div class="package-meta">
            <span><i class="bx bx-car"></i> ${cab.duration}</span>
            <span><i class="bx bx-shield-quarter"></i> Free Insurance</span>
          </div>

          <div class="card-insurance-badge">
            <i class="bx bx-shield-quarter"></i> Free ₹5L Insurance for Group Leader
          </div>

          <h3 class="package-title" style="font-size: 1.3rem; height: 55px; overflow: hidden; margin-top:5px; margin-bottom:12px;">${cab.name}</h3>

          <div class="package-route" style="margin-bottom:15px; font-size:0.82rem;">
            <i class="bx bx-map" style="color:var(--color-gold);"></i> <span><strong>Route:</strong> ${cab.route}</span>
          </div>

          <div class="package-bottom" style="margin-top:15px; padding-top:15px; border-top:1px solid var(--color-border-light);">
            <div class="package-price">
              <span>Pricing details</span>
              <strong style="font-size:1.15rem; color:var(--color-gold);">${priceText}</strong>
            </div>

            <div class="package-actions-row">
              <a href="https://wa.me/919131964831?text=Hi%20Kannu%20Yatri,%20I%20want%20to%20enquire%20about%20the%20${encodeURIComponent(cab.name)}%20package." target="_blank" class="btn-gold" style="background:#25D366; border-color:#25D366; color:#FFF!important;">
                <i class="bx bxl-whatsapp"></i> Whatsapp
              </a>
              <button class="btn-outline" onclick="openCabPackageDetails('${cab.id}')">Details</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  if (window.initTiltAnimation) {
    window.initTiltAnimation();
  }
}

function openCabPackageDetails(cabId) {
  const cabs = getCabs();
  const cab = cabs.find(c => c.id === cabId);
  if (!cab) return;

  openModal();
  modalTitle.innerText = cab.name;

  let inclusionsHTML = '';
  if (cab.inclusions && Array.isArray(cab.inclusions)) {
    cab.inclusions.forEach(inc => {
      inclusionsHTML += `
        <li style="display:flex; align-items:flex-start; gap:8px; font-size:0.82rem; color:#FFF; margin-bottom:8px;">
          <i class="bx bx-check-double" style="color:var(--color-gold); font-size:1.1rem; margin-top:2px; flex-shrink:0;"></i>
          <span>${inc}</span>
        </li>
      `;
    });
  }

  let exclusionsHTML = '';
  if (cab.exclusions && Array.isArray(cab.exclusions)) {
    cab.exclusions.forEach(exc => {
      exclusionsHTML += `
        <li style="display:flex; align-items:flex-start; gap:8px; font-size:0.82rem; color:var(--color-text-muted); margin-bottom:8px;">
          <i class="bx bx-x" style="color:#DC3545; font-size:1.1rem; margin-top:2px; flex-shrink:0;"></i>
          <span>${exc}</span>
        </li>
      `;
    });
  }

  let itineraryHTML = '';
  if (cab.itinerary && Array.isArray(cab.itinerary)) {
    cab.itinerary.forEach(step => {
      itineraryHTML += `
        <div style="margin-bottom: 20px; border-left: 2px solid var(--color-gold); padding-left: 15px; position:relative;">
          <span style="position:absolute; left:-7px; top:0; width:12px; height:12px; border-radius:50%; background:var(--color-gold);"></span>
          <strong style="color:var(--color-gold); font-size:0.92rem; text-transform:uppercase; display:block;">${step.day} - ${step.title}</strong>
          <p style="font-size:0.82rem; margin-top:5px; color:var(--color-text-muted);">${step.desc}</p>
        </div>
      `;
    });
  }

  let sightseeingHTML = '';
  if (cab.sightseeing && Array.isArray(cab.sightseeing)) {
    cab.sightseeing.forEach(sight => {
      sightseeingHTML += `
        <div style="display: flex; flex-direction: column; align-items: center; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--color-border-light); overflow: hidden; padding-bottom: 8px;">
          <img src="${sight.image}" alt="${sight.name}" style="width: 100%; height: 110px; object-fit: cover;">
          <span style="font-size: 0.76rem; font-weight: 600; color: var(--color-gold); margin-top: 8px; text-align: center; padding: 0 5px;">${sight.name}</span>
        </div>
      `;
    });
  }

  let priceText = '';
  if (cab.id === 'cab_selfdrive') {
    priceText = `₹${cab.price} / KM`;
  } else {
    priceText = `₹${Number(cab.price).toLocaleString('en-IN')}`;
  }

  modalBody.innerHTML = `
    <div class="package-detail-modal-wrapper">
      
      <!-- Hero Banner -->
      <div class="package-hero-banner" style="position: relative; height: 220px; border-radius: var(--border-radius); overflow: hidden; margin-bottom: 25px; border: 1px solid var(--color-border);">
        <div style="background-image: url('${cab.image}'); background-size: cover; background-position: center; width: 100%; height: 100%; filter: brightness(0.4);"></div>
        <div style="position: absolute; bottom: 20px; left: 25px; right: 25px; z-index: 5;">
          <span style="color: var(--color-gold); font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">${cab.tag}</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #FFF; font-weight: 700; margin-top: 5px; margin-bottom: 10px;">${cab.name}</h2>
          <p style="font-size: 0.85rem; color: var(--color-gold-light); display: flex; align-items: center; gap: 15px; margin: 0;">
            <span><i class="bx bx-car" style="color: var(--color-gold);"></i> ${cab.duration}</span>
            <span><i class="bx bx-map" style="color: var(--color-gold);"></i> Route: ${cab.route}</span>
          </p>
        </div>
      </div>

      <!-- Insurance Badge -->
      <div class="insurance-modal-alert">
        <i class="bx bx-shield-quarter"></i>
        <div>
          <strong>FREE ₹5,00,000 Travel Insurance</strong>
          The Group Leader (Mukhya) receives FREE ₹5,00,000 Travel Insurance during the journey. All travelers are covered for safety.
        </div>
      </div>

      <!-- Core Info Grid -->
      <div class="package-details-grid-3">
        <div class="glass-panel" style="padding: 12px 15px; text-align: center; border: 1px solid var(--color-border-light);">
          <i class="bx bx-car" style="font-size: 1.6rem; color: var(--color-gold); margin-bottom: 5px; display:block;"></i>
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold); margin-bottom: 3px;">Vehicle Specs</h4>
          <p style="font-size: 0.78rem; color: #FFF; margin: 0;">${cab.vehicle}</p>
        </div>
        <div class="glass-panel" style="padding: 12px 15px; text-align: center; border: 1px solid var(--color-border-light);">
          <i class="bx bx-navigation" style="font-size: 1.6rem; color: var(--color-gold); margin-bottom: 5px; display:block;"></i>
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold); margin-bottom: 3px;">Route Style</h4>
          <p style="font-size: 0.78rem; color: #FFF; margin: 0;">${cab.duration}</p>
        </div>
        <div class="glass-panel" style="padding: 12px 15px; text-align: center; border: 1px solid var(--color-border-light);">
          <i class="bx bx-info-square" style="font-size: 1.6rem; color: var(--color-gold); margin-bottom: 5px; display:block;"></i>
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold); margin-bottom: 3px;">Rate Details</h4>
          <p style="font-size: 0.78rem; color: #FFF; margin: 0;">${cab.pricingDetails}</p>
        </div>
      </div>

      <!-- Gallery / Sightseeing -->
      ${sightseeingHTML ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-gold); margin-bottom: 15px; border-left: 3px solid var(--color-gold); padding-left: 10px;">
          <i class="bx bx-images"></i> Sights & Fleet Options
        </h3>
        <div class="package-details-gallery">
          ${sightseeingHTML}
        </div>
      </div>
      ` : ''}

      <!-- Main Body Grid: Itinerary & Inclusions/Exclusions -->
      <div class="package-details-grid-body">
        <!-- Itinerary -->
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-gold); margin-bottom: 15px; border-left: 3px solid var(--color-gold); padding-left: 10px;">
            <i class="bx bx-map-alt"></i> Trip Options Details
          </h3>
          <div style="padding-left: 10px; border-left: 1px dashed var(--color-border);">
            ${itineraryHTML}
          </div>
        </div>

        <!-- Inclusions & Exclusions -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div class="glass-panel" style="padding: 15px; border: 1px solid var(--color-border-light);">
            <h4 style="color: var(--color-gold); margin-bottom: 10px; font-size: 0.9rem;"><i class="bx bx-check-double"></i> Inclusions</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${inclusionsHTML}
            </ul>
          </div>
          <div class="glass-panel" style="padding: 15px; border: 1px solid var(--color-border-light); background: rgba(220, 53, 69, 0.02); border-color: rgba(220, 53, 69, 0.15);">
            <h4 style="color: #DC3545; margin-bottom: 10px; font-size: 0.9rem;"><i class="bx bx-x-circle"></i> Exclusions</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${exclusionsHTML}
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Action Row -->
      <div style="border-top: 1px solid var(--color-border-light); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div>
          <span style="font-size: 0.8rem; color: var(--color-text-muted);">Package Price</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-gold); font-weight: 700; margin: 0;">
            ${priceText} <span style="font-size: 0.8rem; font-family: var(--font-body); font-weight: 400; color: var(--color-text-muted);">rate</span>
          </h3>
        </div>
        <div style="display: flex; gap: 12px; flex-grow: 1; justify-content: flex-end; max-width: 450px;">
          <a href="https://wa.me/919131964831?text=Hi%20Kannu%20Yatri,%20I%20want%20to%20book%20or%20enquire%20about%20the%20${encodeURIComponent(cab.name)}.%20Route:%20${encodeURIComponent(cab.route)}." target="_blank" class="btn-gold" style="background: #25D366; border-color: #25D366; color: #FFF !important; flex-grow: 1; height: 45px; font-size:0.85rem;">
            <i class="bx bxl-whatsapp" style="font-size: 1.15rem;"></i> Whatsapp Enquiry
          </a>
          <button class="btn-gold" onclick="setActiveBookingTab('cab'); closeModal();" style="flex-grow: 1; height: 45px; font-size:0.85rem;">
            <i class="bx bx-calendar-check"></i> Book Now
          </button>
        </div>
      </div>

    </div>
  `;
}

function openPackageDetails(pkgId) {
  const packages = getPackages();
  const pkg = packages.find(p => p.id === pkgId);
  if (!pkg) return;

  openModal();
  modalTitle.innerText = pkg.name;

  let itineraryHTML = '';
  if (pkg.itinerary && Array.isArray(pkg.itinerary)) {
    pkg.itinerary.forEach(step => {
      itineraryHTML += `
        <div style="margin-bottom: 20px; border-left: 2px solid var(--color-gold); padding-left: 15px; position:relative;">
          <span style="position:absolute; left:-7px; top:0; width:12px; height:12px; border-radius:50%; background:var(--color-gold);"></span>
          <strong style="color:var(--color-gold); font-size:0.92rem; text-transform:uppercase; display:block;">${step.day} - ${step.title}</strong>
          <p style="font-size:0.82rem; margin-top:5px; color:var(--color-text-muted);">${step.desc}</p>
        </div>
      `;
    });
  }

  let inclusionsHTML = '';
  if (pkg.inclusions && Array.isArray(pkg.inclusions)) {
    pkg.inclusions.forEach(inc => {
      inclusionsHTML += `
        <li style="display:flex; align-items:flex-start; gap:8px; font-size:0.82rem; color:#FFF; margin-bottom:8px;">
          <i class="bx bx-check-double" style="color:var(--color-gold); font-size:1.1rem; margin-top:2px; flex-shrink:0;"></i>
          <span>${inc}</span>
        </li>
      `;
    });
  }

  let exclusionsHTML = '';
  const exclusionsList = pkg.exclusions || [
    'Guide charges inside monuments',
    'Personal shopping, laundry & telephone bills',
    'Special VIP entrance tickets at shrines',
    'Anything not explicitly mentioned in inclusions'
  ];
  exclusionsList.forEach(exc => {
    exclusionsHTML += `
      <li style="display:flex; align-items:flex-start; gap:8px; font-size:0.82rem; color:var(--color-text-muted); margin-bottom:8px;">
        <i class="bx bx-x" style="color:#DC3545; font-size:1.1rem; margin-top:2px; flex-shrink:0;"></i>
        <span>${exc}</span>
      </li>
    `;
  });

  let sightseeingHTML = '';
  if (pkg.sightseeing && Array.isArray(pkg.sightseeing)) {
    pkg.sightseeing.forEach(sight => {
      sightseeingHTML += `
        <div style="display: flex; flex-direction: column; align-items: center; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--color-border-light); overflow: hidden; padding-bottom: 8px;">
          <img src="${sight.image}" alt="${sight.name}" style="width: 100%; height: 110px; object-fit: cover;">
          <span style="font-size: 0.76rem; font-weight: 600; color: var(--color-gold); margin-top: 8px; text-align: center; padding: 0 5px;">${sight.name}</span>
        </div>
      `;
    });
  }

  modalBody.innerHTML = `
    <div class="package-detail-modal-wrapper">
      
      <!-- Hero Banner -->
      <div class="package-hero-banner" style="position: relative; height: 220px; border-radius: var(--border-radius); overflow: hidden; margin-bottom: 25px; border: 1px solid var(--color-border);">
        <div style="background-image: url('${pkg.image}'); background-size: cover; background-position: center; width: 100%; height: 100%; filter: brightness(0.4);"></div>
        <div style="position: absolute; bottom: 20px; left: 25px; right: 25px; z-index: 5;">
          <span style="color: var(--color-gold); font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">${pkg.tag}</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #FFF; font-weight: 700; margin-top: 5px; margin-bottom: 10px;">${pkg.name}</h2>
          <p style="font-size: 0.85rem; color: var(--color-gold-light); display: flex; align-items: center; gap: 15px; margin: 0;">
            <span><i class="bx bx-time" style="color: var(--color-gold);"></i> ${pkg.duration}</span>
            <span><i class="bx bx-map" style="color: var(--color-gold);"></i> Route: ${pkg.route}</span>
          </p>
        </div>
      </div>

      <!-- Insurance Badge -->
      <div class="insurance-modal-alert">
        <i class="bx bx-shield-quarter"></i>
        <div>
          <strong>FREE ₹5,00,000 Travel Insurance</strong>
          The Group Leader (Mukhya) receives FREE ₹5,00,000 Travel Insurance during the journey. All travelers are covered for safety.
        </div>
      </div>

      <!-- Core Info Grid (Hotel, Vehicle, Meals) -->
      <div class="package-details-grid-3">
        <div class="glass-panel" style="padding: 12px 15px; text-align: center; border: 1px solid var(--color-border-light);">
          <i class="bx bx-hotel" style="font-size: 1.6rem; color: var(--color-gold); margin-bottom: 5px; display:block;"></i>
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold); margin-bottom: 3px;">Hotel Details</h4>
          <p style="font-size: 0.78rem; color: #FFF; margin: 0;">${pkg.hotelDetails || 'Premium 3-Star AC Stays'}</p>
        </div>
        <div class="glass-panel" style="padding: 12px 15px; text-align: center; border: 1px solid var(--color-border-light);">
          <i class="bx bx-car" style="font-size: 1.6rem; color: var(--color-gold); margin-bottom: 5px; display:block;"></i>
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold); margin-bottom: 3px;">Vehicle Details</h4>
          <p style="font-size: 0.78rem; color: #FFF; margin: 0;">${pkg.vehicleDetails || 'AC Ertiga / Swift Dzire'}</p>
        </div>
        <div class="glass-panel" style="padding: 12px 15px; text-align: center; border: 1px solid var(--color-border-light);">
          <i class="bx bx-restaurant" style="font-size: 1.6rem; color: var(--color-gold); margin-bottom: 5px; display:block;"></i>
          <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold); margin-bottom: 3px;">Meal Details</h4>
          <p style="font-size: 0.78rem; color: #FFF; margin: 0;">${pkg.mealDetails || 'Breakfast & Dinner Included'}</p>
        </div>
      </div>

      <!-- Sightseeing Gallery Section -->
      ${sightseeingHTML ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-gold); margin-bottom: 15px; border-left: 3px solid var(--color-gold); padding-left: 10px;">
          <i class="bx bx-images"></i> Sightseeing Places Gallery
        </h3>
        <div class="package-details-gallery">
          ${sightseeingHTML}
        </div>
      </div>
      ` : ''}

      <!-- Main Body Grid: Itinerary & Inclusions/Exclusions -->
      <div class="package-details-grid-body">
        <!-- Itinerary -->
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-gold); margin-bottom: 15px; border-left: 3px solid var(--color-gold); padding-left: 10px;">
            <i class="bx bx-map-alt"></i> Tour Itinerary
          </h3>
          <div style="padding-left: 10px; border-left: 1px dashed var(--color-border);">
            ${itineraryHTML}
          </div>
        </div>

        <!-- Inclusions & Exclusions -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div class="glass-panel" style="padding: 15px; border: 1px solid var(--color-border-light);">
            <h4 style="color: var(--color-gold); margin-bottom: 10px; font-size: 0.9rem;"><i class="bx bx-check-double"></i> Package Inclusions</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${inclusionsHTML}
            </ul>
          </div>
          <div class="glass-panel" style="padding: 15px; border: 1px solid var(--color-border-light); background: rgba(220, 53, 69, 0.02); border-color: rgba(220, 53, 69, 0.15);">
            <h4 style="color: #DC3545; margin-bottom: 10px; font-size: 0.9rem;"><i class="bx bx-x-circle"></i> Package Exclusions</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${exclusionsHTML}
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Pricing & CTA Row -->
      <div style="border-top: 1px solid var(--color-border-light); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div>
          <span style="font-size: 0.8rem; color: var(--color-text-muted);">Package Price</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-gold); font-weight: 700; margin: 0;">
            ₹${Number(pkg.price).toLocaleString('en-IN')} <span style="font-size: 0.8rem; font-family: var(--font-body); font-weight: 400; color: var(--color-text-muted);">/ person</span>
          </h3>
        </div>
        <div style="display: flex; gap: 12px; flex-grow: 1; justify-content: flex-end; max-width: 450px;">
          <a href="https://wa.me/919131964831?text=Hi%20Kannu%20Yatri,%20I%20want%20to%20enquire%20about%20the%20${encodeURIComponent(pkg.name)}%20package.%20Please%20provide%20more%20details." target="_blank" class="btn-gold" style="background: #25D366; border-color: #25D366; color: #FFF !important; flex-grow: 1; height: 45px; font-size:0.85rem;">
            <i class="bx bxl-whatsapp" style="font-size: 1.15rem;"></i> Whatsapp Enquiry
          </a>
          <button class="btn-gold" onclick="openQuickBookPackage('${pkg.id}')" style="flex-grow: 1; height: 45px; font-size:0.85rem;">
            <i class="bx bx-calendar-check"></i> Book Now
          </button>
        </div>
      </div>

    </div>
  `;
}

// --- QUICK PACKAGE BOOKING MODAL ---
function openQuickBookPackage(pkgId) {
  const packages = getPackages();
  const pkg = packages.find(p => p.id === pkgId);
  if (!pkg) return;
  
  openModal();
  modalTitle.innerText = `Book Holiday Package`;
  
  modalBody.innerHTML = `
    <div style="max-width: 550px; margin: 0 auto; padding: 10px 0;">
      <div class="insurance-modal-alert">
        <i class="bx bx-shield-quarter"></i>
        <div>
          <strong>FREE ₹5,00,000 Travel Insurance Active</strong>
          The Group Leader (Mukhya) receives FREE ₹5,00,000 Travel Insurance during this trip. All travelers are covered.
        </div>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--color-border-light); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h4 style="color:#FFF; font-size:1.15rem; margin-bottom: 8px;">Selected Package:</h4>
        <strong style="color:var(--color-gold); font-size:1.30rem; display:block; margin-bottom: 5px;">${pkg.name}</strong>
        <span style="font-size:0.85rem; color:var(--color-text-muted);"><i class="bx bx-time"></i> ${pkg.duration} | <i class="bx bx-map"></i> ${pkg.route}</span>
        <div style="margin-top: 12px; font-size: 1.15rem; color:#FFF; font-weight:700;">Price: <span style="color:var(--color-gold);">₹${Number(pkg.price).toLocaleString('en-IN')} / member</span></div>
      </div>

      <form id="pkg-quick-book-form" onsubmit="handlePackageQuickBookSubmit('${pkg.id}', event)">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:20px;">
          <div class="form-group" style="display:flex; flex-direction:column; gap:8px;">
            <label for="pbook-name" style="font-size:0.85rem; color:#FFF;"><i class="bx bx-user"></i> Full Name</label>
            <input type="text" id="pbook-name" class="form-control" placeholder="Group Leader Name" style="width:100%;" required>
          </div>
          <div class="form-group" style="display:flex; flex-direction:column; gap:8px;">
            <label for="pbook-phone" style="font-size:0.85rem; color:#FFF;"><i class="bx bx-phone"></i> Phone Number</label>
            <input type="tel" id="pbook-phone" class="form-control" placeholder="10-digit Mobile" pattern="[0-9]{10}" style="width:100%;" required>
          </div>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:25px;">
          <div class="form-group" style="display:flex; flex-direction:column; gap:8px;">
            <label for="pbook-date" style="font-size:0.85rem; color:#FFF;"><i class="bx bx-calendar"></i> Travel Date</label>
            <input type="date" id="pbook-date" class="form-control" style="width:100%;" required>
          </div>
          <div class="form-group" style="display:flex; flex-direction:column; gap:8px;">
            <label for="pbook-passengers" style="font-size:0.85rem; color:#FFF;"><i class="bx bx-group"></i> Total Passengers</label>
            <select id="pbook-passengers" class="form-control" style="width:100%;" required>
              <option value="1">1 Person</option>
              <option value="2">2 Persons</option>
              <option value="3">3 Persons</option>
              <option value="4">4 Persons</option>
              <option value="5">5 Persons</option>
              <option value="6+">6+ Persons (Recommended Group Size)</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn-gold" style="width:100%; height:50px; font-size:1rem;"><i class="bx bx-calendar-check"></i> Book Package Now</button>
      </form>
    </div>
  `;
  
  const pbookDate = document.getElementById('pbook-date');
  if (pbookDate) {
    const today = new Date().toISOString().split('T')[0];
    pbookDate.min = today;
    pbookDate.value = today;
  }
}

function handlePackageQuickBookSubmit(pkgId, event) {
  event.preventDefault();
  const packages = getPackages();
  const pkg = packages.find(p => p.id === pkgId);
  if (!pkg) return;

  const name = document.getElementById('pbook-name').value;
  const phone = document.getElementById('pbook-phone').value;
  const date = document.getElementById('pbook-date').value;
  const passengers = document.getElementById('pbook-passengers').value;

  const bookingID = 'KYP' + Math.floor(100000 + Math.random() * 900000);
  
  modalTitle.innerText = "Package Booking Registered!";
  modalBody.innerHTML = `
    <div style="text-align: center; padding: 20px 10px;">
      <i class="bx bxs-check-circle" style="font-size: 4.5rem; color: #25D366; margin-bottom: 20px;"></i>
      <h3 style="font-family: var(--font-body); font-weight:700; font-size:1.5rem; margin-bottom: 10px; color:#FFF;">Package Booked Successfully</h3>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width:550px; margin: 0 auto 20px;">
        Dear <strong>${name}</strong>, your booking request for <strong>${pkg.name}</strong> has been registered. Reference ID: <strong>${bookingID}</strong>.
      </p>

      <div class="insurance-checkout-badge">
        <i class="bx bx-shield-quarter"></i>
        <div>
          <strong>FREE ₹5,00,000 Travel Insurance Active</strong>
          As the Mukhya (Group Leader), you are insured for ₹5,00,000. All travelers enjoy safety protection during this trip.
        </div>
      </div>

      <div class="glass-panel" style="padding: 20px; max-width:480px; margin: 0 auto 30px; text-align: left; border: 1px dashed var(--color-gold);">
        <h4 style="color:var(--color-gold); margin-bottom: 10px;"><i class="bx bx-info-circle"></i> Instructions to Confirm:</h4>
        <p style="font-size: 0.85rem; line-height: 1.6;">
          • An advance payment is required to lock in the Ertiga cab and 3-Star AC hotel stays.<br>
          • Share your Reference ID on WhatsApp for instant confirmation:<br>
          <strong style="color: var(--color-gold); font-size: 1rem;"><i class="bx bx-phone-call"></i> +91 9131964831 / +91 9680480116</strong>
        </p>
      </div>

      <div style="display:flex; justify-content:center; gap:15px;">
        <a href="https://wa.me/919131964831?text=Hi%20Kannu%20Yatri,%20I%20want%20to%20confirm%20my%20booking%20for%20${encodeURIComponent(pkg.name)}.%20Ref%20ID:%20${bookingID}.%20Traveler:%20${name},%20Date:%20${date},%20Size:%20${passengers}." target="_blank" class="btn-gold" style="background:#25D366; border-color:#25D366; color:#FFF!important;">
          <i class="bx bxl-whatsapp"></i> Confirm on WhatsApp
        </a>
        <button class="btn-outline" onclick="closeModal()">Close Window</button>
      </div>
    </div>
  `;
  showToast("Package booking request submitted!", "bx bx-check-double");
}

// --- ADMIN PORTAL PANEL HANDLERS ---
const adminModal = document.getElementById('admin-modal');
const adminModalTitle = document.getElementById('admin-modal-title');
const adminModalBody = document.getElementById('admin-modal-body-content');

let currentAdminTab = 'buses';

function openAdminPortal(event) {
  if (event) event.preventDefault();
  if (adminModal) {
    adminModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    checkAdminLogin();
  }
}

function closeAdminModal() {
  if (adminModal) {
    adminModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

function checkAdminLogin() {
  const isLoggedIn = sessionStorage.getItem('kannu_admin_logged');
  if (isLoggedIn === 'true') {
    renderAdminDashboard();
  } else {
    renderAdminLogin();
  }
}

function renderAdminLogin() {
  adminModalTitle.innerText = "Admin Security Login";
  adminModalBody.innerHTML = `
    <div class="admin-login-container">
      <i class="bx bx-shield-quarter" style="font-size: 3.5rem; color: var(--color-gold); margin-bottom: 15px; display: block;"></i>
      <h3 style="margin-bottom: 10px;">Security Portal</h3>
      <p style="font-size:0.8rem; margin-bottom: 20px;">Enter security key to manage bookings database.</p>
      <form onsubmit="handleAdminLogin(event)">
        <div class="form-group" style="margin-bottom: 20px;">
          <input type="password" id="admin-pass-key" class="form-control" placeholder="Security Password" style="text-align:center; width:100%;" required>
        </div>
        <button type="submit" class="btn-gold" style="width:100%;">Access Database</button>
      </form>
    </div>
  `;
}

function handleAdminLogin(event) {
  event.preventDefault();
  const password = document.getElementById('admin-pass-key').value;
  // Security Password as requested
  if (password === 'kannu2026' || password === 'admin') {
    sessionStorage.setItem('kannu_admin_logged', 'true');
    showToast("Access granted. Admin session active.", "bx bx-lock-open");
    renderAdminDashboard();
  } else {
    showToast("Invalid security key!", "bx bx-lock");
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('kannu_admin_logged');
  showToast("Admin session ended.", "bx bx-lock");
  renderAdminLogin();
}

function renderAdminDashboard() {
  adminModalTitle.innerText = "Kannu Yatri Database Management";
  adminModalBody.innerHTML = `
    <div class="admin-dashboard">
      <div class="admin-sidebar">
        <button class="admin-nav-btn ${currentAdminTab === 'buses' ? 'active' : ''}" onclick="switchAdminTab('buses')">
          <i class="bx bx-bus"></i> Cabs / Buses
        </button>
        <button class="admin-nav-btn ${currentAdminTab === 'packages' ? 'active' : ''}" onclick="switchAdminTab('packages')">
          <i class="bx bx-package"></i> Tour Packages
        </button>
        <button class="admin-nav-btn" onclick="handleAdminLogout()" style="margin-top:auto; color:#DC3545;">
          <i class="bx bx-log-out"></i> Log Out
        </button>
      </div>
      <div class="admin-content" id="admin-content-view">
        <!-- Render lists based on active tab -->
      </div>
    </div>
  `;
  renderAdminTabContent();
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  renderAdminDashboard();
}

function renderAdminTabContent() {
  const contentView = document.getElementById('admin-content-view');
  if (!contentView) return;

  if (currentAdminTab === 'buses') {
    renderAdminBuses(contentView);
  } else if (currentAdminTab === 'packages') {
    renderAdminPackages(contentView);
  }
}

// --- BUSES MANAGEMENT ---
function renderAdminBuses(container) {
  const buses = getBuses();
  let tableRows = '';
  
  buses.forEach((bus, index) => {
    tableRows += `
      <tr>
        <td><strong>${bus.operator}</strong></td>
        <td>${bus.route}</td>
        <td>${bus.time}</td>
        <td>₹${bus.price}</td>
        <td>${bus.seatsLeft}</td>
        <td>
          <div class="admin-action-btns">
            <button class="admin-mini-btn edit" onclick="openEditBusForm(${index})">Edit</button>
            <button class="admin-mini-btn delete" onclick="deleteBus(${index})">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="admin-header-row">
      <h3>Manage Buses Listing</h3>
      <button class="btn-gold" onclick="openAddBusForm()"><i class="bx bx-plus"></i> Add Bus</button>
    </div>
    <div style="overflow-x: auto;">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Operator (Type)</th>
            <th>Route</th>
            <th>Departs</th>
            <th>Fare</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.length > 0 ? tableRows : '<tr><td colspan="6" style="text-align:center;">No buses in registry. Add a new bus coach!</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function openAddBusForm() {
  const contentView = document.getElementById('admin-content-view');
  contentView.innerHTML = `
    <div class="admin-header-row">
      <h3>Add New Bus Listing</h3>
      <button class="btn-outline" onclick="renderAdminTabContent()"><i class="bx bx-arrow-back"></i> Back</button>
    </div>
    <form class="admin-form" onsubmit="saveBus(event)">
      <div class="form-group">
        <label>Operator / Bus Name</label>
        <input type="text" id="abus-operator" class="form-control" placeholder="e.g., Kannu Yatri Sleeper AC" required>
      </div>
      <div class="form-group">
        <label>Coach / Vehicle Type</label>
        <input type="text" id="abus-type" class="form-control" placeholder="e.g., Volvo AC 2+1" required>
      </div>
      <div class="form-group">
        <label>Route (Format: From - To)</label>
        <input type="text" id="abus-route" class="form-control" placeholder="e.g., Pratapgarh - Udaipur" required>
      </div>
      <div class="form-group">
        <label>Departure Time</label>
        <input type="text" id="abus-time" class="form-control" placeholder="e.g., 10:15 PM" required>
      </div>
      <div class="form-group">
        <label>Price Rate (Fare in INR)</label>
        <input type="number" id="abus-price" class="form-control" placeholder="e.g., 850" required>
      </div>
      <div class="form-group">
        <label>Total Seats Available</label>
        <input type="number" id="abus-seats" class="form-control" value="24" required>
      </div>
      <div class="form-group full-width">
        <label>Inclusions / Features (Comma separated)</label>
        <input type="text" id="abus-inclusions" class="form-control" placeholder="e.g., Sterilized Blankets, USB Charging, Water Bottle">
      </div>
      <div class="admin-form-actions">
        <button type="button" class="btn-outline" onclick="renderAdminTabContent()">Cancel</button>
        <button type="submit" class="btn-gold">Save Bus Listing</button>
      </div>
    </form>
  `;
}

function openEditBusForm(index) {
  const buses = getBuses();
  const bus = buses[index];
  if (!bus) return;

  const contentView = document.getElementById('admin-content-view');
  contentView.innerHTML = `
    <div class="admin-header-row">
      <h3>Edit Bus Coach Details</h3>
      <button class="btn-outline" onclick="renderAdminTabContent()"><i class="bx bx-arrow-back"></i> Back</button>
    </div>
    <form class="admin-form" onsubmit="saveBus(event, ${index})">
      <div class="form-group">
        <label>Operator / Bus Name</label>
        <input type="text" id="abus-operator" class="form-control" value="${bus.operator}" required>
      </div>
      <div class="form-group">
        <label>Coach / Vehicle Type</label>
        <input type="text" id="abus-type" class="form-control" value="${bus.type}" required>
      </div>
      <div class="form-group">
        <label>Route (Format: From - To)</label>
        <input type="text" id="abus-route" class="form-control" value="${bus.route}" required>
      </div>
      <div class="form-group">
        <label>Departure Time</label>
        <input type="text" id="abus-time" class="form-control" value="${bus.time}" required>
      </div>
      <div class="form-group">
        <label>Price Rate (Fare in INR)</label>
        <input type="number" id="abus-price" class="form-control" value="${bus.price}" required>
      </div>
      <div class="form-group">
        <label>Seats Available</label>
        <input type="number" id="abus-seats" class="form-control" value="${bus.seatsLeft}" required>
      </div>
      <div class="form-group full-width">
        <label>Inclusions / Features (Comma separated)</label>
        <input type="text" id="abus-inclusions" class="form-control" value="${bus.inclusions ? bus.inclusions.join(', ') : ''}">
      </div>
      <div class="admin-form-actions">
        <button type="button" class="btn-outline" onclick="renderAdminTabContent()">Cancel</button>
        <button type="submit" class="btn-gold">Update Bus Listing</button>
      </div>
    </form>
  `;
}

function saveBus(event, editIndex = null) {
  event.preventDefault();
  const operator = document.getElementById('abus-operator').value;
  const type = document.getElementById('abus-type').value;
  const route = document.getElementById('abus-route').value;
  const time = document.getElementById('abus-time').value;
  const price = Number(document.getElementById('abus-price').value);
  const seatsLeft = Number(document.getElementById('abus-seats').value);
  const inclusionsVal = document.getElementById('abus-inclusions').value;
  
  const inclusions = inclusionsVal ? inclusionsVal.split(',').map(s => s.trim()) : [];

  let buses = getBuses();
  const busData = {
    id: editIndex !== null ? buses[editIndex].id : 'bus_' + Date.now(),
    operator,
    type,
    route,
    time,
    price,
    seatsLeft,
    inclusions
  };

  if (editIndex !== null) {
    buses[editIndex] = busData;
    showToast("Bus schedule updated successfully!", "bx bx-check-double");
  } else {
    buses.push(busData);
    showToast("New bus coach added to scheduling!", "bx bx-check-double");
  }

  saveBuses(buses);
  renderAdminTabContent();
}

function deleteBus(index) {
  if (confirm("Are you sure you want to delete this bus schedule from scheduling?")) {
    let buses = getBuses();
    buses.splice(index, 1);
    saveBuses(buses);
    showToast("Bus schedule deleted from registry.", "bx bx-trash");
    renderAdminTabContent();
  }
}


// --- HOLIDAY PACKAGES MANAGEMENT ---
function renderAdminPackages(container) {
  const packages = getPackages();
  let tableRows = '';
  
  packages.forEach((pkg, index) => {
    tableRows += `
      <tr>
        <td><strong>${pkg.name}</strong></td>
        <td>${pkg.route}</td>
        <td>${pkg.duration}</td>
        <td>₹${Number(pkg.price).toLocaleString('en-IN')}</td>
        <td>
          <div class="admin-action-btns">
            <button class="admin-mini-btn edit" onclick="openEditPackageForm(${index})">Edit</button>
            <button class="admin-mini-btn delete" onclick="deletePackage(${index})">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="admin-header-row">
      <h3>Manage Holiday Packages</h3>
      <button class="btn-gold" onclick="openAddPackageForm()"><i class="bx bx-plus"></i> Add Package</button>
    </div>
    <div style="overflow-x: auto;">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Route Details</th>
            <th>Duration</th>
            <th>Starts From</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.length > 0 ? tableRows : '<tr><td colspan="5" style="text-align:center;">No packages found in database. Create a package card!</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function openAddPackageForm() {
  const contentView = document.getElementById('admin-content-view');
  
  const itineraryPlaceholder = 
    `Day 1: Arrival & Sightseeing | Check-in and visit scenic attractions.\n` +
    `Day 2: Temple Tour | Attend morning darshan and local markets.\n` +
    `Day 3: Return | Visit forts and head back home.`;

  contentView.innerHTML = `
    <div class="admin-header-row">
      <h3>Create Tour Package Card</h3>
      <button class="btn-outline" onclick="renderAdminTabContent()"><i class="bx bx-arrow-back"></i> Back</button>
    </div>
    <form class="admin-form" onsubmit="savePackage(event)">
      <div class="form-group">
        <label>Package Name</label>
        <input type="text" id="apkg-name" class="form-control" placeholder="e.g., Sacred Darshan Tour" required>
      </div>
      <div class="form-group">
        <label>Category Tag (e.g. Religious, Honeymoon)</label>
        <input type="text" id="apkg-tag" class="form-control" placeholder="e.g., Religious" required>
      </div>
      <div class="form-group">
        <label>Duration</label>
        <input type="text" id="apkg-duration" class="form-control" placeholder="e.g., 3 Days / 2 Nights" required>
      </div>
      <div class="form-group">
        <label>Starting Price (INR / Member)</label>
        <input type="number" id="apkg-price" class="form-control" placeholder="e.g., 3999" required>
      </div>
      <div class="form-group">
        <label>Route / Locations Covered</label>
        <input type="text" id="apkg-route" class="form-control" placeholder="e.g., Pratapgarh - Udaipur - Mount Abu" required>
      </div>
      <div class="form-group">
        <label>Card Image URL</label>
        <input type="text" id="apkg-image" class="form-control" placeholder="Image URL (Unsplash or local files)" value="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80">
      </div>
      <div class="form-group full-width">
        <label>Inclusions / Features (Comma separated)</label>
        <input type="text" id="apkg-inclusions" class="form-control" placeholder="e.g., AC Cab, 2 Nights AC Hotel, Veg Meals, Driver Allowance" required>
      </div>
      <div class="form-group full-width">
        <label>Day-by-Day Itinerary (Format: Day X: Title | Description (one day per line))</label>
        <textarea id="apkg-itinerary" class="form-control" style="min-height: 120px; font-family: monospace;" placeholder="${itineraryPlaceholder}" required></textarea>
      </div>
      <div class="admin-form-actions">
        <button type="button" class="btn-outline" onclick="renderAdminTabContent()">Cancel</button>
        <button type="submit" class="btn-gold">Save Package Card</button>
      </div>
    </form>
  `;
}

function openEditPackageForm(index) {
  const packages = getPackages();
  const pkg = packages[index];
  if (!pkg) return;

  const contentView = document.getElementById('admin-content-view');
  
  // Format itinerary back to text lines
  let itinText = '';
  if (pkg.itinerary && Array.isArray(pkg.itinerary)) {
    itinText = pkg.itinerary.map(i => `${i.day}: ${i.title} | ${i.desc}`).join('\n');
  }

  contentView.innerHTML = `
    <div class="admin-header-row">
      <h3>Edit Tour Package Card</h3>
      <button class="btn-outline" onclick="renderAdminTabContent()"><i class="bx bx-arrow-back"></i> Back</button>
    </div>
    <form class="admin-form" onsubmit="savePackage(event, ${index})">
      <div class="form-group">
        <label>Package Name</label>
        <input type="text" id="apkg-name" class="form-control" value="${pkg.name}" required>
      </div>
      <div class="form-group">
        <label>Category Tag</label>
        <input type="text" id="apkg-tag" class="form-control" value="${pkg.tag || ''}" required>
      </div>
      <div class="form-group">
        <label>Duration</label>
        <input type="text" id="apkg-duration" class="form-control" value="${pkg.duration}" required>
      </div>
      <div class="form-group">
        <label>Starting Price (INR)</label>
        <input type="number" id="apkg-price" class="form-control" value="${pkg.price}" required>
      </div>
      <div class="form-group">
        <label>Route / Locations Covered</label>
        <input type="text" id="apkg-route" class="form-control" value="${pkg.route}" required>
      </div>
      <div class="form-group">
        <label>Card Image URL</label>
        <input type="text" id="apkg-image" class="form-control" value="${pkg.image || ''}">
      </div>
      <div class="form-group full-width">
        <label>Inclusions / Features (Comma separated)</label>
        <input type="text" id="apkg-inclusions" class="form-control" value="${pkg.inclusions ? pkg.inclusions.join(', ') : ''}" required>
      </div>
      <div class="form-group full-width">
        <label>Day-by-Day Itinerary (Format: Day X: Title | Description (one day per line))</label>
        <textarea id="apkg-itinerary" class="form-control" style="min-height: 120px; font-family: monospace;" required>${itinText}</textarea>
      </div>
      <div class="admin-form-actions">
        <button type="button" class="btn-outline" onclick="renderAdminTabContent()">Cancel</button>
        <button type="submit" class="btn-gold">Update Package Card</button>
      </div>
    </form>
  `;
}

function savePackage(event, editIndex = null) {
  event.preventDefault();
  const name = document.getElementById('apkg-name').value;
  const tag = document.getElementById('apkg-tag').value;
  const duration = document.getElementById('apkg-duration').value;
  const price = Number(document.getElementById('apkg-price').value);
  const route = document.getElementById('apkg-route').value;
  const image = document.getElementById('apkg-image').value;
  const inclusionsVal = document.getElementById('apkg-inclusions').value;
  const itineraryVal = document.getElementById('apkg-itinerary').value;

  const inclusions = inclusionsVal ? inclusionsVal.split(',').map(s => s.trim()) : [];
  
  // Parse itinerary back into array objects
  const itinerary = [];
  if (itineraryVal) {
    const lines = itineraryVal.split('\n');
    lines.forEach(line => {
      if (line.trim().length === 0) return;
      const parts = line.split('|');
      const headerPart = parts[0] || '';
      const descPart = parts[1] || '';
      
      const headSubParts = headerPart.split(':');
      const day = (headSubParts[0] || 'Day').trim();
      const title = (headSubParts[1] || '').trim();
      
      itinerary.push({
        day,
        title,
        desc: descPart.trim()
      });
    });
  }

  let packages = getPackages();
  const packageData = {
    id: editIndex !== null ? packages[editIndex].id : 'pkg_' + Date.now(),
    name,
    tag,
    duration,
    price,
    route,
    image,
    inclusions,
    itinerary
  };

  if (editIndex !== null) {
    packages[editIndex] = packageData;
    showToast("Holiday package card details updated!", "bx bx-check-double");
  } else {
    packages.push(packageData);
    showToast("New holiday package added to homepage!", "bx bx-check-double");
  }

  savePackages(packages);
  renderPackages(); // Rerender homepage
  renderAdminTabContent(); // Refresh admin list
}

function deletePackage(index) {
  if (confirm("Are you sure you want to delete this holiday package from the database?")) {
    let packages = getPackages();
    packages.splice(index, 1);
    savePackages(packages);
    showToast("Tour package removed from homepage.", "bx bx-trash");
    renderPackages(); // Rerender homepage
    renderAdminTabContent(); // Refresh admin list
  }
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


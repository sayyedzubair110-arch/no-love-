const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===========================
// SMOOTH SCROLLING
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// ADD TO ORDER FUNCTIONALITY
// ===========================

let orderItems = [];

function addToOrder(itemName, price) {
    orderItems.push({ name: itemName, price: price });
    showNotification(`${itemName} added to your order!`);
    scrollToContact();
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #DC143C;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideIn 0.3s ease-in-out;
        font-weight: bold;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// CONTACT FORM SUBMISSION
// ===========================

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!name || !phone || !message) {
        showNotification('Please fill all fields!');
        return;
    }

    // Prepare message with order items
    let fullMessage = message;
    if (orderItems.length > 0) {
        fullMessage += '\n\nOrder Items:\n';
        orderItems.forEach((item, index) => {
            fullMessage += `${index + 1}. ${item.name} - Rs. ${item.price}\n`;
        });
        const total = orderItems.reduce((sum, item) => sum + item.price, 0);
        fullMessage += `Total: Rs. ${total}`;
    }

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nMessage: ${fullMessage}`);
    const whatsappUrl = `https://wa.me/923043041472?text=${whatsappMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success notification
    showNotification('Order sent via WhatsApp! Thank you for ordering.');

    // Reset form and order items
    this.reset();
    orderItems = [];
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function () {
    let scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }

    lastScrollTop = scrollTop;
});

// ===========================
// LAZY LOADING FOR IMAGES
// ===========================

function lazyLoadImages() {
    const images = document.querySelectorAll('img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Call lazy loading on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}

// ===========================
// PHONE VALIDATION
// ===========================

document.getElementById('phone').addEventListener('input', function (e) {
    // Remove non-digits
    this.value = this.value.replace(/\D/g, '');

    // Validate Pakistani phone number
    if (this.value.length > 11) {
        this.value = this.value.slice(0, 11);
    }
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================

window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===========================
// PAGE LOAD OPTIMIZATION
// ===========================

// Preload critical resources
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageFeatures);
} else {
    initializePageFeatures();
}

function initializePageFeatures() {
    // Initialize menu items on load
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.animation = 'pulse 0.5s ease';
        });
    });
}

// ===========================
// FORM FIELD FOCUS EFFECT
// ===========================

const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===========================
// GOOGLE ANALYTICS & SEO
// ===========================

// Track page views and interactions
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track order button clicks
document.querySelectorAll('.btn-order').forEach(button => {
    button.addEventListener('click', function () {
        trackEvent('Menu', 'Order Button Click', this.textContent);
    });
});

// ===========================
// PERFORMANCE MONITORING
// ===========================

// Monitor Core Web Vitals
if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log('CLS:', clsValue);
            }
        }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
}

// ===========================
// ACCESSIBILITY IMPROVEMENTS
// ===========================

// Add keyboard navigation for menu buttons
document.querySelectorAll('.btn-order').forEach((button, index) => {
    button.setAttribute('aria-label', `Order item ${index + 1}`);
    button.setAttribute('role', 'button');
});

// Add alt text for all images
document.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('alt')) {
        img.setAttribute('alt', 'Food Image');
    }
});

// ===========================
// MOBILE DETECTION
// ===========================

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimize for mobile
if (isMobileDevice()) {
    document.body.style.fontSize = '16px'; // Prevent zoom on input focus
}

// ===========================
// CACHING & SERVICE WORKER
// ===========================

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('js/service-worker.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// ===========================
// DYNAMIC YEAR UPDATE
// ===========================

const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.textContent = footerText.textContent.replace('2026', currentYear);
}

// ===========================
// GLOBAL ERROR HANDLING
// ===========================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

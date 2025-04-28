// DOM Elements
const elements = {
    mobileMenuButton: document.getElementById('mobileMenuButton'),
    mobileMenu: document.getElementById('mobileMenu'),
    heroTitle: document.getElementById('heroTitle'),
    heroSubtitle: document.getElementById('heroSubtitle'),
    heroCTA: document.getElementById('heroCTA'),
    servicesGrid: document.getElementById('servicesGrid'),
    locationsGrid: document.getElementById('locationsGrid'),
    testimonialsGrid: document.getElementById('testimonialsGrid'),
    aboutTitle: document.getElementById('aboutTitle'),
    aboutContent: document.getElementById('aboutContent'),
    socialLinks: document.getElementById('socialLinks')
};

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
};

// Mobile Menu Functions
const toggleMobileMenu = () => {
    if (!elements.mobileMenu || !elements.mobileMenuButton) return;
    elements.mobileMenu.classList.toggle('active');
    const isOpen = elements.mobileMenu.classList.contains('active');
    elements.mobileMenuButton.setAttribute('aria-expanded', isOpen);
};

const closeMobileMenu = (event) => {
    if (!elements.mobileMenu || !elements.mobileMenuButton) return;
    if (!elements.mobileMenu.contains(event.target) && !elements.mobileMenuButton.contains(event.target)) {
        elements.mobileMenu.classList.remove('active');
        elements.mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
};

// Smooth Scroll Function
const smoothScroll = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        if (elements.mobileMenu) {
            elements.mobileMenu.classList.remove('active');
        }
        if (elements.mobileMenuButton) {
            elements.mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
};

// Data Loading and Processing
const loadData = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
};

const processData = (data) => {
    if (!data) {
        throw new Error('No data received');
    }

    // Set logo color
    document.documentElement.style.setProperty('--primary-color', data.logoColor || '#FA8F7C');

    // Set hero section content
    if (elements.heroTitle) {
        elements.heroTitle.textContent = data.hero?.title || 'Experience Authentic Thai Relaxation';
    }
    if (elements.heroSubtitle) {
        elements.heroSubtitle.textContent = data.hero?.subtitle || 'Your sanctuary for traditional Thai massage and wellness.';
    }
    if (elements.heroCTA) {
        elements.heroCTA.classList.add('cta-button');
        elements.heroCTA.textContent = `Call to Book: (403) 988-9964`;
        elements.heroCTA.href = 'tel:4039889964';
    }

    // Populate services
    if (!data.massages || !Array.isArray(data.massages)) {
        throw new Error('Invalid services data');
    }

    if (elements.servicesGrid) {
        elements.servicesGrid.innerHTML = data.massages.map(service => `
            <div class="service-card bg-white rounded-xl shadow-lg overflow-hidden fade-in">
                <div class="overflow-hidden">
                    <img src="${service.image}" alt="${service.name}" loading="lazy" class="w-full h-64 object-cover">
                </div>
                <div class="p-8">
                    <h3 class="text-2xl font-display font-bold mb-4">${service.name}</h3>
                    <p class="text-gray-600 mb-6">${service.description}</p>
                    <div class="space-y-3">
                        ${service.pricing.map(price => `
                            <p class="text-[#FA8F7C] font-semibold text-lg">${price.duration} minutes - $${price.cost}</p>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Populate locations
    if (elements.locationsGrid && data.locations) {
        elements.locationsGrid.innerHTML = data.locations.map(location => `
            <div class="location-card bg-white rounded-xl shadow-lg p-8 fade-in">
                <h3 class="text-2xl font-display font-bold mb-4">${location.name}</h3>
                <p class="text-gray-600 mb-6">${location.address}</p>
                <a href="${location.mapLink}" target="_blank" rel="noopener noreferrer" class="map-link text-[#FA8F7C] hover:text-[#e87f6c] transition-colors duration-200 mb-6 block">
                    <i class="fas fa-map-marker-alt mr-2"></i>View on Map
                </a>
                <div class="space-y-6">
                    ${location.masseuses.map(masseuse => `
                        <div class="border-t border-gray-200 pt-6">
                            <h4 class="font-display font-semibold text-lg mb-3">${masseuse.name}</h4>
                            <div class="space-y-2">
                                ${masseuse.availability.map(avail => `
                                    <p class="text-gray-600">
                                        <i class="far fa-calendar-alt mr-2"></i>${avail.day}: ${avail.times.map(time => `${time.start} - ${time.end}`).join(', ')}
                                    </p>
                                `).join('')}
                            </div>
                            <p class="text-gray-600 mt-3">${masseuse.booking_cta}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Populate testimonials
    if (elements.testimonialsGrid && data.testimonials) {
        elements.testimonialsGrid.innerHTML = data.testimonials.map(testimonial => `
            <div class="testimonial-card bg-white rounded-xl shadow-lg p-8 fade-in">
                <p class="text-gray-600 mb-6">"${testimonial.text}"</p>
                <p class="font-display font-semibold text-lg">${testimonial.author}</p>
                <p class="text-sm text-gray-500">${new Date(testimonial.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }

    // Set about section content
    if (elements.aboutTitle) {
        elements.aboutTitle.textContent = data.about?.title || 'About Thai Spa 4U';
    }
    if (elements.aboutContent) {
        elements.aboutContent.textContent = data.about?.content || '';
    }

    // Populate social links
    if (elements.socialLinks && data.social_links) {
        elements.socialLinks.innerHTML = Object.entries(data.social_links)
            .map(([platform, url]) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-link text-gray-300 hover:text-[#FA8F7C]">
                    <i class="fab fa-${platform} text-2xl"></i>
                    <span class="sr-only">${platform}</span>
                </a>
            `).join('');
    }
};

const displayError = (error) => {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'col-span-full text-center text-red-500 p-4';
    errorMessage.innerHTML = `
        <p class="text-lg font-semibold">Error loading content</p>
        <p class="text-sm mt-2">${error.message}</p>
        <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-[#FA8F7C] text-white rounded hover:bg-[#e87f6c]">
            Try Again
        </button>
    `;

    // Try to find a container to display the error
    const container = elements.servicesGrid || document.querySelector('main') || document.body;
    container.innerHTML = '';
    container.appendChild(errorMessage);
};

// Event Listeners
const initializeEventListeners = () => {
    if (elements.mobileMenuButton) {
        elements.mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    document.addEventListener('click', closeMobileMenu);
    
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Add keyboard navigation for mobile menu
    if (elements.mobileMenuButton) {
        elements.mobileMenuButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMobileMenu();
            }
        });
    }
};

// Initialize
const initialize = async () => {
    try {
        // Ensure page starts at top
        window.scrollTo(0, 0);
        
        const data = await loadData();
        processData(data);
        initializeEventListeners();
    } catch (error) {
        displayError(error);
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', initialize); 
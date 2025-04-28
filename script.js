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

// Core functionality that needs to be available immediately
const initializeCore = () => {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        const toggleMobileMenu = () => {
            mobileMenu.classList.toggle('active');
            mobileMenuButton.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
        };
        
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', (event) => {
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Smooth scroll functionality
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (event) => {
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
            }
        });
    });
};

// Lazy load non-critical functionality
const loadNonCriticalContent = async () => {
    try {
        // Load data.json only when needed
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Process data in chunks to avoid blocking
        setTimeout(() => processServices(data), 0);
        setTimeout(() => processLocations(data), 50);
        setTimeout(() => processTestimonials(data), 100);
        setTimeout(() => processAbout(data), 150);
        setTimeout(() => processSocialLinks(data), 200);
    } catch (error) {
        console.error('Error loading content:', error);
        displayError(error);
    }
};

// Split data processing into separate functions
const processServices = (data) => {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid || !data.massages) return;
    
    servicesGrid.innerHTML = data.massages.map(service => `
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
};

const processLocations = (data) => {
    const locationsGrid = document.getElementById('locationsGrid');
    if (!locationsGrid || !data.locations) return;
    
    locationsGrid.innerHTML = data.locations.map(location => `
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
};

const processTestimonials = (data) => {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid || !data.testimonials) return;
    
    testimonialsGrid.innerHTML = data.testimonials.map(testimonial => `
        <div class="testimonial-card bg-white rounded-xl shadow-lg p-8 fade-in">
            <p class="text-gray-600 mb-6">"${testimonial.text}"</p>
            <p class="font-display font-semibold text-lg">${testimonial.author}</p>
            <p class="text-sm text-gray-500">${new Date(testimonial.date).toLocaleDateString()}</p>
        </div>
    `).join('');
};

const processAbout = (data) => {
    const aboutTitle = document.getElementById('aboutTitle');
    const aboutContent = document.getElementById('aboutContent');
    
    if (aboutTitle) aboutTitle.textContent = data.about?.title || 'About Thai Spa 4U';
    if (aboutContent) aboutContent.textContent = data.about?.content || '';
};

const processSocialLinks = (data) => {
    const socialLinks = document.getElementById('socialLinks');
    if (!socialLinks || !data.social_links) return;
    
    socialLinks.innerHTML = Object.entries(data.social_links)
        .map(([platform, url]) => `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-link text-gray-300 hover:text-[#FA8F7C]">
                <i class="fab fa-${platform} text-2xl"></i>
                <span class="sr-only">${platform}</span>
            </a>
        `).join('');
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

    const container = document.getElementById('servicesGrid') || document.querySelector('main') || document.body;
    container.innerHTML = '';
    container.appendChild(errorMessage);
};

// Initialize core functionality immediately
initializeCore();

// Load non-critical content when the page is idle
if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => loadNonCriticalContent());
} else {
    // Fallback for browsers that don't support requestIdleCallback
    window.addEventListener('load', () => setTimeout(loadNonCriticalContent, 0));
} 
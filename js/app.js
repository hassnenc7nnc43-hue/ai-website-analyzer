(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        businessName: 'Our Business',
        phone: '+1234567890',
        whatsapp: '+1234567890',
        email: 'info@business.com',
        address: '123 Main Street, City, Country',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU5LjIiTiA3M8KwNTknMDguNSJX',
        heroTitle: 'Professional Services You Can Trust',
        heroSubtitle: 'We deliver top-quality services with a commitment to excellence. Book today and experience the difference.',
        servicesIntro: 'We provide a wide range of professional services tailored to your needs.',
        adminPassword: 'admin',
        statExperience: '10+'
    };

    const DEFAULT_SERVICES = [
        { id: 1, name: 'Service One', price: 'From $50', priceNote: 'per session', description: 'Professional service with guaranteed quality results.', icon: '🔧' },
        { id: 2, name: 'Service Two', price: 'From $75', priceNote: 'per hour', description: 'Expert handling with attention to detail.', icon: '✨' },
        { id: 3, name: 'Service Three', price: 'From $100', priceNote: 'per project', description: 'Comprehensive solution for all your needs.', icon: '🚀' },
        { id: 4, name: 'Service Four', price: 'From $60', priceNote: 'per item', description: 'Reliable and fast service delivery.', icon: '⭐' },
        { id: 5, name: 'Service Five', price: 'From $90', priceNote: 'per package', description: 'Premium quality with dedicated support.', icon: '💎' },
        { id: 6, name: 'Service Six', price: 'From $40', priceNote: 'per unit', description: 'Affordable and efficient solution.', icon: '🎯' }
    ];

    const DEFAULT_GALLERY = [];

    const DEFAULT_REVIEWS = [
        { id: 1, name: 'John Smith', rating: 5, text: 'Excellent service! Highly recommended. The team was professional and delivered outstanding results.', image: '' },
        { id: 2, name: 'Sarah Johnson', rating: 5, text: 'Very satisfied with the work. Quick turnaround and great communication throughout.', image: '' },
        { id: 3, name: 'Michael Brown', rating: 4, text: 'Great quality and friendly staff. Will definitely use this service again.', image: '' }
    ];

    const DEFAULT_HOURS = [
        { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', hours: 'Closed' }
    ];

    const DEFAULT_PRODUCTS = (function () {
        var categories = ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Landscaping', 'Painting', 'Roofing', 'Pest Control', 'Handyman', 'Moving', 'Carpentry', 'Tiling'];
        var adjectives = ['Professional', 'Premium', 'Express', 'Reliable', 'Expert', 'Quick', 'Advanced', 'Complete', 'Smart', 'Super'];
        var nouns = ['Repair', 'Installation', 'Maintenance', 'Service', 'Solution', 'Support', 'Care', 'Treatment', 'Cleanup', 'Upgrade', 'Overhaul', 'Check'];
        var icons = ['🔧', '⚡', '❄️', '🧹', '🌿', '🎨', '🏠', '🐜', '🔨', '📦', '🪵', '🧱'];
        var prods = [];
        var id = 1;
        for (var c = 0; c < categories.length; c++) {
            for (var i = 0; i < 9; i++) {
                var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                var noun = nouns[Math.floor(Math.random() * nouns.length)];
                var icon = icons[Math.floor(Math.random() * icons.length)];
                var price = 49 + Math.floor(Math.random() * 450) * 5;
                prods.push({
                    id: id++,
                    name: adj + ' ' + categories[c] + ' ' + noun,
                    category: categories[c],
                    price: '$' + price,
                    priceNum: price,
                    description: 'Professional ' + categories[c].toLowerCase() + ' service with guaranteed quality. Fast, reliable, and affordable.',
                    icon: icon,
                    availability: Math.random() > 0.15 ? 'available' : 'out',
                    rating: (3.5 + Math.random() * 1.5).toFixed(1),
                    features: ['Fast Response', 'Certified Team', 'Warranty Included', '24/7 Support', 'Free Estimate'][Math.floor(Math.random() * 5)]
                });
            }
        }
        return prods;
    })();

    function getDefault(key) {
        const map = { settings: DEFAULT_SETTINGS, services: DEFAULT_SERVICES, gallery: DEFAULT_GALLERY, reviews: DEFAULT_REVIEWS, hours: DEFAULT_HOURS };
        return map[key] || null;
    }

    function loadData(key) {
        try {
            const stored = localStorage.getItem('biz_' + key);
            if (stored) return JSON.parse(stored);
        } catch (e) { /* ignore */ }
        return getDefault(key);
    }

    function saveData(key, data) {
        try { localStorage.setItem('biz_' + key, JSON.stringify(data)); } catch (e) { /* ignore */ }
    }

    let settings = loadData('settings') || DEFAULT_SETTINGS;
    let services = loadData('services') || DEFAULT_SERVICES;
    let gallery = loadData('gallery') || DEFAULT_GALLERY;
    let reviews = loadData('reviews') || DEFAULT_REVIEWS;
    let hours = loadData('hours') || DEFAULT_HOURS;
    let inquiries = loadData('inquiries') || [];
    let bookings = loadData('bookings') || [];
    let contacts = (function () {
        try {
            var c = localStorage.getItem('biz_contacts');
            return c ? JSON.parse(c) : { phones: [], emails: [] };
        } catch (e) { return { phones: [], emails: [] }; }
    })();
    let products = (function () {
        try {
            var p = localStorage.getItem('biz_products');
            return p ? JSON.parse(p) : null;
        } catch (e) { return null; }
    })();
    if (!products || products.length === 0) products = DEFAULT_PRODUCTS;
    let currentCategory = 'all';
    let currentSearch = '';
    let currentRating = 5;

    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }

    function applySettings() {
        var logoText = $('#site-logo .logo-text');
        if (logoText) logoText.textContent = settings.businessName;

        var footerBusinessName = $('#footer-business-name');
        var footerBusinessNameBottom = $('#footer-business-name-bottom');
        var businessNameEl = $('#business-name');
        if (footerBusinessName) footerBusinessName.textContent = settings.businessName;
        if (footerBusinessNameBottom) footerBusinessNameBottom.textContent = settings.businessName;
        if (businessNameEl) businessNameEl.textContent = settings.businessName;

        var seoTitle = $('#seo-title');
        var seoDescription = $('#seo-description');
        if (seoTitle) seoTitle.textContent = settings.businessName + ' | Professional Services';
        if (seoDescription) seoDescription.textContent = settings.heroSubtitle;

        var heroTitle = $('#hero-title');
        var heroSubtitle = $('#hero-subtitle');
        var servicesIntro = $('#services-intro');
        var statExperience = $('#stat-experience');
        if (heroTitle) heroTitle.textContent = settings.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;
        if (servicesIntro) servicesIntro.textContent = settings.servicesIntro;
        if (statExperience) statExperience.textContent = settings.statExperience || '10+';

        var contactAddress = $('#contact-address');
        if (contactAddress) contactAddress.textContent = settings.address;

        var contactPhone = $('#contact-phone');
        var contactEmail = $('#contact-email');
        var contactWhatsapp = $('#contact-whatsapp');
        var contactMap = $('#contact-map');
        if (contactPhone) { contactPhone.href = 'tel:' + settings.phone; contactPhone.textContent = settings.phone; }
        if (contactEmail) { contactEmail.href = 'mailto:' + settings.email; contactEmail.textContent = settings.email; }
        if (contactWhatsapp) { contactWhatsapp.href = 'https://wa.me/' + settings.whatsapp.replace(/[^0-9]/g, ''); contactWhatsapp.textContent = 'Chat: ' + settings.whatsapp; }
        if (contactMap) contactMap.href = settings.mapUrl;

        var bookingPhone = $('#booking-phone');
        var bookingWhatsapp = $('#booking-whatsapp');
        var bookingEmail = $('#booking-email');
        if (bookingPhone) { bookingPhone.href = 'tel:' + settings.phone; bookingPhone.textContent = settings.phone; }
        if (bookingWhatsapp) { bookingWhatsapp.href = 'https://wa.me/' + settings.whatsapp.replace(/[^0-9]/g, ''); bookingWhatsapp.textContent = 'Chat on WhatsApp'; }
        if (bookingEmail) { bookingEmail.href = 'mailto:' + settings.email; bookingEmail.textContent = settings.email; }

        var headerCallText = $('#header-call-text');
        var headerCallBtn = $('#header-call-btn');
        if (headerCallText) headerCallText.textContent = 'Call Now';
        if (headerCallBtn) headerCallBtn.href = 'tel:' + settings.phone;

        var footerPhone = $('#footer-phone');
        var footerEmail = $('#footer-email');
        var footerAddress = $('#footer-address');
        if (footerPhone) { footerPhone.href = 'tel:' + settings.phone; footerPhone.textContent = settings.phone; }
        if (footerEmail) { footerEmail.href = 'mailto:' + settings.email; footerEmail.textContent = settings.email; }
        if (footerAddress) footerAddress.textContent = settings.address;

        renderServices();
        renderBookingServices();
        renderGallery();
        renderReviews();
        renderFooterHours();
        renderInquiries();

        if (headerCallBtn) {
            headerCallBtn.addEventListener('click', function () { window.location.href = 'tel:' + settings.phone; });
        }

        var downloadRate = $('#download-rate');
        var downloadInvoice = $('#download-invoice');
        var downloadBrochure = $('#download-brochure');
        if (downloadRate) downloadRate.addEventListener('click', function (e) { e.preventDefault(); downloadRateList(); });
        if (downloadInvoice) downloadInvoice.addEventListener('click', function (e) { e.preventDefault(); downloadInvoice(); });
        if (downloadBrochure) downloadBrochure.addEventListener('click', function (e) { e.preventDefault(); downloadBrochure(); });
    }

    function renderServices() {
        const grid = $('#services-grid');
        grid.innerHTML = services.map(function (s) {
            return '<div class="service-card">' +
                '<div class="service-icon">' + (s.icon || '⭐') + '</div>' +
                '<h3>' + s.name + '</h3>' +
                '<div class="price">' + s.price + ' <small>' + (s.priceNote || '') + '</small></div>' +
                '<p>' + s.description + '</p>' +
                '</div>';
        }).join('');
    }

    function renderBookingServices() {
        const sel = $('#booking-service');
        sel.innerHTML = '<option value="">Select a service</option>' + services.map(function (s) {
            return '<option value="' + s.name + '">' + s.name + '</option>';
        }).join('');
    }

    function renderGallery() {
        const grid = $('#gallery-grid');
        if (gallery.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#80868b;padding:40px;">No gallery images yet. Upload from the Admin Panel.</p>';
            return;
        }
        grid.innerHTML = gallery.map(function (img, i) {
            return '<div class="gallery-item" data-category="' + (img.category || 'service') + '">' +
                '<img src="' + img.src + '" alt="' + (img.name || 'Gallery image') + '">' +
                '<div class="gallery-label">' + (img.name || 'Image') + '</div>' +
                '<div class="gallery-overlay">' +
                '<button onclick="event.stopPropagation();viewImage(' + i + ')">🔍 Zoom</button>' +
                '<button onclick="event.stopPropagation();downloadGalleryImage(' + i + ')">⬇️ Download</button>' +
                '</div>' +
                '</div>';
        }).join('');

        $$('.gallery-item').forEach(function (item) {
            item.addEventListener('click', function () {
                var idx = Array.from($$('.gallery-item')).indexOf(item);
                viewImage(idx);
            });
        });
    }

    function renderReviews() {
        const grid = $('#reviews-grid');
        if (reviews.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#80868b;padding:40px;">No reviews yet.</p>';
            return;
        }
        grid.innerHTML = reviews.map(function (r) {
            var stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            var imgHtml = r.image ? '<div class="review-image"><img src="' + r.image + '" alt="' + r.name + '"></div>' : '';
            return '<div class="review-card">' +
                '<div class="review-stars">' + stars + '</div>' +
                '<p class="review-text">"' + r.text + '"</p>' +
                '<div class="review-author">' +
                '<div class="review-avatar">' + r.name.charAt(0).toUpperCase() + '</div>' +
                '<div class="review-info"><h4>' + r.name + '</h4><p>Customer</p></div>' +
                '</div>' + imgHtml +
                '</div>';
        }).join('');
    }

    function renderFooterHours() {
        $('#footer-hours').innerHTML = hours.map(function (h) {
            return '<li>' + h.day + ': ' + h.hours + '</li>';
        }).join('');
    }


    function renderContactSection() {
        var primaryPhone = contacts.phones.length > 0 ? contacts.phones[0].number : settings.phone;
        var primaryEmail = contacts.emails.length > 0 ? contacts.emails[0].address : settings.email;
        var primaryWhatsapp = settings.whatsapp;
        for (var i = 0; i < contacts.phones.length; i++) {
            if (contacts.phones[i].number.includes('whatsapp') || contacts.phones[i].label.toLowerCase().indexOf('whatsapp') >= 0) {
                primaryWhatsapp = contacts.phones[i].number;
            }
        }

        // Contact section - Phone card
        var phoneListEl = $('#contact-phone-list');
        if (phoneListEl) {
            if (contacts.phones.length > 0) {
                phoneListEl.innerHTML = contacts.phones.map(function (p) {
                    return '<div class="contact-info-row">' +
                        '<a href="tel:' + p.number.replace(/[^0-9]/g, '') + '" class="contact-link">' + p.number + '</a>' +
                        (p.label ? '<span class="contact-sub-label">(' + p.label + ')</span>' : '') +
                        '<a href="tel:' + p.number.replace(/[^0-9]/g, '') + '" class="contact-link-btn">📞 Call</a>' +
                        '</div>';
                }).join('');
            } else {
                phoneListEl.innerHTML = '<a href="tel:' + settings.phone + '" class="contact-link">' + settings.phone + '</a>';
            }
        }

        // Contact section - WhatsApp card
        var waListEl = $('#contact-whatsapp-list');
        if (waListEl) {
            if (contacts.phones.length > 0) {
                waListEl.innerHTML = contacts.phones.map(function (p) {
                    var waLink = 'https://wa.me/' + p.number.replace(/[^0-9]/g, '');
                    return '<div class="contact-info-row">' +
                        '<a href="' + waLink + '" class="contact-link" target="_blank">' + p.number + '</a>' +
                        (p.label ? '<span class="contact-sub-label">(' + p.label + ')</span>' : '') +
                        '<a href="' + waLink + '" class="contact-link-btn" target="_blank">💬 Chat</a>' +
                        '</div>';
                }).join('');
            } else {
                var waLink = 'https://wa.me/' + primaryWhatsapp.replace(/[^0-9]/g, '');
                waListEl.innerHTML = '<a href="' + waLink + '" class="contact-link" target="_blank">Chat: ' + primaryWhatsapp + '</a>';
            }
        }

        // Contact section - Email card
        var emailListEl = $('#contact-email-list');
        if (emailListEl) {
            if (contacts.emails.length > 0) {
                emailListEl.innerHTML = contacts.emails.map(function (e) {
                    return '<div class="contact-info-row">' +
                        '<a href="mailto:' + e.address + '" class="contact-link">' + e.address + '</a>' +
                        (e.label ? '<span class="contact-sub-label">(' + e.label + ')</span>' : '') +
                        '<a href="mailto:' + e.address + '" class="contact-link-btn">✉️ Email</a>' +
                        '</div>';
                }).join('');
            } else {
                emailListEl.innerHTML = '<a href="mailto:' + settings.email + '" class="contact-link">' + settings.email + '</a>';
            }
        }

        // Booking section - Phone
        var bPhoneListEl = $('#booking-phone-list');
        if (bPhoneListEl) {
            if (contacts.phones.length > 0) {
                bPhoneListEl.innerHTML = contacts.phones.map(function (p) {
                    return '<div class="contact-info-row">' +
                        '<a href="tel:' + p.number.replace(/[^0-9]/g, '') + '" class="contact-link">' + p.number + '</a>' +
                        (p.label ? '<span class="contact-sub-label">(' + p.label + ')</span>' : '') +
                        '</div>';
                }).join('');
            } else {
                bPhoneListEl.innerHTML = '<a href="tel:' + settings.phone + '" class="contact-link">' + settings.phone + '</a>';
            }
        }

        // Booking section - WhatsApp
        var bWaListEl = $('#booking-whatsapp-list');
        if (bWaListEl) {
            if (contacts.phones.length > 0) {
                bWaListEl.innerHTML = contacts.phones.map(function (p) {
                    var waLink = 'https://wa.me/' + p.number.replace(/[^0-9]/g, '');
                    return '<div class="contact-info-row">' +
                        '<a href="' + waLink + '" class="contact-link" target="_blank">' + p.number + '</a>' +
                        (p.label ? '<span class="contact-sub-label">(' + p.label + ')</span>' : '') +
                        '</div>';
                }).join('');
            } else {
                var bWaLink = 'https://wa.me/' + primaryWhatsapp.replace(/[^0-9]/g, '');
                bWaListEl.innerHTML = '<a href="' + bWaLink + '" class="contact-link" target="_blank">Chat on WhatsApp</a>';
            }
        }

        // Booking section - Email
        var bEmailListEl = $('#booking-email-list');
        if (bEmailListEl) {
            if (contacts.emails.length > 0) {
                bEmailListEl.innerHTML = contacts.emails.map(function (e) {
                    return '<div class="contact-info-row">' +
                        '<a href="mailto:' + e.address + '" class="contact-link">' + e.address + '</a>' +
                        (e.label ? '<span class="contact-sub-label">(' + e.label + ')</span>' : '') +
                        '</div>';
                }).join('');
            } else {
                bEmailListEl.innerHTML = '<a href="mailto:' + settings.email + '" class="contact-link">' + settings.email + '</a>';
            }
        }

        // Footer
        var footerPhone = $('#footer-phone');
        if (footerPhone) {
            if (contacts.phones.length > 0) {
                footerPhone.innerHTML = '<a href="tel:' + contacts.phones[0].number.replace(/[^0-9]/g, '') + '" class="contact-link">' + contacts.phones[0].number + '</a>';
            } else {
                footerPhone.innerHTML = '<a href="tel:' + settings.phone + '" class="contact-link">' + settings.phone + '</a>';
            }
        }
        var footerEmail = $('#footer-email');
        if (footerEmail) {
            if (contacts.emails.length > 0) {
                footerEmail.innerHTML = '<a href="mailto:' + contacts.emails[0].address + '" class="contact-link">' + contacts.emails[0].address + '</a>';
            } else {
                footerEmail.innerHTML = '<a href="mailto:' + settings.email + '" class="contact-link">' + settings.email + '</a>';
            }
        }

        // Contact call button
        $('#contact-call-btn').addEventListener('click', function () {
            window.location.href = 'tel:' + (contacts.phones.length > 0 ? contacts.phones[0].number : settings.phone);
        });

        // Contact WhatsApp button
        $('#contact-whatsapp-btn').addEventListener('click', function () {
            var waNum = primaryWhatsapp;
            window.open('https://wa.me/' + waNum.replace(/[^0-9]/g, ''), '_blank');
        });

        // Contact Email button
        $('#contact-email-btn').addEventListener('click', function () {
            window.location.href = 'mailto:' + (contacts.emails.length > 0 ? contacts.emails[0].address : settings.email);
        });

        // Add All Contacts section if multiple contacts
        if (contacts.phones.length > 1 || contacts.emails.length > 1) {
            var contactWrapper = document.querySelector('.contact-wrapper');
            if (contactWrapper) {
                var allDiv = document.createElement('div');
                allDiv.className = 'contact-all';
                allDiv.innerHTML = '<h3>📇 All Contact Information</h3>' +
                    '<div class="contact-all-grid">' +
                    contacts.phones.map(function (p) {
                        return '<div class="contact-all-item"><span class="icon">📞</span><div class="details"><div class="label">' + (p.label || 'Phone') + '</div><div class="value"><a href="tel:' + p.number.replace(/[^0-9]/g, '') + '" class="contact-link">' + p.number + '</a></div></div></div>';
                    }).join('') +
                    contacts.emails.map(function (e) {
                        return '<div class="contact-all-item"><span class="icon">✉️</span><div class="details"><div class="label">' + (e.label || 'Email') + '</div><div class="value"><a href="mailto:' + e.address + '" class="contact-link">' + e.address + '</a></div></div></div>';
                    }).join('') +
                    '</div>';
                contactWrapper.appendChild(allDiv);
            }
        }
    }

    // ========== PRODUCTS ==========
    function saveProducts() {
        try { localStorage.setItem('biz_products', JSON.stringify(products)); } catch (e) { /* noop */ }
    }

    function renderProductCategories() {
        var catBar = $('#products-filter-bar');
        var searchCats = $('#search-categories');
        if (!catBar) return;
        var cats = ['all'];
        var seen = {};
        products.forEach(function (p) {
            if (!seen[p.category]) {
                seen[p.category] = true;
                cats.push(p.category);
            }
        });
        catBar.innerHTML = cats.map(function (c) {
            return '<button class="filter-btn' + (c === currentCategory ? ' active' : '') + '" data-filter="' + c + '">' + c + '</button>';
        }).join('');
        if (searchCats) {
            searchCats.innerHTML = cats.map(function (c) {
                return '<button class="cat-btn' + (c === currentCategory ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
            }).join('');
        }
        $$('.filter-btn[data-filter], .cat-btn[data-cat]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentCategory = btn.dataset.filter || btn.dataset.cat;
                $$('.filter-btn[data-filter]').forEach(function (b) { b.classList.remove('active'); });
                $$('.cat-btn[data-cat]').forEach(function (b) { b.classList.remove('active'); });
                var filterBtn = document.querySelector('.filter-btn[data-filter="' + currentCategory + '"]');
                var catBtn = document.querySelector('.cat-btn[data-cat="' + currentCategory + '"]');
                if (filterBtn) filterBtn.classList.add('active');
                if (catBtn) catBtn.classList.add('active');
                renderProducts();
            });
        });
    }

    function filterProducts() {
        var searchEl = $('#product-search');
        var search = searchEl ? searchEl.value.toLowerCase().trim() : '';
        currentSearch = search;
        return products.filter(function (p) {
            var matchCat = currentCategory === 'all' || p.category === currentCategory;
            var matchSearch = !search ||
                p.name.toLowerCase().indexOf(search) >= 0 ||
                p.category.toLowerCase().indexOf(search) >= 0 ||
                p.description.toLowerCase().indexOf(search) >= 0 ||
                p.features.toLowerCase().indexOf(search) >= 0;
            return matchCat && matchSearch;
        });
    }

    function renderProducts() {
        var grid = $('#products-grid');
        var empty = $('#products-empty');
        var countEl = $('#search-count');
        if (!grid) return;
        var filtered = filterProducts();

        if (countEl) {
            countEl.textContent = filtered.length + ' product' + (filtered.length !== 1 ? 's' : '') + ' found';
        }

        if (filtered.length === 0) {
            grid.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }
        if (empty) empty.style.display = 'none';

        grid.innerHTML = filtered.map(function (p) {
            return '<div class="product-card" data-id="' + p.id + '">' +
                '<div class="product-icon">' + (p.icon || '📦') + '</div>' +
                '<div class="product-category">' + p.category + '</div>' +
                '<h3>' + p.name + '</h3>' +
                '<p class="product-desc">' + p.description + '</p>' +
                '<div class="product-footer">' +
                '<span class="product-price">' + p.price + ' <small>' + (p.features || '') + '</small></span>' +
                '<span class="product-badge ' + (p.availability || 'available') + '">' + (p.availability === 'available' ? '✅ Available' : '❌ Out') + '</span>' +
                '</div>' +
                '</div>';
        }).join('');

        $$('.product-card').forEach(function (card) {
            card.addEventListener('click', function () {
                var pid = parseInt(card.dataset.id);
                var prod = products.find(function (p) { return p.id === pid; });
                if (prod) showToast(prod.name + ' — ' + prod.price);
            });
        });
    }

    // Search event listener
    var searchInput = $('#product-search');
    if (searchInput) {
        var searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(renderProducts, 200);
        });
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                renderProducts();
                var productsSection = document.getElementById('products');
                if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========== END PRODUCTS ==========

    var tbody = document.getElementById('inquiries-table-body');
    var noInq = document.getElementById('no-inquiries');

    if (!tbody || !noInq) return;

    function renderInquiries() {
        var tbody = $('#inquiries-table-body');
        var noInq = $('#no-inquiries');
        if (inquiries.length === 0) {
            tbody.innerHTML = '';
            noInq.style.display = 'block';
            return;
        }
        noInq.style.display = 'none';
        tbody.innerHTML = inquiries.map(function (inq, i) {
            return '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + inq.name + '</td>' +
                '<td>' + inq.email + '</td>' +
                '<td>' + inq.subject + '</td>' +
                '<td>' + inq.date + '</td>' +
                '<td><button class="admin-btn admin-btn-delete" onclick="deleteInquiry(' + i + ')">Delete</button></td>' +
                '</tr>';
        }).join('');
    }

    window.deleteInquiry = function (idx) {
        if (confirm('Delete this inquiry?')) {
            inquiries.splice(idx, 1);
            saveData('inquiries', inquiries);
            renderInquiries();
            showToast('Inquiry deleted');
        }
    };

    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function validatePhone(phone) { return phone.length >= 7; }

    function showToast(msg) {
        var t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(function () { t.classList.remove('show'); }, 3000);
    }

    // Contact Form
    $('#contact-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        var valid = true;
        var fields = [
            { id: 'contact-name', err: 'contact-name-error', req: true },
            { id: 'contact-email-input', err: 'contact-email-error', req: true, type: 'email' },
            { id: 'contact-subject', err: 'contact-subject-error', req: true },
            { id: 'contact-message', err: 'contact-message-error', req: true }
        ];
        fields.forEach(function (f) {
            var el = $('#' + f.id);
            var err = $('#' + f.err);
            var val = el.value.trim();
            if (f.req && !val) { err.textContent = 'This field is required'; el.classList.add('error'); valid = false; }
            else if (f.type === 'email' && val && !validateEmail(val)) { err.textContent = 'Invalid email'; el.classList.add('error'); valid = false; }
            else { err.textContent = ''; el.classList.remove('error'); }
        });
        if (!valid) return;

        var inquiry = {
            name: $('#contact-name').value.trim(),
            email: $('#contact-email-input').value.trim(),
            phone: $('#contact-phone-input').value.trim(),
            subject: $('#contact-subject').value.trim(),
            message: $('#contact-message').value.trim(),
            date: new Date().toISOString()
        };
        inquiries.push(inquiry);
        saveData('inquiries', inquiries);

        // Try EmailJS if configured
        if (settings.emailjsService && settings.emailjsTemplate && settings.emailjsKey) {
            try {
                await emailjs.send(settings.emailjsService, settings.emailjsTemplate, {
                    to_name: settings.formEmail || settings.email,
                    from_name: inquiry.name,
                    reply_to: inquiry.email,
                    subject: inquiry.subject,
                    message: inquiry.message,
                    phone: inquiry.phone
                });
            } catch (err) {
                console.warn('EmailJS send failed:', err);
            }
        }

        $('#contact-form').reset();
        $('#contact-success').classList.add('show');
        setTimeout(function () { $('#contact-success').classList.remove('show'); }, 5000);
        showToast('Message sent successfully!');
    });

    // Booking Form
    $('#booking-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;
        var checks = [
            { id: 'booking-name', err: 'booking-name-error', req: true },
            { id: 'booking-phone-form', err: 'booking-phone-error', req: true },
            { id: 'booking-service', err: 'booking-service-error', req: true }
        ];
        checks.forEach(function (c) {
            var el = $('#' + c.id);
            var err = $('#' + c.err);
            var val = el.value.trim();
            if (c.req && !val) { err.textContent = 'This field is required'; el.classList.add('error'); valid = false; }
            else { err.textContent = ''; el.classList.remove('error'); }
        });
        var payFile = $('#booking-payment').files[0];
        if (payFile && payFile.size > 5 * 1024 * 1024) {
            $('#booking-payment-error').textContent = 'File size exceeds 5MB';
            valid = false;
        } else { $('#booking-payment-error').textContent = ''; }
        if (!valid) return;

        var booking = {
            name: $('#booking-name').value.trim(),
            phone: $('#booking-phone-form').value.trim(),
            date: $('#booking-date').value,
            service: $('#booking-service').value,
            message: $('#booking-message').value.trim(),
            paymentReceipt: '',
            submittedAt: new Date().toISOString()
        };
        if (payFile) {
            var reader = new FileReader();
            reader.onload = function (ev) {
                booking.paymentReceipt = ev.target.result;
                bookings.push(booking);
                saveData('bookings', bookings);
            };
            reader.readAsDataURL(payFile);
        } else {
            bookings.push(booking);
            saveData('bookings', bookings);
        }

        $('#booking-form').reset();
        $('#booking-success').classList.add('show');
        setTimeout(function () { $('#booking-success').classList.remove('show'); }, 5000);
        showToast('Booking submitted successfully!');
    });

    // Gallery Lightbox
    function viewImage(idx) {
        var img = gallery[idx];
        if (!img) return;
        $('#lightbox-img').src = img.src;
        $('#lightbox-caption').textContent = img.name || '';
        $('#lightbox-download').href = img.src;
        $('#lightbox-download').download = img.name || 'image.png';
        $('#lightbox').classList.add('show');
    }
    window.viewImage = viewImage;

    $('#lightbox-close').addEventListener('click', function () { $('#lightbox').classList.remove('show'); });
    $('#lightbox').addEventListener('click', function (e) { if (e.target === $('#lightbox')) $('#lightbox').classList.remove('show'); });

    function downloadGalleryImage(idx) {
        var img = gallery[idx];
        if (!img) return;
        var a = document.createElement('a');
        a.href = img.src;
        a.download = img.name || 'image.png';
        a.click();
    }
    window.downloadGalleryImage = downloadGalleryImage;

    // Gallery filters
    $$('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            $$('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var f = btn.dataset.filter;
            $$('.gallery-item').forEach(function (item) {
                item.style.display = (f === 'all' || item.dataset.category === f) ? '' : 'none';
            });
        });
    });

    // PDF Generation with jsPDF
    function downloadRateList() {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(settings.businessName + ' - Rate List', 20, 20);
        doc.setFontSize(12);
        var y = 40;
        services.forEach(function (s) {
            doc.setFont(undefined, 'bold');
            doc.text(s.name, 20, y);
            doc.setFont(undefined, 'normal');
            doc.text(s.price + ' ' + (s.priceNote || ''), 20, y + 8);
            doc.text(s.description, 20, y + 16);
            y += 30;
        });
        doc.text('Contact: ' + settings.phone + ' | ' + settings.email, 20, y + 10);
        doc.save('Rate_List.pdf');
    }

    function downloadInvoice() {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('Invoice', 20, 20);
        doc.setFontSize(12);
        doc.text('Invoice #: INV-001', 20, 35);
        doc.text('Date: ' + new Date().toLocaleDateString(), 20, 42);
        doc.text('Bill To: [Customer Name]', 20, 52);
        doc.line(20, 58, 190, 58);
        doc.setFont(undefined, 'bold');
        doc.text('Item', 20, 68);
        doc.text('Amount', 120, 68);
        doc.setFont(undefined, 'normal');
        var yy = 78;
        services.forEach(function (s) {
            doc.text(s.name, 20, yy);
            doc.text(s.price, 120, yy);
            yy += 10;
        });
        doc.setFont(undefined, 'bold');
        doc.line(20, yy, 190, yy);
        var totalStr = services.map(function (s) { return s.price; }).join(', ');
        doc.text('Items: ' + totalStr, 20, yy + 10);
        doc.text('Paid: [Amount Paid]', 20, yy + 20);
        doc.text('Balance Due: [Balance]', 20, yy + 28);
        doc.text('Thank you for your business!', 20, yy + 45);
        doc.save('Invoice.pdf');
    }

    function downloadBrochure() {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(settings.businessName, 20, 20);
        doc.setFontSize(14);
        doc.text('Service Brochure', 20, 32);
        doc.setFontSize(11);
        var y = 52;
        doc.text('About', 20, y);
        doc.setFont(undefined, 'normal');
        doc.text(settings.heroSubtitle, 20, y + 8);
        y += 25;
        doc.setFont(undefined, 'bold');
        doc.text('Our Services', 20, y);
        y += 10;
        doc.setFont(undefined, 'normal');
        services.forEach(function (s) {
            doc.setFont(undefined, 'bold');
            doc.text(s.icon + ' ' + s.name, 20, y);
            doc.setFont(undefined, 'normal');
            doc.text(s.price + ' - ' + s.description, 20, y + 7);
            y += 18;
        });
        y += 10;
        doc.setFont(undefined, 'bold');
        doc.text('Contact Information', 20, y);
        doc.setFont(undefined, 'normal');
        doc.text('Phone: ' + settings.phone, 20, y + 8);
        doc.text('Email: ' + settings.email, 20, y + 15);
        doc.text('Address: ' + settings.address, 20, y + 22);
        doc.text('WhatsApp: ' + settings.whatsapp, 20, y + 29);
        doc.save('Service_Brochure.pdf');
    }

    // Mobile menu
    $('#mobile-menu-toggle').addEventListener('click', function () {
        $('#main-nav').classList.toggle('show');
    });
    $$('#main-nav .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            $('#main-nav').classList.remove('show');
        });
    });

    // Scroll header effect
    window.addEventListener('scroll', function () {
        var h = $('#header');
        if (window.scrollY > 50) { h.classList.add('scrolled'); } else { h.classList.remove('scrolled'); }
    });

    // Scroll spy
    var sections = $$('section[id]');
    var navLinks = $$('.nav-link');
    window.addEventListener('scroll', function () {
        var current = '';
        sections.forEach(function (sec) {
            var top = sec.offsetTop - 100;
            if (window.scrollY >= top) { current = sec.getAttribute('id'); }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) { link.classList.add('active'); }
        });
    });

    // Init
        $('#footer-year').textContent = new Date().getFullYear();
        applySettings();
        renderContactSection();
        renderProductCategories();
        renderProducts();

    })();

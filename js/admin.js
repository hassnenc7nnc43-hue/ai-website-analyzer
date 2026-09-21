(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        businessName: 'Our Business', phone: '+1234567890', whatsapp: '+1234567890',
        email: 'info@business.com', address: '123 Main Street, City, Country',
        mapUrl: '', heroTitle: 'Professional Services You Can Trust', heroSubtitle: '',
        servicesIntro: '', adminPassword: 'admin', statExperience: '10+'
    };
    const DEFAULT_SERVICES = [
        { id: 1, name: 'Service One', price: 'From $50', priceNote: 'per session', description: 'Professional service.', icon: '🔧' },
        { id: 2, name: 'Service Two', price: 'From $75', priceNote: 'per hour', description: 'Expert handling.', icon: '✨' },
        { id: 3, name: 'Service Three', price: 'From $100', priceNote: 'per project', description: 'Comprehensive solution.', icon: '🚀' }
    ];
    const DEFAULT_HOURS = [
        { day: 'Monday', hours: '9:00 AM - 6:00 PM' }, { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' }, { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 6:00 PM' }, { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', hours: 'Closed' }
    ];

    function load(key, def) { try { const v = localStorage.getItem('biz_' + key); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
    function save(key, val) { try { localStorage.setItem('biz_' + key, JSON.stringify(val)); } catch (e) { /* noop */ } }

    let settings = load('settings', DEFAULT_SETTINGS);
    let services = load('services', DEFAULT_SERVICES);
    let gallery = load('gallery', []);
    let reviews = load('reviews', []);
    let hours = load('hours', DEFAULT_HOURS);
    let inquiries = load('inquiries', []);
    let contacts = load('contacts', { phones: [], emails: [] });
    let isLoggedIn = sessionStorage.getItem('admin_logged') === '1';
    let currentRating = 5;

    function $(s) { return document.querySelector(s); }
    function $$(s) { return document.querySelectorAll(s); }

    // Login
    if (isLoggedIn) { showDashboard(); refreshAll(); } else { showLogin(); }

    function showLogin() { $('#admin-login').style.display = ''; $('#admin-dashboard').style.display = 'none'; }
    function showDashboard() { $('#admin-login').style.display = 'none'; $('#admin-dashboard').style.display = ''; }

    $('#login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var pw = $('#admin-password').value;
        if (pw === settings.adminPassword) {
            sessionStorage.setItem('admin_logged', '1');
            isLoggedIn = true;
            showDashboard();
            refreshAll();
            showToast('Welcome back!');
        } else {
            $('#login-error').style.display = 'block';
        }
    });

    $('#admin-logout').addEventListener('click', function () {
        sessionStorage.removeItem('admin_logged');
        isLoggedIn = false;
        showLogin();
    });

    // Nav
    $$('.admin-nav-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
            $$('.admin-nav-item').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            $$('.admin-section').forEach(function (s) { s.classList.remove('active'); });
            $('#section-' + btn.dataset.section).classList.add('active');
            $('#admin-page-title').textContent = btn.textContent.trim();
            $('#admin-sidebar').classList.remove('open');
        });
    });

    $('#sidebar-toggle').addEventListener('click', function () { $('#admin-sidebar').classList.toggle('open'); });

    function refreshAll() {
        populateSettings();
        renderServicesTable();
        renderGalleryGrid();
        renderReviewsTable();
        renderHours();
        renderInquiries();
        renderContacts();
        updateStats();
    }

    function updateStats() {
        $('#stat-services').textContent = services.length;
        $('#stat-gallery').textContent = gallery.length;
        $('#stat-reviews').textContent = reviews.length;
        $('#stat-inquiries').textContent = inquiries.length;
        $('#dash-phone').textContent = settings.phone;
        $('#dash-email').textContent = settings.email;
        $('#dash-address').textContent = settings.address;
        $('#dash-whatsapp').textContent = settings.whatsapp;
        renderContactStats();
    }

    function renderContactStats() {
        var dashPhones = $('#dash-phones');
        var dashEmails = $('#dash-emails');
        if (dashPhones) dashPhones.textContent = contacts.phones.length + ' phone' + (contacts.phones.length !== 1 ? 's' : '');
        if (dashEmails) dashEmails.textContent = contacts.emails.length + ' email' + (contacts.emails.length !== 1 ? 's' : '');
    }

    function populateSettings() {
        $('#admin-business-name').value = settings.businessName;
        $('#admin-phone').value = settings.phone;
        $('#admin-whatsapp').value = settings.whatsapp;
        $('#admin-email').value = settings.email;
        $('#admin-address').value = settings.address;
        $('#admin-map').value = settings.mapUrl || '';
        $('#admin-hero-title').value = settings.heroTitle;
        $('#admin-emailjs-service').value = settings.emailjsService || '';
        $('#admin-emailjs-template').value = settings.emailjsTemplate || '';
        $('#admin-emailjs-key').value = settings.emailjsKey || '';
        $('#admin-form-email').value = settings.formEmail || settings.email || '';
    }

    $('#save-settings-btn').addEventListener('click', function () {
        settings.businessName = $('#admin-business-name').value.trim() || 'Our Business';
        settings.phone = $('#admin-phone').value.trim();
        settings.whatsapp = $('#admin-whatsapp').value.trim();
        settings.email = $('#admin-email').value.trim();
        settings.address = $('#admin-address').value.trim();
        settings.mapUrl = $('#admin-map').value.trim();
        settings.heroTitle = $('#admin-hero-title').value.trim();
        settings.emailjsService = $('#admin-emailjs-service').value.trim();
        settings.emailjsTemplate = $('#admin-emailjs-template').value.trim();
        settings.emailjsKey = $('#admin-emailjs-key').value.trim();
        settings.formEmail = $('#admin-form-email').value.trim();
        var pwEl = $('#admin-password-change');
        var pw = pwEl ? pwEl.value : '';
        if (pw) { settings.adminPassword = pw; }
        save('settings', settings);
        updateStats();
        showToast('Settings saved successfully!');
    });

    // Services CRUD
    let editServiceId = null;

    $('#save-service-btn').addEventListener('click', function () {
        var name = $('#admin-service-name').value.trim();
        var price = $('#admin-service-price').value.trim();
        var note = $('#admin-service-note').value.trim();
        var icon = $('#admin-service-icon').value.trim() || '⭐';
        var desc = $('#admin-service-desc').value.trim();
        if (!name || !price) { showToast('Name and price are required'); return; }

        if (editServiceId) {
            var svc = services.find(function (s) { return s.id === editServiceId; });
            if (svc) { svc.name = name; svc.price = price; svc.priceNote = note; svc.icon = icon; svc.description = desc; }
            showToast('Service updated!');
        } else {
            services.push({ id: Date.now(), name: name, price: price, priceNote: note, icon: icon, description: desc });
            showToast('Service added!');
        }
        save('services', services);
        renderServicesTable();
        updateStats();
        clearServiceForm();
    });

    $('#cancel-edit-service').addEventListener('click', clearServiceForm);

    function clearServiceForm() {
        editServiceId = null;
        $('#edit-service-id').value = '';
        $('#admin-service-name').value = '';
        $('#admin-service-price').value = '';
        $('#admin-service-note').value = '';
        $('#admin-service-icon').value = '';
        $('#admin-service-desc').value = '';
        $('#cancel-edit-service').style.display = 'none';
    }

    function renderServicesTable() {
        $('#services-table-body').innerHTML = services.map(function (s, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + s.name + '</td><td>' + s.price + '</td>' +
                '<td class="actions"><button class="admin-btn admin-btn-edit" onclick="editService(' + s.id + ')">Edit</button>' +
                '<button class="admin-btn admin-btn-delete" onclick="deleteService(' + s.id + ')">Delete</button></td></tr>';
        }).join('');
    }

    window.editService = function (id) {
        var svc = services.find(function (s) { return s.id === id; });
        if (!svc) return;
        editServiceId = id;
        $('#edit-service-id').value = id;
        $('#admin-service-name').value = svc.name;
        $('#admin-service-price').value = svc.price;
        $('#admin-service-note').value = svc.priceNote || '';
        $('#admin-service-icon').value = svc.icon || '⭐';
        $('#admin-service-desc').value = svc.description || '';
        $('#cancel-edit-service').style.display = '';
        $('#admin-service-name').focus();
    };

    window.deleteService = function (id) {
        if (confirm('Delete this service?')) {
            services = services.filter(function (s) { return s.id !== id; });
            save('services', services);
            renderServicesTable();
            updateStats();
            if (editServiceId === id) clearServiceForm();
            showToast('Service deleted');
        }
    };

    // Gallery
    $('#gallery-upload-area').addEventListener('click', function () { $('#gallery-file-input').click(); });
    $('#gallery-file-input').addEventListener('change', function (e) { handleImageUpload(e, 'gallery'); });

    function handleImageUpload(e, type) {
        var file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showToast('File too large (max 5MB)'); return; }
        var reader = new FileReader();
        reader.onload = function (ev) {
            var item = { src: ev.target.result, name: file.name, category: $('#gallery-category').value, uploadedAt: new Date().toISOString() };
            if (type === 'gallery') {
                gallery.push(item);
                save('gallery', gallery);
                renderGalleryGrid();
            }
            showToast('Image uploaded!');
            updateStats();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    function renderGalleryGrid() {
        var grid = $('#gallery-admin-grid');
        if (gallery.length === 0) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#80868b;padding:30px;">No images uploaded yet.</p>'; return; }
        grid.innerHTML = gallery.map(function (img, i) {
            return '<div class="admin-image-item" onclick="viewGalleryImage(' + i + ')">' +
                '<img src="' + img.src + '" alt="' + img.name + '">' +
                '<div class="img-actions">' +
                '<button class="admin-btn admin-btn-delete" onclick="event.stopPropagation();deleteGalleryImage(' + i + ')">✕</button>' +
                '</div></div>';
        }).join('');
    }

    window.viewGalleryImage = function (idx) {
        var img = gallery[idx];
        if (!img) return;
        $('#modal-img').src = img.src;
        $('#modal-img-name').textContent = img.name;
        $('#modal-img-download').href = img.src;
        $('#modal-img-download').download = img.name;
        $('#modal-img-delete').onclick = function () { deleteGalleryImage(idx); };
        $('#modal-view-image').classList.add('show');
    };

    window.deleteGalleryImage = function (idx) {
        if (confirm('Delete this image?')) {
            gallery.splice(idx, 1);
            save('gallery', gallery);
            renderGalleryGrid();
            updateStats();
            $('#modal-view-image').classList.remove('show');
            showToast('Image deleted');
        }
    };

    // Reviews CRUD
    let editReviewId = null;

    $$('#admin-stars .star').forEach(function (star) {
        star.addEventListener('click', function () {
            currentRating = parseInt(star.dataset.rating);
            updateStars();
        });
        star.addEventListener('mouseenter', function () {
            var r = parseInt(star.dataset.rating);
            $$('#admin-stars .star').forEach(function (s) { s.classList.toggle('active', parseInt(s.dataset.rating) <= r); });
        });
    });
    $('#admin-stars').addEventListener('mouseleave', updateStars);

    function updateStars() {
        $$('#admin-stars .star').forEach(function (s) { s.classList.toggle('active', parseInt(s.dataset.rating) <= currentRating); });
        $('#admin-review-rating').value = currentRating;
    }

    $('#save-review-btn').addEventListener('click', function () {
        var name = $('#admin-review-name').value.trim();
        var text = $('#admin-review-text').value.trim();
        var rating = parseInt($('#admin-review-rating').value) || 5;
        if (!name || !text) { showToast('Name and review text required'); return; }

        var file = $('#admin-review-image').files[0];
        var review = { id: editReviewId || Date.now(), name: name, rating: rating, text: text, image: '' };

        if (file) {
            if (file.size > 5 * 1024 * 1024) { showToast('File too large'); return; }
            var reader = new FileReader();
            reader.onload = function (ev) {
                review.image = ev.target.result;
                saveReview(review);
            };
            reader.readAsDataURL(file);
            return;
        }
        saveReview(review);
    });

    function saveReview(review) {
        if (editReviewId) {
            var r = reviews.find(function (x) { return x.id === editReviewId; });
            if (r) { r.name = review.name; r.rating = review.rating; r.text = review.text; r.image = review.image; }
            showToast('Review updated!');
        } else {
            reviews.push(review);
            showToast('Review added!');
        }
        save('reviews', reviews);
        renderReviewsTable();
        updateStats();
        clearReviewForm();
    }

    $('#cancel-edit-review').addEventListener('click', clearReviewForm);

    function clearReviewForm() {
        editReviewId = null;
        $('#edit-review-id').value = '';
        $('#admin-review-name').value = '';
        $('#admin-review-text').value = '';
        currentRating = 5;
        updateStars();
        $('#admin-review-image').value = '';
        $('#cancel-edit-review').style.display = 'none';
    }

    function renderReviewsTable() {
        $('#reviews-table-body').innerHTML = reviews.map(function (r, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + r.name + '</td><td>' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</td>' +
                '<td class="actions"><button class="admin-btn admin-btn-edit" onclick="editReview(' + r.id + ')">Edit</button>' +
                '<button class="admin-btn admin-btn-delete" onclick="deleteReview(' + r.id + ')">Delete</button></td></tr>';
        }).join('');
    }

    window.editReview = function (id) {
        var r = reviews.find(function (x) { return x.id === id; });
        if (!r) return;
        editReviewId = id;
        $('#edit-review-id').value = id;
        $('#admin-review-name').value = r.name;
        $('#admin-review-text').value = r.text;
        currentRating = r.rating;
        updateStars();
        $('#cancel-edit-review').style.display = '';
        $('#admin-review-name').focus();
    };

    window.deleteReview = function (id) {
        if (confirm('Delete this review?')) {
            reviews = reviews.filter(function (r) { return r.id !== id; });
            save('reviews', reviews);
            renderReviewsTable();
            updateStats();
            if (editReviewId === id) clearReviewForm();
            showToast('Review deleted');
        }
    };

    // Hours
    function renderHours() {
        $('#hours-grid').innerHTML = hours.map(function (h, i) {
            return '<div class="form-group">' +
                '<label style="font-weight:600;color:#5f6368;font-size:0.85rem;">' + h.day + '</label>' +
                '<input type="text" class="hour-input" data-idx="' + i + '" value="' + h.hours + '" placeholder="e.g. 9:00 AM - 6:00 PM">' +
                '</div>';
        }).join('');
    }

    $('#save-hours-btn').addEventListener('click', function () {
        $$('.hour-input').forEach(function (inp) {
            var idx = parseInt(inp.dataset.idx);
            hours[idx].hours = inp.value.trim();
        });
        save('hours', hours);
        showToast('Business hours updated!');
    });

    // Inquiries display (read-only)
    function renderInquiries() {
        var tbody = $('#inquiries-table-body');
        var noInq = $('#no-inquiries');
        if (inquiries.length === 0) { tbody.innerHTML = ''; noInq.style.display = 'block'; return; }
        noInq.style.display = 'none';
        tbody.innerHTML = inquiries.map(function (inq, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + (inq.name || '-') + '</td><td>' + (inq.email || '-') + '</td>' +
                '<td>' + (inq.subject || '-') + '</td><td>' + (inq.date ? new Date(inq.date).toLocaleDateString() : '-') + '</td>' +
                '<td><button class="admin-btn admin-btn-delete" onclick="deleteInquiry(' + i + ')">Delete</button></td></tr>';
        }).join('');
    }

    window.deleteInquiry = function (idx) {
        if (confirm('Delete this inquiry?')) {
            inquiries.splice(idx, 1);
            save('inquiries', inquiries);
            renderInquiries();
            updateStats();
            showToast('Inquiry deleted');
        }
    };

    // Contact Info Management
    function renderContacts() {
        renderPhoneList();
        renderEmailList();
    }

    function renderPhoneList() {
        var list = $('#phone-list');
        if (!list) return;
        if (contacts.phones.length === 0) {
            list.innerHTML = '<p class="contact-empty">No phone numbers added yet.</p>';
            return;
        }
        list.innerHTML = '<div class="contact-list">' + contacts.phones.map(function (p, i) {
            return '<div class="contact-item">' +
                '<div class="contact-item-info">' +
                '<span class="contact-item-icon">📞</span>' +
                '<div class="contact-item-details">' +
                '<span class="contact-item-value">' + (p.number || '-') + '</span>' +
                '<span class="contact-item-label">' + (p.label || 'Phone') + '</span>' +
                '</div></div>' +
                '<div class="contact-item-actions">' +
                '<a href="tel:' + (p.number || '').replace(/[^0-9]/g, '') + '" class="admin-btn admin-btn-save" style="text-decoration:none;">Call</a>' +
                '<button class="admin-btn admin-btn-delete" onclick="deletePhone(' + i + ')">Delete</button>' +
                '</div></div>';
        }).join('') + '</div>';
    }

    function renderEmailList() {
        var list = $('#email-list');
        if (!list) return;
        if (contacts.emails.length === 0) {
            list.innerHTML = '<p class="contact-empty">No email addresses added yet.</p>';
            return;
        }
        list.innerHTML = '<div class="contact-list">' + contacts.emails.map(function (e, i) {
            return '<div class="contact-item">' +
                '<div class="contact-item-info">' +
                '<span class="contact-item-icon">✉️</span>' +
                '<div class="contact-item-details">' +
                '<span class="contact-item-value">' + (e.address || '-') + '</span>' +
                '<span class="contact-item-label">' + (e.label || 'Email') + '</span>' +
                '</div></div>' +
                '<div class="contact-item-actions">' +
                '<a href="mailto:' + (e.address || '') + '" class="admin-btn admin-btn-save" style="text-decoration:none;">Email</a>' +
                '<button class="admin-btn admin-btn-delete" onclick="deleteEmail(' + i + ')">Delete</button>' +
                '</div></div>';
        }).join('') + '</div>';
    }

    $('#add-phone-btn').addEventListener('click', function () {
        var num = $('#new-phone').value.trim();
        var label = $('#new-phone-label').value.trim() || 'Phone';
        if (!num) { showToast('Phone number is required'); return; }
        if (!/^[+]?[0-9\s\-().]{7,}$/.test(num)) {
            showToast('Invalid phone number');
            $('#new-phone').classList.add('input-error');
            setTimeout(function () { $('#new-phone').classList.remove('input-error'); }, 2000);
            return;
        }
        contacts.phones.push({ number: num, label: label });
        save('contacts', contacts);
        renderPhoneList();
        renderContactStats();
        $('#new-phone').value = '';
        $('#new-phone-label').value = '';
        showToast('Phone number added!');
    });

    $('#add-email-btn').addEventListener('click', function () {
        var addr = $('#new-email').value.trim();
        var label = $('#new-email-label').value.trim() || 'Email';
        if (!addr) { showToast('Email address is required'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
            showToast('Invalid email address');
            $('#new-email').classList.add('input-error');
            setTimeout(function () { $('#new-email').classList.remove('input-error'); }, 2000);
            return;
        }
        contacts.emails.push({ address: addr, label: label });
        save('contacts', contacts);
        renderEmailList();
        renderContactStats();
        $('#new-email').value = '';
        $('#new-email-label').value = '';
        showToast('Email address added!');
    });

    window.deletePhone = function (idx) {
        if (confirm('Delete this phone number?')) {
            contacts.phones.splice(idx, 1);
            save('contacts', contacts);
            renderPhoneList();
            renderContactStats();
            showToast('Phone number deleted');
        }
    };

    window.deleteEmail = function (idx) {
        if (confirm('Delete this email address?')) {
            contacts.emails.splice(idx, 1);
            save('contacts', contacts);
            renderEmailList();
            renderContactStats();
            showToast('Email address deleted');
        }
    };

    function showToast(msg) {
        var t = $('#admin-toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(function () { t.classList.remove('show'); }, 3000);
    }

    // Init stars
    updateStars();
})();

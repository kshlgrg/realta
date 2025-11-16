document.addEventListener('DOMContentLoaded', function() {
    var header = document.getElementById('header');
    var menuToggle = document.querySelector('.menu-toggle');
    var navMenu = document.querySelector('nav ul');
    var lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    var scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    var buildingRevealElements = document.querySelectorAll('.building-reveal');

    var revealObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    scrollRevealElements.forEach(function(element) {
        revealObserver.observe(element);
    });

    var buildingObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    var buildingObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(function() {
                    entry.target.classList.add('active');
                }, parseInt(delay));
                buildingObserver.unobserve(entry.target);
            }
        });
    }, buildingObserverOptions);

    buildingRevealElements.forEach(function(element) {
        buildingObserver.observe(element);
    });

    var parallaxImages = document.querySelectorAll('.parallax-image');

    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;

        parallaxImages.forEach(function(img) {
            var rect = img.getBoundingClientRect();
            var parentRect = img.parentElement.getBoundingClientRect();

            if (parentRect.top < window.innerHeight && parentRect.bottom > 0) {
                var speed = 0.3;
                var yPos = -(scrolled * speed);
                img.style.transform = 'translateY(' + yPos + 'px) scale(1.1)';
            }
        });
    });

    var statCounters = document.querySelectorAll('.stat-counter');
    var counterAnimated = new Set();

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !counterAnimated.has(entry.target)) {
                counterAnimated.add(entry.target);
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statCounters.forEach(function(counter) {
        counterObserver.observe(counter);
    });

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'));
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.floor(easedProgress * target);

            element.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }

        requestAnimationFrame(updateCounter);
    }

    var rotateElements = document.querySelectorAll('.rotate-on-scroll');

    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;

        rotateElements.forEach(function(element) {
            var rotation = scrolled * 0.02;
            element.style.transform = 'rotate(' + rotation + 'deg)';
        });
    });

    var cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 20;
            var rotateY = (centerX - x) / 20;

            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-15px)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var isValid = true;

            var nameInput = document.getElementById('name');
            var nameError = document.getElementById('nameError');
            if (nameInput && nameInput.value.trim() === '') {
                nameError.style.display = 'block';
                isValid = false;
            } else if (nameError) {
                nameError.style.display = 'none';
            }

            var emailInput = document.getElementById('email');
            var emailError = document.getElementById('emailError');
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailPattern.test(emailInput.value)) {
                emailError.style.display = 'block';
                isValid = false;
            } else if (emailError) {
                emailError.style.display = 'none';
            }

            var messageInput = document.getElementById('message');
            var messageError = document.getElementById('messageError');
            if (messageInput && messageInput.value.trim() === '') {
                messageError.style.display = 'block';
                isValid = false;
            } else if (messageError) {
                messageError.style.display = 'none';
            }

            if (isValid) {
                var submitBtn = contactForm.querySelector('button[type="submit"]');
                var originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                setTimeout(function() {
                    alert('Thank you for your inquiry. Our concierge team will contact you within 24 hours.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    var smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId !== '#') {
                var targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    var galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var img = this.querySelector('img');
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 100000; display: flex; align-items: center; justify-content: center; cursor: pointer; animation: fadeIn 0.3s ease;';

            var lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; border: 2px solid rgba(201, 169, 98, 0.3); animation: scaleIn 0.4s ease;';

            overlay.appendChild(lightboxImg);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            overlay.addEventListener('click', function() {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(function() {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                }, 300);
            });
        });
    });

    var style = document.createElement('style');
    style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } } @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }';
    document.head.appendChild(style);

    var cursor = document.createElement('div');
    cursor.style.cssText = 'position: fixed; width: 20px; height: 20px; border: 2px solid rgba(201, 169, 98, 0.5); border-radius: 50%; pointer-events: none; z-index: 99999; transition: transform 0.15s ease, border-color 0.3s ease; transform: translate(-50%, -50%);';
    document.body.appendChild(cursor);

    var cursorDot = document.createElement('div');
    cursorDot.style.cssText = 'position: fixed; width: 6px; height: 6px; background: rgba(201, 169, 98, 0.8); border-radius: 50%; pointer-events: none; z-index: 99999; transition: transform 0.05s ease; transform: translate(-50%, -50%);';
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    var interactiveElements = document.querySelectorAll('a, button, .card, .gallery-item');
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'rgba(201, 169, 98, 1)';
        });
        el.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'rgba(201, 169, 98, 0.5)';
        });
    });

    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a');

    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (window.pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Cart functionality
    let cartItems = [];
    let cartTotal = 0;

    function updateCart() {
        const cartCount = document.querySelector('.cart-count');
        const cartAmount = document.querySelector('.cart-amount');
        
        cartCount.textContent = cartItems.length;
        cartAmount.textContent = `₹${cartTotal.toFixed(2)}`;
    }

    // Subscription card interactions
    const subscriptionCards = document.querySelectorAll('.subscription-card');
    
    subscriptionCards.forEach(card => {
        const addToCartBtn = card.querySelector('.btn-card');
        
        addToCartBtn.addEventListener('click', function() {
            const cardTitle = card.querySelector('h3').textContent;
            const planType = card.querySelector('.plan-type').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('₹', ''));
            
            // Add to cart
            const cartItem = {
                id: Date.now(),
                title: cardTitle,
                plan: planType,
                price: price
            };
            
            cartItems.push(cartItem);
            cartTotal += price;
            updateCart();
            
            // Show success message
            showNotification(`${cardTitle} ${planType} added to cart!`);
            
            // Animate cart
            animateCart();
        });
    });

    // Cart click handler
    const cart = document.querySelector('.cart');
    cart.addEventListener('click', function() {
        if (cartItems.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            showCartModal();
        }
    });

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #2d5016;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Cart animation
    function animateCart() {
        const cart = document.querySelector('.cart');
        cart.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cart.style.transform = 'scale(1)';
        }, 200);
    }

    // Cart modal
    function showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        let cartHTML = `
            <h2 style="color: #2d5016; margin-bottom: 1rem;">Your Cart</h2>
            <div class="cart-items">
        `;
        
        cartItems.forEach(item => {
            cartHTML += `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee;">
                    <div>
                        <h4 style="color: #2d5016; margin-bottom: 0.25rem;">${item.title}</h4>
                        <p style="color: #666; font-size: 0.9rem;">${item.plan}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-weight: 600; color: #2d5016;">₹${item.price}</span>
                        <button class="remove-item" style="background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #2d5016;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: #2d5016;">Total:</h3>
                    <h3 style="color: #2d5016;">₹${cartTotal.toFixed(2)}</h3>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-primary" style="flex: 1;">Checkout</button>
                    <button class="btn btn-secondary" style="flex: 1;">Continue Shopping</button>
                </div>
            </div>
        `;
        
        modalContent.innerHTML = cartHTML;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Remove item handlers
        modalContent.querySelectorAll('.remove-item').forEach((btn, index) => {
            btn.addEventListener('click', function() {
                cartTotal -= cartItems[index].price;
                cartItems.splice(index, 1);
                updateCart();
                document.body.removeChild(modal);
                if (cartItems.length > 0) {
                    showCartModal();
                }
            });
        });
        
        // Checkout handler
        modalContent.querySelector('.btn-primary').addEventListener('click', function() {
            showNotification('Checkout functionality coming soon!');
            document.body.removeChild(modal);
        });
        
        // Continue shopping handler
        modalContent.querySelector('.btn-secondary').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }

    // Hero section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.subscription-card, .feature-block, .review-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                const isSlash = finalValue.includes('/');
                
                let numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(counter);
                    }
                    
                    let displayValue = Math.floor(currentValue);
                    if (isPercentage) displayValue += '%';
                    if (isPlus) displayValue += '+';
                    if (isSlash) displayValue = finalValue; // Keep original for 24/7
                    
                    target.textContent = displayValue;
                }, 30);
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Mobile menu toggle (for future mobile optimization)
    function createMobileMenu() {
        const header = document.querySelector('.header .container');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
                toggle.style.cssText = `
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: block;
                `;
                
                header.insertBefore(toggle, navMenu);
                
                toggle.addEventListener('click', function() {
                    navMenu.style.display = navMenu.style.display === 'none' ? 'block' : 'none';
                });
            }
        }
    }

    // Initialize mobile menu
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // Form validation (for future contact forms)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #2d5016;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
        } else {
            scrollToTopBtn.style.opacity = '0';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize everything
    updateCart();
    highlightNavigation();
});

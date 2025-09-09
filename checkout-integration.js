// Checkout Integration for HealthyBowl
// This file handles the checkout process and database integration

class CheckoutManager {
    constructor() {
        this.supabaseUrl = 'https://awnmurxunaenwzluhwge.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bm11cnh1bmFlbnd6bHVod2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQyNjIsImV4cCI6MjA3MjY1MDI2Mn0.vgf0wzw8DmDAMUhPPxufVaHfkl5T2trnPqzF6ZHwIJ4';
        this.supabase = null;
        this.init();
    }

    async init() {
        // Initialize Supabase if credentials are provided
        if (this.supabaseUrl && this.supabaseUrl !== 'YOUR_SUPABASE_URL') {
            try {
                // Wait for Supabase to be available
                if (typeof window !== 'undefined' && window.supabase) {
                    this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
                    console.log('✅ Supabase initialized successfully');
                } else {
                    // Fallback: try to load Supabase dynamically
                    const { createClient } = await import('https://unpkg.com/@supabase/supabase-js@2');
                    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
                    console.log('✅ Supabase initialized successfully');
                }
            } catch (error) {
                console.error('❌ Failed to initialize Supabase:', error);
            }
        }
    }

    // Get cart data from localStorage
    getCartData() {
        return JSON.parse(localStorage.getItem('healthybowl_cart')) || [];
    }

    // Calculate order totals
    calculateTotals(cartItems) {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const gstAmount = subtotal * 0.18; // 18% GST
        const totalAmount = subtotal + gstAmount;
        
        return {
            subtotal: subtotal,
            gstAmount: gstAmount,
            totalAmount: totalAmount
        };
    }

    // Create order in database
    async createOrder(customerData, billingAddress) {
        try {
            if (!this.supabase) {
                throw new Error('Database not connected. Please configure Supabase credentials.');
            }

            const cartItems = this.getCartData();
            if (cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            const totals = this.calculateTotals(cartItems);

            // Prepare order items for database
            const orderItems = cartItems.map(item => ({
                name: item.name,
                size: item.size,
                period: item.period,
                quantity: item.quantity,
                price: item.price,
                fruitMix: item.fruitMix,
                fruitMixName: item.fruitMixName
            }));

            // Call the create_order_with_items function
            const { data, error } = await this.supabase.rpc('create_order_with_items', {
                p_user_id: null, // You might need to create a user first
                p_customer_email: customerData.email,
                p_customer_first_name: customerData.firstName,
                p_customer_last_name: customerData.lastName,
                p_customer_phone: customerData.phone,
                p_billing_address: billingAddress,
                p_subtotal: totals.subtotal,
                p_gst_amount: totals.gstAmount,
                p_order_items: orderItems,
                p_payment_status: 'paid' // Set payment status to paid since customer can only order after payment
            });

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return {
                success: true,
                orderId: data,
                orderNumber: `HB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(data).slice(-4)}`,
                totalAmount: totals.totalAmount
            };

        } catch (error) {
            console.error('Order creation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Process checkout
    async processCheckout(customerData, billingAddress) {
        try {
            // Show loading state
            this.showLoading('Processing your order...');

            // Create order in database
            const result = await this.createOrder(customerData, billingAddress);

            if (result.success) {
                // Clear cart
                localStorage.removeItem('healthybowl_cart');
                
                // Show success message
                this.showSuccess(result.orderNumber, result.totalAmount);
                
                // Update cart display
                this.updateCartDisplay();
                
                return result;
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            this.showError(error.message);
            return { success: false, error: error.message };
        }
    }

    // Show loading state
    showLoading(message) {
        const notification = document.createElement('div');
        notification.id = 'checkout-loading';
        notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
    }

    // Show success message
    showSuccess(orderNumber, totalAmount) {
        // Remove loading notification
        const loading = document.getElementById('checkout-loading');
        if (loading) loading.remove();

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>✅</span>
                <div>
                    <div class="font-semibold">Order Placed Successfully!</div>
                    <div class="text-sm">Order #${orderNumber}</div>
                    <div class="text-sm">Total: ₹${totalAmount.toFixed(2)}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Show error message
    showError(message) {
        // Remove loading notification
        const loading = document.getElementById('checkout-loading');
        if (loading) loading.remove();

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>❌</span>
                <div>
                    <div class="font-semibold">Order Failed</div>
                    <div class="text-sm">${message}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Update cart display
    updateCartDisplay() {
        const cart = this.getCartData();
        const cartCount = document.querySelector('.cart-count');
        const cartAmount = document.querySelector('.cart-amount');
        
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
        if (cartAmount) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartAmount.textContent = `₹${total.toFixed(2)}`;
        }
    }

    // Check if database is connected
    isConnected() {
        return this.supabase !== null;
    }

    // Get connection status
    getConnectionStatus() {
        if (!this.supabase) {
            return {
                connected: false,
                message: 'Database not configured. Please update Supabase credentials.'
            };
        }
        return {
            connected: true,
            message: 'Database connected successfully'
        };
    }
}

// Initialize checkout manager
const checkoutManager = new CheckoutManager();

// Export for use in other files
window.CheckoutManager = CheckoutManager;
window.checkoutManager = checkoutManager;

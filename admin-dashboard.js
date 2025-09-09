// Global variables
let orders = [];
let filteredOrders = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentEditingOrderId = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateLastUpdated();
    loadOrders();
    setupEventListeners();
    setupMobileMenu();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterOrders);
    document.getElementById('statusFilter').addEventListener('change', filterOrders);
    document.getElementById('dateFilter').addEventListener('change', filterOrders);
    document.getElementById('statusSectionFilter').addEventListener('change', filterOrders);
}

// Load orders from database
async function loadOrders() {
    try {
        console.log('🔄 Loading orders...');
        
        // Try to load from Supabase first
        if (typeof window.supabaseClient !== 'undefined') {
            console.log('📡 Fetching from Supabase...');
            
            const { data, error } = await window.supabaseClient
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('❌ Supabase error:', error);
                throw error;
            }
            
            if (data && data.length > 0) {
                console.log(`✅ Loaded ${data.length} orders from Supabase`);
                orders = data;
            } else {
                console.log('⚠️ No orders in Supabase, using sample data');
                throw new Error('No orders found');
            }
        } else {
            console.log('❌ Supabase not available, using sample data');
            throw new Error('Supabase not available');
        }
    } catch (error) {
        console.log('🔄 Using sample data as fallback');
        // Sample data as fallback
        orders = [
            {
                id: "b5d35488-1def-4f93-8ade-12199878fcc1",
                order_number: "HB-20250905-0002",
                customer_email: "test@healthybowl.in",
                customer_first_name: "John",
                customer_last_name: "Doe",
                customer_phone: "+91 98765 43210",
                billing_address: {
                    street: "123, Shivaji Park, Dr. Ambedkar Road, Near Shiv Sena Bhavan, Dadar West",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400028",
                    landmark: "Opposite to Shivaji Park Ground, Next to McDonald's, Above State Bank of India"
                },
                status: "delivered",
                payment_status: "paid",
                total_amount: "1260.00",
                created_at: "2025-09-05 15:04:41.415623+00",
                order_items: [
                    {
                        product_name: "250ml Weekly Plan",
                        quantity: 2,
                        fruit_mix: "classic-apple",
                        fruit_mix_name: "Option 1: Classic Apple Mix (Apple, Orange, Green Grapes, Pomegranate)",
                        unit_price: "600.00",
                        total_price: "1200.00"
                    }
                ]
            },
            {
                id: "f0c48692-7bd3-44e2-9d57-198940884f79",
                order_number: "HB-20250905-0001",
                customer_email: "test@healthybowl.in",
                customer_first_name: "John",
                customer_last_name: "Doe",
                customer_phone: "+91 98765 43210",
                billing_address: {
                    street: "456, 2nd Floor, Brigade Gateway, Dr. Rajkumar Road, Rajajinagar, Near Orion Mall",
                    city: "Bangalore",
                    state: "Karnataka",
                    pincode: "560055",
                    landmark: "Above Reliance Digital Store, Next to Metro Station, Opposite to Forum Mall, Near Manyata Tech Park"
                },
                status: "delivered",
                payment_status: "paid",
                total_amount: "1260.00",
                created_at: "2025-09-05 13:36:11.154709+00",
                order_items: [
                    {
                        product_name: "250ml Weekly Plan",
                        quantity: 2,
                        fruit_mix: "antioxidant-power",
                        fruit_mix_name: "Option 2: Antioxidant Power Bowl (Pomegranate, Apple, Green Grapes, Kiwi)",
                        unit_price: "600.00",
                        total_price: "1200.00"
                    }
                ]
            },
            {
                id: "a1b2c3d4-5e6f-7890-abcd-ef1234567890",
                order_number: "HB-20250905-0003",
                customer_email: "jane@example.com",
                customer_first_name: "Jane",
                customer_last_name: "Smith",
                customer_phone: "+91 87654 32109",
                billing_address: {
                    street: "789 Park Street",
                    city: "Kolkata",
                    state: "West Bengal",
                    pincode: "700016",
                    landmark: "Near Victoria Memorial"
                },
                status: "preparing",
                payment_status: "paid",
                total_amount: "1920.00",
                created_at: "2025-09-05 16:30:15.123456+00",
                order_items: [
                    {
                        product_name: "500ml Monthly Plan",
                        quantity: 1,
                        fruit_mix: "citrus-fresh",
                        fruit_mix_name: "Option 3: Citrus Fresh Blend (Orange, Apple, Green Grapes, Pomegranate)",
                        unit_price: "1920.00",
                        total_price: "1920.00"
                    }
                ]
            },
            {
                id: "b2c3d4e5-6f7g-8901-bcde-f23456789012",
                order_number: "HB-20250905-0004",
                customer_email: "mike@example.com",
                customer_first_name: "Mike",
                customer_last_name: "Johnson",
                customer_phone: "+91 76543 21098",
                billing_address: {
                    street: "321 Connaught Place",
                    city: "New Delhi",
                    state: "Delhi",
                    pincode: "110001",
                    landmark: "Near Central Park"
                },
                status: "out_for_delivery",
                payment_status: "paid",
                total_amount: "480.00",
                created_at: "2025-09-05 14:15:30.789012+00",
                order_items: [
                    {
                        product_name: "500ml Weekly Plan",
                        quantity: 1,
                        fruit_mix: "sweet-crunchy",
                        fruit_mix_name: "Option 4: Sweet & Crunchy Mix (Apple, Green Grapes, Orange, Pineapple)",
                        unit_price: "480.00",
                        total_price: "480.00"
                    }
                ]
            },
            {
                id: "c3d4e5f6-7g8h-9012-cdef-345678901234",
                order_number: "HB-20250905-0005",
                customer_email: "sarah@example.com",
                customer_first_name: "Sarah",
                customer_last_name: "Wilson",
                customer_phone: "+91 65432 10987",
                billing_address: {
                    street: "654 Marine Drive",
                    city: "Chennai",
                    state: "Tamil Nadu",
                    pincode: "600001",
                    landmark: "Near Marina Beach"
                },
                status: "pending",
                payment_status: "paid",
                total_amount: "300.00",
                created_at: "2025-09-05 17:45:22.456789+00",
                order_items: [
                    {
                        product_name: "250ml Weekly Plan",
                        quantity: 1,
                        fruit_mix: "premium-exotic",
                        fruit_mix_name: "Option 5: Premium Exotic Bowl (Apple, Pomegranate, Kiwi, Pineapple)",
                        unit_price: "300.00",
                        total_price: "300.00"
                    }
                ]
            }
        ];
    }
    
    // Update display
    filteredOrders = [...orders];
    updateStats();
    displayOrders();
}

// Filter orders based on search and filters
function filterOrders() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const statusSectionFilter = document.getElementById('statusSectionFilter').value;

    filteredOrders = orders.filter(order => {
        const matchesSearch = !searchTerm || 
            order.order_number.toLowerCase().includes(searchTerm) ||
            order.customer_first_name.toLowerCase().includes(searchTerm) ||
            order.customer_last_name.toLowerCase().includes(searchTerm) ||
            order.customer_email.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || order.status === statusFilter;
        const matchesStatusSection = !statusSectionFilter || statusSectionFilter === 'all' || order.status === statusSectionFilter;
        
        let matchesDate = true;
        if (dateFilter) {
            const orderDate = new Date(order.created_at).toISOString().split('T')[0];
            matchesDate = orderDate === dateFilter;
        }

        return matchesSearch && matchesStatus && matchesStatusSection && matchesDate;
    });

    currentPage = 1;
    displayOrders();
}

// Update statistics
function updateStats() {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const outForDelivery = orders.filter(order => order.status === 'out_for_delivery').length;

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('outForDelivery').textContent = outForDelivery;
}

// Display orders in table with pagination
function displayOrders() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageOrders = filteredOrders.slice(startIndex, endIndex);

    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    pageOrders.forEach(order => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${order.order_number}</div>
                <div class="text-sm text-gray-500">${formatDate(order.created_at)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${order.customer_first_name} ${order.customer_last_name}</div>
                <div class="text-sm text-gray-500">${order.customer_email}</div>
                <div class="text-sm text-gray-500">${order.customer_phone || 'N/A'}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                    ${order.billing_address ? `
                        <div class="space-y-1">
                            <div class="font-medium">${order.billing_address.street}</div>
                            <div>${order.billing_address.city}, ${order.billing_address.state}</div>
                            <div>${order.billing_address.pincode}</div>
                            ${order.billing_address.landmark ? `<div class="text-xs text-gray-500">${order.billing_address.landmark}</div>` : ''}
                        </div>
                    ` : '<div class="text-gray-500">No address</div>'}
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                    ${order.order_items ? order.order_items.map(item => `
                        <div class="mb-1">
                            ${item.product_name} (Qty: ${item.quantity})
                            ${item.fruit_mix_name ? `<br><span class="fruit-mix-badge ${getFruitMixClass(item.fruit_mix)}">${item.fruit_mix_name}</span>` : ''}
                        </div>
                    `).join('') : 'No items'}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${order.status}">${formatStatus(order.status)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge payment-${order.payment_status}">${formatPaymentStatus(order.payment_status)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹${parseFloat(order.total_amount).toLocaleString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewOrderDetails('${order.id}')" class="text-green-600 hover:text-green-900 mr-3">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="updateOrderStatus('${order.id}')" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    updatePagination();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredOrders.length);

    document.getElementById('showingStart').textContent = startItem;
    document.getElementById('showingEnd').textContent = endItem;
    document.getElementById('totalCount').textContent = filteredOrders.length;

    // Generate pagination numbers
    const paginationNumbers = document.getElementById('paginationNumbers');
    paginationNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === currentPage 
                ? 'z-10 bg-green-50 border-green-500 text-green-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
        }`;
        button.onclick = () => goToPage(i);
        paginationNumbers.appendChild(button);
    }
}

// Navigation functions
function goToPage(page) {
    currentPage = page;
    displayOrders();
}

function nextPage() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayOrders();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayOrders();
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderModal');
    const details = document.getElementById('orderDetails');
    
    details.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Order Information</h4>
                <div class="space-y-2">
                    <p><span class="font-medium">Order Number:</span> ${order.order_number}</p>
                    <p><span class="font-medium">Order Date:</span> ${formatDate(order.created_at)}</p>
                    <p><span class="font-medium">Status:</span> <span class="status-badge status-${order.status}">${formatStatus(order.status)}</span></p>
                    <p><span class="font-medium">Payment Status:</span> <span class="status-badge payment-${order.payment_status}">${formatPaymentStatus(order.payment_status)}</span></p>
                    <p><span class="font-medium">Total Amount:</span> ₹${parseFloat(order.total_amount).toLocaleString()}</p>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                <div class="space-y-2">
                    <p><span class="font-medium">Name:</span> ${order.customer_first_name} ${order.customer_last_name}</p>
                    <p><span class="font-medium">Email:</span> ${order.customer_email}</p>
                    <p><span class="font-medium">Phone:</span> ${order.customer_phone || 'N/A'}</p>
                </div>
                
                ${order.billing_address ? `
                    <div class="mt-4">
                        <h5 class="text-md font-semibold text-gray-800 mb-2">Delivery Address</h5>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <p class="font-medium">${order.billing_address.street}</p>
                            <p>${order.billing_address.city}, ${order.billing_address.state}</p>
                            <p>Pincode: ${order.billing_address.pincode}</p>
                            ${order.billing_address.landmark ? `<p class="text-sm text-gray-600">Landmark: ${order.billing_address.landmark}</p>` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="mt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
            <div class="space-y-3">
                ${order.items ? order.items.map(item => `
                    <div class="border rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium">${item.product_name}</p>
                                <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                                ${item.fruit_mix_name ? `<p class="text-sm text-gray-600">Fruit Mix: <span class="fruit-mix-badge ${getFruitMixClass(item.fruit_mix)}">${item.fruit_mix_name}</span></p>` : ''}
                            </div>
                            <div class="text-right">
                                <p class="font-medium">₹${parseFloat(item.unit_price).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                `).join('') : 'No items found'}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('orderModal').classList.add('hidden');
}

// Update order status - open modal
function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentEditingOrderId = orderId;
    
    // Populate modal
    document.getElementById('statusOrderNumber').value = order.order_number;
    document.getElementById('currentStatus').value = formatStatus(order.status);
    document.getElementById('newStatusSelect').value = order.status;
    
    // Show modal
    document.getElementById('statusModal').classList.remove('hidden');
}

// Close status modal
function closeStatusModal() {
    document.getElementById('statusModal').classList.add('hidden');
    currentEditingOrderId = null;
}

// Confirm status update
async function confirmStatusUpdate() {
    if (!currentEditingOrderId) return;
    
    const newStatus = document.getElementById('newStatusSelect').value;
    const order = orders.find(o => o.id === currentEditingOrderId);
    
    if (order) {
        try {
            // Update in Supabase database
            if (typeof window.supabaseClient !== 'undefined') {
                const { error } = await window.supabaseClient
                    .from('orders')
                    .update({ status: newStatus })
                    .eq('id', currentEditingOrderId);
                
                if (error) {
                    console.error('Error updating order status:', error);
                    showMessage('Failed to update order status', 'error');
                    return;
                }
            }
            
            // Update local array
            order.status = newStatus;
            console.log(`Updated order ${currentEditingOrderId} to status: ${newStatus}`);
            
            // Show success message
            showMessage(`Order status updated to: ${formatStatus(newStatus)}`, 'success');
            
            // Refresh display
            refreshData();
        } catch (error) {
            console.error('Error updating order status:', error);
            showMessage('Failed to update order status', 'error');
        }
    }
    
    closeStatusModal();
}

// Show message notification
function showMessage(message, type = 'success') {
    // Remove existing message if any
    const existingMessage = document.getElementById('messageNotification');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'messageNotification';
    messageDiv.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
    }`;
    messageDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Refresh data
function refreshData() {
    loadOrders();
    updateLastUpdated();
}

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatStatus(status) {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatPaymentStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getFruitMixClass(fruitMix) {
    const classes = {
        'classic-apple': 'fruit-classic',
        'antioxidant-power': 'fruit-antioxidant',
        'citrus-fresh': 'fruit-citrus',
        'sweet-crunchy': 'fruit-sweet',
        'premium-exotic': 'fruit-premium'
    };
    return classes[fruitMix] || 'fruit-classic';
}

// Close modal when clicking outside
document.getElementById('orderModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    
    if (mobileMenuBtn && mobileMenuDropdown) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuDropdown.classList.toggle('hidden');
        });
    }
}

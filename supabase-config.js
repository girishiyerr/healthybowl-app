// Supabase Configuration for HealthyBowl
// This file contains all Supabase client configuration and API functions

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://awnmurxunaenwzluhwge.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bm11cnh1bmFlbnd6bHVod2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQyNjIsImV4cCI6MjA3MjY1MDI2Mn0.vgf0wzw8DmDAMUhPPxufVaHfkl5T2trnPqzF6ZHwIJ4'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =============================================
// AUTHENTICATION FUNCTIONS
// =============================================

// Sign up new user
export async function signUp(email, password, userData) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    phone: userData.phone
                }
            }
        })
        
        if (error) throw error
        
        // Create user profile
        if (data.user) {
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: data.user.id,
                    email: data.user.email,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    phone: userData.phone,
                    newsletter_subscribed: userData.newsletterSubscribed || false
                })
            
            if (profileError) throw profileError
        }
        
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

// Sign in user
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Sign out user
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        return { error }
    } catch (error) {
        return { error }
    }
}

// Get current user
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    } catch (error) {
        return { user: null, error }
    }
}

// =============================================
// USER PROFILE FUNCTIONS
// =============================================

// Get user profile
export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Update user profile
export async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// ADDRESS FUNCTIONS
// =============================================

// Get user addresses
export async function getUserAddresses(userId) {
    try {
        const { data, error } = await supabase
            .from('customer_addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Add new address
export async function addUserAddress(userId, addressData) {
    try {
        const { data, error } = await supabase
            .from('customer_addresses')
            .insert({
                user_id: userId,
                ...addressData
            })
            .select()
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Update address
export async function updateUserAddress(addressId, updates) {
    try {
        const { data, error } = await supabase
            .from('customer_addresses')
            .update(updates)
            .eq('id', addressId)
            .select()
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Delete address
export async function deleteUserAddress(addressId) {
    try {
        const { error } = await supabase
            .from('customer_addresses')
            .delete()
            .eq('id', addressId)
        
        return { error }
    } catch (error) {
        return { error }
    }
}

// =============================================
// PRODUCT FUNCTIONS
// =============================================

// Get all products
export async function getProducts() {
    try {
        const { data, error } = await supabase
            .from('product_catalog')
            .select('*')
            .order('size_ml', { ascending: true })
            .order('plan_type', { ascending: true })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Get product by ID
export async function getProduct(productId) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// COUPON FUNCTIONS
// =============================================

// Validate coupon
export async function validateCoupon(couponCode, orderAmount) {
    try {
        const { data, error } = await supabase
            .rpc('validate_coupon', {
                p_coupon_code: couponCode,
                p_order_amount: orderAmount
            })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// DELIVERY FUNCTIONS
// =============================================

// Check delivery availability
export async function checkDeliveryAvailability(pincode) {
    try {
        const { data, error } = await supabase
            .rpc('check_delivery_availability', {
                p_pincode: pincode
            })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Get delivery areas
export async function getDeliveryAreas() {
    try {
        const { data, error } = await supabase
            .from('delivery_areas')
            .select('*')
            .eq('is_active', true)
            .order('area_name')
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// ORDER FUNCTIONS
// =============================================

// Create order
export async function createOrder(orderData) {
    try {
        const { data, error } = await supabase
            .rpc('create_order_with_items', {
                p_user_id: orderData.userId || null,
                p_customer_email: orderData.customer.email,
                p_customer_first_name: orderData.customer.firstName,
                p_customer_last_name: orderData.customer.lastName,
                p_customer_phone: orderData.customer.phone,
                p_billing_address: orderData.customer.address,
                p_subtotal: orderData.subtotal,
                p_gst_amount: orderData.gst,
                p_discount_amount: orderData.discountAmount || 0,
                p_coupon_id: orderData.coupon?.id || null,
                p_coupon_code: orderData.coupon?.code || null,
                p_delivery_instructions: orderData.customer.instructions,
                p_order_items: orderData.items
            })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Get user orders
export async function getUserOrders(userId) {
    try {
        const { data, error } = await supabase
            .from('order_summary')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Get order details
export async function getOrderDetails(orderId) {
    try {
        // Get order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()
        
        if (orderError) throw orderError
        
        // Get order items
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)
        
        if (itemsError) throw itemsError
        
        return { 
            data: { ...order, items }, 
            error: null 
        }
    } catch (error) {
        return { data: null, error }
    }
}

// Update order status
export async function updateOrderStatus(orderId, status, paymentStatus = null) {
    try {
        const updates = { status }
        if (paymentStatus) updates.payment_status = paymentStatus
        
        const { data, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', orderId)
            .select()
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// CONTACT FUNCTIONS
// =============================================

// Submit contact message
export async function submitContactMessage(messageData) {
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .insert({
                first_name: messageData.firstName,
                last_name: messageData.lastName,
                email: messageData.email,
                phone: messageData.phone,
                subject: messageData.subject,
                message: messageData.message,
                newsletter_subscribed: messageData.newsletterSubscribed || false
            })
            .select()
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Get contact messages (admin only)
export async function getContactMessages() {
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// Update contact message status
export async function updateContactMessageStatus(messageId, status, adminNotes = null) {
    try {
        const updates = { status }
        if (adminNotes) updates.admin_notes = adminNotes
        
        const { data, error } = await supabase
            .from('contact_messages')
            .update(updates)
            .eq('id', messageId)
            .select()
            .single()
        
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// ANALYTICS FUNCTIONS
// =============================================

// Get order statistics
export async function getOrderStats() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('status, payment_status, total_amount, created_at')
        
        if (error) throw error
        
        // Process data for analytics
        const stats = {
            totalOrders: data.length,
            totalRevenue: data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
            pendingOrders: data.filter(order => order.status === 'pending').length,
            completedOrders: data.filter(order => order.status === 'delivered').length,
            paidOrders: data.filter(order => order.payment_status === 'paid').length
        }
        
        return { data: stats, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Handle Supabase errors
export function handleSupabaseError(error) {
    console.error('Supabase Error:', error)
    
    if (error.message) {
        return error.message
    }
    
    return 'An unexpected error occurred. Please try again.'
}

// Format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount)
}

// Format date
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date))
}

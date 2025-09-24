// Borzo Integration Service for HealthyBowl
// Handles delivery requests and status updates

class BorzoIntegration {
    constructor() {
        this.apiKey = '0C103815F71635F077C5A79A04ED7725F0A35152';
        this.baseUrl = 'https://robotapitest-bxjyfrjzba-uc.a.run.app'; // Borzo test API
        this.callbackUrl = 'https://healthybowl.in/borzo-callback.html'; // Production callback URL
        this.callbackToken = '095B396436F61688AA44AC771A38839E4067021C'; // Callback token for verification
    }

    /**
     * Create a delivery request with Borzo
     * @param {Object} orderData - Order information
     * @param {Object} deliveryAddress - Delivery address
     * @returns {Promise<Object>} - Borzo delivery response
     */
    async createDeliveryRequest(orderData, deliveryAddress) {
        try {
        const deliveryRequest = {
            // Basic delivery information
            type: 'scheduled', // standard, express, scheduled - using scheduled for better timing
            matter: 'HealthyBowl Order Delivery',
            vehicle_type_id: 1, // 1 = bike, 2 = car, 3 = van
            
            // Schedule delivery for when order will be ready (add 15-20 minutes buffer for half_ready)
            scheduled_at: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutes from now
                
                // Pickup information (your business address)
                points: [
                    {
                        type: 'pickup',
                        address: {
                            street: 'Your Business Address',
                            house: 'Building Name',
                            city: 'Mumbai',
                            lat: 19.0760, // Your business coordinates
                            lng: 72.8777
                        },
                        contact_person: {
                            name: 'HealthyBowl Team',
                            phone: '+919876543210' // Your business phone
                        },
                        note: `Order #${orderData.order_number} - Fresh fruits and sprouts`
                    },
                    {
                        type: 'dropoff',
                        address: {
                            street: deliveryAddress.line1,
                            house: deliveryAddress.line2 || '',
                            city: deliveryAddress.city || 'Mumbai',
                            lat: deliveryAddress.lat || 19.0760, // You might want to geocode this
                            lng: deliveryAddress.lng || 72.8777
                        },
                        contact_person: {
                            name: `${deliveryAddress.firstName} ${deliveryAddress.lastName}`,
                            phone: deliveryAddress.phone
                        },
                        note: deliveryAddress.instructions || 'Please handle with care - fresh fruits'
                    }
                ],
                
                // Delivery preferences
                is_client_notification_enabled: true,
                is_contact_person_notification_enabled: true,
                is_route_optimizer_enabled: true,
                
                // Callback configuration
                callback_url: this.callbackUrl,
                
                // Additional options
                is_motobox_required: false,
                is_insurance_required: false,
                payment_method: 'non_cash', // non_cash, cash
                cod_money_to_collect: 0 // No COD since payment is already done
            };

            const response = await fetch(`${this.baseUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-DV-Auth-Token': this.apiKey
                },
                body: JSON.stringify(deliveryRequest)
            });

            if (!response.ok) {
                throw new Error(`Borzo API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                borzoOrderId: result.order_id,
                trackingUrl: result.tracking_url,
                estimatedDeliveryTime: result.estimated_delivery_time,
                data: result
            };

        } catch (error) {
            console.error('Borzo delivery request failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get delivery status from Borzo
     * @param {string} borzoOrderId - Borzo order ID
     * @returns {Promise<Object>} - Delivery status
     */
    async getDeliveryStatus(borzoOrderId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/orders/${borzoOrderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-DV-Auth-Token': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Borzo API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                status: result.status,
                statusText: result.status_text,
                estimatedDeliveryTime: result.estimated_delivery_time,
                data: result
            };

        } catch (error) {
            console.error('Failed to get Borzo delivery status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Cancel a delivery request
     * @param {string} borzoOrderId - Borzo order ID
     * @returns {Promise<Object>} - Cancellation result
     */
    async cancelDelivery(borzoOrderId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/orders/${borzoOrderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-DV-Auth-Token': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Borzo API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                data: result
            };

        } catch (error) {
            console.error('Failed to cancel Borzo delivery:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create immediate delivery request (when order is ready for pickup)
     * @param {Object} orderData - Order information
     * @param {Object} deliveryAddress - Delivery address
     * @returns {Promise<Object>} - Borzo delivery response
     */
    async createImmediateDeliveryRequest(orderData, deliveryAddress) {
        try {
            const deliveryRequest = {
                // Basic delivery information
                type: 'express', // Use express for immediate delivery
                matter: 'HealthyBowl Order Delivery - Ready for Pickup',
                vehicle_type_id: 1, // 1 = bike, 2 = car, 3 = van
                
                // Pickup information (your business address)
                points: [
                    {
                        type: 'pickup',
                        address: {
                            street: 'Your Business Address',
                            house: 'Building Name',
                            city: 'Mumbai',
                            lat: 19.0760, // Your business coordinates
                            lng: 72.8777
                        },
                        contact_person: {
                            name: 'HealthyBowl Team',
                            phone: '+919876543210' // Your business phone
                        },
                        note: `Order #${orderData.order_number} - Fresh fruits and sprouts - READY FOR PICKUP`
                    },
                    {
                        type: 'dropoff',
                        address: {
                            street: deliveryAddress.line1,
                            house: deliveryAddress.line2 || '',
                            city: deliveryAddress.city || 'Mumbai',
                            lat: deliveryAddress.lat || 19.0760,
                            lng: deliveryAddress.lng || 72.8777
                        },
                        contact_person: {
                            name: `${deliveryAddress.firstName} ${deliveryAddress.lastName}`,
                            phone: deliveryAddress.phone
                        },
                        note: deliveryAddress.instructions || 'Please handle with care - fresh fruits'
                    }
                ],
                
                // Delivery preferences
                is_client_notification_enabled: true,
                is_contact_person_notification_enabled: true,
                is_route_optimizer_enabled: true,
                
                // Callback configuration
                callback_url: this.callbackUrl,
                
                // Additional options
                is_motobox_required: false,
                is_insurance_required: false,
                payment_method: 'non_cash',
                cod_money_to_collect: 0
            };

            const response = await fetch(`${this.baseUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-DV-Auth-Token': this.apiKey
                },
                body: JSON.stringify(deliveryRequest)
            });

            if (!response.ok) {
                throw new Error(`Borzo API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                borzoOrderId: result.order_id,
                trackingUrl: result.tracking_url,
                estimatedDeliveryTime: result.estimated_delivery_time,
                data: result
            };

        } catch (error) {
            console.error('Borzo immediate delivery request failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process callback from Borzo (called by your callback URL)
     * @param {Object} callbackData - Data received from Borzo
     * @returns {Object} - Processing result
     */
    processCallback(callbackData) {
        try {
            // Map Borzo status to your internal status
            const statusMapping = {
                'new': 'out_for_delivery',
                'accepted': 'out_for_delivery',
                'picked_up': 'out_for_delivery',
                'in_progress': 'out_for_delivery',
                'delivered': 'delivered',
                'cancelled': 'cancelled',
                'failed': 'cancelled'
            };

            const internalStatus = statusMapping[callbackData.status] || 'out_for_delivery';
            
            return {
                success: true,
                borzoOrderId: callbackData.order_id,
                borzoStatus: callbackData.status,
                internalStatus: internalStatus,
                statusText: callbackData.status_text,
                timestamp: callbackData.timestamp,
                data: callbackData
            };

        } catch (error) {
            console.error('Failed to process Borzo callback:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other files
window.BorzoIntegration = BorzoIntegration;

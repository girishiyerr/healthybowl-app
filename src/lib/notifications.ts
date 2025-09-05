import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  subscriptionDetails: {
    planName: string
    sizeMl: number
    mixFruits: number
    mixSprouts: number
    pricePerDelivery: number
    startDate: string
    address: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'HealthyBowl <noreply@healthybowl.com>',
      to: [email],
      subject: 'Order Confirmation - HealthyBowl',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5016;">🎉 Welcome to HealthyBowl!</h1>
          
          <p>Thank you for subscribing to our fresh fruits and sprouts delivery service!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2d5016; margin-top: 0;">Subscription Details</h2>
            <p><strong>Plan:</strong> ${subscriptionDetails.planName}</p>
            <p><strong>Box Size:</strong> ${subscriptionDetails.sizeMl}ml</p>
            <p><strong>Mix per delivery:</strong> ${subscriptionDetails.mixFruits} fruits + ${subscriptionDetails.mixSprouts} sprouts</p>
            <p><strong>Price per delivery:</strong> ₹${subscriptionDetails.pricePerDelivery}</p>
            <p><strong>Start Date:</strong> ${subscriptionDetails.startDate}</p>
            <p><strong>Delivery Address:</strong> ${subscriptionDetails.address}</p>
          </div>
          
          <p>Your first delivery will be scheduled according to your plan. You can manage your subscription from your dashboard.</p>
          
          <p>Questions? Reply to this email or contact us at support@healthybowl.com</p>
          
          <p>Best regards,<br>The HealthyBowl Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return { success: false, error }
  }
}

/**
 * Send delivery reminder
 */
export async function sendDeliveryReminder(
  email: string,
  deliveryDetails: {
    date: string
    time: string
    address: string
    items: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'HealthyBowl <noreply@healthybowl.com>',
      to: [email],
      subject: 'Delivery Reminder - Tomorrow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5016;">🍎 Delivery Reminder</h1>
          
          <p>Your HealthyBowl delivery is scheduled for tomorrow!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2d5016; margin-top: 0;">Delivery Details</h2>
            <p><strong>Date:</strong> ${deliveryDetails.date}</p>
            <p><strong>Time:</strong> ${deliveryDetails.time}</p>
            <p><strong>Address:</strong> ${deliveryDetails.address}</p>
            <p><strong>Items:</strong> ${deliveryDetails.items}</p>
          </div>
          
          <p>Please ensure someone is available to receive the delivery.</p>
          
          <p>Need to reschedule? <a href="${process.env.NEXTAUTH_URL}/dashboard">Manage your delivery</a></p>
          
          <p>Best regards,<br>The HealthyBowl Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending delivery reminder:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending delivery reminder:', error)
    return { success: false, error }
  }
}

/**
 * Send payment failure notification
 */
export async function sendPaymentFailureNotification(
  email: string,
  subscriptionDetails: {
    planName: string
    amount: number
    dueDate: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'HealthyBowl <noreply@healthybowl.com>',
      to: [email],
      subject: 'Payment Failed - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545;">⚠️ Payment Failed</h1>
          
          <p>We were unable to process your payment for your HealthyBowl subscription.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2d5016; margin-top: 0;">Payment Details</h2>
            <p><strong>Plan:</strong> ${subscriptionDetails.planName}</p>
            <p><strong>Amount:</strong> ₹${subscriptionDetails.amount}</p>
            <p><strong>Due Date:</strong> ${subscriptionDetails.dueDate}</p>
          </div>
          
          <p>Please update your payment method to continue receiving deliveries.</p>
          
          <p><a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #2d5016; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Update Payment Method</a></p>
          
          <p>Questions? Reply to this email or contact us at support@healthybowl.com</p>
          
          <p>Best regards,<br>The HealthyBowl Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending payment failure notification:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending payment failure notification:', error)
    return { success: false, error }
  }
}

/**
 * Send WhatsApp message (placeholder - requires WhatsApp Business API)
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
) {
  // This would integrate with WhatsApp Business API
  // For now, we'll just log the message
  console.log(`WhatsApp to ${phoneNumber}: ${message}`)
  
  if (process.env.ENABLE_WHATSAPP === 'true') {
    // Implement WhatsApp Business API integration here
    // const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: phoneNumber,
    //     type: 'text',
    //     text: { body: message }
    //   })
    // })
  }
  
  return { success: true }
}

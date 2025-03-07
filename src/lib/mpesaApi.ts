
// M-Pesa API integration
import axios from 'axios';

const API_KEY = '1df1102d8dae2d6d975f1d835d302d7ac752393f';

/**
 * Process M-Pesa payment by sending a payment request to the provided phone number
 * @param phoneNumber The phone number to send the payment request to
 * @param amount The amount to be paid
 * @returns Promise that resolves when the request is sent
 */
export const processMpesaPayment = async (
  phoneNumber: string,
  amount: number
): Promise<void> => {
  // Format phone number to include country code if needed
  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  console.log(`Processing payment of KSh ${amount} to ${formattedPhone} with API key ${API_KEY}`);
  
  try {
    const resp = await axios.post(
      "https://lipia-api.kreativelabske.com/api/request/stk",
      {
        phone: `0${formattedPhone.slice(3)}`, // Format phone to 07XXXXXXXX format
        amount: String(amount),
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    
    console.log('STK push response:', resp.data);
    
    if (!resp.data.success) {
      throw new Error(resp.data.message || 'Failed to process payment');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

/**
 * Format phone number to include country code if needed
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If the number starts with 0, replace it with 254
  if (digitsOnly.startsWith('0')) {
    return `254${digitsOnly.substring(1)}`;
  }
  
  // If the number doesn't have country code, add it
  if (!digitsOnly.startsWith('254')) {
    return `254${digitsOnly}`;
  }
  
  return digitsOnly;
};

/**
 * Verify a payment transaction
 * @param transactionId The transaction ID to verify
 * @returns Promise that resolves with the transaction status
 */
export const verifyPayment = async (
  transactionId: string
): Promise<{ success: boolean; message: string }> => {
  // In a real implementation, this would check the status of a transaction
  console.log(`Verifying transaction ${transactionId} with API key ${API_KEY}`);
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Payment completed successfully',
      });
    }, 1000);
  });
};

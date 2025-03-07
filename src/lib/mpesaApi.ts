
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
): Promise<{success: boolean, data?: any, message?: string}> => {
  // Format phone number to include country code if needed
  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  console.log(`Processing payment of KSh ${amount} to ${formattedPhone} with API key ${API_KEY}`);
  
  try {
    // Ensure the phone number is properly formatted according to API requirements
    // The API expects the format 07XXXXXXXX (without the country code)
    let formattedPhoneForApi = formattedPhone;
    
    // If it starts with 254, remove it and add 0
    if (formattedPhone.startsWith('254')) {
      formattedPhoneForApi = `0${formattedPhone.slice(3)}`;
    }
    
    console.log(`Sending STK push to formatted phone: ${formattedPhoneForApi}`);
    
    // Make sure we're sending the exact format expected by the API
    const resp = await axios.post(
      "https://lipia-api.kreativelabske.com/api/request/stk",
      {
        phone: formattedPhoneForApi,
        amount: String(amount)
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    
    console.log('STK push response:', resp.data);
    
    // The API returns success: false but message: "callback received successfully" when it works
    // This is a bit confusing but we need to handle it
    if (resp.data.message === "callback received successfully") {
      return {
        success: true,
        data: resp.data.data,
        message: "STK push sent successfully"
      };
    }
    
    // If not the special case above, check the actual success field
    if (!resp.data.success) {
      return {
        success: false,
        message: resp.data.message || 'Failed to process payment'
      };
    }
    
    return {
      success: true,
      data: resp.data.data,
      message: "Payment processed successfully"
    };
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while processing payment'
    };
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

/**
 * Handle QR code scanning to trigger STK push
 * This would be called from an endpoint that the QR code links to
 */
export const handleQrCodeScan = async (
  paymentData: { amount: number; reference: string }
): Promise<{success: boolean, message: string}> => {
  try {
    // In a real implementation, this function would be part of a web service
    // that the QR code URL points to. For now, we'll simulate this behavior.
    
    // We'd need the phone number from the user scanning the QR
    // For demo purposes, let's use a test phone number
    const testPhone = "0712345678";
    
    const result = await processMpesaPayment(testPhone, paymentData.amount);
    
    return {
      success: result.success,
      message: result.message || "QR code scan processed"
    };
  } catch (error: any) {
    console.error('Error handling QR code scan:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while handling QR code scan'
    };
  }
};

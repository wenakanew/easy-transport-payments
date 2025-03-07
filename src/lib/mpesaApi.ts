
// M-Pesa API integration

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
  // In a real implementation, this would make an API call to the M-Pesa API
  // For now, we'll simulate the API call with a delay
  
  // Format phone number to include country code if needed
  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  console.log(`Processing payment of KSh ${amount} to ${formattedPhone} with API key ${API_KEY}`);
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });
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

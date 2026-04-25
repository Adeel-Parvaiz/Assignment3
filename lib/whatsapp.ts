// Format phone number for WhatsApp link
// Pakistan numbers: 03001234567 → 923001234567
export function getWhatsAppLink(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');

  // Convert local Pakistan number to international format
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.slice(1);
  }

  return `https://wa.me/${cleaned}`;
}
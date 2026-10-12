// Your own details. Put the real values in the file  frontend/.env  (it is NOT uploaded to GitHub).
// Example .env lines are in  .env.example
export const BRAND_NAME = import.meta.env.VITE_BRAND_NAME || "Mara Academy";

// Country code + number, no "+" or spaces. Example: 919876543210
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919940814845";

export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "maraacademy@example.com";

// YouTube link of a "how to pay the fee" video shown on the home page (leave empty to show "coming soon")
export const PAY_VIDEO_URL = import.meta.env.VITE_PAY_VIDEO_URL || "https://youtu.be/XTgYB6_L_ss?si=U2j0blId_cFMYsgy";

export const REPLY_TIME = "10 AM to 7 PM (Indian time)";

export function getWhatsAppLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(text);
}

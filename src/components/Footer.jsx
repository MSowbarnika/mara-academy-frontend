import { BRAND_NAME, WHATSAPP_NUMBER, CONTACT_EMAIL } from "../config";

function Footer() {
  const whatsappLink =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent("Hi, I want to know more about your music classes.");

  return (
    <footer id="contact">
      <div className="footer-logo">🎵 {BRAND_NAME}</div>

      <p>Learn Music. Practice. Perform.</p>

      <div className="footer-contact">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          💬 Chat on WhatsApp
        </a>
        <a href={`mailto:${CONTACT_EMAIL}`} className="footer-email">
          ✉️ {CONTACT_EMAIL}
        </a>
      </div>

      <p className="copyright">
        © 2026 {BRAND_NAME}. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;

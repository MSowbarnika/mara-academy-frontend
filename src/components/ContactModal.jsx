import { BRAND_NAME, CONTACT_EMAIL, REPLY_TIME, getWhatsAppLink } from "../config";

// "Contact Info" popup (used on the home page and in the navbar)
function ContactModal({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Contact Info</h3>
        <p className="modal-name">{BRAND_NAME}</p>

        <a
          href={getWhatsAppLink("Hi, I want to know more about your music classes.")}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          💬 Send WhatsApp Message
        </a>

        <p className="modal-note">
          Enquiry / suggestions / queries: we reply {REPLY_TIME}.
        </p>
        <p className="modal-note">✉️ {CONTACT_EMAIL}</p>

        <button
          type="button"
          className="secondary-btn modal-close"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ContactModal;

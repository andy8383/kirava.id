/**
 * =============================================================================
 * KIRAVA CONFIGURATION FILE
 * =============================================================================
 * Seluruh kontak dan konfigurasi utama website KIRAVA diatur di file ini.
 * Jika ingin mengganti nomor WhatsApp atau email, cukup ubah nilai di bawah ini.
 * Tidak perlu mengedit kode HTML atau JavaScript di tempat lain.
 * =============================================================================
 */

// Ganti nomor WhatsApp di sini (format lokal 08xxx atau internasional 62xxx)
const WHATSAPP_NUMBER = "089504008817";

// Pesan pembuka otomatis default saat pengunjung menekan tombol WhatsApp
const WHATSAPP_DEFAULT_MESSAGE = "Halo KIRAVA, saya ingin mengetahui lebih lanjut tentang solusi KIRAVA.";

// Konfigurasi informasi kontak & profil brand
const KIRAVA_CONFIG = {
  brandName: "KIRAVA",
  domain: "kirava.id",
  websiteUrl: "https://kirava.id",
  email: "hello@kirava.id",
  
  // Nomor WhatsApp utama
  whatsappNumber: WHATSAPP_NUMBER,
  
  // Pesan default
  whatsappDefaultMessage: WHATSAPP_DEFAULT_MESSAGE,

  // Pesan khusus per produk/solusi (ketika calon klien ingin konsultasi spesifik)
  whatsappProductMessages: {
    general: WHATSAPP_DEFAULT_MESSAGE,
    farm: "Halo KIRAVA, saya tertarik dan ingin konsultasi mengenai solusi KIRAVA FARM (IoT Pertanian & Perkebunan).",
    livestock: "Halo KIRAVA, saya tertarik dan ingin konsultasi mengenai solusi KIRAVA LIVESTOCK (IoT Peternakan).",
    home: "Halo KIRAVA, saya tertarik dan ingin konsultasi mengenai solusi KIRAVA HOME (Smart Home Automation).",
    edu: "Halo KIRAVA, saya tertarik dan ingin konsultasi mengenai solusi KIRAVA EDU (Teknologi Pendidikan & AI Sekolah).",
    business: "Halo KIRAVA, saya tertarik dan ingin konsultasi mengenai solusi KIRAVA BUSINESS (Aplikasi & POS UMKM)."
  },

  /**
   * Helper untuk membuat URL WhatsApp resmi yang valid
   * Mengubah awalan '08' menjadi '628' secara otomatis untuk API wa.me
   */
  getWhatsAppUrl(topicOrMessage = "general") {
    let cleanNumber = this.whatsappNumber.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.substring(1);
    }
    
    let text = this.whatsappDefaultMessage;
    if (this.whatsappProductMessages[topicOrMessage]) {
      text = this.whatsappProductMessages[topicOrMessage];
    } else if (typeof topicOrMessage === "string" && topicOrMessage !== "general") {
      text = topicOrMessage;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  }
};

// Ekspor ke window global agar dapat diakses dari file script mana pun
if (typeof window !== "undefined") {
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  window.KIRAVA_CONFIG = KIRAVA_CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { WHATSAPP_NUMBER, KIRAVA_CONFIG };
}

/**
 * =============================================================================
 * KIRAVA (kirava.id) — Main Application JavaScript
 * Clean, lightweight, dependency-free interaction scripts with AI Neuron Effect.
 * =============================================================================
 */

(function () {
  'use strict';

  // 1. Data detail untuk masing-masing solusi KIRAVA
  const SOLUTIONS_DATA = {
    farm: {
      name: "KIRAVA FARM",
      category: "IoT Pertanian & Perkebunan",
      desc: "Monitoring dan otomatisasi untuk membantu mengelola lahan, tanaman, penyiraman, kelembapan, dan kondisi lingkungan secara presisi tanpa perlu inspeksi manual setiap saat.",
      features: [
        "Monitoring kelembapan tanah real-time",
        "Monitoring suhu & kelembapan udara",
        "Monitoring kondisi lingkungan & intensitas cahaya",
        "Otomatisasi penyiraman (smart irrigation valve)",
        "Dashboard monitoring web & mobile",
        "Notifikasi anomali via WhatsApp / Telegram"
      ],
      hardware: ["Sensor Kelembapan Kapasitif", "Sensor Suhu & Kelembapan SHT30/DHT22", "Modul ESP32 Low Power", "Solenoid Valve 12V/220V", "Panel Surya + Baterai (Opsional)"],
      waTopic: "farm"
    },
    livestock: {
      name: "KIRAVA LIVESTOCK",
      category: "IoT Peternakan",
      desc: "Teknologi monitoring untuk membantu peternak memantau kondisi kandang dan lingkungan ayam/ternak secara lebih mudah untuk mencegah stres hewan dan menekan angka kematian.",
      features: [
        "Monitoring suhu kandang 24/7",
        "Monitoring kelembapan udara kandang",
        "Monitoring kadar gas amonia (NH3)",
        "Kontrol otomatis kipas, blower & cooling pad",
        "Dashboard IoT terpadu dengan grafik riwayat",
        "Early warning system untuk lonjakan suhu ekstrem"
      ],
      hardware: ["Multi-Point Temperature Probe", "Sensor Amonia MQ-137", "Kontroler Otomasi Relai Industri", "ESP32 Industrial Gateway", "Alarm Sirene & Notifikasi HP"],
      waTopic: "livestock"
    },
    home: {
      name: "KIRAVA HOME",
      category: "Smart Home",
      desc: "Solusi rumah pintar untuk monitoring dan kontrol perangkat rumah dari satu sistem terpusat, aman, hemat energi, dan nyaman bagi seluruh keluarga.",
      features: [
        "Kontrol lampu & sakelar pintar",
        "Monitoring sensor gerak, pintu & jendela",
        "Keamanan rumah & deteksi kebocoran gas/asap",
        "Monitoring konsumsi daya listrik perangkat",
        "Otomatisasi jadwal hidup/mati peralatan",
        "Kontrol lokal & jarak jauh via smartphone"
      ],
      hardware: ["Smart Switch WiFi/Zigbee", "Sensor Kontak Pintu & Gerak PIR", "Power Metering Clamp", "Gateway Hub Pintar", "Aplikasi Mobile Terpadu"],
      waTopic: "home"
    },
    edu: {
      name: "KIRAVA EDU",
      category: "Education Technology",
      desc: "Solusi teknologi untuk membantu sekolah, guru, dan lembaga pendidikan menggunakan aplikasi dan AI dalam proses pembelajaran, evaluasi, dan administrasi sekolah yang efisien.",
      features: [
        "Aplikasi pendidikan & sistem informasi sekolah",
        "AI pendamping guru (pembuat bank soal & modul)",
        "Pengolahan data absensi & nilai siswa",
        "Rapor digital otomatis sesuai kurikulum",
        "Dashboard analitik performa kelas & sekolah",
        "Portal komunikasi sekolah dengan wali murid"
      ],
      hardware: ["Cloud LMS & Portal Web", "Mesin Absensi RFID/Biometrik (Opsional)", "AI Engine Analisis Pembelajaran", "Mobile App Siswa & Orang Tua"],
      waTopic: "edu"
    },
    business: {
      name: "KIRAVA BUSINESS",
      category: "Business & UMKM",
      desc: "Solusi aplikasi untuk membantu bisnis dan UMKM mengelola operasional, produk, transaksi, kasir, dan data bisnis agar rapi, efisien, dan siap bertumbuh.",
      features: [
        "Point of Sale (Kasir Digital) cepat & intuitif",
        "Manajemen katalog produk & kategori",
        "Manajemen stok real-time & peringatan stok menipis",
        "Pencatatan transaksi & integrasi pembayaran QRIS",
        "Laporan keuangan, omzet, & laba rugi otomatis",
        "Akses multi-cabang & multi-kasir"
      ],
      hardware: ["Aplikasi Kasir Tablet/HP/Web", "Printer Thermal Bluetooth/USB", "Dashboard Manajemen Cloud", "Integrasi Barcode Scanner"],
      waTopic: "business"
    }
  };

  // 2. Hubungkan semua tombol dan link WhatsApp secara dinamis
  function bindWhatsAppLinks() {
    if (!window.KIRAVA_CONFIG) {
      console.warn('KIRAVA_CONFIG belum terdefinisi.');
      return;
    }

    const waButtons = document.querySelectorAll('[data-wa-action="contact"]');
    waButtons.forEach(btn => {
      const topic = btn.getAttribute('data-wa-topic') || 'general';
      btn.href = window.KIRAVA_CONFIG.getWhatsAppUrl(topic);
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    });

    const phoneLabels = document.querySelectorAll('[data-wa-phone]');
    phoneLabels.forEach(el => {
      el.textContent = window.KIRAVA_CONFIG.whatsappNumber;
    });

    const emailLabels = document.querySelectorAll('[data-config-email]');
    emailLabels.forEach(el => {
      el.textContent = window.KIRAVA_CONFIG.email;
      if (el.tagName === 'A') {
        el.href = `mailto:${window.KIRAVA_CONFIG.email}`;
      }
    });
  }

  // 3. Modal Solusi KIRAVA
  function setupSolutionModals() {
    const modalOverlay = document.getElementById('solutionModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalFeaturesList = document.getElementById('modalFeaturesList');
    const modalHardwareList = document.getElementById('modalHardwareList');
    const modalWaBtn = document.getElementById('modalWaBtn');

    if (!modalOverlay) return;

    function openModal(key) {
      const data = SOLUTIONS_DATA[key];
      if (!data) return;

      modalCategory.textContent = data.category;
      modalTitle.textContent = data.name;
      modalDesc.textContent = data.desc;

      modalFeaturesList.innerHTML = '';
      data.features.forEach(f => {
        const item = document.createElement('div');
        item.className = 'modal-feature-item';
        item.innerHTML = `<span style="color: var(--primary); font-weight: bold;">✓</span> <span>${f}</span>`;
        modalFeaturesList.appendChild(item);
      });

      if (modalHardwareList) {
        modalHardwareList.innerHTML = '';
        data.hardware.forEach(h => {
          const item = document.createElement('div');
          item.className = 'modal-feature-item';
          item.innerHTML = `<span style="color: var(--accent-emerald);">●</span> <span>${h}</span>`;
          modalHardwareList.appendChild(item);
        });
      }

      if (window.KIRAVA_CONFIG && modalWaBtn) {
        modalWaBtn.href = window.KIRAVA_CONFIG.getWhatsAppUrl(data.waTopic);
        modalWaBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          Konsultasikan Solusi Ini via WhatsApp
        `;
      }

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    const viewButtons = document.querySelectorAll('[data-open-solution]');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-open-solution');
        openModal(key);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // 4. Mobile Navigation Drawer Toggle
  function setupMobileNav() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const mobileNav = document.getElementById('mobileNavDrawer');
    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.innerHTML = isOpen 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // 5. Scrollspy untuk Navbar Link aktif
  function setupScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // 6. Interactive Architecture Node Helper
  function setupArchitectureInteractivity() {
    const tags = document.querySelectorAll('.iot-hardware-tag');
    tags.forEach(tag => {
      tag.addEventListener('mouseenter', () => {
        tag.style.boxShadow = '0 6px 18px rgba(2, 132, 199, 0.2)';
      });
      tag.addEventListener('mouseleave', () => {
        tag.style.boxShadow = '';
      });
    });
  }

  // 7. EFEK AI NEURON (Lightweight, High-Performance Canvas Animation)
  function setupNeuronNetwork() {
    const canvas = document.getElementById('neuronCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let nodes = [];
    let signals = [];

    const mouse = {
      x: -1000,
      y: -1000,
      active: false
    };

    // Palet warna neuron untuk tema cerah
    const colors = [
      { r: 2, g: 132, b: 199 },   // Primary blue (#0284c7)
      { r: 14, g: 165, b: 233 },  // Light sky (#0ea5e9)
      { r: 16, g: 185, b: 129 },  // Emerald (#10b981)
      { r: 99, g: 102, b: 241 }   // Indigo (#6366f1)
    ];

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
      initNodes();
    }

    function initNodes() {
      nodes = [];
      signals = [];

      // Jumlah node proporsional: ~36 di desktop, ~20 di mobile
      const nodeCount = width < 768 ? 20 : 36;

      for (let i = 0; i < nodeCount; i++) {
        const color = colors[i % colors.length];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: 2 + Math.random() * 2,
          color: color,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02
        });
      }
    }

    // Trigger transmisi sinyal sinapsis acak
    function spawnSynapticSignal() {
      if (nodes.length < 2 || signals.length > 5) return;
      const srcIdx = Math.floor(Math.random() * nodes.length);
      let bestDst = -1;
      let minDistance = 140;

      for (let j = 0; j < nodes.length; j++) {
        if (srcIdx === j) continue;
        const dx = nodes[srcIdx].x - nodes[j].x;
        const dy = nodes[srcIdx].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          bestDst = j;
        }
      }

      if (bestDst !== -1) {
        signals.push({
          from: nodes[srcIdx],
          to: nodes[bestDst],
          progress: 0,
          speed: 0.02 + Math.random() * 0.02
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // 1. Gambar sinapsis (koneksi antar node)
      const maxDistance = 135;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Interaksi kursor
        if (mouse.active) {
          const mdx = nodes[i].x - mouse.x;
          const mdy = nodes[i].y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 140) {
            const mAlpha = (1 - mDist / 140) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // 2. Gambar sinyal potensial aksi (impulse pulsa yang berjalan)
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.progress += sig.speed;
        if (sig.progress >= 1) {
          signals.splice(s, 1);
          continue;
        }

        const curX = sig.from.x + (sig.to.x - sig.from.x) * sig.progress;
        const curY = sig.from.y + (sig.to.y - sig.from.y) * sig.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.75)';
        ctx.shadowColor = 'rgba(2, 132, 199, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Update dan gambar node (neuron bodies)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Gerak perlahan
        n.x += n.vx;
        n.y += n.vy;

        // Pantulan batas layar
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Efek denyut halus
        n.pulsePhase += n.pulseSpeed;
        const currentRadius = n.radius + Math.sin(n.pulsePhase) * 0.8;
        const alpha = 0.4 + Math.sin(n.pulsePhase) * 0.2;

        // Core neuron
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${alpha})`;
        ctx.fill();

        // Soft halo glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(2.5, currentRadius + 3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${alpha * 0.25})`;
        ctx.fill();
      }

      // Peluang trigger sinyal sinapsis
      if (Math.random() < 0.035) {
        spawnSynapticSignal();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    // Event listeners
    window.addEventListener('resize', () => {
      clearTimeout(window._neuronResizeTimer);
      window._neuronResizeTimer = setTimeout(resizeCanvas, 150);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    // Otomatis pause saat tab tidak aktif untuk menghemat daya
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(draw);
        }
      }
    });

    resizeCanvas();
    animationFrameId = requestAnimationFrame(draw);
  }

  // Inisialisasi saat DOM siap
  document.addEventListener('DOMContentLoaded', () => {
    bindWhatsAppLinks();
    setupSolutionModals();
    setupMobileNav();
    setupScrollspy();
    setupArchitectureInteractivity();
    setupNeuronNetwork();
  });

})();

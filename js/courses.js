/* =============================================
   COURSES & CERTIFICATES - courses.js
   Envelopes OPEN by default on page load
   ============================================= */

const certificatesData = [
  {
    id: 'cert1',
    title: 'C++ For C Programmers, Part A',
    org: 'University of California, Santa Cruz (via Coursera)',
    date: '30 September 2020',
    credentialId: 'Y7KVKATKWMVY',
    skills: ['C++', 'Type Conversion', 'Generic Programming', 'STL'],
    description: 'Designed for experienced C programmers, this course facilitates the transition into C++ by focusing on its object-oriented features. It covers the Standard Template Library and modern coding paradigms.',
    verifyLink: 'https://coursera.org/verify/Y7KVKATKWMVY',
    color: '#FF9900',
    image: 'assets\\Courses Certificate\\image1.png',
  },
  {
    id: 'cert2',
    title: 'Python Classes and Inheritance',
    org: 'University of Michigan (via Coursera)',
    date: '13 October 2020',
    credentialId: 'E5FYFEXQ8XVP',
    skills: ['Object-Oriented Programming (OOP)', 'Python', 'Class Inheritance', 'Code Reusability'],
    description: 'This technical course focuses on deep-level Python programming, specifically how to structure complex programs using classes. It covers inheritance and methods to create modular, scalable software.',
    verifyLink: 'https://coursera.org/verify/E5FYFEXQ8XVP',
    color: '#4285F4',
    image: 'assets\\Courses Certificate\\image2.png',
  },
  {
    id: 'cert3',
    title: 'C for Everyone: Programming Fundamentals',
    org: 'University of California, Santa Cruz (via Coursera)',
    date: '13 October 2020',
    credentialId: 'CVV3AA49H9WB',
    skills: ['C Programming', 'Algorithm Logic', 'Memory Management'],
    description: 'This course provides a comprehensive introduction to C programming, focusing on fundamental concepts and practical applications.',
    verifyLink: 'https://coursera.org/verify/CVV3AA49H9WB',
    color: '#E53E3E',
    image: 'assets\\Courses Certificate\\image3.png',
  },
  {
    id: 'cert4',
    title: 'Python Basics',
    org: 'University of Michigan (via Coursera)',
    date: '20 October 2020',
    credentialId: '64AQT2EQXTJW',
    skills: ['Python Syntax', 'Control Flow', 'Data Structures'],
    description: 'A foundational course covering the core syntax and execution flow of the Python language. It provides the essential building blocks for data science and web development.',
    verifyLink: 'https://coursera.org/verify/64AQT2EQXTJW',
    color: '#D4AF37',
    image: 'assets\\Courses Certificate\\image4.png',
  },
  {
    id: 'cert5',
    title: 'Introduction to Big Data',
    org: 'University of California San Diego (via Coursera)',
    date: '22 October 2020',
    credentialId: 'EH4WMXM48VVK',
    skills: ['Big Data Infrastructure', 'Data Analysis', 'Scalable Processing', 'Data Visualization'],
    description: 'An introductory program covering the fundamental concepts of managing and processing massive datasets. It highlights the tools and techniques required to extract insights from high-velocity data.',
    verifyLink: 'https://coursera.org/verify/EH4WMXM48VVK',
    color: '#20B2AA',
    image: 'assets\\Courses Certificate\\image5.png',
  },
  {
    id: 'cert6',
    title: 'Java Classes and Objects',
    org: 'Coursera Project Network',
    date: '26 October 2020',
    credentialId: 'CDA6JYS6AFY3N',
    skills: ['Java', 'Object-Oriented Programming (OOP)', 'Class Design', 'Encapsulation'],
    description: 'An introductory program covering the fundamental concepts of managing and processing massive datasets. It highlights the tools and techniques required to extract insights from high-velocity data.',
    verifyLink: 'https://coursera.org/verify/CDA6JYS6AFY3N',
    color: '#1BA0D7',
    image: 'assets\\Courses Certificate\\image6.png',
  },
  {
    id: 'cert7',
    title: 'Intelligent Traffic System (ITS)/ Certificate of Publication (IJRASET)',
    org: 'International Journal for Research in Applied Science & Engineering Technology, (IJRASET)',
    date: 'November 2023',
    credentialId: 'IJRASET56669 | ISSN: 2321-9653',
    skills: ['Smart City Infrastructure', 'Traffic Management Systems', 'Automation', 'Applied Science'],
    description: 'This research explores the development of an "Intelligent Traffic System" to optimize urban flow and safety. The paper was published in Volume 11, Issue XI after a rigorous peer-review process.',
    verifyLink: 'https://ijraset.com/article?manuscript=IJRASET56669',
    color: '#1BA0D7',
    image: 'assets\\Courses Certificate\\image7.jpg',
  },
  {
    id: 'cert8',
    title: 'Multimodal AI for Brain Tumor Prediction/ Certificate of Publication (IJIRT)',
    org: 'International Journal for Research in Applied Science & Engineering Technology, (IJIRT)',
    date: 'October 2025',
    credentialId: '185331 | ISSN: 2349-6002',
    skills: ['Multimodal Artificial Intelligence', 'Deep Learning', 'Medical Imaging', 'Explainable AI (XAI)'],
    description: 'This research explores the development of a "Multimodal AI" approach for predicting brain tumors. The paper was published in Volume 11, Issue XI after a rigorous peer-review process.',
    verifyLink: 'https://ijirt.org/article?manuscript=185331',
    color: '#1BA0D7',
    image: 'assets\\Courses Certificate\\image8.jpg',
  },
];

/* ═══════════════════════════════════════
   RENDER — envelopes open on load
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderCertificates();
  setupCertModals();
});

function renderCertificates() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  grid.innerHTML = certificatesData.map(cert => `
    <div class="cert-envelope open" data-id="${cert.id}" tabindex="0">
      <div class="envelope-body">

        <!-- Flap open upward -->
        <div class="envelope-flap open-flap"></div>

        <!-- Inner content -->
        <div class="cert-peek open-peek">

          <!-- Certificate image -->
          <div class="cert-img-wrap">
            ${cert.image
              ? `<img
                   src="${cert.image}"
                   alt="${cert.title}"
                   class="cert-preview-img"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                 />
                 <div class="cert-img-fallback" style="display:none;background:linear-gradient(135deg,${cert.color}22,${cert.color}08);">
                   <span style="font-size:3rem;">${cert.emoji}</span>
                 </div>`
              : `<div class="cert-img-fallback" style="background:linear-gradient(135deg,${cert.color}22,${cert.color}08);">
                   <span style="font-size:3rem;">${cert.emoji}</span>
                 </div>`
            }
          </div>

          <!-- Org badge -->
          <div class="cert-org-badge" style="color:${cert.color};border-color:${cert.color}50;background:${cert.color}12;">
            ${cert.org}
          </div>

          <!-- Title -->
          <div class="cert-peek-title">${cert.title}</div>

          <!-- Date & validity -->
          <div class="cert-validity-row">
            <span>📅 ${cert.date}</span>
            <span class="cert-dot">·</span>
            <span>⏱️ ${cert.validity}</span>
          </div>

          <!-- VIEW FULL CERTIFICATE BUTTON -->
          <button
            class="cert-view-full-btn"
            data-id="${cert.id}"
            style="
              --btn-color: ${cert.color};
              border: 2px solid ${cert.color};
              color: ${cert.color};
              background: ${cert.color}15;
            "
          >
            <span class="btn-icon">🎓</span>
            View Full Certificate
            <span class="btn-arrow">→</span>
          </button>

        </div>
        <!-- /cert-peek -->

      </div>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
function setupCertModals() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;
  const content = modal.querySelector('.cert-modal-content');

  /* Button click → open modal */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cert-view-full-btn');
    if (!btn) return;
    e.stopPropagation();
    const cert = certificatesData.find(c => c.id === btn.dataset.id);
    if (cert) {
      populateCertModal(cert, content);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  /* Hover effect on button */
  document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.cert-view-full-btn');
    if (!btn) return;
    const c = btn.style.getPropertyValue('--btn-color') ||
              btn.style.borderColor;
    btn.style.background = c;
    btn.style.color = '#fff';
  });

  document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.cert-view-full-btn');
    if (!btn) return;
    const borderColor = btn.style.borderColor;
    btn.style.background = borderColor.replace(')', ', 0.12)').replace('rgb', 'rgba');
    btn.style.color = borderColor;
  });

  /* Close modal */
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function populateCertModal(cert, container) {
  container.innerHTML = `
    <div class="cert-modal-header">

      <!-- Full certificate image -->
      <div class="cert-modal-img-container">
        ${cert.image
          ? `<img
               src="${cert.image}"
               alt="${cert.title}"
               class="cert-modal-full-img"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
             />
             <div class="cert-modal-img-fallback"
                  style="display:none;background:linear-gradient(135deg,${cert.color}18,${cert.color}08);">
               <span style="font-size:5rem;">${cert.emoji}</span>
             </div>`
          : `<div class="cert-modal-img-fallback"
                  style="background:linear-gradient(135deg,${cert.color}18,${cert.color}08);">
               <span style="font-size:5rem;">${cert.emoji}</span>
             </div>`
        }
      </div>

      <!-- Info -->
      <div class="cert-modal-info">
        <div class="cert-modal-org" style="color:${cert.color};">${cert.org}</div>
        <h2 class="cert-modal-title">${cert.title}</h2>
        <p style="font-size:.97rem;color:var(--text-secondary);line-height:1.75;">${cert.description}</p>
      </div>
    </div>

    <!-- Details -->
    <div class="cert-modal-details">
      <div class="cert-detail-item">
        <div class="cert-detail-label">Issue Date</div>
        <div class="cert-detail-value">📅 ${cert.date}</div>
      </div>
      <div class="cert-detail-item">
        <div class="cert-detail-label">Validity</div>
        <div class="cert-detail-value">⏱️ ${cert.validity}</div>
      </div>
      <div class="cert-detail-item">
        <div class="cert-detail-label">Credential ID</div>
        <div class="cert-detail-value"
             style="font-family:var(--font-mono);font-size:.8rem;">${cert.credentialId}</div>
      </div>
      <div class="cert-detail-item">
        <div class="cert-detail-label">Issuing Authority</div>
        <div class="cert-detail-value">${cert.org}</div>
      </div>
    </div>

    <!-- Skills -->
    <div style="margin-bottom:2rem;">
      <div class="cert-detail-label" style="margin-bottom:.75rem;">Skills Covered</div>
      <div class="expertise-tags">
        ${cert.skills.map(s => `<span class="expertise-tag">${s}</span>`).join('')}
      </div>
    </div>

    <!-- Verify button -->
    <a href="${cert.verifyLink}"
       target="_blank"
       rel="noopener"
       class="cert-verify-btn"
       style="background:linear-gradient(135deg,${cert.color},${cert.color}bb);">
      ✅ Verify Certificate →
    </a>
  `;
}
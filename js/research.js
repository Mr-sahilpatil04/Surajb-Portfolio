/* =============================================
   RESEARCH PAGE - research.js
   ============================================= */

// Research data
const researchData = {
  papers: [
    {
      id: 'p1',
      title: 'Deep Learning Approaches for Natural Language Processing in Educational Assessment',
      journal: 'IEEE Transactions on Learning Technologies',
      year: '2024',
      authors: 'Dr. A. R. Sharma, S. Kumar, M. Patel',
      abstract: 'This paper presents novel deep learning architectures specifically designed for automated assessment of student responses in educational environments. We explore transformer-based models and their effectiveness in evaluating subjective answers, proposing a hybrid approach that combines BERT embeddings with domain-specific fine-tuning.',
      doi: 'https://doi.org/10.1109/TLT.2024.0001',
      keywords: ['Deep Learning', 'NLP', 'Educational Technology', 'Automated Assessment'],
      citations: 28,
    },
    {
      id: 'p2',
      title: 'Machine Learning based Predictive Analytics for Student Performance',
      journal: 'Journal of Educational Data Mining',
      year: '2023',
      authors: 'Dr. A. R. Sharma, R. Singh',
      abstract: 'We propose a comprehensive machine learning framework for early identification of at-risk students by analyzing multiple data streams including academic records, attendance patterns, and engagement metrics. The model achieves 91.3% accuracy in predicting student outcomes.',
      doi: 'https://doi.org/10.5281/jedm.2023.0045',
      keywords: ['Machine Learning', 'Predictive Analytics', 'Educational Data Mining'],
      citations: 42,
    },
    {
      id: 'p3',
      title: 'Blockchain-Based Credential Verification System for Academic Institutions',
      journal: 'Computers & Education',
      year: '2023',
      authors: 'Dr. A. R. Sharma, P. Verma, K. Shah',
      abstract: 'This research introduces a decentralized credential verification system leveraging blockchain technology to combat academic fraud. The proposed system provides immutable, transparent, and instantly verifiable academic credentials across institutions worldwide.',
      doi: 'https://doi.org/10.1016/j.compedu.2023.0012',
      keywords: ['Blockchain', 'Credential Verification', 'Academic Integrity'],
      citations: 19,
    },
    {
      id: 'p4',
      title: 'IoT-Enabled Smart Campus Infrastructure: Architecture and Implementation',
      journal: 'IEEE Internet of Things Journal',
      year: '2022',
      authors: 'Dr. A. R. Sharma, N. Mehta',
      abstract: 'We present a comprehensive IoT architecture for smart campus environments, integrating sensor networks, edge computing, and cloud infrastructure to optimize resource utilization, enhance security, and improve the overall campus experience.',
      doi: 'https://doi.org/10.1109/JIOT.2022.0089',
      keywords: ['IoT', 'Smart Campus', 'Edge Computing', 'Architecture'],
      citations: 55,
    },
  ],
  patents: [
    {
      id: 'pt1',
      title: 'System and Method for Adaptive Learning Path Generation Using Reinforcement Learning',
      patentNo: 'IN202341023456',
      filingDate: '2023-03-15',
      status: 'Granted',
      inventors: 'Dr. A. R. Sharma, S. Kumar',
      abstract: 'A patented system that dynamically generates personalized learning paths for students using reinforcement learning algorithms. The system continuously adapts based on learner performance, preferences, and educational objectives to optimize learning outcomes.',
      link: 'https://ipindia.gov.in/patent/IN202341023456',
    },
    {
      id: 'pt2',
      title: 'Multi-Modal Authentication Framework for Secure Online Examination Systems',
      patentNo: 'IN202241078901',
      filingDate: '2022-07-10',
      status: 'Published',
      inventors: 'Dr. A. R. Sharma, P. Joshi, R. Gupta',
      abstract: 'An innovative multi-modal biometric authentication framework combining facial recognition, keystroke dynamics, and behavioral analysis to prevent impersonation during online examinations, ensuring academic integrity in remote assessment environments.',
      link: 'https://ipindia.gov.in/patent/IN202241078901',
    },
  ],
  copyrights: [
    {
      id: 'c1',
      title: 'EduAnalytics Pro – Learning Management Dashboard Software',
      regNo: 'SW-2024-001234',
      year: '2024',
      type: 'Computer Software',
      abstract: 'A comprehensive learning analytics dashboard providing real-time insights into student performance, engagement metrics, and predictive alerts for educators and administrators. Registered under the Copyright Act, 1957.',
      link: 'https://copyright.gov.in/SW-2024-001234',
    },
    {
      id: 'c2',
      title: 'Interactive Algorithm Visualization Toolkit',
      regNo: 'SW-2023-005678',
      year: '2023',
      type: 'Educational Software',
      abstract: 'An interactive visualization toolkit for teaching data structures and algorithms, featuring animated step-by-step execution, multiple programming language support, and integration with popular IDEs.',
      link: 'https://copyright.gov.in/SW-2023-005678',
    },
    {
      id: 'c3',
      title: 'Curriculum Design Framework for Outcome-Based Education',
      regNo: 'LW-2023-009012',
      year: '2023',
      type: 'Literary Work',
      abstract: 'A comprehensive framework document and methodology for designing outcome-based curriculum, including templates, rubrics, assessment strategies, and implementation guidelines for engineering education.',
      link: 'https://copyright.gov.in/LW-2023-009012',
    },
  ],
  projects: [
    {
      id: 'pr1',
      title: 'AI-Powered Proctoring System for Online Exams (DST Funded)',
      fundingAgency: 'Department of Science & Technology, Govt. of India',
      amount: '₹28.5 Lakhs',
      duration: '2022–2025',
      status: 'Ongoing',
      abstract: 'A DST-funded research project developing an AI-based proctoring system using computer vision and behavioral analysis to ensure academic integrity in online examinations. The project involves development, testing, and deployment across 5 universities.',
      link: 'https://dst.gov.in/project/AI-Proctoring-2022',
    },
    {
      id: 'pr2',
      title: 'Smart Irrigation System Using IoT and ML for Farmers',
      fundingAgency: 'National Agricultural Science Fund (NASF)',
      amount: '₹15 Lakhs',
      duration: '2021–2023',
      status: 'Completed',
      abstract: 'An IoT and ML-based smart irrigation system designed to optimize water usage in agriculture. The system uses soil moisture sensors, weather prediction models, and automated irrigation controls to reduce water consumption by 40% while improving crop yield.',
      link: 'https://nasf.gov.in/project/smart-irrigation-2021',
    },
    {
      id: 'pr3',
      title: 'Cybersecurity Framework for Critical Infrastructure Protection',
      fundingAgency: 'MEITY, Government of India',
      amount: '₹45 Lakhs',
      duration: '2023–2026',
      status: 'Ongoing',
      abstract: 'A MEITY-funded project developing comprehensive cybersecurity frameworks and tools for protecting critical national infrastructure, including power grids, water treatment facilities, and transportation systems.',
      link: 'https://meity.gov.in/project/cyber-infra-2023',
    },
  ],
  fdps: [
    {
      id: 'f1',
      title: 'NPTEL Faculty Development Program on Machine Learning',
      organizer: 'IIT Madras / NPTEL',
      duration: '4 Weeks',
      date: 'June 2024',
      mode: 'Online',
      abstract: 'Comprehensive 4-week faculty development program covering supervised and unsupervised learning, deep learning architectures, and practical implementation using Python and TensorFlow.',
      certLink: '#',
    },
    {
      id: 'f2',
      title: 'Workshop on Outcome-Based Education (OBE) & NBA Accreditation',
      organizer: 'AICTE-ISTE',
      duration: '5 Days',
      date: 'January 2024',
      mode: 'Offline',
      abstract: 'An intensive 5-day workshop on implementing outcome-based education frameworks, NBA accreditation process, curriculum mapping, and attainment calculation methodologies.',
      certLink: '#',
    },
    {
      id: 'f3',
      title: 'Advanced Workshop on Cloud Computing and DevOps',
      organizer: 'AWS / NASSCOM',
      duration: '3 Days',
      date: 'September 2023',
      mode: 'Hybrid',
      abstract: 'Hands-on workshop covering AWS cloud architecture, containerization with Docker/Kubernetes, CI/CD pipelines, and DevOps best practices for academic and industry applications.',
      certLink: '#',
    },
    {
      id: 'f4',
      title: 'Research Methodology and Academic Writing Program',
      organizer: 'UGC-HRDC, Savitribai Phule Pune University',
      duration: '3 Weeks',
      date: 'March 2023',
      mode: 'Offline',
      abstract: 'A UGC-sponsored 3-week program covering research methodology, literature review, statistical analysis, academic paper writing, and publication ethics for faculty members.',
      certLink: '#',
    },
    {
      id: 'f5',
      title: 'Cyber Security and Ethical Hacking – Faculty Training Program',
      organizer: 'EC-Council / C|EH',
      duration: '2 Weeks',
      date: 'November 2022',
      mode: 'Online',
      abstract: 'Professional training program covering penetration testing methodologies, vulnerability assessment, network security, and ethical hacking techniques recognized by EC-Council.',
      certLink: '#',
    },
  ],
};

// Initialize tabs
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.research-tab-btn');
  const panels = document.querySelectorAll('.research-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  if (tabBtns.length > 0) tabBtns[0].click();

  renderResearch();
  setupResearchModals();
});

function renderResearch() {
  // Papers
  const papersGrid = document.querySelector('#panel-papers .research-grid');
  if (papersGrid) {
    papersGrid.innerHTML = researchData.papers.map(p => `
      <div class="research-card reveal" data-id="${p.id}" data-type="paper">
        <div class="research-card-type type-paper">📄 Publication</div>
        <div class="research-card-title">${p.title}</div>
        <div class="research-card-meta">${p.journal} • ${p.year} • Cited: ${p.citations}</div>
        <div class="research-card-abstract">${p.abstract}</div>
        <div class="research-card-footer">
          <span class="research-card-year">${p.authors.split(',')[0]}...</span>
          <span class="research-card-arrow">→</span>
        </div>
      </div>
    `).join('');
  }

  // Patents
  const patentsGrid = document.querySelector('#panel-patents .research-grid');
  if (patentsGrid) {
    patentsGrid.innerHTML = researchData.patents.map(p => `
      <div class="research-card reveal" data-id="${p.id}" data-type="patent">
        <div class="research-card-type type-patent">🔐 Patent</div>
        <div class="research-card-title">${p.title}</div>
        <div class="research-card-meta">No: ${p.patentNo} • Filed: ${p.filingDate}</div>
        <div class="research-card-abstract">${p.abstract}</div>
        <div class="research-card-footer">
          <span class="research-card-year badge">${p.status}</span>
          <span class="research-card-arrow">→</span>
        </div>
      </div>
    `).join('');
  }

  // Copyrights
  const copyGrid = document.querySelector('#panel-copyrights .research-grid');
  if (copyGrid) {
    copyGrid.innerHTML = researchData.copyrights.map(c => `
      <div class="research-card reveal" data-id="${c.id}" data-type="copyright">
        <div class="research-card-type type-copyright">©️ Copyright</div>
        <div class="research-card-title">${c.title}</div>
        <div class="research-card-meta">Reg. No: ${c.regNo} • ${c.year}</div>
        <div class="research-card-abstract">${c.abstract}</div>
        <div class="research-card-footer">
          <span class="research-card-year">${c.type}</span>
          <span class="research-card-arrow">→</span>
        </div>
      </div>
    `).join('');
  }

  // Projects
  const projGrid = document.querySelector('#panel-projects .research-grid');
  if (projGrid) {
    projGrid.innerHTML = researchData.projects.map(p => `
      <div class="research-card reveal" data-id="${p.id}" data-type="project">
        <div class="research-card-type type-project">🔬 Project</div>
        <div class="research-card-title">${p.title}</div>
        <div class="research-card-meta">${p.fundingAgency} • ${p.amount}</div>
        <div class="research-card-abstract">${p.abstract}</div>
        <div class="research-card-footer">
          <span class="research-card-year badge">${p.status}</span>
          <span class="research-card-arrow">→</span>
        </div>
      </div>
    `).join('');
  }

  // FDPs
  const fdpList = document.querySelector('#panel-fdp .fdp-grid');
  if (fdpList) {
    fdpList.innerHTML = researchData.fdps.map((f, i) => `
      <div class="fdp-card reveal" data-id="${f.id}" data-type="fdp">
        <div class="fdp-number">${String(i+1).padStart(2,'0')}</div>
        <div class="fdp-info">
          <div class="fdp-title">${f.title}</div>
          <div class="fdp-meta">${f.organizer} • ${f.date} • ${f.duration} • ${f.mode}</div>
        </div>
        <a href="${f.certLink}" class="fdp-cert-btn" target="_blank" rel="noopener">🎓 Certificate</a>
      </div>
    `).join('');
  }
}

function setupResearchModals() {
  const modal = document.getElementById('research-modal');
  if (!modal) return;
  const modalContent = modal.querySelector('.research-modal-content');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.research-card');
    if (!card || card.classList.contains('fdp-card')) return;

    const id = card.dataset.id;
    const type = card.dataset.type;
    
    let item;
    if (type === 'paper') item = researchData.papers.find(p => p.id === id);
    else if (type === 'patent') item = researchData.patents.find(p => p.id === id);
    else if (type === 'copyright') item = researchData.copyrights.find(c => c.id === id);
    else if (type === 'project') item = researchData.projects.find(p => p.id === id);

    if (item) {
      populateResearchModal(item, type, modalContent);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

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

function populateResearchModal(item, type, container) {
  const typeLabels = {
    paper: { label: '📄 Publication', cls: 'type-paper' },
    patent: { label: '🔐 Patent', cls: 'type-patent' },
    copyright: { label: '©️ Copyright', cls: 'type-copyright' },
    project: { label: '🔬 Research Project', cls: 'type-project' },
  };

  const meta = {
    paper: `<div class="research-modal-meta-item">📰 <strong>${item.journal}</strong></div>
            <div class="research-modal-meta-item">👥 ${item.authors}</div>
            <div class="research-modal-meta-item">📅 ${item.year}</div>
            <div class="research-modal-meta-item">📊 Cited: ${item.citations} times</div>`,
    patent: `<div class="research-modal-meta-item">🔢 No: <strong>${item.patentNo}</strong></div>
             <div class="research-modal-meta-item">📅 Filed: ${item.filingDate}</div>
             <div class="research-modal-meta-item">👥 ${item.inventors}</div>
             <div class="research-modal-meta-item">✅ Status: <strong>${item.status}</strong></div>`,
    copyright: `<div class="research-modal-meta-item">🔢 Reg: <strong>${item.regNo}</strong></div>
                <div class="research-modal-meta-item">📅 Year: ${item.year}</div>
                <div class="research-modal-meta-item">📋 Type: ${item.type}</div>`,
    project: `<div class="research-modal-meta-item">🏛️ <strong>${item.fundingAgency}</strong></div>
              <div class="research-modal-meta-item">💰 Grant: ${item.amount}</div>
              <div class="research-modal-meta-item">📅 ${item.duration}</div>
              <div class="research-modal-meta-item">✅ ${item.status}</div>`,
  };

  container.innerHTML = `
    <div class="research-modal-badge">
      <span class="research-card-type ${typeLabels[type].cls}">${typeLabels[type].label}</span>
    </div>
    <h2 class="research-modal-title">${item.title}</h2>
    <div class="research-modal-meta">${meta[type]}</div>
    <div class="research-modal-abstract">
      <h4>Abstract / Description</h4>
      <p>${item.abstract}</p>
    </div>
    ${item.keywords ? `<div class="research-card-footer" style="padding-top:0; border:none; flex-wrap:wrap; gap:0.5rem;">
      ${item.keywords.map(k => `<span class="timeline-tag">${k}</span>`).join('')}
    </div>` : ''}
    <div style="margin-top:2rem;">
      <a href="${item.doi || item.link}" target="_blank" rel="noopener" class="research-modal-link">
        🔗 View Full ${type === 'paper' ? 'Paper' : type === 'patent' ? 'Patent' : type === 'copyright' ? 'Registration' : 'Project'} →
      </a>
    </div>
  `;
}

// script.js - Simple, powerful logic for everyone

// Global state
let appData = JSON.parse(JSON.stringify(defaultData));
let currentStep = 1;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  setupSkillInput();
  addExperienceField(); // Add one by default
  addEducationField();  // Add one by default
  setupTabSwitching();
});

// ===== STEP NAVIGATION =====
function nextStep(step) {
  // Validate Step 1
  if (step === 2 && currentStep === 1) {
    if (!validateStep1()) return;
    collectFormData();
  }
  
  // Validate Step 2
  if (step === 3 && currentStep === 2) {
    const jd = document.getElementById('jobDescription').value.trim();
    if (jd.length < 50) {
      alert('Please paste a complete job description (at least 50 characters) for best results.');
      return;
    }
  }

  // Update UI
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
  
  currentStep = step;
  
  // Auto-scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const required = ['fullName', 'jobTitle', 'email'];
  for (let id of required) {
    const val = document.getElementById(id).value.trim();
    if (!val) {
      alert(`Please fill in your ${id.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      document.getElementById(id).focus();
      return false;
    }
  }
  return true;
}

function collectFormData() {
  // Personal info
  appData.personal = {
    fullName: document.getElementById('fullName').value.trim(),
    jobTitle: document.getElementById('jobTitle').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    location: document.getElementById('location').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim()
  };
  
  // Summary
  appData.summary = document.getElementById('summary').value.trim();
  
  // Skills (from hidden input)
  appData.skills = JSON.parse(document.getElementById('skillsData').value || '[]');
  
  // Experience
  appData.experience = [];
  document.querySelectorAll('.experience-item').forEach(item => {
    const role = item.querySelector('.job-title').value.trim();
    const company = item.querySelector('.company').value.trim();
    if (role && company) {
      appData.experience.push({
        role,
        company,
        date: item.querySelector('.job-date').value.trim(),
        details: item.querySelector('.job-details').value.trim()
      });
    }
  });
  
  // Education
  appData.education = [];
  document.querySelectorAll('.education-item').forEach(item => {
    const degree = item.querySelector('.degree').value.trim();
    const school = item.querySelector('.school').value.trim();
    if (degree && school) {
      appData.education.push({
        degree,
        school,
        year: item.querySelector('.edu-date').value.trim()
      });
    }
  });
}

// ===== SKILLS TAG INPUT =====
function setupSkillInput() {
  const input = document.getElementById('skillInput');
  const list = document.getElementById('skillsList');
  const hidden = document.getElementById('skillsData');
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      const skill = input.value.trim();
      let skills = JSON.parse(hidden.value || '[]');
      
      if (!skills.includes(skill)) {
        skills.push(skill);
        hidden.value = JSON.stringify(skills);
        renderSkillTag(skill, skills);
      }
      input.value = '';
    }
  });
  
  // Initial render if config has skills
  if (appData.skills.length) {
    appData.skills.forEach(skill => renderSkillTag(skill, appData.skills));
  }
}

function renderSkillTag(skill, skillsArray) {
  const list = document.getElementById('skillsList');
  const tag = document.createElement('div');
  tag.className = 'skill-tag';
  tag.innerHTML = `
    ${skill} 
    <button type="button" onclick="removeSkill('${skill}')">×</button>
  `;
  list.appendChild(tag);
}

function removeSkill(skill) {
  let skills = JSON.parse(document.getElementById('skillsData').value || '[]');
  skills = skills.filter(s => s !== skill);
  document.getElementById('skillsData').value = JSON.stringify(skills);
  
  // Re-render tags
  document.getElementById('skillsList').innerHTML = '';
  skills.forEach(s => renderSkillTag(s, skills));
}

// ===== DYNAMIC FIELDS =====
function addExperienceField() {
  const template = document.getElementById('experienceTemplate');
  const clone = template.content.cloneNode(true);
  document.getElementById('experienceList').appendChild(clone);
}

function addEducationField() {
  const template = document.getElementById('educationTemplate');
  const clone = template.content.cloneNode(true);
  document.getElementById('educationList').appendChild(clone);
}

function removeField(btn) {
  btn.closest('.experience-item, .education-item').remove();
}

// ===== JOB DESCRIPTION ANALYZER =====
function analyzeAndGenerate() {
  const jd = document.getElementById('jobDescription').value.trim();
  appData.jobDescription = jd;
  
  // Extract keywords (simple but effective)
  const keywords = extractKeywords(jd);
  appData.matchedKeywords = keywords;
  
  // Calculate match score
  const userSkills = appData.skills.map(s => s.toLowerCase());
  const matched = keywords.filter(k => userSkills.some(us => us.includes(k) || k.includes(us)));
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
  
  // Show analysis
  document.getElementById('analysisResult').style.display = 'block';
  document.getElementById('matchScore').textContent = score;
  
  const tagContainer = document.getElementById('keywordTags');
  tagContainer.innerHTML = '';
  keywords.forEach(kw => {
    const isMatch = matched.includes(kw);
    const tag = document.createElement('div');
    tag.className = `skill-tag ${isMatch ? '' : 'unmatched'}`;
    tag.style.background = isMatch ? '#dcfce7' : '#fef3c7';
    tag.style.color = isMatch ? '#166534' : '#92400e';
    tag.textContent = kw;
    tagContainer.appendChild(tag);
  });
  
  // Generate documents
  generateResume();
  generateCV();
  
  // Go to preview
  nextStep(3);
}

function extractKeywords(text) {
  // Simple keyword extraction:
  // 1. Convert to lowercase, remove punctuation
  // 2. Filter common words
  // 3. Match against known ATS keywords + extract frequent nouns
  
  const clean = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ');
    
  const words = clean.split(' ');
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);
  
  // Get candidate keywords (4+ chars, not stop word)
  const candidates = words.filter(w => w.length >= 4 && !stopWords.has(w));
  
  // Count frequency
  const freq = {};
  candidates.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  // Get known ATS keywords that appear
  const allKnown = Object.values(ATS_KEYWORDS).flat();
  const knownMatches = allKnown.filter(kw => clean.includes(kw));
  
  // Get top frequent words (not in known) as bonus keywords
  const frequent = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w)
    .filter(w => !knownMatches.includes(w));
  
  // Combine, dedupe, limit to 15
  const keywords = [...new Set([...knownMatches, ...frequent])].slice(0, 15);
  
  return keywords;
}

// ===== DOCUMENT GENERATION =====
function generateResume() {
  const data = { ...appData };
  
  // Tailor content with keywords
  const tailoredSummary = tailorContent(data.summary, data.matchedKeywords);
  const tailoredExperience = data.experience.map(exp => ({
    ...exp,
    details: tailorContent(exp.details, data.matchedKeywords)
  }));
  
  // Simple template rendering (no external lib)
  let html = RESUME_TEMPLATE.header
    .replace('{{fullName}}', data.personal.fullName)
    .replace('{{jobTitle}}', data.personal.jobTitle)
    .replace('{{email}}', data.personal.email)
    .replace('{{phone}}', data.personal.phone ? `| ${data.personal.phone}` : '')
    .replace('{{location}}', data.personal.location ? `| ${data.personal.location}` : '')
    .replace('{{linkedin}}', data.personal.linkedin ? `| ${data.personal.linkedin}` : '');
  
  html += RESUME_TEMPLATE.summary.replace('{{summary}}', tailoredSummary);
  
  html += RESUME_TEMPLATE.skills
    .replace('{{skills}}', data.skills.join(', '));
  
  html += RESUME_TEMPLATE.experience.replace('{{#each experience}}', '')
    .replace('{{/each}}', '')
    .replace(/{{role}}/g, '') // Will replace per item below
    .replace(/{{company}}/g, '')
    .replace(/{{date}}/g, '')
    .replace(/{{details}}/g, '');
  
  // Manual experience loop (simple approach)
  const expContainer = document.createElement('div');
  tailoredExperience.forEach(job => {
    expContainer.innerHTML += `
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>${job.role}</span><span>${job.date}</span>
        </div>
        <div style="font-style:italic">${job.company}</div>
        <p class="job-details">${job.details}</p>
      </div>
    `;
  });
  html = html.replace(RESUME_TEMPLATE.experience, `
    <section class="doc-section">
      <h3>Professional Experience</h3>
      ${expContainer.innerHTML}
    </section>
  `);
  
  // Education
  let eduHTML = '';
  data.education.forEach(edu => {
    eduHTML += `
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>${edu.degree}</span><span>${edu.year}</span>
        </div>
        <div style="font-style:italic">${edu.school}</div>
      </div>
    `;
  });
  html += RESUME_TEMPLATE.education
    .replace('{{#each education}}', '')
    .replace('{{/each}}', '')
    .replace(/{{degree}}/g, '')
    .replace(/{{school}}/g, '')
    .replace(/{{year}}/g, '')
    .replace(/<section class="doc-section">[\s\S]*?<\/section>/, `
      <section class="doc-section">
        <h3>Education</h3>
        ${eduHTML}
      </section>
    `);
  
  document.getElementById('resumeDocument').innerHTML = html;
}

function generateCV() {
  // Similar to resume but with CV template and more detail
  const data = { ...appData };
  
  let html = CV_TEMPLATE.header
    .replace('{{fullName}}', data.personal.fullName)
    .replace('{{jobTitle}}', data.personal.jobTitle)
    .replace('{{email}}', data.personal.email)
    .replace('{{phone}}', data.personal.phone ? `| ${data.personal.phone}` : '')
    .replace('{{location}}', data.personal.location ? `| ${data.personal.location}` : '')
    .replace('{{linkedin}}', data.personal.linkedin ? `| ${data.personal.linkedin}` : '');
  
  html += CV_TEMPLATE.summary.replace('{{summary}}', data.summary);
  
  // Skills as grid
  let skillsHTML = '';
  data.skills.forEach(skill => {
    skillsHTML += `<div>• ${highlightKeywords(skill, data.matchedKeywords)}</div>`;
  });
  html += CV_TEMPLATE.skills
    .replace('{{#each skillsArray}}', '')
    .replace('{{/each}}', '')
    .replace('{{this}}', '')
    .replace('<div class="skills-grid">\n        \n      </div>', `<div class="skills-grid">${skillsHTML}</div>`);
  
  // Experience (more detailed)
  let expHTML = '';
  data.experience.forEach(job => {
    expHTML += `
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:11pt">
          <span>${job.role}</span><span>${job.date}</span>
        </div>
        <div style="font-style:italic;margin-bottom:0.3rem">${job.company}</div>
        <p class="job-details">${highlightKeywords(job.details, data.matchedKeywords)}</p>
      </div>
    `;
  });
  html += `<section class="doc-section"><h3>Professional Experience</h3>${expHTML}</section>`;
  
  // Education
  let eduHTML = '';
  data.education.forEach(edu => {
    eduHTML += `
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>${edu.degree}</span><span>${edu.year}</span>
        </div>
        <div style="font-style:italic">${edu.school}</div>
      </div>
    `;
  });
  html += `<section class="doc-section"><h3>Education & Certifications</h3>${eduHTML}</section>`;
  
  document.getElementById('cvDocument').innerHTML = html;
}

// ===== KEYWORD TAILORING HELPERS =====
function tailorContent(text, keywords) {
  if (!text) return '';
  return highlightKeywords(text, keywords);
}

function highlightKeywords(text, keywords) {
  if (!keywords || !keywords.length) return text;
  
  let result = text;
  keywords.forEach(kw => {
    // Simple case-insensitive replacement with highlight span
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    result = result.replace(regex, match => 
      `<span class="keyword-match">${match}</span>`
    );
  });
  return result;
}

// ===== TAB SWITCHING FOR PREVIEW =====
function setupTabSwitching() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.preview-panel').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById(`${tab}Preview`).classList.add('active');
    });
  });
}

// ===== PDF DOWNLOAD =====
function downloadPDF(type) {
  const element = document.getElementById(type === 'resume' ? 'resumeDocument' : 'cvDocument');
  const name = appData.personal.fullName.replace(/\s+/g, '_');
  const filename = `${name}_${type === 'resume' ? 'Resume' : 'CV'}.pdf`;
  
  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Show loading state
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  btn.disabled = true;
  
  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
}

// ===== UTILITY: Show/Hide Steps =====
// (Already handled in nextStep function)

// script.js - Complete application logic

// ===== GLOBAL STATE =====
let appData = JSON.parse(JSON.stringify(defaultData));
let currentStep = 1;
let uploadMode = false; // Track if user uploaded or filled manually

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  setupUploadHandlers();
  setupSkillInput();
  addExperienceField();
  addEducationField();
  setupTabSwitching();
  
  // Show manual form by default (user can choose upload)
  document.getElementById('manualForm').style.display = 'block';
  document.getElementById('uploadSection').querySelector('.divider').style.display = 'none';
  document.getElementById('uploadSection').querySelector('button.btn-text').style.display = 'none';
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
      showAlert('Please paste a complete job description (at least 50 characters) for best results.', 'warning');
      return;
    }
  }

  // Update UI
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  
  document.querySelectorAll('.step').forEach(el => {
    el.classList.remove('active', 'completed');
    if (parseInt(el.dataset.step) < step) {
      el.classList.add('completed');
    }
    if (parseInt(el.dataset.step) === step) {
      el.classList.add('active');
    }
  });
  
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const required = ['fullName', 'jobTitle', 'email'];
  for (let id of required) {
    const val = document.getElementById(id).value.trim();
    if (!val) {
      const fieldName = id.replace(/([A-Z])/g, ' $1').toLowerCase();
      showAlert(`Please fill in your ${fieldName}`, 'error');
      document.getElementById(id).focus();
      document.getElementById(id).classList.add('error');
      return false;
    }
    document.getElementById(id).classList.remove('error');
  }
  return true;
}

function collectFormData() {
  appData.personal = {
    fullName: document.getElementById('fullName').value.trim(),
    jobTitle: document.getElementById('jobTitle').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    location: document.getElementById('location').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim()
  };
  
  appData.summary = document.getElementById('summary').value.trim();
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

// ===== FILE UPLOAD HANDLERS =====
function setupUploadHandlers() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  
  // Click to upload
  dropZone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'LABEL') {
      fileInput.click();
    }
  });
  
  // Drag & drop effects
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.add('dragover');
      document.body.classList.add('dragging');
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('dragover');
      document.body.classList.remove('dragging');
    }, false);
  });
  
  // Handle file drop
  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length) handleFileSelect(files[0]);
  }, false);
  
  // Handle file input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileSelect(e.target.files[0]);
  });
}

async function handleFileSelect(file) {
  const fileInfo = document.getElementById('fileInfo');
  const uploadResult = document.getElementById('uploadResult');
  const extractedPreview = document.getElementById('extractedPreview');
  
  // Validate file type
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();
  const isValidType = PARSING_RULES.allowedTypes.includes(file.type) || 
                      PARSING_RULES.allowedExtensions.includes(fileExt);
  const isValidSize = file.size <= PARSING_RULES.maxFileSize;
  
  if (!isValidType) {
    showAlert('Please upload a PDF, DOCX, or TXT file.', 'error');
    return;
  }
  
  if (!isValidSize) {
    showAlert('File too large. Please upload a file under 10MB.', 'error');
    return;
  }
  
  // Show loading
  fileInfo.innerHTML = `<span class="loading">${UI_MESSAGES.parsing}</span>`;
  
  try {
    let text = '';
    
    if (file.type === 'text/plain' || fileExt === '.txt') {
      text = await readTextFile(file);
    } else if (file.type === 'application/pdf' || fileExt === '.pdf') {
      text = await parsePDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileExt === '.docx') {
      text = await parseDOCX(file);
    }
    
    const parsedData = parseResumeText(text);
    extractedPreview.innerHTML = formatExtractedPreview(parsedData);
    uploadResult.style.display = 'block';
    fileInfo.textContent = `✓ ${file.name} (${formatFileSize(file.size)})`;
    
    window.extractedData = { raw: text, parsed: parsedData };
    uploadMode = true;
    
  } catch (error) {
    console.error('Parse error:', error);
    fileInfo.innerHTML = `<span style="color:${getCSSVar('--danger')}">${UI_MESSAGES.uploadError}</span>`;
    showAlert(`${UI_MESSAGES.uploadError} ${error.message}`, 'error');
  }
}

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  
  return text;
}

async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function parseResumeText(text) {
  const data = { ...defaultData };
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  // Extract email
  const emails = text.match(PARSING_RULES.patterns.email);
  if (emails && emails[0]) data.personal.email = emails[0];
  
  // Extract phone
  const phones = text.match(PARSING_RULES.patterns.phone);
  if (phones && phones[0]) data.personal.phone = phones[0].trim();
  
  // Extract LinkedIn
  const linkedins = text.match(PARSING_RULES.patterns.linkedin);
  if (linkedins && linkedins[0]) data.personal.linkedin = linkedins[0];
  
  // Try to extract name (first non-empty line that's not contact info)
  for (let line of lines) {
    if (line.length > 2 && line.length < 50 && 
        !line.match(PARSING_RULES.patterns.email) &&
        !line.match(PARSING_RULES.patterns.phone) &&
        !line.match(/\d{4}/)) {
      data.personal.fullName = line;
      // Try to extract job title from same line or next line
      const titleMatch = line.match(new RegExp(PARSING_RULES.commonTitles.join('|'), 'i'));
      if (titleMatch) {
        data.personal.jobTitle = line;
      }
      break;
    }
  }
  
  // Extract skills
  const lowerText = text.toLowerCase();
  const foundSkills = PARSING_RULES.knownSkills.filter(skill => 
    lowerText.includes(skill.toLowerCase())
  );
  if (foundSkills.length) {
    data.skills = [...new Set(foundSkills)].slice(0, 15);
  }
  
  // Extract summary (first substantial paragraph)
  const paragraphs = text.split(/\n\n+/);
  for (let para of paragraphs) {
    if (para.length > 100 && para.length < 500) {
      data.summary = para.trim();
      break;
    }
  }
  
  // Fallback: put raw text in summary
  if (!data.summary && text.length > 100) {
    data.summary = text.substring(0, 500) + '...';
  }
  
  return data;
}

function formatExtractedPreview(data) {
  const items = [];
  
  if (data.personal.fullName) items.push(`<strong>Name:</strong> ${data.personal.fullName}`);
  if (data.personal.email) items.push(`<strong>Email:</strong> ${data.personal.email}`);
  if (data.personal.phone) items.push(`<strong>Phone:</strong> ${data.personal.phone}`);
  if (data.skills.length) {
    items.push(`<strong>Skills Found:</strong> ${data.skills.slice(0, 5).join(', ')}${data.skills.length > 5 ? '...' : ''}`);
  }
  if (data.summary) {
    items.push(`<strong>Summary:</strong> ${data.summary.substring(0, 150)}...`);
  }
  
  return items.length 
    ? items.map(i => `<p>${i}</p>`).join('') 
    : '<p><em>No structured data extracted. Raw text will be available for editing.</em></p>';
}

function confirmUpload() {
  if (!window.extractedData) return;
  
  const parsed = window.extractedData.parsed;
  
  if (parsed.personal.fullName) document.getElementById('fullName').value = parsed.personal.fullName;
  if (parsed.personal.email) document.getElementById('email').value = parsed.personal.email;
  if (parsed.personal.phone) document.getElementById('phone').value = parsed.personal.phone;
  if (parsed.personal.linkedin) document.getElementById('linkedin').value = parsed.personal.linkedin;
  if (parsed.summary) document.getElementById('summary').value = parsed.summary;
  
  if (parsed.skills.length) {
    document.getElementById('skillsData').value = JSON.stringify(parsed.skills);
    parsed.skills.forEach(skill => renderSkillTag(skill, parsed.skills));
  }
  
  document.getElementById('uploadSection').style.display = 'none';
  document.getElementById('manualForm').style.display = 'block';
  
  setupSkillInput();
  addExperienceField();
  addEducationField();
}

function resetUpload() {
  document.getElementById('uploadResult').style.display = 'none';
  document.getElementById('fileInfo').textContent = '';
  document.getElementById('fileInput').value = '';
  skipUpload();
}

function skipUpload() {
  document.getElementById('uploadSection').style.display = 'none';
  document.getElementById('manualForm').style.display = 'block';
  
  setupSkillInput();
  addExperienceField();
  addEducationField();
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
  
  if (appData.skills.length) {
    appData.skills.forEach(skill => renderSkillTag(skill, appData.skills));
  }
}

function renderSkillTag(skill, skillsArray) {
  const list = document.getElementById('skillsList');
  const tag = document.createElement('div');
  tag.className = 'skill-tag';
  tag.innerHTML = `${skill} <button type="button" onclick="removeSkill('${skill}')">×</button>`;
  list.appendChild(tag);
}

function removeSkill(skill) {
  let skills = JSON.parse(document.getElementById('skillsData').value || '[]');
  skills = skills.filter(s => s !== skill);
  document.getElementById('skillsData').value = JSON.stringify(skills);
  
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
  
  const keywords = extractKeywords(jd);
  appData.matchedKeywords = keywords;
  
  const userSkills = appData.skills.map(s => s.toLowerCase());
  const matched = keywords.filter(k => 
    userSkills.some(us => us.includes(k) || k.includes(us))
  );
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
  
  document.getElementById('analysisResult').style.display = 'block';
  document.getElementById('matchScore').textContent = score;
  
  const tagContainer = document.getElementById('keywordTags');
  tagContainer.innerHTML = '';
  keywords.forEach(kw => {
    const isMatch = matched.includes(kw);
    const tag = document.createElement('div');
    tag.className = `skill-tag ${isMatch ? 'matched' : 'unmatched'}`;
    tag.textContent = kw;
    tagContainer.appendChild(tag);
  });
  
  // Show match feedback
  if (score >= 80) {
    showAlert(UI_MESSAGES.matchScoreHigh, 'success');
  } else if (score >= 50) {
    showAlert(UI_MESSAGES.matchScoreMedium, 'warning');
  } else {
    showAlert(UI_MESSAGES.matchScoreLow, 'info');
  }
  
  generateResume();
  generateCV();
  
  nextStep(3);
}

function extractKeywords(text) {
  const clean = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ');
    
  const words = clean.split(' ');
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 
    'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just'
  ]);
  
  const candidates = words.filter(w => w.length >= 4 && !stopWords.has(w));
  
  const freq = {};
  candidates.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  const allKnown = Object.values(ATS_KEYWORDS).flat();
  const knownMatches = allKnown.filter(kw => clean.includes(kw));
  
  const frequent = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w)
    .filter(w => !knownMatches.includes(w));
  
  const keywords = [...new Set([...knownMatches, ...frequent])].slice(0, 15);
  
  return keywords;
}

// ===== DOCUMENT GENERATION =====
function generateResume() {
  const data = { ...appData };
  
  const tailoredSummary = tailorContent(data.summary, data.matchedKeywords);
  const tailoredExperience = data.experience.map(exp => ({
    ...exp,
    details: tailorContent(exp.details, data.matchedKeywords)
  }));
  
  // Build header
  let html = RESUME_TEMPLATE.header
    .replace('{{fullName}}', data.personal.fullName)
    .replace('{{jobTitle}}', data.personal.jobTitle)
    .replace('{{email}}', data.personal.email)
    .replace('{{phone}}', data.personal.phone ? ` | ${data.personal.phone}` : '')
    .replace('{{location}}', data.personal.location ? ` | ${data.personal.location}` : '')
    .replace('{{linkedin}}', data.personal.linkedin ? ` | ${data.personal.linkedin}` : '');
  
  html += RESUME_TEMPLATE.summary.replace('{{summary}}', tailoredSummary);
  
  html += RESUME_TEMPLATE.skills.replace('{{skills}}', data.skills.join(', '));
  
  // Build experience items
  let expHTML = '';
  tailoredExperience.forEach(job => {
    expHTML += `
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>${job.role}</span><span>${job.date}</span>
        </div>
        <div style="font-style:italic">${job.company}</div>
        <p class="job-details">${job.details}</p>
      </div>
    `;
  });
  html += RESUME_TEMPLATE.experience.replace('{{experienceItems}}', expHTML);
  
  // Build education items
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
  html += RESUME_TEMPLATE.education.replace('{{educationItems}}', eduHTML);
  
  document.getElementById('resumeDocument').innerHTML = html;
}

function generateCV() {
  const data = { ...appData };
  
  let html = CV_TEMPLATE.header
    .replace('{{fullName}}', data.personal.fullName)
    .replace('{{jobTitle}}', data.personal.jobTitle)
    .replace('{{email}}', data.personal.email)
    .replace('{{phone}}', data.personal.phone ? ` | ${data.personal.phone}` : '')
    .replace('{{location}}', data.personal.location ? ` | ${data.personal.location}` : '')
    .replace('{{linkedin}}', data.personal.linkedin ? ` | ${data.personal.linkedin}` : '');
  
  html += CV_TEMPLATE.summary.replace('{{summary}}', data.summary);
  
  // Build skills grid
  let skillsHTML = '';
  data.skills.forEach(skill => {
    skillsHTML += `<div>• ${highlightKeywords(skill, data.matchedKeywords)}</div>`;
  });
  html += CV_TEMPLATE.skills.replace('{{skillsItems}}', skillsHTML);
  
  // Build experience
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
  
  // Build education
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

// ===== KEYWORD TAILORING =====
function tailorContent(text, keywords) {
  if (!text) return '';
  return highlightKeywords(text, keywords);
}

function highlightKeywords(text, keywords) {
  if (!keywords || !keywords.length) return text;
  
  let result = text;
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    result = result.replace(regex, match => 
      `<span class="keyword-match">${match}</span>`
    );
  });
  return result;
}

// ===== TAB SWITCHING =====
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
  const name = appData.personal.fullName.replace(/\s+/g, '_') || 'Resume';
  const filename = `${name}_${type === 'resume' ? 'Resume' : 'CV'}.pdf`;
  
  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  btn.disabled = true;
  
  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    showAlert(UI_MESSAGES.downloadReady, 'success');
  }).catch(err => {
    console.error('PDF generation error:', err);
    btn.innerHTML = originalText;
    btn.disabled = false;
    showAlert('Failed to generate PDF. Try using Print → Save as PDF instead.', 'error');
  });
}

// ===== UTILITY FUNCTIONS =====
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existing = document.querySelector('.alert');
  if (existing) existing.remove();
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  if (type === 'error') icon = 'times-circle';
  
  alert.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  
  // Insert after header
  const header = document.querySelector('.app-header');
  header.parentNode.insertBefore(alert, header.nextSibling);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s';
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

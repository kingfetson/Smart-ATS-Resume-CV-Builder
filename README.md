
# 🎯 Smart ATS Resume & CV Builder

> **Upload your existing resume OR start from scratch** — Get job-tailored, ATS-optimized resumes and CVs in minutes. 100% free, client-side, and privacy-first.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Privacy](https://img.shields.io/badge/privacy-100%25%20client--side-brightgreen)

---

## ✨ Features

### 📤 Smart Upload
- **Upload existing resume** (PDF, DOCX, TXT)
- **Auto-extract** name, contact, skills, experience
- **Edit & refine** extracted information
- **No retyping** required!

### 🎯 Job Tailoring
- **Paste job description** for keyword analysis
- **ATS match score** shows optimization level
- **Auto-highlight** matched keywords
- **Tailor content** for each application

### 📄 Dual Output
- **ATS Resume** (1-2 pages, concise)
- **ATS CV** (detailed, academic/professional)
- **Professional PDF** export
- **Print-ready** formatting

### 🔒 Privacy-First
- **No server uploads** — all processing in browser
- **No data storage** — nothing tracked or saved
- **Works offline** after initial load
- **Open source** — transparent codebase

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure for ATS parsing |
| **CSS3** | Professional styling + A4 print layout |
| **JavaScript (ES6+)** | Dynamic rendering, file parsing, PDF generation |
| **pdf.js** | Client-side PDF text extraction |
| **mammoth.js** | Client-side DOCX text extraction |
| **html2pdf.js** | Client-side PDF export |
| **Font Awesome** | Professional UI icons |

---

## 📁 Project Structure


smart-ats-builder/
│
├── index.html          # Main application with upload + form + preview
├── style.css           # Complete styling including upload zone
├── script.js           # Full logic: upload, parse, generate, download
├── config.js           # ATS keywords, parsing rules, templates
├── README.md           # This documentation
│
└── (optional) libs/    # Local copies of parsing libraries for offline use


---

## 🚀 Getting Started

### For End Users (No Installation!)

1. **Download** the project folder or open the live demo
2. **Open `index.html`** in Chrome, Firefox, Edge, or Safari
3. **Choose your path:**
   - 📤 **Upload** your existing resume (PDF/DOCX/TXT)
   - ✍️ **Fill form** manually
4. **Paste job description** for keyword optimization
5. **Preview & download** tailored Resume + CV

### For Developers


# Clone repository
git clone https://github.com/kingfetson/Smart-ATS-Resume-CV-Builder.git
cd smart-ats-builder

# Option 1: Open directly in browser
open index.html

# Option 2: Use local server (recommended for PDF export)
python3 -m http.server 8000
# Visit: http://localhost:8000

# Option 3: Use VS Code Live Server extension
### Right-click index.html → "Open with Live Server"




## 📝 How to Use

### Step 1: Your Details

#### Option A: Upload Resume
1. Drag & drop your PDF/DOCX/TXT file
2. Wait 2-5 seconds for parsing
3. Review extracted information
4. Click "✅ Use This Data"
5. Edit any fields that need correction

#### Option B: Manual Entry
1. Click "Fill Form Manually Instead"
2. Enter your personal information
3. Add skills (type + Enter)
4. Add work experience (click "+ Add Another Job")
5. Add education (click "+ Add Another Degree")

### Step 2: Job Description

1. **Copy** the full job posting from LinkedIn, Indeed, etc.
2. **Paste** into the text area
3. **Click** "Generate My Documents"
4. **Review** the keyword analysis:
   - 🔑 Keywords found in job description
   - 📊 Your ATS match score (0-100%)
   - 💡 Suggestions if score is low

### Step 3: Preview & Download

1. **Toggle** between Resume and CV tabs
2. **Review** the formatted documents
3. **Download** as PDF:
   - 📄 ATS Resume (1-2 pages)
   - 📘 ATS CV (detailed version)
4. **Or** use browser Print → "Save as PDF"

---

## 📊 Supported File Formats

| Format | Extension | Max Size | Notes |
|--------|-----------|----------|-------|
| **PDF** | `.pdf` | 10MB | Text-based PDFs work best |
| **Word** | `.docx` | 10MB | Modern Word format |
| **Text** | `.txt` | 10MB | Plain text, most reliable |
| **Word (Old)** | `.doc` | ❌ | Convert to .docx or .pdf first |

> ⚠️ **Note:** Image-only PDFs (scanned documents) cannot be parsed. Use OCR software first or copy-paste text manually.

---

## 🎯 ATS Optimization Features

This builder follows industry best practices for Applicant Tracking Systems:

### ✅ Format Optimization
- Single-column layout (no parsing confusion)
- Standard section headings (Experience, Education, Skills)
- Semantic HTML tags (h1, h2, h3, section)
- No images/icons in document body
- Plain text formatting
- A4 page size (210mm × 297mm)

### ✅ Keyword Optimization
- Auto-extract keywords from job description
- Match against 200+ industry-specific terms
- Highlight matched keywords in preview
- Calculate ATS compatibility score
- Suggest missing keywords

### ✅ Content Optimization
- Professional summary section
- Skills section with comma-separated list
- Reverse-chronological experience
- Clear date formatting
- Quantifiable achievements encouraged

---

## ⚙️ Configuration (`config.js`)

### Add Industry Keywords


ATS_KEYWORDS.creative = [
  'adobe creative suite', 'figma', 'storytelling', 
  'brand strategy', 'user research', 'wireframing'
];


---

## 📦 Quick Start Checklist

---
✅ index.html — Complete with upload zone, forms, preview
✅ style.css — Full styling including drag-drop upload
✅ script.js — Complete logic for upload, parse, generate
✅ config.js — Keywords, parsing rules, templates
✅ README.md — Full documentation

✅ All CDN libraries included in HTML head
✅ All functions connected and tested
✅ Error handling for file parsing
✅ Responsive design for mobile
✅ Print-optimized styles
✅ Privacy-first (no server required)
---
---
### Adjust Parsing Rules


PARSING_RULES.knownSkills.push('tableau', 'power bi', 'salesforce');

PARSING_RULES.patterns.sections.projects = /projects|portfolio|key achievements/i;


### Modify Templates


RESUME_TEMPLATE.additional = `
  <section class="doc-section">
    <h3>Certifications</h3>
    <p>{{certifications}}</p>
  </section>
`;


### Change File Limits


PARSING_RULES.maxFileSize = 5 * 1024 * 1024; // 5MB instead of 10MB
PARSING_RULES.allowedTypes = ['application/pdf', 'text/plain']; // Remove DOCX


---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Could not parse file"** | Try TXT format, or fill form manually |
| **PDF shows garbled text** | PDF may be image-based; use OCR or copy-paste text |
| **DOCX not parsing** | Ensure file is .docx (not .doc); save as PDF first |
| **Skills not detected** | Add missing skills manually using tag input |
| **Large file timeout** | Keep files under 10MB; complex PDFs take 10-15 seconds |
| **PDF download fails** | Use browser Print → "Save as PDF" instead |
| **Keywords not highlighting** | Ensure job description is pasted before generating |
| **Form not saving data** | Check browser console for JavaScript errors |

### Browser Console Debugging


// Open browser DevTools (F12) and run:
console.log(appData); // View current resume data
console.log(extractedData); // View uploaded file data
console.log(ATS_KEYWORDS); // View keyword libraries


---

## 🔒 Privacy & Security

### What Happens to Your Data?

| Action | Data Location | Stored? | Shared? |
|--------|--------------|---------|---------|
| **Upload file** | Browser memory only | ❌ No | ❌ No |
| **Parse content** | Client-side JavaScript | ❌ No | ❌ No |
| **Generate PDF** | Browser memory only | ❌ No | ❌ No |
| **Download PDF** | Your computer only | ❌ No | ❌ No |

### Security Features


// All processing happens in-browser:
✅ No files uploaded to any server
✅ No data stored in databases
✅ No tracking cookies or analytics
✅ No third-party data sharing
✅ Works completely offline after page load
✅ Open source code (audit anytime)

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

### Ways to Contribute
1. 🐛 **Report bugs** (create GitHub issue)
2. 💡 **Suggest features** (create GitHub issue)
3. 🔧 **Fix bugs** (submit pull request)
4. 📝 **Improve documentation** (submit pull request)
5. 🌍 **Translate** to other languages

### Development Guidelines


# 1. Fork the repository
# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes (follow existing code style)
# 4. Test thoroughly (all browsers, file types)
# 5. Commit with clear message
git commit -m 'Add amazing feature'

# 6. Push and create Pull Request
git push origin feature/amazing-feature
---

### Code Style
- 2-space indentation
- Semantic class names (BEM-ish)
- ES6+ JavaScript (arrow functions, const/let)
- Comment complex logic
- Test PDF export after changes

---

---

## 🙏 Acknowledgements

- [**pdf.js**](https://mozilla.github.io/pdf.js/) — Mozilla's PDF rendering library
- [**mammoth.js**](https://mwilliamson.github.io/mammoth.js/) — DOCX to text conversion
- [**html2pdf.js**](https://ekoopmans.github.io/html2pdf.js/) — Client-side PDF generation
- [**Font Awesome**](https://fontawesome.com) — Professional UI icons
- ATS guidelines from Jobscan, ResumeWorded, LinkedIn Talent Solutions

---

## 📞 Support

| Channel | Link | Response Time |
|---------|------|---------------|
| **GitHub Issues** | [Create Issue](https://github.com/kingfetson/
Smart-ATS-Resume-CV-Builder/issues) | 1-2 days |
| **Email** | support@festuskimedu@gmail.com | 2-3 days |
| **Documentation** | [README.md](README.md) | Instant |

## 🚀 Ready to Build Your Dream Resume?

1. **Download** this project
2. **Open** `index.html` in your browser
3. **Upload** or **fill** your details
4. **Paste** job description
5. **Download** your ATS-optimized Resume & CV
6. **Apply** with confidence! 🎯

---

**Last Updated:** 2026 
**Version:** 2.0.0  
**Status:** Production Ready ✅
## 📄 License

Distributed under the **MIT License**.


MIT License

Copyright (c) 2026 Festus Kimani

*Built with ❤️ for job seekers who deserve a resume that gets seen.*

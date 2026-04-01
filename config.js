// config.js - ATS keyword libraries, parsing rules & document templates

// ===== ATS KEYWORDS BY INDUSTRY =====
const ATS_KEYWORDS = {
  tech: [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue', 'typescript',
    'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 
    'git', 'ci/cd', 'agile', 'scrum', 'api', 'rest', 'graphql', 'microservices',
    'html', 'css', 'sass', 'webpack', 'jenkins', 'terraform', 'linux', 'bash'
  ],
  marketing: [
    'seo', 'sem', 'google analytics', 'content strategy', 'social media', 
    'campaign management', 'crm', 'hubspot', 'mailchimp', 'conversion optimization',
    'email marketing', 'ppc', 'facebook ads', 'google ads', 'marketing automation',
    'brand management', 'market research', 'customer segmentation', 'a/b testing'
  ],
  finance: [
    'financial modeling', 'excel', 'forecasting', 'budgeting', 'gaap', 'quickbooks', 
    'risk analysis', 'compliance', 'audit', 'sap', 'financial reporting', 'variance analysis',
    'cash flow', 'balance sheet', 'income statement', 'tax preparation', 'accounting'
  ],
  healthcare: [
    'patient care', 'ehr', 'hipaa', 'clinical documentation', 'treatment planning', 
    'medical coding', 'icd-10', 'emr', 'nursing', 'phlebotomy', 'vital signs',
    'medication administration', 'infection control', 'cpr', 'bls', 'acl'
  ],
  sales: [
    'crm', 'salesforce', 'pipeline management', 'lead generation', 'cold calling',
    'account management', 'business development', 'negotiation', 'closing', 'quota',
    'b2b', 'b2c', 'customer retention', 'sales strategy', 'prospecting'
  ],
  general: [
    'leadership', 'communication', 'project management', 'problem solving', 
    'team collaboration', 'time management', 'adaptability', 'critical thinking',
    'organization', 'multitasking', 'attention to detail', 'customer service'
  ]
};

// ===== PARSING RULES FOR RESUME EXTRACTION =====
const PARSING_RULES = {
  patterns: {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g,
    linkedin: /linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi,
    url: /https?:\/\/[^\s]+/g,
    date: /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\b/gi,
    dateRange: /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\s*[-–]\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})\b/gi,
    sections: {
      experience: /experience|work history|professional experience|employment|work experience/i,
      education: /education|qualifications|academic background|degrees|certifications/i,
      skills: /skills|technical skills|core competencies|expertise|technologies|proficient/i,
      summary: /summary|profile|about me|professional summary|objective/i,
      projects: /projects|portfolio|key projects|personal projects/i
    }
  },
  
  commonTitles: [
    'manager', 'director', 'engineer', 'developer', 'designer', 'analyst',
    'consultant', 'specialist', 'coordinator', 'assistant', 'lead', 'senior', 
    'junior', 'executive', 'officer', 'administrator', 'supervisor', 'head'
  ],
  
  knownSkills: [
    // Tech
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'react native', 'angular', 'vue', 'svelte', 'node.js', 'express',
    'django', 'flask', 'spring', 'laravel', 'rails',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'heroku', 'netlify', 'vercel',
    'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions',
    'git', 'svn', 'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui',
    'webpack', 'vite', 'babel', 'typescript', 'graphql', 'rest api',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
    // Business
    'project management', 'agile', 'scrum', 'stakeholder management', 'budgeting',
    'strategic planning', 'business analysis', 'process improvement', 'lean', 'six sigma',
    'salesforce', 'hubspot', 'zendesk', 'slack', 'microsoft office', 'google workspace',
    'excel', 'powerpoint', 'word', 'tableau', 'power bi', 'looker',
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'adaptability',
    'time management', 'organization', 'critical thinking', 'creativity', 'empathy'
  ],

  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  allowedExtensions: ['.pdf', '.docx', '.doc', '.txt']
};

// ===== RESUME TEMPLATE (Concise, 1-2 pages) =====
const RESUME_TEMPLATE = {
  header: `
    <div class="doc-header">
      <h1>{{fullName}}</h1>
      <h2>{{jobTitle}}</h2>
      <div class="contact">
        {{email}}{{phone}}{{location}}{{linkedin}}
      </div>
    </div>
  `,
  summary: `
    <section class="doc-section">
      <h3>Professional Summary</h3>
      <p>{{summary}}</p>
    </section>
  `,
  skills: `
    <section class="doc-section">
      <h3>Core Skills</h3>
      <p>{{skills}}</p>
    </section>
  `,
  experience: `
    <section class="doc-section">
      <h3>Professional Experience</h3>
      {{experienceItems}}
    </section>
  `,
  education: `
    <section class="doc-section">
      <h3>Education</h3>
      {{educationItems}}
    </section>
  `
};

// ===== CV TEMPLATE (Detailed, Academic/Professional) =====
const CV_TEMPLATE = {
  header: `
    <div class="doc-header">
      <h1>{{fullName}}</h1>
      <h2>{{jobTitle}}</h2>
      <div class="contact">
        {{email}}{{phone}}{{location}}{{linkedin}}
      </div>
    </div>
  `,
  summary: `
    <section class="doc-section">
      <h3>Professional Profile</h3>
      <p>{{summary}}</p>
    </section>
  `,
  skills: `
    <section class="doc-section">
      <h3>Technical & Professional Skills</h3>
      <div class="skills-grid">
        {{skillsItems}}
      </div>
    </section>
  `,
  experience: `
    <section class="doc-section">
      <h3>Professional Experience</h3>
      {{experienceItems}}
    </section>
  `,
  education: `
    <section class="doc-section">
      <h3>Education & Certifications</h3>
      {{educationItems}}
    </section>
  `,
  additional: `
    {{certificationsSection}}
    {{projectsSection}}
  `
};

// ===== DEFAULT EMPTY DATA STRUCTURE =====
const defaultData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: ''
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  jobDescription: '',
  matchedKeywords: [],
  certifications: '',
  projects: ''
};

// ===== SCORE WEIGHTS FOR ATS MATCHING =====
const SCORE_WEIGHTS = {
  exactMatch: 2,      // Keyword appears exactly
  partialMatch: 1,    // Keyword is part of a phrase
  skillBoost: 1.5,    // Bonus if keyword is in user's skills
  experienceBoost: 1.3 // Bonus if keyword appears in experience
};

// ===== UI MESSAGES =====
const UI_MESSAGES = {
  uploadSuccess: '✅ File parsed successfully!',
  uploadError: '❌ Could not parse file. Please try a different format.',
  parsing: '⏳ Parsing your file...',
  generating: '⏳ Generating your documents...',
  downloadReady: '✅ Download started!',
  matchScoreHigh: '🎉 Excellent match! Your resume is well-optimized.',
  matchScoreMedium: '⚠️ Good match. Consider adding more keywords.',
  matchScoreLow: '💡 Low match. Add more keywords from the job description.'
};

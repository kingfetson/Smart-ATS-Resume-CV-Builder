// config.js - ATS keyword libraries & document templates

// Common ATS keywords by industry (for matching)
const ATS_KEYWORDS = {
  tech: ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'agile', 'scrum', 'ci/cd', 'sql', 'api', 'git'],
  marketing: ['seo', 'sem', 'google analytics', 'content strategy', 'social media', 'campaign management', 'crm', 'hubspot', 'mailchimp', 'conversion optimization'],
  finance: ['financial modeling', 'excel', 'forecasting', 'budgeting', 'gaap', 'quickbooks', 'risk analysis', 'compliance', 'audit', 'sap'],
  healthcare: ['patient care', 'ehr', 'hipaa', 'clinical documentation', 'treatment planning', 'medical coding', 'icd-10', 'emr'],
  general: ['leadership', 'communication', 'project management', 'problem solving', 'team collaboration', 'time management', 'adaptability']
};

// Resume template structure (concise, 1-2 pages)
const RESUME_TEMPLATE = {
  header: `
    <div class="doc-header">
      <h1>{{fullName}}</h1>
      <h2>{{jobTitle}}</h2>
      <div class="contact">
        {{email}} {{#if phone}}| {{phone}}{{/if}} {{#if location}}| {{location}}{{/if}} {{#if linkedin}}| {{linkedin}}{{/if}}
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
      {{#each experience}}
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>{{role}}</span><span>{{date}}</span>
        </div>
        <div style="font-style:italic">{{company}}</div>
        <p class="job-details">{{details}}</p>
      </div>
      {{/each}}
    </section>
  `,
  education: `
    <section class="doc-section">
      <h3>Education</h3>
      {{#each education}}
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>{{degree}}</span><span>{{year}}</span>
        </div>
        <div style="font-style:italic">{{school}}</div>
      </div>
      {{/each}}
    </section>
  `
};

// CV template structure (detailed, academic/professional)
const CV_TEMPLATE = {
  header: RESUME_TEMPLATE.header,
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
        {{#each skillsArray}}
        <div>• {{this}}</div>
        {{/each}}
      </div>
    </section>
  `,
  experience: `
    <section class="doc-section">
      <h3>Professional Experience</h3>
      {{#each experience}}
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:11pt">
          <span>{{role}}</span><span>{{date}}</span>
        </div>
        <div style="font-style:italic;margin-bottom:0.3rem">{{company}}</div>
        <p class="job-details">{{details}}</p>
      </div>
      {{/each}}
    </section>
  `,
  education: `
    <section class="doc-section">
      <h3>Education & Certifications</h3>
      {{#each education}}
      <div class="job-item">
        <div style="display:flex;justify-content:space-between;font-weight:bold">
          <span>{{degree}}</span><span>{{year}}</span>
        </div>
        <div style="font-style:italic">{{school}}</div>
      </div>
      {{/each}}
    </section>
  `,
  // CV can include additional sections
  additional: `
    {{#if certifications}}
    <section class="doc-section">
      <h3>Certifications</h3>
      <p>{{certifications}}</p>
    </section>
    {{/if}}
    {{#if projects}}
    <section class="doc-section">
      <h3>Key Projects</h3>
      <p>{{projects}}</p>
    </section>
    {{/if}}
  `
};

// Default empty data structure
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
  matchedKeywords: []
};

import Script from "next/script";

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">BestFit Application Studio</p>
            <h1>Find the strongest version of your experience for every role.</h1>
          </div>
          <button id="generateBtn" className="primary-button">Generate</button>
        </header>

        <section className="input-stack">
          <div className="panel target-panel">
            <div className="panel-header">
              <div>
                <h2>Target Job</h2>
                <span>Add a job link or paste the job description</span>
              </div>
            </div>
            <label className="job-link-field">
              <span>Job Link</span>
              <input
                id="jobInput"
                type="url"
                inputMode="url"
                spellCheck="false"
                placeholder="https://company.com/careers/job-posting"
              />
            </label>
            <div className="basic-grid">
              <label><span>Target Role</span><input id="targetRoleInput" placeholder="Data Analyst Intern" /></label>
              <label><span>Company</span><input id="companyInput" placeholder="Company name" /></label>
              <label className="wide-field"><span>Job Description</span><textarea id="jobDescriptionInput" rows={5} placeholder="Paste responsibilities and requirements here, especially if the job link requires login." /></label>
            </div>
            <p className="helper-text">The initial profile and experiences are examples. Replace them with your own details.</p>
            <p id="workspaceStatus" className="helper-text" role="status">Example profile — replace it with your own information. Changes are saved in this browser.</p>
            <p className="helper-text">
              Paste a posting from Handshake, LinkedIn, a company career page, or any job board.
              Pasted descriptions take priority. Drafts use keyword matching and your supplied experience; review before applying.
            </p>
          </div>

          <div className="panel basic-panel">
            <div className="panel-header">
              <div>
                <h2>Basic Information</h2>
                <span>Used for the resume header and education section</span>
              </div>
            </div>
            <div className="basic-grid">
              <label>
                <span>Full Name</span>
                <input id="fullNameInput" type="text" placeholder="Your Name" />
              </label>
              <label>
                <span>Email</span>
                <input id="emailInput" type="email" placeholder="name@email.com" />
              </label>
              <label>
                <span>Phone</span>
                <input id="phoneInput" type="tel" placeholder="(123) 456-7890" />
              </label>
              <label>
                <span>Location</span>
                <input id="profileLocationInput" type="text" placeholder="New York, NY" />
              </label>
              <label>
                <span>Address</span>
                <input id="addressInput" type="text" placeholder="Optional street address" />
              </label>
              <label>
                <span>School</span>
                <input id="schoolInput" type="text" placeholder="University Name" />
              </label>
              <label>
                <span>Degree</span>
                <input id="degreeInput" type="text" placeholder="Bachelor of Science" />
              </label>
              <label>
                <span>Major</span>
                <input id="majorInput" type="text" placeholder="Data Science" />
              </label>
              <label>
                <span>Minor</span>
                <input id="minorInput" type="text" placeholder="Computer Science" />
              </label>
              <label>
                <span>GPA</span>
                <input id="gpaInput" type="text" placeholder="3.8 / 4.0" />
              </label>
              <label>
                <span>Graduation Date</span>
                <input id="graduationInput" type="text" placeholder="May 2026" />
              </label>
              <label>
                <span>LinkedIn / Portfolio</span>
                <input id="portfolioInput" type="url" placeholder="https://linkedin.com/in/yourname" />
              </label>
              <label className="wide-field">
                <span>Core Courses</span>
                <input
                  id="coreCoursesInput"
                  type="text"
                  placeholder="Data Analysis, Business Analytics, Python, Statistics..."
                />
              </label>
            </div>
          </div>

          <div className="panel experience-panel">
            <div className="panel-header">
              <div>
                <h2>Your Experience Bank</h2>
                <span>Add each experience separately</span>
              </div>
              <button id="addExperienceBtn" className="secondary-button" type="button">Add Experience</button>
            </div>
            <div id="experienceList" className="experience-list"></div>
          </div>
        </section>

        <section className="output-grid">
          <article className="panel wide">
            <div className="panel-header">
              <div>
                <h2>Generated Resume</h2>
                <span>Classic ATS-friendly template</span>
              </div>
              <div className="resume-actions">
                <button id="editResumeBtn" className="secondary-button" type="button">Edit Resume</button>
                <button id="saveResumeBtn" className="secondary-button" type="button">Save Edits</button>
                <button id="regenerateResumeBtn" className="secondary-button" type="button">Regenerate Draft</button>
                <button id="downloadResumeBtn" className="secondary-button" type="button">Download HTML</button>
                <button id="printResumeBtn" className="secondary-button" type="button">Print / Save PDF</button>
              </div>
            </div>
            <p id="saveStatus" className="save-status">Generated from your profile and selected experiences.</p>
            <div id="generatedResume" className="resume-document"></div>
          </article>

          <article className="panel wide">
            <div className="panel-header">
              <div>
                <h2>Resume Header</h2>
                <span>Basic information formatted for the application</span>
              </div>
            </div>
            <div id="resumeHeader" className="resume-header-preview"></div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2>Job Focus</h2>
                <span>What this role appears to value</span>
              </div>
            </div>
            <div id="jobFocus" className="chips"></div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2>Experience Selection</h2>
                <span>Which evidence should lead</span>
              </div>
            </div>
            <div id="experienceSelection" className="stack"></div>
          </article>

          <article className="panel wide">
            <div className="panel-header">
              <div>
                <h2>Tailored Descriptions</h2>
                <span>Role-specific rewrites without inventing facts</span>
              </div>
            </div>
            <div id="tailoredDescriptions" className="stack"></div>
          </article>

          <article className="panel wide">
            <div className="panel-header">
              <div>
                <h2>Cover Letter</h2>
                <span>Editable draft based on your experience</span>
              </div>
            </div>
            <div className="resume-actions">
              <button id="regenerateLetterBtn" className="secondary-button" type="button">Regenerate Letter</button>
              <button id="downloadLetterBtn" className="secondary-button" type="button">Download Letter</button>
            </div>
            <p id="letterStatus" className="save-status" role="status">Review and personalize before sending.</p>
            <textarea id="coverLetter" className="letter" aria-label="Cover letter draft" rows={16}></textarea>
          </article>
        </section>
      </section>

      <Script src="/legacy-app.js" strategy="afterInteractive" />
    </main>
  );
}

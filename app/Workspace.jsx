"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Welcome from "./Welcome";
import { browserAuth } from "../lib/auth/browser";
import { authConfigured, authEnabled } from "../lib/auth/config";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, Download, FileText, FolderOpen, Layers, Pencil, Plus, Printer, RefreshCw, Save, Sparkles, UserRound } from "lucide-react";

export default function Workspace({ account }) {
  const pathname = usePathname();
  const [documentView, setDocumentView] = useState("resume");
  const view = pathname === "/profile" ? "profile" : pathname === "/experiences" ? "experiences" : "studio";
  const isWelcome = pathname === "/";
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname);
  const [signingOut, setSigningOut] = useState(false);
  const [accountError, setAccountError] = useState("");
  async function signOut() {
    setSigningOut(true);
    setAccountError("");
    window.dispatchEvent(new Event("bestfit:flush"));
    try {
      const { error } = await browserAuth().auth.signOut();
      if (error) throw error;
      window.location.assign("/");
    } catch {
      setAccountError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  }
  return (
    <>
    {isWelcome && <Welcome signedIn={Boolean(account)} />}
    <main className="app-shell" data-view={view} data-account={account?.id || ""} hidden={isWelcome || isAuthPage || (authConfigured && !account)}>
      <section className="workspace">
        <nav className="workspace-nav" aria-label="Main navigation">
          <Link href="/" className="workspace-brand"><span className="brand-symbol"><Layers size={19} /></span>BestFit<span className="brand-caption">APPLICATION STUDIO</span></Link>
          <div className="workspace-links">
            <Link href="/studio" aria-current={view === "studio" ? "page" : undefined}><FileText size={16} />Studio</Link>
            <Link href="/profile" aria-current={view === "profile" ? "page" : undefined}><UserRound size={16} />My Profile</Link>
            <Link href="/experiences" aria-current={view === "experiences" ? "page" : undefined}><FolderOpen size={16} />Experience Bank</Link>
          </div>
          {authEnabled && <div className="account-controls">{account ? <><span title={account.email}>{account.email}</span><button type="button" onClick={signOut} disabled={signingOut}>{signingOut ? "Signing out..." : "Sign out"}</button></> : <Link href="/login">Sign in<ArrowUpRight size={13} /></Link>}</div>}
        </nav>
        {accountError && <p className="auth-error" role="alert">{accountError}</p>}
        <header className="topbar">
          <div>
            <p className="eyebrow">{view === "studio" ? "YOUR NEXT OPPORTUNITY" : "YOUR APPLICATION FOUNDATION"}</p>
            <h1>{view === "profile" ? "My Profile" : view === "experiences" ? "Experience Bank" : "Application Studio"}</h1>
          </div>
          <button id="generateBtn" className="primary-button" hidden={view !== "studio"}><Sparkles size={16} /><span>Generate application</span></button>
          {view !== "studio" && <Link href="/studio" className="secondary-button navigation-action"><ArrowLeft size={16} />Back to Studio</Link>}
        </header>

        <div className="profile-summary" hidden={view !== "studio"}>
          <span className="profile-avatar"><UserRound size={19} /></span>
          <div className="profile-summary-copy"><strong id="profileSummaryName">My Profile</strong><span id="profileSummaryDetails">Loading saved details...</span></div>
          <div className="summary-links"><Link href="/profile">Edit profile<ArrowUpRight size={14} /></Link><Link href="/experiences">Experiences<ArrowUpRight size={14} /></Link></div>
        </div>
        <div className="studio-layout">
        <section className="input-stack">
          <div className="panel target-panel" hidden={view !== "studio"}>
            <div className="panel-header">
              <div>
                <p className="section-kicker">01 / THE OPPORTUNITY</p>
                <h2><BriefcaseBusiness size={18} />Target Job</h2>
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
            </div>
            <details className="job-details"><summary>Job description <span>Optional</span><ChevronDown size={15} /></summary><label><span className="sr-only">Job Description</span><textarea id="jobDescriptionInput" rows={5} placeholder="Responsibilities and qualifications" /></label></details>
          </div>

          <section className="focus-section" hidden={view !== "studio"}>
            <div className="panel-header"><div><p className="section-kicker">02 / WHAT MATTERS</p><h2>Job Focus</h2></div><span className="small-badge">Role signals</span></div>
            <div id="jobFocus" className="chips"></div>
          </section>

          <div className="panel basic-panel" hidden={view !== "profile"}>
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

          <div className="panel experience-panel" hidden={view !== "experiences"}>
            <div className="panel-header">
              <div>
                <h2>Your Experience Bank</h2>
                <span>Add each experience separately</span>
              </div>
              <button id="addExperienceBtn" className="secondary-button" type="button"><Plus size={16} />Add Experience</button>
            </div>
            <div id="experienceList" className="experience-list"></div>
          </div>
        </section>
        <section className="output-grid" hidden={view !== "studio"}>
          <div className="document-tabs" role="tablist" aria-label="Application documents">
            <button id="resumeTab" role="tab" aria-selected={documentView === "resume"} aria-controls="resumePanel" onClick={() => setDocumentView("resume")}><FileText size={16} />Resume</button>
            <button id="letterTab" role="tab" aria-selected={documentView === "letter"} aria-controls="letterPanel" onClick={() => setDocumentView("letter")}><Pencil size={16} />Cover Letter</button>
            <span className="draft-badge"><span />Draft</span>
          </div>
          <article id="resumePanel" role="tabpanel" aria-labelledby="resumeTab" className="document-panel" hidden={documentView !== "resume"}>
            <div className="panel-header">
              <div>
                <h2>Resume</h2>
                <span>Classic / Single column</span>
              </div>
              <div className="resume-actions">
                <button id="editResumeBtn" className="secondary-button" type="button"><Pencil size={15} /><span>Edit Resume</span></button>
                <button id="saveResumeBtn" className="tool-button" title="Save edits" aria-label="Save Edits" type="button"><Save size={16} /></button>
                <button id="regenerateResumeBtn" className="tool-button" title="Regenerate draft" aria-label="Regenerate Draft" type="button"><RefreshCw size={16} /></button>
                <span className="toolbar-divider" />
                <button id="downloadResumeBtn" className="tool-button" title="Download HTML" aria-label="Download HTML" type="button"><Download size={16} /></button>
                <button id="printResumeBtn" className="tool-button" title="Print / Save PDF" aria-label="Print / Save PDF" type="button"><Printer size={16} /></button>
              </div>
            </div>
            <p id="saveStatus" className="save-status" role="status">Draft ready.</p>
            <div className="paper-stage"><div id="generatedResume" className="resume-document"></div></div>
          </article>

          <div hidden>
            <div id="resumeHeader" className="resume-header-preview"></div>
          </div>

          <details className="analysis-details">
            <summary><FolderOpen size={16} />Experience selection<ChevronDown size={16} /></summary>
            <div id="experienceSelection" className="stack"></div>
          </details>

          <details className="analysis-details">
            <summary><FileText size={16} />Tailored descriptions<ChevronDown size={16} /></summary>
            <div id="tailoredDescriptions" className="stack"></div>
          </details>

          <article id="letterPanel" role="tabpanel" aria-labelledby="letterTab" className="document-panel letter-panel" hidden={documentView !== "letter"}>
            <div className="panel-header">
              <div>
                <h2>Cover Letter</h2>
                <span>Editable draft based on your experience</span>
              </div>
            </div>
            <div className="resume-actions">
                <button id="regenerateLetterBtn" className="secondary-button" type="button"><RefreshCw size={15} />Regenerate Letter</button>
              <button id="downloadLetterBtn" className="secondary-button" type="button"><Download size={15} />Download Letter</button>
            </div>
            <p id="letterStatus" className="save-status" role="status">Review and personalize before sending.</p>
            <textarea id="coverLetter" className="letter" aria-label="Cover letter draft" rows={16}></textarea>
          </article>
        </section>
        </div>
        <p className="workspace-save-status"><Check size={13} /><span id="workspaceStatus" role="status">Saved in this browser</span></p>
      </section>

      {(!authConfigured || account) && <Script src="/legacy-app.js" strategy="afterInteractive" />}
    </main>
    </>
  );
}

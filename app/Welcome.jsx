import Link from "next/link";
import { authEnabled } from "../lib/auth/config";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";

export default function Welcome({ signedIn = false }) {
  return (
    <div className="welcome">
      <a className="welcome-skip" href="#welcome-main">Skip to content</a>
      <header className="welcome-nav">
        <Link href="/" className="welcome-logo" aria-label="BestFit home"><Layers size={20} />BestFit</Link>
        <nav aria-label="Welcome navigation">
          <a href="#the-process" className="welcome-nav-about">The approach</a>
          {authEnabled && !signedIn && <Link href="/login" className="welcome-nav-about">Sign in</Link>}
          <Link href="/studio" className="welcome-nav-open">Open Studio<ArrowUpRight size={13} /></Link>
        </nav>
      </header>

      <main id="welcome-main">
        <section className="welcome-hero" aria-labelledby="welcome-title">
          <div className="welcome-intro">
            <p className="welcome-eyebrow">A NEW PERSPECTIVE ON YOUR EXPERIENCE</p>
            <h1 id="welcome-title">BestFit.</h1>
            <p className="welcome-promise">Your experience.<br />In its best light.</p>
            <p className="welcome-description">Find the strongest version of your story.<br />For every role you pursue.</p>
            <Link href="/studio" className="welcome-primary">Create your application<ArrowRight size={17} /></Link>
          </div>
          <div className="welcome-product">
            <img src="/studio-preview.png" width="1440" height="650" alt="BestFit application workspace with a target job on the left and a formatted resume on the right" fetchPriority="high" />
          </div>
        </section>

        <section className="welcome-process" id="the-process" aria-labelledby="process-title">
          <div className="welcome-section-heading">
            <p className="welcome-eyebrow">THE SAME YOU. A SHARPER STORY.</p>
            <h2 id="process-title">A career is more than <br />one version of a resume.</h2>
            <p>Your projects, work, research, and everyday achievements. <br />Bring them together. Choose what matters for the opportunity ahead.</p>
          </div>
          <div className="welcome-steps">
            <div><span className="welcome-step-number">01</span><h3>Your foundation.</h3><p>One place for your background and everything you have done.</p><Link href="/profile">Build your profile<ArrowUpRight size={15} /></Link></div>
            <div><span className="welcome-step-number">02</span><h3>A new opportunity.</h3><p>A target role brings a different perspective to your experience.</p><Link href="/experiences">Explore your experience<ArrowUpRight size={15} /></Link></div>
            <div><span className="welcome-step-number">03</span><h3>Your own words.</h3><p>A focused application, with the final edit always in your hands.</p><Link href="/studio">Enter the studio<ArrowUpRight size={15} /></Link></div>
          </div>
        </section>

        <section className="welcome-closing">
          <p className="welcome-eyebrow">YOUR NEXT CHAPTER</p>
          <h2>You bring the experience.<br />Give it a fresh perspective.</h2>
          <Link href="/studio" className="welcome-primary">Get started<ArrowRight size={17} /></Link>
        </section>
      </main>
      <footer className="welcome-footer"><Link href="/" className="welcome-logo"><Layers size={16} />BestFit</Link><span>Your story, thoughtfully presented.</span><Link href="/studio">Application Studio<ArrowUpRight size={13} /></Link></footer>
    </div>
  );
}

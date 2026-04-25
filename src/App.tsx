import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ProjectsSection } from "./components/ProjectsSection";
import { useT } from "./context/LanguageContext";

const EMAIL = "hajar.lbaibi@gmail.com";
const PHONE = "0613352089";
const PHONE_E164 = "+212613352089";
const PHONE_2 = "0641807253";
const PHONE_2_E164 = "+212641807253";
const DEFAULT_RESUME = "/resume.pdf";
const STORAGE_KEY = "uploadedResume";

function App() {
  const { lang, setLang, t } = useT();
  const resumeObjectUrlRef = useRef<string | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedResume, setUploadedResume] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [resumePdfError, setResumePdfError] = useState(false);

  useEffect(() => {
    document.title = t.meta.title;
  }, [t.meta.title]);

  // Load saved resume from localStorage on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem(STORAGE_KEY);
      if (savedResume) {
        const parsed = JSON.parse(savedResume);
        const blob = base64ToBlob(parsed.data, "application/pdf");
        const url = URL.createObjectURL(blob);
        resumeObjectUrlRef.current = url;
        setUploadedResume({ name: parsed.name, url });
      }
    } catch (error) {
      console.error("Failed to load resume from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (resumeObjectUrlRef.current) {
        URL.revokeObjectURL(resumeObjectUrlRef.current);
        resumeObjectUrlRef.current = null;
      }
    };
  }, []);

  // Helper functions for localStorage persistence
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(",")[1]); // Extract base64 part
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function base64ToBlob(base64: string, mimeType: string): Blob {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }

  async function handleResumeFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      e.target.value = "";
      setResumePdfError(true);
      window.setTimeout(() => setResumePdfError(false), 4000);
      return;
    }
    setResumePdfError(false);
    if (resumeObjectUrlRef.current) {
      URL.revokeObjectURL(resumeObjectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    resumeObjectUrlRef.current = url;
    setUploadedResume({ name: file.name, url });

    // Save to localStorage
    try {
      const base64 = await blobToBase64(file);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: file.name, data: base64 }));
    } catch (error) {
      console.error("Failed to save resume to localStorage:", error);
    }
  }

  function clearUploadedResume() {
    if (resumeObjectUrlRef.current) {
      URL.revokeObjectURL(resumeObjectUrlRef.current);
      resumeObjectUrlRef.current = null;
    }
    setUploadedResume(null);
    if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";

    // Remove from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove resume from localStorage:", error);
    }
  }

  const previewSrc = uploadedResume?.url ?? DEFAULT_RESUME;
  const showPreview = Boolean(previewSrc);

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top">
          Hajar Lbaibi
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#about">{t.nav.about}</a>
          <a href="#experience">{t.nav.experience}</a>
          <a href="#projects">{t.nav.projects}</a>
          <a href="#education">{t.nav.education}</a>
          <a href="#resume">{t.nav.resume}</a>
          <a href="#contact">{t.nav.contact}</a>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              aria-pressed={lang === "fr"}
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <button
              type="button"
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">Hajar Lbaibi</h1>
          <p className="tagline">{t.hero.role}</p>
          <p className="lead">{t.hero.intro}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
              {t.hero.ctaPrimary}
            </a>
            <a className="btn btn-ghost" href="#education">
              {t.hero.ctaSecondary}
            </a>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title">
          <h2 id="about-title">{t.about.title}</h2>
          <div className="card">
            <p style={{ margin: 0, color: "var(--text-muted)" }}>{t.about.text}</p>
          </div>
          <h2 id="langs" style={{ marginTop: "2rem" }}>
            {t.languages.title}
          </h2>
          <ul className="pills" aria-labelledby="langs">
            {t.languages.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        
        <section id="experience" aria-labelledby="exp-title">
  <h2 id="exp-title">{t.experience.title}</h2>

  {t.experience.items.map((job) => (
    <article key={job.title + job.period} className="card">
      <h3>{job.title}</h3>
      <p className="meta">
        <span>{job.org}</span>
        <span>{job.period}</span>
        <span>{job.location}</span>
      </p>
      <ul>
        {job.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </article>
  ))}
</section>
        {/* <section id="experience" aria-labelledby="exp-title">
          <h2 id="exp-title">{t.experience.title}</h2>

          <article className="card card-highlight">
            <h3>{t.experience.freelance.title}</h3>
            <p className="meta">
              <span>{t.experience.freelance.period}</span>
              <span>{t.experience.freelance.location}</span>
            </p>
            <ul>
              {t.experience.freelance.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>

          {t.experience.items.map((job) => (
            <article key={job.title + job.period} className="card">
              <h3>{job.title}</h3>
              <p className="meta">
                <span>{job.org}</span>
                <span>{job.period}</span>
                <span>{job.location}</span>
              </p>
              <ul>
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section> */}

        <ProjectsSection lang={lang} t={t.projects} />

        <section id="education" aria-labelledby="edu-title">
          <h2 id="edu-title">{t.education.title}</h2>
          {t.education.items.map((edu) => (
            <article key={edu.degree + edu.school} className="card">
              <h3>{edu.degree}</h3>
              {edu.detail ? (
                <p className="meta" style={{ marginBottom: "0.5rem" }}>
                  {edu.detail}
                </p>
              ) : null}
              <p className="meta">
                <span>{edu.school}</span>
                <span>{edu.period}</span>
                <span>{edu.location}</span>
              </p>
            </article>
          ))}
        </section>

        <section id="certs" aria-labelledby="cert-title">
          <h2 id="cert-title">{t.certificates.title}</h2>
          <div className="card">
            <ul style={{ margin: 0 }}>
              {t.certificates.items.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>
        <section id="skills" aria-labelledby="skills-title">
  <h2 id="skills-title">{t.skills.title}</h2>

  <div className="card">
    <h3>💻 Programmation</h3>
    <ul>
      {t.skills.programming.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>

    <h3>🗄️ Bases de données</h3>
    <ul>
      {t.skills.databases.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>

    <h3>🧠 Informatique</h3>
    <ul>
      {t.skills.computing.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>

    <h3>🛠️ Outils</h3>
    <ul>
      {t.skills.tools.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>

    <h3>🤝 Soft Skills</h3>
    <ul>
      {t.skills.soft.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
</section>

        <section id="resume" aria-labelledby="resume-title">
          <h2 id="resume-title">{t.resume.title}</h2>
          <div className="card resume-card">
            <p className="resume-intro">{t.resume.intro}</p>
            <div className="resume-actions">
              <a
                className="btn btn-primary"
                href={uploadedResume?.url ?? DEFAULT_RESUME}
                download={uploadedResume?.name ?? "hajar-lbaibi-cv.pdf"}
              >
                {t.resume.downloadDefault}
              </a>
              <label className="file-upload-label">
                <span>{t.resume.uploadLabel}</span>
                <input
                  ref={resumeFileInputRef}
                  className="sr-only"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleResumeFileChange}
                />
              </label>
            </div>
            {resumePdfError ? (
              <p className="resume-hint" role="status" style={{ color: "#e8a598" }}>
                {t.resume.invalidPdf}
              </p>
            ) : null}
            {uploadedResume ? (
              <div className="resume-file-row">
                <span className="resume-file-name">
                  {t.resume.selectedFile}: {uploadedResume.name}
                </span>
                <a
                  className="btn btn-ghost"
                  href={uploadedResume.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.resume.openUploaded}
                </a>
                <button type="button" className="btn btn-ghost" onClick={clearUploadedResume}>
                  {t.resume.removeUpload}
                </button>
              </div>
            ) : null}
            <p className="resume-hint">{t.resume.uploadHint}</p>
            {showPreview ? (
              <div className="resume-preview">
                <iframe title={t.resume.title} src={previewSrc} />
              </div>
            ) : null}
          </div>
        </section>
        <section id="github" aria-labelledby="github-title">
  <h2 id="github-title">GitHub</h2>

  <div className="card">
    <p style={{ marginBottom: "1rem" }}>
      Check out my projects and code on GitHub 👇
    </p>

    <a
      className="btn btn-primary"
      href="https://github.com/asilhajar"
      target="_blank"
      rel="noreferrer"
    >
      Visit my GitHub
    </a>
  </div>
</section>

        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">{t.contact.title}</h2>
          <p className="lead" style={{ marginTop: 0 }}>
            {t.contact.subtitle}
            
          </p>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="label">{t.contact.emailLabel}</div>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              
            </div>
            <div className="contact-item">
              <div className="label">{t.contact.phoneLabel}</div>
              <a href={`tel:${PHONE_E164}`}>{PHONE}</a>
              <br />
              <a href={`tel:${PHONE_2_E164}`}>{PHONE_2}</a>
            </div>
            <div className="contact-item" style={{ gridColumn: "1 / -1" }}>
              <div className="label">{t.contact.locationLabel}</div>
              <span>{t.contact.locationValue}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">{t.footer}</footer>
    </div>
  );
}

export default App;

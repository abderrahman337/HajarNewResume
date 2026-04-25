export type Lang = "fr" | "en";

export type Translation = {
  meta: { title: string };
  nav: {
    about: string;
    experience: string;
    projects: string;
    education: string;
    resume: string;
    contact: string;
  };
  hero: {
    role: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    title: string;
    text: string;
  };
 
  experience: {
    title: string;
    items: {
      title: string;
      org: string;
      location: string;
      period: string;
      bullets: string[];
    }[];
  };
  education: {
    title: string;
    items: Array<{
      degree: string;
      school: string;
      location: string;
      period: string;
      detail?: string;
    }>;
  };
  certificates: {
    title: string;
    items: string[];
  };
  languages: {
    title: string;
    items: string[];
  };
  skills: {
    title: string;
    programming: string[];
    databases: string[];
    computing: string[];
    tools: string[];
    soft: string[];
  };
  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    locationValue: string;
  };
  projects: {
    title: string;
    filterAll: string;
    filterApps: string;
    filterEcommerce: string;
    filterShopify: string;
    counter: string;
    close: string;
    prev: string;
    next: string;
    openDetails: string;
    noResults: string;
  };
  resume: {
    title: string;
    intro: string;
    downloadDefault: string;
    uploadLabel: string;
    uploadHint: string;
    openUploaded: string;
    removeUpload: string;
    selectedFile: string;
    invalidPdf: string;
  };
  footer: string;
};
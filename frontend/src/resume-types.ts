export type SectionKey = "summary" | "experience" | "education" | "skills" | "projects";
export type TemplateId = "modern-pro" | "minimal-ats" | "corporate-elite" | "creative-edge" | "compact-one-page" | "executive-premium";
export type FontChoice = "inter" | "poppins" | "serif";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
  tech: string;
}

export interface ResumeData {
  id: string;
  name: string;
  updatedAt: string;
  template: TemplateId;
  accentColor: string;
  font: FontChoice;
  sectionOrder: SectionKey[];
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
}

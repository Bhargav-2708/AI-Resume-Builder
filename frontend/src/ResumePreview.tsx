import React from "react";
import type { ResumeData, SectionKey } from "./resume-types";

interface Props {
  data: ResumeData;
}

const FONT_CLASS: Record<string, string> = {
  inter: "font-sans",
  poppins: "font-sans",
  serif: "font-serif",
};

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: accent ?? "#0f172a", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${accent ?? "#0f172a"}` }}>{title}</h3>
      {children}
    </div>
  );
}

function renderSection(key: SectionKey, data: ResumeData, accent: string, layout: "main" | "sidebar" = "main") {
  switch (key) {
    case "summary":
      return data.personal.summary ? (
        <Section key={key} title="Summary" accent={accent}>
          <p style={{ fontSize: 11, lineHeight: 1.55, color: "#334155" }}>{data.personal.summary}</p>
        </Section>
      ) : null;
    case "experience":
      return data.experience.length ? (
        <Section key={key} title="Experience" accent={accent}>
          {data.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{e.role}</div>
                  <div style={{ fontSize: 11.5, color: accent, fontWeight: 600 }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                </div>
                <div style={{ fontSize: 10.5, color: "#64748b", whiteSpace: "nowrap" }}>{e.startDate} – {e.endDate}</div>
              </div>
              <ul style={{ marginTop: 4, paddingLeft: 16, listStyleType: "disc" }}>
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ fontSize: 11, lineHeight: 1.5, color: "#334155", marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      ) : null;
    case "education":
      return data.education.length ? (
        <Section key={key} title="Education" accent={accent}>
          {data.education.map((e) => (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{e.school}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>{e.startDate} – {e.endDate}</div>
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>{e.degree}</div>
              {e.details && <div style={{ fontSize: 10.5, color: "#64748b" }}>{e.details}</div>}
            </div>
          ))}
        </Section>
      ) : null;
    case "skills":
      return data.skills.length ? (
        <Section key={key} title="Skills" accent={accent}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.skills.map((s) => (
              <span key={s} style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 6, background: layout === "sidebar" ? "rgba(255,255,255,0.15)" : `${accent}14`, color: layout === "sidebar" ? "#fff" : accent, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </Section>
      ) : null;
    case "projects":
      return data.projects.length ? (
        <Section key={key} title="Projects" accent={accent}>
          {data.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name} {p.link && <span style={{ color: accent, fontWeight: 500, fontSize: 10.5 }}>· {p.link}</span>}</div>
              <div style={{ fontSize: 11, color: "#334155", lineHeight: 1.5 }}>{p.description}</div>
              {p.tech && <div style={{ fontSize: 10.5, color: "#64748b", fontStyle: "italic" }}>{p.tech}</div>}
            </div>
          ))}
        </Section>
      ) : null;
  }
}

function ModernPro({ data }: Props) {
  const accent = data.accentColor;
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", background: "#fff" }}>
      <aside style={{ width: "35%", background: accent, color: "white", padding: "32px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{data.personal.fullName}</div>
          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>{data.personal.title}</div>
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.8, marginBottom: 24, opacity: 0.95 }}>
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
          {data.personal.website && <div>{data.personal.website}</div>}
        </div>
        {data.skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.3)" }}>Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {data.skills.map((s) => (
                <span key={s} style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 6, background: "rgba(255,255,255,0.15)" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </aside>
      <main style={{ flex: 1, padding: "32px 28px" }}>
        {data.sectionOrder.filter((k) => k !== "skills").map((k) => renderSection(k, data, accent))}
      </main>
    </div>
  );
}

function MinimalATS({ data }: Props) {
  return (
    <div className="resume-page" style={{ padding: "44px 48px", background: "#fff" }}>
      <header style={{ marginBottom: 18, borderBottom: "2px solid #0f172a", paddingBottom: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{data.personal.fullName}</div>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>{data.personal.title}</div>
        <div style={{ fontSize: 10.5, color: "#475569", marginTop: 6 }}>
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join(" · ")}
        </div>
      </header>
      {data.sectionOrder.map((k) => renderSection(k, data, "#0f172a"))}
    </div>
  );
}

function CorporateElite({ data }: Props) {
  const accent = data.accentColor;
  return (
    <div className="resume-page font-serif" style={{ padding: "48px 52px", background: "#fff" }}>
      <header style={{ textAlign: "center", marginBottom: 24, paddingBottom: 16, borderBottom: `3px double ${accent}` }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{data.personal.fullName}</div>
        <div style={{ fontSize: 13, color: accent, marginTop: 4, fontStyle: "italic" }}>{data.personal.title}</div>
        <div style={{ fontSize: 10.5, color: "#475569", marginTop: 8 }}>
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join("  •  ")}
        </div>
      </header>
      {data.sectionOrder.map((k) => renderSection(k, data, accent))}
    </div>
  );
}

function CreativeEdge({ data }: Props) {
  const accent = data.accentColor;
  return (
    <div className="resume-page" style={{ padding: "40px 44px", background: "#fff" }}>
      <header style={{ marginBottom: 22, position: "relative" }}>
        <div style={{ position: "absolute", left: -44, top: 0, bottom: 0, width: 6, background: accent }} />
        <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a" }}>{data.personal.fullName}</div>
        <div style={{ fontSize: 13, color: accent, fontWeight: 600, marginTop: 2 }}>{data.personal.title}</div>
        <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 6 }}>
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join(" · ")}
        </div>
      </header>
      {data.sectionOrder.map((k) => renderSection(k, data, accent))}
    </div>
  );
}

function CompactOnePage({ data }: Props) {
  const accent = data.accentColor;
  return (
    <div className="resume-page" style={{ padding: "28px 32px", fontSize: 10.5, background: "#fff" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12, paddingBottom: 8, borderBottom: `1.5px solid ${accent}` }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{data.personal.fullName}</div>
          <div style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{data.personal.title}</div>
        </div>
        <div style={{ fontSize: 9.5, color: "#475569", textAlign: "right", lineHeight: 1.5 }}>
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
        </div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          {data.sectionOrder.filter(k => ["summary", "experience", "projects"].includes(k)).map((k) => renderSection(k, data, accent))}
        </div>
        <div>
          {data.sectionOrder.filter(k => ["skills", "education"].includes(k)).map((k) => renderSection(k, data, accent))}
        </div>
      </div>
    </div>
  );
}

function ExecutivePremium({ data }: Props) {
  const accent = data.accentColor;
  return (
    <div className="resume-page" style={{ padding: "60px 64px", background: "#fff" }}>
      <header style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 38, fontWeight: 300, letterSpacing: 1, color: "#0f172a" }}>{data.personal.fullName}</div>
        <div style={{ width: 60, height: 3, background: accent, margin: "12px 0" }} />
        <div style={{ fontSize: 14, color: "#475569", letterSpacing: 1, textTransform: "uppercase" }}>{data.personal.title}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 14, display: "flex", gap: 20, flexWrap: "wrap" }}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </header>
      <div style={{ lineHeight: 1.7 }}>
        {data.sectionOrder.map((k) => renderSection(k, data, accent))}
      </div>
    </div>
  );
}

export function ResumePreview({ data }: Props) {
  const fontClass = FONT_CLASS[data.font] ?? "font-sans";
  const Component = (() => {
    switch (data.template) {
      case "modern-pro": return ModernPro;
      case "minimal-ats": return MinimalATS;
      case "corporate-elite": return CorporateElite;
      case "creative-edge": return CreativeEdge;
      case "compact-one-page": return CompactOnePage;
      case "executive-premium": return ExecutivePremium;
      default: return MinimalATS;
    }
  })();
  return (
    <div className={`${fontClass} w-[210mm] min-h-[297mm] shadow-elegant mx-auto text-black`} id="resume-preview-root">
      <Component data={data} />
    </div>
  );
}

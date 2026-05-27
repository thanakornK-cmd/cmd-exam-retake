import React from "react";
import type { CSSProperties, ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
  variant?: "member" | "admin" | "public";
};

const pageVariants: Record<NonNullable<PageShellProps["variant"]>, CSSProperties> = {
  public: {
    background:
      "radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.16), transparent 28%), linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  member: {
    background:
      "radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 28%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.18), transparent 28%), linear-gradient(160deg, #eff6ff 0%, #e2e8f0 100%)",
  },
  admin: {
    background:
      "radial-gradient(circle at top left, rgba(245, 158, 11, 0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.18), transparent 28%), linear-gradient(160deg, #fff7ed 0%, #e2e8f0 100%)",
  },
};

const baseStyles: CSSProperties = {
  minHeight: "100vh",
  padding: "2rem",
  color: "#0f172a",
  display: "grid",
  alignItems: "start",
  gap: "1.5rem",
};

const contentShell: CSSProperties = {
  width: "100%",
  display: "grid",
  gap: "1rem",
  alignSelf: "start",
  justifyItems: "center",
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  maxWidth = "980px",
  variant = "public",
}: PageShellProps) {
  const background = pageVariants[variant];

  return (
    <main style={{ ...baseStyles, ...background }}>
      <div style={{ ...contentShell, maxWidth, margin: "0 auto", width: "100%" }}>
        <section
          style={{
            width: "100%",
            textAlign: "center",
            display: "grid",
            gap: "0.7rem",
            justifyItems: "center",
          }}
        >
          {eyebrow ? (
            <p
              style={{
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: "0.76rem",
                color: "#64748b",
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.05em",
            }}
          >
            {title}
          </h1>
          {description ? (
            <p
              style={{
                margin: "0 auto",
                maxWidth: "48rem",
                color: "#475569",
                lineHeight: 1.7,
                fontSize: "1.02rem",
              }}
            >
              {description}
            </p>
          ) : null}
        </section>

        <section
          style={{
            width: "100%",
            borderRadius: "28px",
            border: "1px solid rgba(148, 163, 184, 0.24)",
            background: "rgba(255, 255, 255, 0.82)",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.14)",
            backdropFilter: "blur(12px)",
            padding: "1.5rem",
          }}
        >
          {children}
        </section>
      </div>
    </main>
  );
}

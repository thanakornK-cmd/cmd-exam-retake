import React from "react";
import type { CSSProperties } from "react";

type LoanStatus = "ACTIVE" | "OVERDUE" | "RETURNED";

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const label = status.toLowerCase();
  const styleByStatus: Record<LoanStatus, CSSProperties> = {
    ACTIVE: {
      background: "rgba(59, 130, 246, 0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(59, 130, 246, 0.18)",
    },
    OVERDUE: {
      background: "rgba(239, 68, 68, 0.12)",
      color: "#b91c1c",
      border: "1px solid rgba(239, 68, 68, 0.18)",
    },
    RETURNED: {
      background: "rgba(34, 197, 94, 0.12)",
      color: "#166534",
      border: "1px solid rgba(34, 197, 94, 0.18)",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        padding: "0.35rem 0.7rem",
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        ...styleByStatus[status],
      }}
    >
      {label}
    </span>
  );
}

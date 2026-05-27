import React from "react";
import { LoanStatusBadge } from "./loan-status-badge";
import type { CSSProperties } from "react";

type LoanRow = {
  id: string;
  loanCode: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "ACTIVE" | "OVERDUE" | "RETURNED";
  fineAmount: number;
  book: { title: string };
};

export function LoanList({ loans }: { loans: LoanRow[] }) {
  if (loans.length === 0) {
    return (
      <p
        style={{
          margin: 0,
          padding: "1rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.72)",
          border: "1px dashed rgba(148, 163, 184, 0.35)",
          color: "#475569",
        }}
      >
        No loans found.
      </p>
    );
  }

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    overflow: "hidden",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  };

  const headCellStyle: CSSProperties = {
    padding: "0.95rem 1rem",
    textAlign: "left",
    fontSize: "0.82rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#475569",
    background: "rgba(248, 250, 252, 0.96)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
  };

  const cellStyle: CSSProperties = {
    padding: "0.95rem 1rem",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    color: "#0f172a",
  };

  function fineCell(loan: LoanRow) {
    if (loan.status !== "RETURNED") {
      return <span style={{ color: "#64748b" }}>-</span>;
    }

    const highlight = loan.fineAmount > 0;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "999px",
          padding: "0.2rem 0.55rem",
          fontWeight: 600,
          background: highlight ? "rgba(239, 68, 68, 0.12)" : "rgba(34, 197, 94, 0.12)",
          color: highlight ? "#b91c1c" : "#166534",
        }}
      >
        {loan.fineAmount} THB
      </span>
    );
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headCellStyle}>Loan code</th>
          <th style={headCellStyle}>Book</th>
          <th style={headCellStyle}>Loan date</th>
          <th style={headCellStyle}>Due date</th>
          <th style={headCellStyle}>Return date</th>
          <th style={headCellStyle}>Status</th>
          <th style={headCellStyle}>Fine</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((loan) => (
          <tr key={loan.id} style={{ background: "white" }}>
            <td style={cellStyle}>{loan.loanCode}</td>
            <td style={cellStyle}>{loan.book.title}</td>
            <td style={cellStyle}>{new Date(loan.loanDate).toLocaleDateString()}</td>
            <td style={cellStyle}>{new Date(loan.dueDate).toLocaleDateString()}</td>
            <td style={cellStyle}>
              {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "-"}
            </td>
            <td style={cellStyle}>
              <LoanStatusBadge status={loan.status} />
            </td>
            <td style={cellStyle}>{fineCell(loan)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

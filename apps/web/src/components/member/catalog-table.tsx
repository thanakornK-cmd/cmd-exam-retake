import React from "react";
import type { CSSProperties } from "react";

type BookRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
};

type CatalogTableProps = {
  books: BookRow[];
  onBorrow?: (bookId: string) => void;
  isBorrowing?: boolean;
};

export function CatalogTable({ books, onBorrow, isBorrowing }: CatalogTableProps) {
  if (books.length === 0) {
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
        No books available yet.
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

  const actionButtonStyle: CSSProperties = {
    border: 0,
    borderRadius: "999px",
    padding: "0.7rem 1rem",
    background: "linear-gradient(135deg, #0f172a, #334155)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headCellStyle}>Title</th>
          <th style={headCellStyle}>Author</th>
          <th style={headCellStyle}>Category</th>
          <th style={headCellStyle}>Available</th>
          <th style={headCellStyle}>Total</th>
          {onBorrow ? <th style={headCellStyle}>Action</th> : null}
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id} style={{ background: "white" }}>
            <td style={cellStyle}>{book.title}</td>
            <td style={cellStyle}>{book.author}</td>
            <td style={cellStyle}>{book.category}</td>
            <td style={cellStyle}>{book.availableCopies}</td>
            <td style={cellStyle}>{book.totalCopies}</td>
            {onBorrow ? (
              <td style={cellStyle}>
                <button
                  type="button"
                  disabled={isBorrowing || book.availableCopies <= 0}
                  onClick={() => onBorrow(book.id)}
                  style={actionButtonStyle}
                >
                  {book.availableCopies <= 0 ? "Unavailable" : "Borrow"}
                </button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

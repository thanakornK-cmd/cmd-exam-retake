type OverdueReportRow = {
  member: string;
  book: string;
  dueDate: string;
  overdueDays: number;
  fine: number;
};

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function buildContentStream(rows: OverdueReportRow[]) {
  const lines = [
    "BT",
    "/F1 18 Tf",
    "40 550 Td",
    "(Overdue Loans Report) Tj",
    "/F1 10 Tf",
    "0 -30 Td",
    `(Rows: ${rows.length}) Tj`,
  ];

  rows.forEach((row) => {
    lines.push(`0 -16 Td`);
    lines.push(
      `(${escapePdfText(
        `${row.member} | ${row.book} | ${row.dueDate} | ${row.overdueDays} | ${row.fine} THB`,
      )}) Tj`,
    );
  });

  lines.push("ET");
  return lines.join("\n");
}

export async function buildOverdueReportPdf(rows: OverdueReportRow[]) {
  const objects: string[] = [];
  const content = buildContentStream(rows);

  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
  objects.push(
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
  );
  objects.push("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push(
    `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
  );

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = ["0000000000 65535 f \n"];
  let position = header.length;

  for (const object of objects) {
    offsets.push(`${String(position).padStart(10, "0")} 00000 n \n`);
    body += `${object}\n`;
    position += `${object}\n`.length;
  }

  const xrefOffset = header.length + body.length;
  const xref = `xref\n0 ${objects.length + 1}\n${offsets.join("")}trailer << /Size ${
    objects.length + 1
  } /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const pdf = `${header}${body}${xref}`;

  return new TextEncoder().encode(pdf);
}

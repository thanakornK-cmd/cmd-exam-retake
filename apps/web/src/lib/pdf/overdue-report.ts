import fs from "node:fs";
import PDFDocument from "pdfkit";

type OverdueReportRow = {
  member: string;
  book: string;
  dueDate: string;
  overdueDays: number;
  fine: number;
};

function resolveThaiFontPath() {
  const candidates = [
    "/System/Library/Fonts/Supplemental/Thonburi.ttf",
    "/System/Library/Fonts/Supplemental/SukhumvitSet.ttf",
    "/System/Library/Fonts/Supplemental/NotoSansThai.ttc",
  ];

  return candidates.find((path) => fs.existsSync(path));
}

function formatFine(value: number) {
  return `${value.toLocaleString("en-US")} THB`;
}

export async function buildOverdueReportPdf(rows: OverdueReportRow[]) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Uint8Array>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const thaiFontPath = resolveThaiFontPath();
  if (thaiFontPath) {
    doc.registerFont("ReportThai", thaiFontPath);
    doc.font("ReportThai");
  }

  doc.fontSize(20).fillColor("#0f172a").text("Overdue Loans Report");
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor("#475569").text(`Rows: ${rows.length}`);
  doc.moveDown(0.8);

  const columns = [
    { key: "member", label: "Member", width: 110 },
    { key: "book", label: "Book", width: 220 },
    { key: "dueDate", label: "Due Date", width: 90 },
    { key: "overdueDays", label: "Overdue", width: 60 },
    { key: "fine", label: "Fine", width: 70 },
  ] as const;

  let y = doc.y;
  const startX = 40;
  const rowHeight = 22;
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  doc.roundedRect(startX, y, tableWidth, rowHeight, 3).fill("#e2e8f0");
  doc.fillColor("#0f172a").fontSize(10);

  let x = startX + 6;
  for (const col of columns) {
    doc.text(col.label, x, y + 6, { width: col.width - 12 });
    x += col.width;
  }

  y += rowHeight;

  for (const row of rows) {
    if (y > 780) {
      doc.addPage();
      y = 40;
    }

    doc.rect(startX, y, tableWidth, rowHeight).fill(y % (rowHeight * 2) === 0 ? "#ffffff" : "#f8fafc");
    doc.fillColor("#1e293b").fontSize(10);

    const values = [
      row.member,
      row.book,
      row.dueDate,
      String(row.overdueDays),
      formatFine(row.fine),
    ];

    x = startX + 6;
    for (let index = 0; index < columns.length; index += 1) {
      doc.text(values[index], x, y + 6, { width: columns[index].width - 12, ellipsis: true });
      x += columns[index].width;
    }

    y += rowHeight;
  }

  doc.end();
  return done;
}

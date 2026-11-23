import { jsPDF } from "jspdf";
import { KitData } from "./types";

export function generatePdfKit(data: KitData) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      return true;
    }
    return false;
  };

  const r = data.tailoredResume;

  // ==========================================
  // PAGE 1: TAILORED ATS RESUME
  // ==========================================

  // Header: Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text((r.fullName || "CANDIDATE NAME").toUpperCase(), margin, cursorY);
  cursorY += 7;

  // Target Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235); // brand-600
  doc.text(r.targetTitle || "Professional Specialist", margin, cursorY);
  cursorY += 5;

  // Contact info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(r.contact || "Email | Phone | Location", margin, cursorY);
  cursorY += 4;

  // Horizontal Divider
  doc.setDrawColor(30, 58, 138); // navy
  doc.setLineWidth(0.6);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 6;

  // Section 1: Professional Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text("PROFESSIONAL SUMMARY", margin, cursorY);
  cursorY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(r.summary || "", contentWidth);
  doc.text(summaryLines, margin, cursorY);
  cursorY += summaryLines.length * 4.2 + 4;

  // Section 2: Core Competencies & Skills
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text("CORE COMPETENCIES & ATS KEYWORDS", margin, cursorY);
  cursorY += 4.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Technical Skills: ", margin, cursorY);
  doc.setFont("helvetica", "normal");
  const techLines = doc.splitTextToSize(r.skills?.technical || "None specified", contentWidth - 28);
  doc.text(techLines, margin + 28, cursorY);
  cursorY += Math.max(4.5, techLines.length * 4);

  doc.setFont("helvetica", "bold");
  doc.text("Methodologies: ", margin, cursorY);
  doc.setFont("helvetica", "normal");
  const methLines = doc.splitTextToSize(r.skills?.methodologies || "Agile, CI/CD, SDLC", contentWidth - 28);
  doc.text(methLines, margin + 28, cursorY);
  cursorY += Math.max(4.5, methLines.length * 4);

  doc.setFont("helvetica", "bold");
  doc.text("Soft Skills: ", margin, cursorY);
  doc.setFont("helvetica", "normal");
  const softLines = doc.splitTextToSize(r.skills?.leadership || "Cross-functional Collaboration, Problem Solving", contentWidth - 28);
  doc.text(softLines, margin + 28, cursorY);
  cursorY += Math.max(5.5, softLines.length * 4 + 2);

  // Section 3: Professional Experience
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text("PROFESSIONAL EXPERIENCE", margin, cursorY);
  cursorY += 5;

  (r.experience || []).forEach((exp) => {
    checkPageBreak(25);
    // Role & Company
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${exp.role} — `, margin, cursorY);
    const roleWidth = doc.getTextWidth(`${exp.role} — `);
    doc.setTextColor(37, 99, 235);
    doc.text(exp.company, margin + roleWidth, cursorY);

    // Period (aligned right)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(exp.period, pageWidth - margin, cursorY, { align: "right" });
    cursorY += 4.5;

    // Bullets
    (exp.bullets || []).forEach((bullet) => {
      const bulletLines = doc.splitTextToSize(bullet, contentWidth - 5);
      checkPageBreak(bulletLines.length * 4 + 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text("•", margin + 1, cursorY);
      doc.text(bulletLines, margin + 5, cursorY);
      cursorY += bulletLines.length * 3.8 + 1.5;
    });
    cursorY += 3;
  });

  // Section 4: Education
  checkPageBreak(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text("EDUCATION & CREDENTIALS", margin, cursorY);
  cursorY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const eduLines = doc.splitTextToSize(r.education || "Bachelor's Degree in Related Field", contentWidth);
  doc.text(eduLines, margin, cursorY);

  // ==========================================
  // PAGE BREAK: INTERVIEW MASTER GUIDE
  // ==========================================
  doc.addPage();
  cursorY = margin;

  // Guide Header
  doc.setFillColor(239, 246, 255); // brand-50
  doc.rect(margin, cursorY, contentWidth, 24, "F");
  doc.setDrawColor(191, 219, 254);
  doc.rect(margin, cursorY, contentWidth, 24, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text("ReadyResume — Tailored Interview Preparation Master Guide", margin + 4, cursorY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Role: ${r.targetTitle || "Target Role"}  |  ATS Compatibility Score: ${data.atsScore}%  |  Tailored by Llama 3.3 AI`,
    margin + 4,
    cursorY + 13
  );
  doc.text(
    "Structured STAR answers (Situation, Task, Action, Result) for 3 Technical & 3 Behavioral Questions.",
    margin + 4,
    cursorY + 18
  );
  cursorY += 30;

  // 8 Interview Questions
  (data.interviewQuestions || []).forEach((q, idx) => {
    checkPageBreak(35);

    // Question Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const qHeader = `Q${idx + 1} [${q.type === "technical" ? "Technical" : "Behavioral"} - ${q.category || "Core"}]:`;
    doc.text(qHeader, margin, cursorY);
    cursorY += 4.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    const qLines = doc.splitTextToSize(q.question, contentWidth - 4);
    doc.text(qLines, margin + 2, cursorY);
    cursorY += qLines.length * 4 + 2;

    // Answer body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    if (typeof q.sampleAnswer === "object" && q.sampleAnswer !== null) {
      const sa = q.sampleAnswer;
      const parts = [
        { label: "Situation", text: sa.situation },
        { label: "Task", text: sa.task },
        { label: "Action", text: sa.action },
        { label: "Result", text: sa.result },
      ];

      parts.forEach((p) => {
        if (!p.text) return;
        checkPageBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`[${p.label}]: `, margin + 2, cursorY);
        const labelW = doc.getTextWidth(`[${p.label}]: `);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        const textLines = doc.splitTextToSize(p.text, contentWidth - labelW - 4);
        doc.text(textLines, margin + 2 + labelW, cursorY);
        cursorY += textLines.length * 3.6 + 1;
      });
    } else if (typeof q.sampleAnswer === "string") {
      const answerLines = doc.splitTextToSize(q.sampleAnswer, contentWidth - 4);
      checkPageBreak(answerLines.length * 3.6 + 4);
      doc.text(answerLines, margin + 2, cursorY);
      cursorY += answerLines.length * 3.6 + 1;
    }

    if (q.proTip) {
      checkPageBreak(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(29, 78, 216);
      const tipLines = doc.splitTextToSize(`💡 Coach Tip: ${q.proTip}`, contentWidth - 4);
      doc.text(tipLines, margin + 2, cursorY);
      cursorY += tipLines.length * 3.6 + 1;
    }

    cursorY += 4;
  });

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ReadyResume — Career Accelerator Suite  |  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  const safeName = (r.fullName || "Candidate").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  doc.save(`ReadyResume-Career-Kit-${safeName}.pdf`);
}

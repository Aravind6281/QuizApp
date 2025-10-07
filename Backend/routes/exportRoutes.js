import express from "express";
import Result from "../models/Result.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";

const router = express.Router();

// 📄 CSV Export
router.get("/csv", async (req, res) => {
  const results = await Result.find().populate("user quiz");
  const fields = ["user.name", "quiz.title", "score", "percentage"];
  const parser = new Parser({ fields });
  const csv = parser.parse(results);

  res.header("Content-Type", "text/csv");
  res.attachment("quiz_results.csv");
  return res.send(csv);
});

// 🧾 PDF Export
router.get("/pdf", async (req, res) => {
  const results = await Result.find().populate("user quiz");
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=quiz_report.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Quiz Results Report", { align: "center" });
  doc.moveDown();
  results.forEach((r, i) => {
    doc
      .fontSize(12)
      .text(
        `${i + 1}. ${r.user.name} - ${r.quiz.title} - ${r.percentage}%`,
        { continued: false }
      );
  });
  doc.end();
});

export default router;

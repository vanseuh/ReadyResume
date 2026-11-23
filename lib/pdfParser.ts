/**
 * Client-Side PDF Text Extractor
 * Parses PDF files in the user's browser using pdfjs-dist without sending files to any server (0 token cost).
 */

export async function extractTextFromPdfFile(file: File): Promise<{ text: string; error?: string }> {
  try {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return { text: "", error: "Please upload a valid .pdf resume file." };
    }

    if (file.size > 8 * 1024 * 1024) {
      return { text: "", error: "File is too large (maximum 8MB allowed)." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import("pdfjs-dist");

    // Configure worker source for browser
    if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    });

    const pdf = await loadingTask.promise;
    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageStrings: string[] = [];
      for (const item of textContent.items) {
        if ("str" in item && typeof item.str === "string") {
          pageStrings.push(item.str);
        }
      }
      extractedText += pageStrings.join(" ") + "\n\n";
    }

    const cleaned = extractedText.replace(/\s+/g, " ").trim();

    // Friendly error if scanned image or no selectable text
    if (cleaned.length < 50) {
      return {
        text: "",
        error: "No selectable text found in this PDF. It appears to be a scanned image or empty. Please upload a text-based PDF or paste your resume content directly.",
      };
    }

    // Limit to 8,000 characters
    const cappedText = cleaned.slice(0, 8000);
    return { text: cappedText };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PDF Parsing Error:", error);
    return {
      text: "",
      error: "Unable to parse this PDF file. Please ensure it is not password-protected or paste your resume directly.",
    };
  }
}

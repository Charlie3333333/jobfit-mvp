export async function readResume(file) {
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error("Choose a file smaller than 5 MB.");
  const extension = file.name.split(".").at(-1).toLowerCase();
  let text = "";
  if (extension === "txt") text = await file.text();
  else if (extension === "docx") {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const result = await (mammoth.extractRawText || mammoth.default.extractRawText)({ arrayBuffer: await file.arrayBuffer() });
    text = result.value;
  } else if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const loading = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false });
    try {
      const pdf = await loading.promise;
      if (pdf.numPages > 30) throw new Error("Choose a resume with 30 pages or fewer.");
      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number);
        const content = await page.getTextContent();
        const rows = [];
        for (const item of content.items) {
          if (!item.str?.trim()) continue;
          const y = item.transform[5];
          let row = rows.find(row => Math.abs(row.y - y) < 3);
          if (!row) rows.push(row = { y, items: [] });
          row.items.push(item);
        }
        text += rows.sort((a, b) => b.y - a.y).map(row => {
          const items = row.items.sort((a, b) => a.transform[4] - b.transform[4]);
          return items.map((item, i) => {
            const previous = items[i - 1];
            const gap = previous ? item.transform[4] - previous.transform[4] - previous.width : 0;
            return `${i ? gap > 25 ? " | " : " " : ""}${item.str}`;
          }).join("");
        }).join("\n") + "\n";
        if (text.length > 200000) throw new Error("This document contains too much text. Choose a shorter resume.");
      }
    } finally { await loading.destroy(); }
  } else throw new Error("Choose a PDF, DOCX, or TXT file. Old .doc files are not supported.");
  if (text.length > 200000) throw new Error("This document contains too much text. Choose a shorter resume.");
  if (text.trim().length < 40) throw new Error("No readable text found. Scanned images need OCR first; upload a text-based PDF or DOCX.");
  return text;
}

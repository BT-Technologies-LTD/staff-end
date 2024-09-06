// import path, { format } from "path";
// import { fileURLToPath } from "url";
import { chromium } from "playwright";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export default async function createPayslip(htmlContent) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return pdfBuffer;
}

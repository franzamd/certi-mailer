import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { config } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('base64ImageSrc', function (imagePath) {
  const fullImagePath = path.join(__dirname, '..', imagePath);
  if (!fs.existsSync(fullImagePath)) {
    throw new Error(`Image file not found: ${fullImagePath}`);
  }
  const bitmap = fs.readFileSync(fullImagePath);
  const base64String = bitmap.toString('base64');
  return new Handlebars.SafeString(`data:image/png;base64,${base64String}`);
});

Handlebars.registerHelper('safeString', function (html) {
  return new Handlebars.SafeString(html);
});

async function generateCertificate(participant, certificateCount, event, options = config) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const templatePath = path.join(__dirname, '../templates/certificate_template.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);

  // Generate URL for QR
  const qrURLWithCode = `${event.qrURL}?participantCode=${participant.code}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrURLWithCode);

  const htmlTemplate = template({
    qrCodeDataUrl,
    participant,
    event,
    options
  });

  await page.setContent(htmlTemplate);

  // Config output pdf 
  let pdfFileName = `${participant.name} - ${participant.role}.pdf`;
  if (options.includeNumbering) {
    pdfFileName = options.numberingFormat
      .replace('{number}', certificateCount)
      .replace('{name}', participant.name)
      .replace('{role}', participant.role) + '.pdf';
  }
  const pdfPath = path.join(__dirname, '../certificates', pdfFileName);
  await page.pdf({ format: 'Letter', path: pdfPath, landscape: true, printBackground: true });

  await browser.close();
  return pdfPath;
}

export { generateCertificate };
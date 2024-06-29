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

Handlebars.registerHelper('upper', function (text) {
  return text.toUpperCase();
});

Handlebars.registerHelper('formatDescription', function (description, role, eventName, teacher, hours) {
  const formattedRole = role ? role.toUpperCase() : '';
  const formattedEventName = eventName ? eventName.toUpperCase() : '';
  const formattedTeacher = teacher ? teacher.toUpperCase() : '';
  const formattedDescription = description
    .replace('{{role}}', `<strong>${formattedRole}</strong>`)
    .replace('{{eventName}}', `<strong>${formattedEventName}</strong>`)
    .replace('{{teacher}}', `<strong>${formattedTeacher}</strong>`)
    .replace('{{hours}}', hours)
    .replace(/\n/g, '<br>');
  return new Handlebars.SafeString(formattedDescription);
});

Handlebars.registerHelper('splitEventName', function (eventName, specialCase) {
  let splitIndex = eventName.indexOf(specialCase);

  if (splitIndex > -1) {
    // Si el caso especial está presente, asegurarse de que esté en la primera línea
    const firstLine = specialCase;
    const secondLine = eventName.substring(splitIndex + specialCase.length).trim();
    return new Handlebars.SafeString(`${firstLine}<br>${secondLine}`);
  } else {
    // Si el caso especial no está presente, usar la lógica original
    const splitWords = ['de', 'en'];
    splitWords.forEach(word => {
      const index = eventName.indexOf(word);
      if (index > -1 && (splitIndex === -1 || index < splitIndex)) {
        splitIndex = index;
      }
    });

    if (splitIndex > -1) {
      const firstLine = eventName.substring(0, splitIndex).trim();
      const secondLine = eventName.substring(splitIndex).trim();
      return new Handlebars.SafeString(`${firstLine}<br>${secondLine}`);
    } else {
      // Si no se encuentra ninguna palabra clave, devolver el texto original
      return eventName;
    }
  }
});

async function generateCertificate(participant, certificateCount, event, certificate, options = config) {
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
    certificate,
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
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

import { config } from '../config/config.js';
import { getCertificateTitle } from '../utils/certificateUtils.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read JSON file
function readJSONFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Function to replace placeholders in email data
function replacePlaceholders(emailData, participant, eventData) {
  emailData.subject = emailData.subject.replace('{{eventName}}', eventData.name);
  emailData.headerTitle = getCertificateTitle(participant.role);
  emailData.senderRole = emailData.senderRole.replace('{{entityName}}', emailData.entityName);
  return emailData;
}

async function sendCertificateByEmail(participant) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const pdfPath = participant.pdfPath;

  // Check if the PDF file exists
  if (!fs.existsSync(pdfPath)) {
    logger.error(`❌ PDF file not found: ${pdfPath}`);
    throw new Error(`PDF file not found: ${pdfPath}`);
  }

  // Read email.json and event.json
  const emailFile = path.join(__dirname, '../data/email.json');
  const emailData = readJSONFile(emailFile);

  const eventFile = path.join(__dirname, '../data/event.json');
  const eventData = readJSONFile(eventFile);

  // Replace placeholders in email data
  const updatedEmailData = replacePlaceholders(emailData, participant, eventData);

  // Read the Handlebars template
  const templatePath = path.join(__dirname, '../templates/email_template.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  // Config options template
  const emailTemplateOptions = config.emailTemplate;

  const template = Handlebars.compile(templateSource);

  // Render the template with participant data
  const htmlContent = template({
    headerTitle: updatedEmailData.headerTitle,
    salutation: updatedEmailData.salutation,
    participantName: participant.name,
    bodyText: updatedEmailData.bodyText,
    eventName: eventData.name,
    eventDate: eventData.date,
    eventMode: updatedEmailData.eventMode,
    sender: updatedEmailData.sender,
    senderRole: updatedEmailData.senderRole,
    labels: updatedEmailData.labels,
    options: emailTemplateOptions,
    linkText: updatedEmailData.linkText,
    linkUrl: updatedEmailData.linkUrl,
    entityName: updatedEmailData.entityName
  });

  const mailOptions = {
    from: `"${emailData.entityName}" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.REPLY_TO_EMAIL || process.env.EMAIL_USER,
    to: participant.email,
    subject: updatedEmailData.subject,
    html: htmlContent,
    attachments: [
      { filename: `${participant.name}.pdf`, path: pdfPath }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

export { sendCertificateByEmail };
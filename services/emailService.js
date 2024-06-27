import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sendCertificateByEmail(participant) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const pdfPath = participant.pdfPath;

  // Read email.json and get subject and text mail
  const emailFile = path.join(__dirname, '../data/email.json');
  const emailData = JSON.parse(fs.readFileSync(emailFile, 'utf-8'));

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: participant.email,
    subject: emailData.subject,
    text: emailData.text,
    attachments: [
      { filename: `${participant.name}.pdf`, path: pdfPath }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`✔️ [${participant.id}] Certificate sent to ${participant.email} for ${participant.name}`);
  } catch (error) {
    logger.error(`❌ [${participant.id}] Failed to send certificate to ${participant.email} for ${participant.name}: ${error.message}`);
    throw error;
  }
}

export { sendCertificateByEmail };
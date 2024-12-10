import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { sendCertificateByEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function sendCertificates() {
  const filePath = path.join(__dirname, '../data/participants.json');
  const participants = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let sentCount = 0;
  let errorCount = 0;
  let errorIds = [];

  for (const participant of participants) {
    try {
      await sendCertificateByEmail(participant);
      sentCount++;
      logger.info(`✅ Certificate sent to ${participant.email} for ${participant.name} with role ${participant.role}`);
    } catch (error) {
      errorCount++;
      errorIds.push(participant.id);
      logger.error(`❌ Failed to send certificate to ${participant.email} for ${participant.name}: ${error.message}`);
    }
  }

  if (errorCount > 0) {
    logger.info(`Total ${sentCount} Certificates sent successfully, ${errorCount} with errors. IDs with errors: ${errorIds.join(', ')}`);
  } else {
    logger.info(`Total ${sentCount} Certificates sent successfully!`);
  }
}

export default sendCertificates;
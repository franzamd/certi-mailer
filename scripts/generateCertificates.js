import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { generateCertificate } from '../services/certificateService.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateCertificates() {
  // Read participants and event data from JSON files
  const participantsFilePath = path.join(__dirname, '../data/participants.json');
  const eventFilePath = path.join(__dirname, '../data/event.json');

  const participants = JSON.parse(fs.readFileSync(participantsFilePath, 'utf-8'));
  const event = JSON.parse(fs.readFileSync(eventFilePath, 'utf-8'));

  let sentCount = 0;
  let errorCount = 0;
  let errorIds = [];

  // Send certificate for each participant
  for (const participant of participants) {
    try {
      sentCount++;
      const pdfPath = await generateCertificate(participant, sentCount, event);
      logger.info(`✅ [${participant.id}] Certificate generated for ${participant.name} - ${participant.role}`);

      // Update participant with the PDF path
      participant.pdfPath = pdfPath;
    } catch (error) {
      errorCount++;
      errorIds.push(participant.id);
      logger.error(`❌ [${participant.id}] Failed to generate certificate for ${participant.name} - ${participant.role}. Error: ${error.message}`);
    }
  }

  // Save updated participants data
  fs.writeFileSync(participantsFilePath, JSON.stringify(participants, null, 2));

  if (errorCount > 0) {
    logger.error(`Total ${sentCount} Certificates processed, ${errorCount} with errors. IDs with errors: ${errorIds.join(', ')}`);
  } else {
    logger.info(`Total ${sentCount} Certificates generated successfully!`);
  }
}

export default generateCertificates;
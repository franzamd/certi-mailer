import minimist from 'minimist';
import generateCertificates from './generateCertificates.js';
import sendCertificates from './sendCertificates.js';
import logger from '../utils/logger.js';

const args = minimist(process.argv.slice(2));

const main = async () => {
  try {
    if (args.generate || args.all) {
      await generateCertificates();
    }
    if (args.send || args.all) {
      await sendCertificates();
    }
  } catch (error) {
    logger.error(`Unexpected error: ${error.message}`);
    process.exit(1); // Exit with error code
  }
};

main();
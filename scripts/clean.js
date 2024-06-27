import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const confirmAction = async (question, action) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question + ' (yes/no) ', (answer) => {
      rl.close();
      if (answer.toLowerCase() === 'yes') {
        action().then(resolve).catch(resolve);
      } else {
        resolve(false);
      }
    });
  });
};

const cleanData = async () => {
  const participantsFilePath = path.join(__dirname, '../data/participants.json');
  const emailFilePath = path.join(__dirname, '../data/email.json');
  const eventFilePath = path.join(__dirname, '../data/event.json');
  const logFilePath = path.join(__dirname, '../logs/app.log');
  const certificatesDirPath = path.join(__dirname, '../certificates');

  const clearParticipants = () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(participantsFilePath, JSON.stringify([], null, 2), (err) => {
        if (err) {
          logger.error('Failed to clear participants data.', err);
          reject(err);
        } else {
          logger.info('Participants data has been cleared.');
          resolve();
        }
      });
    });
  };

  const clearEmail = () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(emailFilePath, JSON.stringify({}, null, 2), (err) => {
        if (err) {
          logger.error('Failed to clear email data.', err);
          reject(err);
        } else {
          logger.info('Email data has been cleared.');
          resolve();
        }
      });
    });
  };

  const clearEvent = () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(eventFilePath, JSON.stringify({}, null, 2), (err) => {
        if (err) {
          logger.error('Failed to clear event data.', err);
          reject(err);
        } else {
          logger.info('Event data has been cleared.');
          resolve();
        }
      });
    });
  };

  const clearLogFile = () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(logFilePath, '', (err) => {
        if (err) {
          logger.error('Failed to clear log file.', err);
          reject(err);
        } else {
          logger.info('Log file has been cleared.');
          resolve();
        }
      });
    });
  };

  const clearCertificates = () => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(certificatesDirPath)) {
        fs.readdir(certificatesDirPath, (err, files) => {
          if (err) {
            logger.error('Failed to read certificates directory.', err);
            reject(err);
          } else {
            const deletePromises = files.map((file) => {
              const filePath = path.join(certificatesDirPath, file);
              return new Promise((resolve, reject) => {
                fs.stat(filePath, (err, stats) => {
                  if (err) {
                    reject(err);
                  } else if (stats.isFile()) {
                    fs.unlink(filePath, (err) => {
                      if (err) {
                        logger.error(`Failed to delete certificate file ${filePath}.`, err);
                        reject(err);
                      } else {
                        logger.info(`Certificate file ${filePath} has been deleted.`);
                        resolve();
                      }
                    });
                  } else {
                    resolve();
                  }
                });
              });
            });
            Promise.all(deletePromises)
              .then(resolve)
              .catch(reject);
          }
        });
      } else {
        logger.info('Certificate directory does not exist.');
        resolve();
      }
    });
  };

  try {
    await confirmAction('Are you sure you want to clear the participants data', clearParticipants);
    await confirmAction('Are you sure you want to clear the email data', clearEmail);
    await confirmAction('Are you sure you want to clear the event data', clearEvent);
    await confirmAction('Are you sure you want to clear the log file', clearLogFile);
    await confirmAction('Are you sure you want to delete all certificate files', clearCertificates);
  } catch (error) {
    logger.error('Cleaning process failed.', error);
  }
};

// Start the cleaning process
cleanData();
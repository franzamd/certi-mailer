import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

const args = minimist(process.argv.slice(2));
const inputFileName = typeof args.input === 'string' ? args.input : 'participants.csv';
const inputFilePath = path.join(process.cwd(), 'inputs', inputFileName);
const outputFilePath = path.join(process.cwd(), 'outputs', 'participants.json');

function generateRandomCode() {
  return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
}

function processData(data) {
  return data.map((participant, index) => {
    const { Name, Role, Email, Description, ...rest } = participant;
    if (!Name || !Role || Object.keys(rest).length > 0) {
      logger.error(`❌ Invalid participant data: ${JSON.stringify(participant)}`);
      return null;
    }
    return {
      id: index + 1,
      name: Name.toUpperCase(),
      role: Role,
      email: Email || null,
      code: generateRandomCode(),
      description: Description || null,
    };
  }).filter(participant => participant !== null);
}

function detectSeparator(filePath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { start: 0, end: 1024 }); // Lee los primeros 1024 bytes
    let buffer = '';

    stream.on('data', (chunk) => {
      buffer += chunk.toString();
    });

    stream.on('end', () => {
      const commaCount = (buffer.match(/,/g) || []).length;
      const semicolonCount = (buffer.match(/;/g) || []).length;
      resolve(commaCount > semicolonCount ? ',' : ';');
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

async function readCSV(filePath) {
  const separator = await detectSeparator(filePath);
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator }))
      .on('data', (data) => {
        // Clean ids empty
        const cleanedData = {};
        for (const key in data) {
          if (data[key] !== '') {
            cleanedData[key] = data[key];
          }
        }
        results.push(cleanedData);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

async function importData() {
  try {
    let data;
    if (inputFilePath.endsWith('.csv')) {
      data = await readCSV(inputFilePath);
    } else if (inputFilePath.endsWith('.xlsx')) {
      data = readExcel(inputFilePath);
    } else {
      throw new Error('Unsupported file format');
    }

    const processedData = processData(data);
    fs.writeFileSync(outputFilePath, JSON.stringify(processedData, null, 2));
    logger.info(`✅ Data has been imported and saved to ${outputFilePath}`);
    return processedData;
  } catch (error) {
    logger.error(`❌ Error importing data: ${error.message}`);
    throw error;
  }
}

importData().catch(console.error);
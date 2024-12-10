import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import logger from '../utils/logger.js';

const args = minimist(process.argv.slice(2));
const outputFileName = typeof args.output === 'string' ? args.output : 'exported_participants.csv';
const outputFilePath = path.join(path.resolve(), 'outputs', outputFileName);
const inputFilePath = path.join(path.resolve(), 'outputs', 'participants.json');

function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeCSV(filePath, data) {
  const header = [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Name' },
    { id: 'role', title: 'Role' },
    { id: 'email', title: 'Email' },
    { id: 'code', title: 'Code' },
  ];

  const csvContent = [
    header.map(item => item.title).join(','),
    ...data.map(row => header.map(item => row[item.id]).join(','))
  ].join('\n');

  fs.writeFileSync(filePath, csvContent);
}

function writeExcel(filePath, data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
  XLSX.writeFile(workbook, filePath);
}

async function exportData() {
  const data = readJSON(inputFilePath);

  if (outputFilePath.endsWith('.csv')) {
    writeCSV(outputFilePath, data);
  } else if (outputFilePath.endsWith('.xlsx')) {
    writeExcel(outputFilePath, data);
  } else {
    throw new Error('Unsupported file format');
  }
  logger.info(`✅ Data has been exported and saved to ${outputFilePath}`);
}

exportData().catch(error => logger.error(`❌ Error exporting data: ${error.message}`));
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const outputFileName = args.output || 'exported_participants.csv';
const outputFilePath = path.join(__dirname, '..', 'outputs', outputFileName);
const inputFilePath = path.join(__dirname, '..', 'outputs', 'participants.json');

function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeCSV(filePath, data) {
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'role', title: 'Role' },
      { id: 'email', title: 'Email' },
      { id: 'code', title: 'Code' },
    ],
  });
  return csvWriter.writeRecords(data);
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
    await writeCSV(outputFilePath, data);
  } else if (outputFilePath.endsWith('.xlsx')) {
    writeExcel(outputFilePath, data);
  } else {
    throw new Error('Unsupported file format');
  }
  console.log(`Data has been exported and saved to ${outputFilePath}`);
}

exportData().catch(console.error);
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

const inputFileName = args.input || 'participants.csv';
const inputFilePath = path.join(__dirname, '..', 'inputs', inputFileName);
const outputFilePath = path.join(__dirname, '..', 'outputs', 'participants.json');

function generateRandomCode() {
  return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
}

function processData(data) {
  return data.map((participant, index) => ({
    id: index + 1,
    name: participant.name.toUpperCase(),
    role: participant.role,
    email: participant.email,
    code: generateRandomCode(),
  }));
}

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
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
  console.log(`Data has been imported and saved to ${outputFilePath}`);
  return processedData;
}

importData().catch(console.error);
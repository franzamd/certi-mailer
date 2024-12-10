import fs from 'fs';
import path from 'path';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const inputFilePath = args.input ? path.join(process.cwd(), args.input) : null;

// Verificar si se proporcionó un archivo de entrada
if (!inputFilePath) {
  console.error('Error: No input file specified. Please use the --input flag to specify the input file.');
  process.exit(1);
}

// Verificar si el archivo existe
if (!fs.existsSync(inputFilePath)) {
  console.error('Error: The specified input file does not exist:', inputFilePath);
  process.exit(1);
}

// Leer el archivo JSON
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const participants = generateParticipantsJson(jsonData);
    const outputPath = path.join(process.cwd(), 'outputs', 'participants.js');
    fs.writeFile(outputPath, `const participants = ${JSON.stringify(participants, null, 2)};`, (writeErr) => {
      if (writeErr) {
        console.error('Error writing participants file:', writeErr);
      } else {
        console.log('Participants JSON generated successfully at:', outputPath);
      }
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});

// Función para generar el JSON de participantes
function generateParticipantsJson(data) {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    role: item.role,
    code: item.code
  }));
}
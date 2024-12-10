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
    const tableHtml = generateTableHtml(jsonData);
    const outputPath = path.join(process.cwd(), 'outputs', 'table.html');
    fs.writeFile(outputPath, tableHtml, (writeErr) => {
      if (writeErr) {
        console.error('Error writing HTML file:', writeErr);
      } else {
        console.log('HTML table generated successfully at:', outputPath);
      }
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});

// Función para generar la tabla HTML
function generateTableHtml(data) {
  const header = `
    <thead>
      <tr>
        <th>Nro</th>
        <th>NOMBRES Y APELLIDOS</th>
        <th>DEPARTAMENTO</th>
        <th>EN CALIDAD DE</th>
        <th>CÓDIGO DE VERIFICACIÓN</th>
      </tr>
    </thead>
  `;

  const rows = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.role}</td>
      <td>${item.code}</td>
    </tr>
  `).join('');

  const table = `
    <table>
      ${header}
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  return table;
}
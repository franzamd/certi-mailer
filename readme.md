# Certi Mailer

Welcome to Certi Mailer! This Node.js application is designed to streamline the process of managing event participants, generating certificates, and sending them via email.

## Table of Contents

- [Overview](#overview)
- [Available Scripts](#available-scripts)
- [Cleaning Process](#cleaning-process)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Config File](#config-file)
- [Data Files](#data-files)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

Certi Mailer is a comprehensive solution for event organizers who need to manage participant data, generate personalized certificates, and distribute them efficiently. The application ensures that each participant receives a certificate tailored to their participation in the event.

## Available Scripts

You can use the following npm scripts to run various tasks in the project:

- `start`: Runs the main script (execute generate-certificates and send-certificates).

```bash
  npm start
```

- `generate-certificates`: Generates certificates (.pdf) for participants and save in certificates folder.

```bash
npm run generate-certificates
```

- `send-certificates`: Send certificates for participants vía email.

```bash
npm run send-certificates
```

- `convert-data`: Converts data from one format to another (.csv o .xlsx).

```bash
npm run convert-data -- --input <input-file> --output <output-file>
```

- `export-data`: Exports data to various formats.

```bash
npm run export-data -- --output <output-file>
```

- `clean`: Clears participant data, log files, and removes all files from the certificates directory.

```bash
npm run clean
```

- `lint`: Lints the codebase using ESLint.

```bash
npm run lint
```

- `test`: Runs tests using Jest.

```bash
npm run test
```

## Cleaning Process

The `clean.js` script performs the following actions:

1. Clears the `participants.json` file.
2. Clears the `email.json` file.
3. Clears the `event.json` file.
4. Clears the `app.log` file.
5. Deletes all files in the `certificates` directory.

To execute the cleaning process, ensure you have the necessary permissions and run:

```bash
npm run clean
```

You will be prompted to confirm each action before it is executed.

## Configuration

### Environment Variables

Create a `.env` file in the project root directory and set the following environment variables:

```bash
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

Replace the placeholders with your SMTP server details.

### Config File

The `config/config.js` file contains the configuration for the application. Ensure you set the necessary options for the application to function correctly.

## Data Files

- `data/email.json`: Contains email configuration and templates.
- `data/event.json`: Contains event details such as name, date, and location.
- `data/participants.json`: Contains participant data including names, roles, and email addresses.

### `data/email.json`

This file contains the email configuration and templates. Ensure you include the following fields:

```json
{
  "subject": "Your Certificate",
  "text": "Thank you for participating in our event. Please find your certificate attached."
}
```

### data/event.json

This file contains the details of the event. Ensure you include the following fields:

```json
{
  "name": "Event Name",
  "date": "Event Date",
  "location": "Event Location",
  "qrURL": "https://example.com/verification"
}
```

### data/participants.json

This file contains the participant data. Ensure you include the following fields for each participant:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "role": "Speaker",
    "email": "john.doe@example.com",
    "code": "ABC123"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "role": "Attendee",
    "email": "jane.smith@example.com",
    "code": "XYZ789"
  }
]
```

## Assets

The assets directory contains the background images used for the certificates:

    •	assets/first_page_bg.png: Background image for the first page of the certificate.
    •	assets/second_page_bg.png: Background image for the second page of the certificate.

Ensure these images are present in the assets directory to correctly generate the certificates.

## Dependencies

The project dependencies are listed in the `package.json` file. To install the dependencies, run:

```bash
npm install
```

## Usage

To use the application, run the appropriate script as needed:

```bash
# Run the main script
npm start

# Generate certificates
npm run generate-certificates

# Send certificates
npm run send-certificates

# Convert data
npm run convert-data -- --input <input-file> --output <output-file>

# Export data
npm run export-data -- --output <output-file>

# Clean the project
npm run clean
```

## Contributing

Contributions are welcome. Please read the `CONTRIBUTING.md` file for guidelines on how to contribute to the project.

## License

This project is licensed under the XYZ License. See the `LICENSE` file for details.

## Contact

For any inquiries or issues, please contact the project administrator at [franz.medrano@icloud.com](mailto:email@example.com).

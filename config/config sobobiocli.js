export const config = {
  textPositions: {
    conferTitle: { top: '200px', left: '465px' },
    title: { top: '245px', left: '300px' },
    name: { top: '370px', left: '170px' },
    role: { top: '150px', left: '300px' },
    qrCode: { top: '650px', left: '940px' },
    verificationCode: { top: '745px', left: '940px' },
    description: { top: '430px', left: '170px' },
    date: { top: '550px', left: '170px' },
    labelA: { top: '400px', left: '130px' },
    underline: { top: '425px', left: '170px' }
  },
  boxWidths: {
    conferTitle: '300px',
    title: '400px',
    name: '780px',
    role: '400px',
    qrCode: '100px',
    verificationCode: '100px',
    description: '780px',
    date: '780px',
    labelA: '28px',
    underline: '800px'
  },
  fontSizes: {
    conferTitle: '18px',
    title: '66px',
    name: '24px',
    role: '18px',
    verificationCode: '11px',
    description: '16px',
    date: '14px',
    labelA: '28px'
  },
  lineHeights: {
    conferTitle: '1',
    title: '1.1',
    name: '1.3',
    role: '1.2',
    verificationCode: '1.2',
    description: '1.5',
    date: '1.2',
    labelA: '1.2'
  },
  letterSpacings: {
    conferTitle: '0.5px',
    title: '5px',
    labelA: '0.5px'
  },
  colors: {
    conferTitle: '#18273D',
    title: '#18273D',
    verificationCode: '#fff',
    labelA: '#000',
    underline: '#D4D5D6'
  },
  fontWeights: {
    conferTitle: '600',
    title: '800',
    name: '700',
    role: '400',
    verificationCode: '400',
    description: '400',
    date: '400',
    labelA: '400'
  },
  fontStyles: {
    conferTitle: 'italic',
    title: 'normal',
    name: 'normal',
    role: 'normal',
    verificationCode: 'normal',
    description: 'normal',
    date: 'normal',
    labelA: 'normal'
  },
  underlineHeight: '2px',
  showBorders: false,
  numberOfPages: 2,
  includeNumbering: false,
  numberingFormat: '{number} - {name} - {role}',
  textAlignments: {
    conferTitle: 'left',
    title: 'center',
    name: 'center',
    role: 'center',
    verificationCode: 'center',
    description: 'left',
    date: 'center',
    labelA: 'left'
  },
  fonts: {
    family: 'Montserrat, sans-serif',
    url: 'https://fonts.googleapis.com/css?family=Montserrat:400,600,700,800'
  },
  textCase: {
    conferTitle: 'none',
    title: 'uppercase',
    name: 'uppercase',
    labelA: 'none'
  },
  options: {
    showFirstPageBg: true,
    showSecondPageBg: false
  },
  backgroundImages: {
    firstPage: 'assets/first_page_bg.png',
    secondPage: 'assets/second_page_bg.png'
  },
  emailTemplate: {
    body: {
      family: 'Arial, sans-serif',
      size: '16px',
      weight: 'normal',
      style: 'normal',
      color: '#000000'
    }
  },
  qrOptions: {
    qrType: 'participant',
    qrTypes: ['event', 'participant'],
  }
};
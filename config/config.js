export const config = {
  textPositions: {
    title: { top: '50px', left: '300px' },
    name: { top: '100px', left: '300px' },
    role: { top: '150px', left: '300px' },
    qrCode: { top: '200px', left: '300px' },
    verificationCode: { top: '250px', left: '300px' },
    description: { top: '300px', left: '300px' },
    deliveredAt: { top: '350px', left: '300px' }
  },
  boxWidths: {
    title: '400px',
    name: '400px',
    role: '400px',
    qrCode: '100px',
    verificationCode: '400px',
    description: '400px',
    deliveredAt: '400px'
  },
  fontSizes: {
    title: '24px',
    name: '20px',
    role: '18px',
    verificationCode: '16px',
    description: '14px',
    deliveredAt: '16px'
  },
  showBorders: true,
  numberOfPages: 2,
  includeNumbering: false,
  numberingFormat: '{number} - {name} - {role}',
  textAlignments: {
    title: 'center',
    name: 'center',
    role: 'center',
    verificationCode: 'center',
    description: 'left',
    deliveredAt: 'center'
  },
  backgroundImages: {
    firstPage: 'assets/first_page_bg.png',
    secondPage: 'assets/second_page_bg.png'
  }
};
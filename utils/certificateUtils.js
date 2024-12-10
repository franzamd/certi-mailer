export function getCertificateTitle(role) {
  const normalizedRole = role.trim().toLowerCase();

  switch (normalizedRole) {
    case 'participante':
      return 'Certificado de Participación';
    case 'organizador':
      return 'Certificado de Organizador';
    case 'organizadora':
      return 'Certificado de Organizadora';
    case 'coordinador':
      return 'Certificado de Coordinador';
    case 'coordinadora':
      return 'Certificado de Coordinadora';
    case 'expositor':
      return 'Certificado de Expositor';
    case 'expositora':
      return 'Certificado de Expositora';
    case 'moderador':
      return 'Certificado de Moderador';
    case 'moderadora':
      return 'Certificado de Moderadora';
    default:
      return 'Certificado de Evento';
  }
}
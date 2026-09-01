// Site chrome shown around the Spanish Brief Generator. Other pages stay English.
const spanish: Record<string, string> = {
  About: 'Acerca de', Updates: 'Novedades', 'Impact Snapshot': 'Panorama de impacto',
  Evaluate: 'Evaluar', Learn: 'Aprender', 'Knowledge Base': 'Base de conocimiento',
  'Standard and SDGs': 'El estándar y los ODS', Imagine: 'Imaginar', 'Get Involved': 'Participa',
  'Close main navigation': 'Cerrar navegación principal', 'Open main navigation': 'Abrir navegación principal',
  'Main navigation': 'Navegación principal', 'Mobile navigation': 'Navegación móvil',
  'Footer navigation': 'Navegación del pie de página', 'Social media': 'Redes sociales',
  'An open sustainability standard for visual communication and design practitioners': 'Un estándar abierto de sostenibilidad para profesionales de la comunicación visual y el diseño',
  'Get occasional updates about the SD Standard.': 'Recibe novedades ocasionales sobre SD Standard.',
  'Enter your email': 'Escribe tu correo electrónico', Subscribe: 'Suscribirme',
  'Powered by Buttondown.': 'Con tecnología de Buttondown.',
}

export const translateBriefChrome = (text: string, isSpanish: boolean) => isSpanish ? spanish[text] ?? text : text

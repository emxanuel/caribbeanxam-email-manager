// Template definitions
export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  category: 'event' | 'promotion' | 'newsletter' | 'notification';
}

// Template metadata
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'test-event',
    name: 'Evento de Prueba',
    description: 'Plantilla para invitaciones a eventos especiales',
    subject: '¡Estás invitado a nuestro próximo evento! - CaribbeanXam',
    category: 'event'
  },
  {
    id: 'promotion-offer',
    name: 'Oferta Especial',
    description: 'Plantilla para promociones y ofertas especiales',
    subject: '¡Oferta Especial por Tiempo Limitado! - CaribbeanXam',
    category: 'promotion'
  },
  {
    id: 'newsletter',
    name: 'Newsletter Mensual',
    description: 'Plantilla para newsletters mensuales',
    subject: 'Newsletter Mensual - CaribbeanXam',
    category: 'newsletter'
  }
];

// Template content imports
export const templateContent = {
  'test-event': () => import('./test-event.html?raw').then(module => module.default),
  'promotion-offer': () => import('./promotion-offer.html?raw').then(module => module.default),
  'newsletter': () => import('./newsletter.html?raw').then(module => module.default)
};

// Helper function to get template by ID
export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return emailTemplates.find(template => template.id === id);
};

// Helper function to get all templates by category
export const getTemplatesByCategory = (category: EmailTemplate['category']): EmailTemplate[] => {
  return emailTemplates.filter(template => template.category === category);
};

// Helper function to get all templates
export const getAllTemplates = (): EmailTemplate[] => {
  return emailTemplates;
}; 
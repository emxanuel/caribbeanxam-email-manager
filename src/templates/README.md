# Email Templates System

This directory contains all the email templates for the CaribbeanXam email manager.

## How to Add a New Template

### 1. Create the HTML Template File

Create a new `.html` file in this directory with your email template. Use the existing templates as a reference for the structure and styling.

Example: `my-new-template.html`

### 2. Update the Template Index

Add your template metadata to `src/templates/index.ts`:

```typescript
// Add to emailTemplates array
{
  id: 'my-new-template',
  name: 'Mi Nueva Plantilla',
  description: 'Descripción de la plantilla',
  subject: 'Asunto del correo - CaribbeanXam',
  category: 'event' // or 'promotion', 'newsletter', 'notification'
}

// Add to templateContent object
'my-new-template': () => import('./my-new-template.html?raw').then(module => module.default)
```

### 3. Template Categories

- `event`: For event invitations and announcements
- `promotion`: For special offers and promotions
- `newsletter`: For regular newsletters
- `notification`: For general notifications

### 4. Template Structure

All templates should follow this basic structure:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CaribbeanXam - [Template Name]</title>
    <style type="text/css">
      /* Include responsive styles */
    </style>
  </head>
  <body>
    <!-- Email content -->
  </body>
</html>
```

### 5. Best Practices

- Use inline CSS for email compatibility
- Include responsive design for mobile devices
- Test your template in different email clients
- Keep the design consistent with CaribbeanXam branding
- Use semantic HTML structure
- Include proper alt text for images

## Available Templates

- `test-event.html`: Event invitation template
- `promotion-offer.html`: Special offer template
- `newsletter.html`: Monthly newsletter template

## Usage

Templates are automatically loaded and can be selected in the email manager interface. The system will use the template's predefined subject line unless a custom subject is provided. 
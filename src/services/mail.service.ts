import axios from "axios";
import { config } from "@/config";
import { getTemplateById as getTemplate, templateContent, getAllTemplates as getAllTemplatesFromIndex, getTemplatesByCategory as getTemplatesByCategoryFromIndex, type EmailTemplate } from "@/templates";

const mailServiceClient = axios.create({
  baseURL: config.mailServiceUrl + "/api",
}); 

// Types for the mail service
interface MailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

interface MailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface BulkMailResponse {
  results: MailResponse[];
  totalSent: number;
  totalFailed: number;
}

// Function to send bulk emails
export const sendEmailBulk = async (emails: string[], templateId: string, customSubject?: string, textContent?: string): Promise<BulkMailResponse> => {
  try {
    // Get template metadata
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template with ID '${templateId}' not found`);
    }

    // Get template content
    const templateLoader = templateContent[templateId as keyof typeof templateContent];
    if (!templateLoader) {
      throw new Error(`Template content for '${templateId}' not found`);
    }

    const htmlContent = await templateLoader();
    const subject = customSubject || template.subject;

    // Create mail requests array
    const mailRequests: MailRequest[] = emails.map(email => ({
      to: email,
      subject: subject,
      html: htmlContent,
      text: textContent,
      from: "ventas@caribbeanxam.com"
    }));

    // Send the bulk email request
    const response = await mailServiceClient.post('/mail/send-bulk', {
      emails: mailRequests,
    });
    
    const results: MailResponse[] = response.data;
    
    // Calculate success/failure counts
    const totalSent = results.filter(result => result.success).length;
    const totalFailed = results.filter(result => !result.success).length;
    
    return {
      results,
      totalSent,
      totalFailed
    };
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send bulk emails');
  }
};

// Function to get template metadata by ID
export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return getTemplate(id);
};

// Function to get all available templates
export const getAllTemplates = (): EmailTemplate[] => {
  return getAllTemplatesFromIndex();
};

// Function to get templates by category
export const getTemplatesByCategory = (category: EmailTemplate['category']): EmailTemplate[] => {
  return getTemplatesByCategoryFromIndex(category);
}; 
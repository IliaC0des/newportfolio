export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const EMAILJS_CONFIG: EmailJsConfig = {
  serviceId: 'service_dzguu0c',
  templateId: 'template_ub2dgi8',
  publicKey: 'j2vKkxDzocmeHJcWt',
};

export const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export const EMAILJS_TIMEOUT_MS = 15_000;

export const ESCALATION_QUEUE = {
  NAME: 'escalation',
  JOBS: {
    SEND_SUPPORT_TICKET_EMAIL: 'send-support-ticket-email',
  },
};

export interface EscalationJobData {
  conversationId: string;
  endUserName: string;
  endUserEmail: string;
  clientEmail: string;
  emailContent: string;
  clientUserId: string;
  clientName: string;
  chatbotName: string;
  conversationName: string;
  conversationDashboardUrl: string;
}

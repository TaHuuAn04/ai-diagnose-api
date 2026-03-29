export const AI_DIAGNOSIS_QUEUE = {
  NAME: 'ai-diagnosis',
  JOBS: {
    PROCESS_FULL_FLOW: 'process-full-flow',
  },
};

export interface AiDiagnosisJobData {
  consultationId: string;
  diagnoseModelId: string;
  description: string;
  imageBase64: string;
}

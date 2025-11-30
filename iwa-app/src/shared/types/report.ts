//iwa-app/src/shared/types/report.ts

export interface Report {
  reportId: string;
  date: string;
  description: string;
  clientId: string;
  postId: string;
}

export interface ModerationRequest {
  requestId: string;
  date: string;
  description: string;
  postId: string;
}

export interface CreateReportPayload {
  description: string;
  clientId: string;
  postId: string;
}

export interface CreateModerationRequestPayload {
  description: string;
  postId: string;
}

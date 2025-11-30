//iwa-app/src/shared/types/report.ts

export interface Report {
  reportId: string;
  date: string;
  description: string;
  clientId: string;
  postId: string;

  // Champs optionnels pour l’admin (UI)
  status?: "pending" | "processed";
  reportCount?: number;
  productName?: string;
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

//iwa-app/src/shared/types/report.ts

export interface Report {
  reportId: string;
  type: string;
  date: Date;
  description: string;
  clientId: string;
  postId: string;
}

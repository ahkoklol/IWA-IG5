// iwa-app/src/api/reportingApi.ts

import type {
  Report,
  ModerationRequest,
  CreateReportPayload,
  CreateModerationRequestPayload,
} from "../shared/types/report";

import { httpClient } from "./httpClient";

const REPORTING_BASE_URL = "http://localhost:8080/reporting";

/**
 * Create a report for a post.
 */
export async function createReport(
  postId: string,
  payload: CreateReportPayload,
): Promise<Report> {
  const body = {
    ...payload,
    postId,
  };

  const response = await httpClient.post<Report>(
    `${REPORTING_BASE_URL}/report/${postId}`,
    body,
  );

  return response.data;
}

/**
 * Get report by post ID.
 */
export async function getReportByPostId(postId: string): Promise<Report> {
  const response = await httpClient.get<Report>(
    `${REPORTING_BASE_URL}/report/${postId}`,
  );

  return response.data;
}

/**
 * Delete report by post ID.
 */
export async function deleteReport(postId: string): Promise<void> {
  await httpClient.delete(`${REPORTING_BASE_URL}/report/${postId}`);
}

/**
 * Create a moderation request for a post.
 */
export async function createModerationRequest(
  postId: string,
  payload: CreateModerationRequestPayload,
): Promise<ModerationRequest> {
  const body = {
    ...payload,
    postId,
  };

  const response = await httpClient.post<ModerationRequest>(
    `${REPORTING_BASE_URL}/request/${postId}`,
    body,
  );

  return response.data;
}

/**
 * Get moderation request by post ID.
 */
export async function getModerationRequestByPostId(
  postId: string,
): Promise<ModerationRequest> {
  const response = await httpClient.get<ModerationRequest>(
    `${REPORTING_BASE_URL}/request/${postId}`,
  );

  return response.data;
}

/**
 * Delete moderation request by post ID.
 */
export async function deleteModerationRequest(postId: string): Promise<void> {
  await httpClient.delete(`${REPORTING_BASE_URL}/request/${postId}`);
}

/**
 * Get all reports.
 */
export async function getAllReports(): Promise<Report[]> {
  const response = await httpClient.get<Report[]>(
    `${REPORTING_BASE_URL}/report`,
  );

  return response.data;
}

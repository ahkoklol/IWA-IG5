import type {
  Report,
  ModerationRequest,
  CreateReportPayload,
  CreateModerationRequestPayload,
} from "../shared/types/report";

const REPORTING_BASE_URL = "http://localhost:8080/reporting";

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed with status ${response.status}: ${text}`);
  }
  return response.json() as Promise<T>;
}

async function handleVoidResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed with status ${response.status}: ${text}`);
  }
}

export async function createReport(
  postId: string,
  payload: CreateReportPayload,
): Promise<Report> {
  const body = {
    ...payload,
    postId,
  };

  const response = await fetch(`${REPORTING_BASE_URL}/report/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleJsonResponse<Report>(response);
}

export async function getReportByPostId(postId: string): Promise<Report> {
  const response = await fetch(`${REPORTING_BASE_URL}/report/${postId}`);
  return handleJsonResponse<Report>(response);
}

export async function deleteReport(postId: string): Promise<void> {
  const response = await fetch(`${REPORTING_BASE_URL}/report/${postId}`, {
    method: "DELETE",
  });
  return handleVoidResponse(response);
}

export async function createModerationRequest(
  postId: string,
  payload: CreateModerationRequestPayload,
): Promise<ModerationRequest> {
  const body = {
    ...payload,
    postId,
  };

  const response = await fetch(`${REPORTING_BASE_URL}/request/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleJsonResponse<ModerationRequest>(response);
}

export async function getModerationRequestByPostId(
  postId: string,
): Promise<ModerationRequest> {
  const response = await fetch(`${REPORTING_BASE_URL}/request/${postId}`);
  return handleJsonResponse<ModerationRequest>(response);
}

export async function deleteModerationRequest(postId: string): Promise<void> {
  const response = await fetch(`${REPORTING_BASE_URL}/request/${postId}`, {
    method: "DELETE",
  });
  return handleVoidResponse(response);
}

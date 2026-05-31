const API_BASE = "https://job-board-backend-production-f330.up.railway.app";

export type Role = "USER" | "ADMIN";

export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  salary?: string | number;
  jobType?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  createdAt?: string;
  postedDate?: string;
}

export interface Application {
  id: string | number;
  jobId: string | number;
  userId: string | number;
  coverLetter?: string;
  status: "APPLIED" | "SHORTLISTED" | "REJECTED";
  appliedDate?: string;
  createdAt?: string;
  job?: Job;
  jobTitle?: string;
  company?: string;
  name?: string;
  email?: string;
  resumeUrl?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...init,
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

function safeJson(text: string) {
  try { return JSON.parse(text); } catch { return text; }
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request<any>("/api/user/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<any>("/api/user/login", { method: "POST", body: JSON.stringify(body) }),

  // Jobs
  getJobs: () => request<Job[]>("/api/jobs"),
  getJob: (id: string | number) => request<Job>(`/api/jobs/${id}`),
  searchJobs: (params: { title?: string; location?: string; jobType?: string }) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
    return request<Job[]>(`/api/jobs/search?${sp.toString()}`);
  },
  createJob: (body: Partial<Job>) =>
    request<Job>("/api/jobs/postJob", { method: "POST", body: JSON.stringify(body) }),
  updateJob: (id: string | number, body: Partial<Job>) =>
    request<Job>(`/api/jobs/updateJob/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteJob: (id: string | number) =>
    request<any>(`/api/jobs/deleteJob/${id}`, { method: "DELETE" }),

  // Applications
  apply: (form: FormData) =>
    request<Application>("/api/applications/postApplication", { method: "POST", body: form }),
  getApplicationsByJob: (jobId: string | number) =>
    request<Application[]>(`/api/applications/job/${jobId}`),
  getApplicationsByUser: (userId: string | number) =>
    request<Application[]>(`/api/applications/user/${userId}`),
  updateApplicationStatus: (id: string | number, body: { status: string; coverLetter?: string }) =>
    request<Application>(`/api/applications/updateApplication/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  resumeUrl: (applicationId: string | number) =>
    `${API_BASE}/api/applications/${applicationId}/resume`,
};

export { API_BASE };

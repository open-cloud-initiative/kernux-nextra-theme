import { fetchProtectedResource } from "./oauth2";

const baseUrl =
  process.env.GITLAB_API_URL || "https://gitlab.opencode.de/api/v4";
const repoId = process.env.REPO_ID || "4516";
const ref = "live-preview";

export const fetchFile = async (file: string): Promise<any> => {
  const response = await fetchProtectedResource(
    new URL(
      baseUrl +
        `/projects/${repoId}/repository/files/${encodeURIComponent(file)}/raw?ref=${encodeURIComponent(ref)}`,
    ),
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return response.text();
};

export const saveFile = async (
  file: string,
  content: string,
  commitMessage: string,
): Promise<any> => {
  const body = {
    content: content,
    commit_message: commitMessage,
    branch: ref,
  };
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const response = await fetchProtectedResource(
    new URL(
      baseUrl +
        `/projects/${repoId}/repository/files/${encodeURIComponent(file)}`,
    ),
    "PUT",
    JSON.stringify(body),
    headers,
  );

  if (!response.ok) {
    throw new Error(`Failed to save file: ${response.statusText}`);
  }

  return response.json();
};

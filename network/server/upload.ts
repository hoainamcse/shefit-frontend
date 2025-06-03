
import { fetchData } from "../helpers/fetch-data";

export type PresignResponse = {
  upload_url: string;
  file_url: string;
  expires_in: number;
}

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  folder = "uploads"
): Promise<PresignResponse> => {
  const params = new URLSearchParams({ file_name: fileName, file_type: fileType, folder }).toString();
  const res = await fetchData(`/v1/s3:genPresignedUrl?${params}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get presigned URL");
  return res.json();
};

export const uploadFileToS3 = async (url: string, file: File): Promise<void> => {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("S3 upload failed");
};


export interface FileDetails {
  user_id: number;
  filename: string;
  mime_type: string;
  s3_key: string;
  size: number;
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_deleted: boolean;
}

export interface DataResponse {
  message: string;
  file: FileDetails;
}

export interface UploadResponse {
  status: string;
  data: DataResponse;
  message?: string; // To accommodate potential error messages at the root level
}

import { fetchData } from "../helpers/fetch-data";
import type { UploadResponse } from "../../models/upload"; // Adjusted import path

const S3_BASE_URL = 'http://shefit-stg.s3.amazonaws.com';

export const getS3FileUrl = (s3Key: string): string => {
  if (!S3_BASE_URL) {
    console.error('Error: NEXT_PUBLIC_S3_BASE_URL is not defined in environment variables.');
    return ''; 
  }
  if (!s3Key) return ''
  // Ensure no double slashes if s3Key might start with one
  return `${S3_BASE_URL.replace(/\/$/, '')}/${s3Key.replace(/^\//, '')}`
};

export const uploadImageApi = async (
  file: File,
  token: string 
): Promise<UploadResponse> => {
  const path = '/v1/s3/upload';
  const formData = new FormData();
  formData.append('file', file, file.name);

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'accept': 'application/json',
  };

  try {
    const response = await fetchData(
      path,
      {
        method: 'POST',
        headers: headers,
        body: formData,
      },
      false 
    );

    const responseData: UploadResponse = await response.json();

    if (responseData.status !== 'success') {
      const errorMessage = 
        responseData.message || 
        (responseData.data && responseData.data.message) || 
        'Upload indicated failure in response body.';
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Image upload failed (using fetchData):', error);
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during the image upload.');
  }
};



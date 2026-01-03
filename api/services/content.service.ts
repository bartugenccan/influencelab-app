import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import axiosInstance from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { ErrorResponse } from '../common';

export interface AnalyzeContentRequest {
  media: {
    uri: string;
    type: 'image' | 'video';
    fileName?: string;
  };
  analysis_type: 'coach' | 'persona';
  caption?: string;
  persona?: string;
}

export interface AnalyzeContentResponse {
  coach_analysis: {
    alignment_score: number;
    caption_score: number;
    visual_score: number;
    improvments: string[];
    overall_score: number;
    quick_wins: string[];
    revised_caption: string;
    strengths: string[];
    mode: string;
    // Add other response fields based on your backend
  };
}

const analyzeContent = async (data: AnalyzeContentRequest) => {
  const formData = new FormData();

  // Add media file
  const fileUri = data.media.uri;
  const fileName =
    data.media.fileName || `media_${Date.now()}.${data.media.type === 'video' ? 'mp4' : 'jpg'}`;
  const fileType = data.media.type === 'video' ? 'video/mp4' : 'image/jpeg';

  // @ts-ignore - FormData types for React Native
  formData.append('media', {
    uri: fileUri,
    name: fileName,
    type: fileType,
  });

  // Add analysis_type
  formData.append('analysis_type', data.analysis_type);

  // Add optional fields
  if (data.caption) {
    formData.append('caption', data.caption);
  }

  if (data.persona && data.analysis_type === 'persona') {
    formData.append('persona', data.persona);
  }

  const response = await axiosInstance.post<AnalyzeContentResponse>(
    API_ENDPOINTS.CONTENT.ANALYZE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  console.log('====================================');
  console.log(response.data);
  console.log('====================================');
  return response.data;
};

type AnalyzeContentMutationOptions = UseMutationOptions<
  AnalyzeContentResponse,
  AxiosError<ErrorResponse>,
  AnalyzeContentRequest
>;

export const contentService = {
  analyzeContent,
};

export const useAnalyzeContentMutation = (options?: AnalyzeContentMutationOptions) =>
  useMutation<AnalyzeContentResponse, AxiosError<ErrorResponse>, AnalyzeContentRequest>({
    mutationFn: analyzeContent,
    ...(options ?? {}),
  });

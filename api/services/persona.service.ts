import type { AxiosError } from 'axios';
import axiosInstance from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { ErrorResponse } from '../common';

export interface PersonaTemplateResponse {
  templates: PersonaTemplate[];
}

export interface PersonaTemplate {
  id: string;
  title: string;
  description: string;
  age_range: string;
  persona_count: number;
  constraints: PersonaConstraint;
}

export interface PersonaConstraint {
  experience_level: string[];
  lifestyle: string[];
}

export const getPersonaTemplates = async (): Promise<PersonaTemplateResponse> => {
  try {
    const response = await axiosInstance.get<PersonaTemplateResponse>(
      API_ENDPOINTS.PERSONA.GET_TEMPLATES
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error(
      'Error fetching persona templates:',
      axiosError.response?.data || axiosError.message
    );
    throw error;
  }
};

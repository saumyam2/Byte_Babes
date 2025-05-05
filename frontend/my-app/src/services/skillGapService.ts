import axios from 'axios';

const API_BASE_URL = 'https://jobsforher-bytebabes.onrender.com';

interface SkillGapResponse {
  [skill: string]: {
    resources: string[];
    timeline: string;
    difficulty: string;
    prerequisites: string[];
  };
}

export const analyzeSkillGap = async (
  resumeFile: File,
  jobDescription: string
): Promise<SkillGapResponse> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_description_text', jobDescription);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/skill-gap-analysis`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to analyze skill gap');
  }
};
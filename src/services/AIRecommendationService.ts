import axios, { AxiosError } from 'axios';
import { RecommendTripDTO } from './dto/TripDTO';

export interface AIRecommendationResponse {
  title: string;
  summary?: string;
  destinations: Array<{
    name: string;
    description: string;
    coordinates: { lat: number; lng: number };
    estimatedCost: number;
    duration: number;
  }>;
  itinerary?: Array<{
    day: number;
    activities: Array<{
      name: string;
      type: string;
      duration: number;
      cost?: number;
    }>;
  }>;
  totalBudget: number;
  currency: string;
}

class AIRecommendationService {
  private readonly aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl =
      process.env.AI_RECOMMENDATION_SERVICE_URL ||
      'http://ai-recommendation-service:3003';
  }

  async getRecommendations(
    data: RecommendTripDTO,
  ): Promise<AIRecommendationResponse> {
    try {
      const response = await axios.post<AIRecommendationResponse>(
        `${this.aiServiceUrl}/internal/v1/ai/recommend`,
        {
          origin: data.origin,
          dates: data.dates,
          budget: data.budget,
          interests: data.interests,
          transport: data.transport,
          timezone: data.timezone,
          dryRun: data.dryRun,
        },
        {
          timeout: 30000, // 30 seconds timeout
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        throw new Error('AI recommendation service is unavailable');
      }
      if (err.response?.status === 429) {
        throw new Error('Too many requests to AI service');
      }
      if (err.response && err.response.status >= 500) {
        throw new Error('AI recommendation service is temporarily unavailable');
      }

      console.error('Error calling AI recommendation service:', err);
      throw new Error('Failed to get AI recommendations');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${this.aiServiceUrl}/recommender/health`, {
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default new AIRecommendationService();

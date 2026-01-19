import axios, { AxiosError } from 'axios';
import { RecommendTripDTO } from './dto/TripDTO';

export interface AIRecommendationResponse {
  title: string;
  summary: string;
  destination: string;
  total_budget_estimate: number;
  currency: string;
  duration_days: number;
  itinerary: Array<{
    day_index: number;
    order_index: number;
    title: string;
    description: string;
    place_name: string;
    coordinates: { lat: number; lng: number };
    estimated_cost: number;
    duration_minutes: number;
    start_time: string;
    category: string;
    rationale: string;
  }>;
  tags: string[];
  tips: string[];
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
          user_id: '00000000-0000-0000-0000-000000000000',
          user_profile: {
            interests: data.interests,
            transport_modes: [data.transport],
            avg_daily_budget: Math.round(
              data.budget /
                ((new Date(data.dates.end).getTime() -
                  new Date(data.dates.start).getTime()) /
                  (1000 * 60 * 60 * 24)),
            ),
          },
          constraints: {
            origin_city: data.origin.city,
            destination_city: data.origin.city, // AI service expects destination, we use same as origin for local trips
            duration_days: Math.ceil(
              (new Date(data.dates.end).getTime() -
                new Date(data.dates.start).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
            total_budget: data.budget,
            travel_party_size: 1,
          },
          timezone: data.timezone,
        },
        {
          timeout: 120000, // 120 seconds timeout - increased for AI processing
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError;

      console.error('Error calling AI recommendation service:', {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });

      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        throw new Error('AI recommendation service is unavailable');
      }
      if (err.response?.status === 429) {
        throw new Error('Too many requests to AI service');
      }
      if (err.response && err.response.status >= 500) {
        const errorMessage =
          (err.response.data as any)?.detail ||
          'AI recommendation service is temporarily unavailable';
        throw new Error(`AI service error: ${errorMessage}`);
      }
      if (err.response && err.response.status >= 400) {
        const errorMessage =
          (err.response.data as any)?.detail || 'Invalid request to AI service';
        throw new Error(`AI service validation error: ${errorMessage}`);
      }

      throw new Error(`Failed to get AI recommendations: ${err.message}`);
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

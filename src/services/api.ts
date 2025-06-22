import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../constants/api';
import type { Token, DashboardMetrics } from '../types';

export interface BelieverScreenerResponse {
  tokens: Token[];
  dashboardMetrics: DashboardMetrics;
}

class APIService {
  private api: AxiosInstance;

  constructor() {
    // API for our local server
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  // Get dashboard metrics from our server
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      console.log('🚀 Getting dashboard metrics from server...');
      
      const response = await this.api.get(API_ENDPOINTS.DASHBOARD_METRICS);
      
      if (response.data && response.data.success) {
        console.log('✅ Successfully fetched dashboard metrics');
        return response.data.data;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Error getting dashboard metrics:', error);
      throw error;
    }
  }

  // Get token list from our server
  async getTokens(filters?: any): Promise<Token[]> {
    try {
      console.log('🚀 Getting token list from server...');
      
      const params = {
        limit: filters?.limit || 20,
        ...filters,
      };
      
      const response = await this.api.get(API_ENDPOINTS.TOKENS_LIST, { params });
      
      if (response.data && response.data.success) {
        console.log(`✅ Successfully fetched ${response.data.data.tokens.length} tokens`);
        return response.data.data.tokens;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Error getting tokens:', error);
      throw error;
    }
  }

  // Get individual token details from our server
  async getTokenDetails(tokenId: string): Promise<Token | null> {
    try {
      console.log('🚀 Getting token details from server for:', tokenId);
      
      const url = API_ENDPOINTS.TOKEN_DETAIL.replace(':tokenId', tokenId);
      const response = await this.api.get(url);
      
      if (response.data && response.data.success) {
        console.log('✅ Successfully fetched token details');
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting token details:', error);
      return null;
    }
  }

  // Search tokens from our server
  async searchTokens(query: string): Promise<Token[]> {
    try {
      console.log('🚀 Searching tokens on server:', query);
      
      const response = await this.api.get(API_ENDPOINTS.SEARCH, {
        params: { q: query },
      });
      
      if (response.data && response.data.success) {
        console.log(`✅ Found ${response.data.data.length} tokens matching "${query}"`);
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error searching tokens:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get(API_ENDPOINTS.HEALTH, { timeout: 5000 });
      return response.data && response.data.status === 'ok';
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }
}

export const apiService = new APIService();
export default apiService; 
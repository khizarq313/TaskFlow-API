import api from './api';
import { Analytics } from '../types/user';

export const analyticsService = {
  // Get analytics data
  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get<Analytics>('/analytics');
    return response.data;
  },
};

export default analyticsService;

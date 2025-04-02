import api from './axios';

export interface ClickStatistic {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniqueClickStatistic {
  id: string;
  text: string;
  userId: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimpleClickStatistic {
  text: string;
  uuid: string;
}

// Statistics API
export const statisticsAPI = {
  // Get all click statistics (admin only)
  getAll: async (): Promise<ClickStatistic[]> => {
    const response = await api.get<ClickStatistic[]>('/click-statistics');
    return response.data;
  },

  // Get click statistics for authenticated user
  getMyClicks: async (): Promise<ClickStatistic[]> => {
    const response = await api.get<ClickStatistic[]>('/click-statistics/my-clicks');
    return response.data;
  },

  // Register a click (authenticated)
  registerClick: async (text: string, personalToken: string): Promise<ClickStatistic> => {
    const response = await api.post<ClickStatistic>('/click-statistics', {
      text,
      personalToken
    });
    return response.data;
  },

  // Register a simple click (without authentication, using UUID)
  registerSimpleClick: async (data: SimpleClickStatistic): Promise<ClickStatistic> => {
    const response = await api.post<ClickStatistic>('/click-statistics/simple', data);
    return response.data;
  },

  // Get unique click statistics for authenticated user
  getMyUniqueClicks: async (): Promise<UniqueClickStatistic[]> => {
    const response = await api.get<UniqueClickStatistic[]>('/unique-click-statistics/me');
    return response.data;
  },
  
  // Get all clicks by text for authenticated user
  getClicksByText: async (text: string, personalToken: string): Promise<ClickStatistic[]> => {
    const response = await api.post<ClickStatistic[]>('/click-statistics/by-text', {
      text,
      personalToken
    });
    return response.data;
  }
}; 
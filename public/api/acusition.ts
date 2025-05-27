import { apisEndpoint } from './apiurl';
import { httpWithAuth } from './http';

export const getDownloadsApi = async () => {
  
    try {
      const response = httpWithAuth.get(
        `${apisEndpoint.getSessionURL}`,
      );
      return (await response).data;
    } catch (error: any) {
      throw error;
    }
  };
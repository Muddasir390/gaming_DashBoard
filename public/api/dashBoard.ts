import { apisEndpoint } from './apiurl';
import { httpWithAuth } from './http';
import { toast } from 'react-toastify';

export const dailyActiveUserApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.activeUserURL, payload);
      const data = (await response).data;
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const getAllPostApi = async () => {
  
    try {
      const response = httpWithAuth.get(
        `${apisEndpoint.getPostURL}`,
      );
      return (await response).data;
    } catch (error: any) {
      throw error;
    }
  };

  export const addPostApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.addPostURL, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return (await response).data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const deletePostApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.deletePostURL, payload);
      const data = (await response).data;
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };


  export const getSinglePostApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.singlePostURL, payload, {
      });
      return (await response).data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const updatePostApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.updatePostURL, payload, {
      });
      return (await response).data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const getAllFleetsApi = async (data: any) => {
    try {
      const response = httpWithAuth.get(
        `${apisEndpoint.getFleetsURL}`,
      );
      return (await response).data;
    } catch (error: any) {
      throw error;
    }
  };


  export const updateFleetApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.updateFleetsURL, payload);
      const data = (await response).data;
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const getAllUsersApi = async () => {
  
    try {
      const response = httpWithAuth.get(
        `${apisEndpoint.allUsersURL}`,
      );
      return (await response).data;
    } catch (error: any) {
      throw error;
    }
  };

  export const userJourneyApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.userJourneyURL, payload);
      const data = (await response).data;
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const virtualStorePurchaseApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.virtaulStorePurchaseURL, payload);
      const data = (await response).data;
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const storePurchaseApi = async (payload: any) => {
    try {
      const response = httpWithAuth.post(apisEndpoint.storePurchaseURL, payload);
      const data = (await response).data;
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };

  export const getSessionApi = async () => {
  
    try {
      const response = httpWithAuth.get(
        `${apisEndpoint.getSessionURL}`,
      );
      return (await response).data;
    } catch (error: any) {
      throw error;
    }
  };

  export const getUserCountApi = async () => {
  
    try {
      const response = httpWithAuth.get(
        `${apisEndpoint.getUserCountURL}`,
      );
      return (await response).data;
    } catch (error: any) {
      throw error;
    }
  };

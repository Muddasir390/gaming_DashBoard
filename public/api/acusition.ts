import { apisEndpoint } from './apiurl';
import { httpWithAuth } from './http';

export const getDownloadsApi = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getSessionURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch downloads: ${error.message}`);
  }
};

export const getLauncherAndZoaverseDetailsAPI = async (data: any) => {
  const { startDate, endDate } = data?.queryKey[1] || {};
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  try {
    const response = await httpWithAuth.get(
      `${apisEndpoint.getLauncherAndZoaverseDetailURL}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch launcher and zoaverse details: ${error.message}`);
  }
};

export const getLauncherInstallDetailsAPI = async (data: any) => {
  const { startDate, endDate } = data?.queryKey[1] || {};
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  try {
    const response = await httpWithAuth.get(
      `${apisEndpoint.getLauncherInstallDetailsURL}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch launcher install details: ${error.message}`);
  }
};

export const getPurchaseRateAPI = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getPuchaseRateURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch purchase rate: ${error.message}`);
  }
};

export const getTotalDownloadsAPI = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getTotalDownloadsURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch total downloads: ${error.message}`);
  }
};
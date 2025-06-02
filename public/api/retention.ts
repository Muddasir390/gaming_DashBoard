import { apisEndpoint } from "./apiurl";
import { httpWithAuth } from "./http";

export const getReactivationRateAPI = async (data: any) => {
  const { startDate, endDate,inactivityDays } = data?.queryKey[1] || {};
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  try {
    const response = await httpWithAuth.get(
      `${apisEndpoint.getReactivationRateURL}?startDate=${startDate}&endDate=${endDate}&inactivityDays=${inactivityDays}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch launcher and zoaverse details: ${error.message}`);
  }
};

export const getChurnRateAPI = async (data: any) => {
  const { startDate, endDate,inactivityDays } = data?.queryKey[1] || {};
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  try {
    const response = await httpWithAuth.get(
      `${apisEndpoint.getChurnRateURL}?startDate=${startDate}&endDate=${endDate}&inactivityDays=${inactivityDays}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch launcher install details: ${error.message}`);
  }
};

export const getActiveUsersCurrentWeekURL = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getActiveUsersCurrentWeekURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch purchase rate: ${error.message}`);
  }
};

export const getAverageSessionsLengthAPI = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getAverageSessionsLengthURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch total downloads: ${error.message}`);
  }
};
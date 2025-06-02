import { apisEndpoint } from "./apiurl";
import { httpWithAuth } from "./http";

export const getRegistrationToFirstSessionRateAPI = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getFirstSessionRateRegisteredAccountsURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Registration-to-First Session Rate: ${error.message}`);
  }
};

export const getFirstSessionRateInstallAPI = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getFirstSessionRateInstallURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Install-to-First Session Rate: ${error.message}`);
  }
};
export const getTimeToFirstSessionAPI = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getTimeToFirstSessionURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Average time from registration to first game session: ${error.message}`);
  }
};
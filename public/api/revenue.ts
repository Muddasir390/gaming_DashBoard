import { apisEndpoint } from "./apiurl";
import { httpWithAuth } from "./http";

export const getRepeatPurchaseRate = async () => {
  try {
    const response = await httpWithAuth.get(apisEndpoint.getrepeatPurchaseRateURL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch Repeat Purchase Rate: ${error.message}`);
  }
};
import { apisEndpoint } from "./apiurl";
import { httpWithAuth } from "./http";

export const getUTMInfoAPI = async (data: any) => {
  const { startDate, endDate } = data?.queryKey[1] || {};
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  try {
    const response = await httpWithAuth.get(
      `${apisEndpoint.getUTMInfoURL}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch launcher and zoaverse details: ${error.message}`);
  }
};

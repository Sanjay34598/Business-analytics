import { getApiData } from "./api";

export const getSales = () => getApiData("/sales");
export const getForecast = () => getApiData("/forecast");
export const getChurn = () => getApiData("/churn");
export const getRecommendations = () => getApiData("/recommendation");

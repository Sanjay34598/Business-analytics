import { getApiData } from "./api";

export const getSales = () => getApiData("/sales");
export const getForecast = () => getApiData("/forecast");
export const getChurn = () => getApiData("/churn");
export const getRecommendations = () => getApiData("/recommendation");
export const getMetrics = () => getApiData("/reports/metrics");
export const retrainDataset = async (datasetId) => {
    const response = await fetch(`http://localhost:5000/datasets/${datasetId}/retrain`, {
        method: "POST"
    });
    if (!response.ok) {
        throw new Error("Retraining failed");
    }
    return response.json();
};

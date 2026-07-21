import { getApiData } from "./api";

export const getSales = (analysisId) => getApiData(analysisId ? `/sales?analysis_id=${analysisId}` : "/sales");
export const getForecast = (analysisId) => getApiData(analysisId ? `/forecast?analysis_id=${analysisId}` : "/forecast");
export const getChurn = (analysisId) => getApiData(analysisId ? `/churn?analysis_id=${analysisId}` : "/churn");
export const getRecommendations = (analysisId) => getApiData(analysisId ? `/recommendation?analysis_id=${analysisId}` : "/recommendation");
export const getMetrics = (analysisId) => getApiData(analysisId ? `/reports/metrics?analysis_id=${analysisId}` : "/reports/metrics");

export const retrainDataset = async (datasetId) => {
    const response = await fetch(`http://localhost:5000/datasets/${datasetId}/retrain`, {
        method: "POST"
    });
    if (!response.ok) {
        throw new Error("Retraining failed");
    }
    return response.json();
};

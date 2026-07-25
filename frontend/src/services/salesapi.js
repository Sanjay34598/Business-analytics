import { getApiData } from "./api";

export const getDashboardData = (analysisId) => 
  getApiData(analysisId ? `/api/dashboard?analysis_id=${analysisId}` : "/api/dashboard");

export const getSales = (analysisId) => 
  getApiData(analysisId ? `/api/sales?analysis_id=${analysisId}` : "/api/sales");

export const getForecast = (analysisId) => 
  getApiData(analysisId ? `/api/forecast?analysis_id=${analysisId}` : "/api/forecast");

export const getChurn = (analysisId) => 
  getApiData(analysisId ? `/api/churn?analysis_id=${analysisId}` : "/api/churn");

export const getRecommendations = (analysisId) => 
  getApiData(analysisId ? `/api/recommendation?analysis_id=${analysisId}` : "/api/recommendation");

export const getMetrics = (analysisId) => 
  getApiData(analysisId ? `/api/report?analysis_id=${analysisId}` : "/api/report");

const API_BASE = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "";

export const retrainDataset = async (datasetId) => {
    const response = await fetch(`${API_BASE}/datasets/${datasetId}/retrain`, {
        method: "POST"
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Retraining failed");
    }
    return response.json();
};

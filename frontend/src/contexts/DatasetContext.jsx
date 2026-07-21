import { createContext, useContext, useEffect, useState } from "react";
import { getApiData } from "../services/api";

const DatasetContext = createContext();

export const DatasetProvider = ({ children }) => {
  const [datasets, setDatasets] = useState([]);
  const [activeDataset, setActiveDataset] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = async () => {
    try {
      const data = await getApiData("/datasets");
      setDatasets(data);
      const active = data.find(d => d.active) || null;
      setActiveDataset(active);
    } catch (err) {
      console.error("Failed to fetch datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const uploadDataset = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/datasets/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to upload dataset");
    }
    
    const data = await res.json();
    await fetchDatasets();
    return data.dataset;
  };

  const activateDataset = async (id) => {
    const res = await fetch(`/datasets/${id}/active`, {
      method: "PUT",
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to activate dataset");
    }
    
    await fetchDatasets();
  };

  const deleteDataset = async (id) => {
    const res = await fetch(`/datasets/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete dataset");
    }
    
    await fetchDatasets();
  };

  const analyzeDataset = async (id) => {
    // Optimistically update status to Processing...
    setDatasets(prev => prev.map(d => d.id === id ? { ...d, status: "Processing..." } : d));
    
    const res = await fetch("/datasets/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ dataset_id: id })
    });
    
    if (!res.ok) {
      const error = await res.json();
      await fetchDatasets();
      throw new Error(error.error || "Analysis failed");
    }
    
    await fetchDatasets();
    return await res.json();
  };

  return (
    <DatasetContext.Provider
      value={{
        datasets,
        activeDataset,
        loading,
        fetchDatasets,
        uploadDataset,
        activateDataset,
        deleteDataset,
        analyzeDataset
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => useContext(DatasetContext);

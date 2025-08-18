import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const endpoints = {
  overview: `${API_BASE}/analytics/overview`
};

export const useAnalytics = (activeTab) => {
  const [data, setData] = useState({
    overview: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchDataForTab = useCallback(async () => {
    let endpointUrl;
    let dataKey;

    switch (activeTab) {
      case "overview":
        endpointUrl = endpoints.overview;
        dataKey = "overview";
        break;
      default:
        return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(endpointUrl);
      const result = await response.json();

      if (result.success) {
        setData((prevData) => ({
          ...prevData,
          [dataKey]: result.data,
        }));
      } else {
        setError("Gagal memuat data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, refreshCounter]); 

  useEffect(() => {
    fetchDataForTab();
  }, [fetchDataForTab]);

  const refreshData = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return { data, loading, error, refreshData };
};
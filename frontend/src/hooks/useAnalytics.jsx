import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const endpoints = {
  overview: `${API_BASE}/analytics/overview`,
  revenue: `${API_BASE}/analytics/revenue-trend`,
  categories: `${API_BASE}/analytics/category-performance`,
};

export const useAnalytics = (activeTab, timeRange) => {
  const [data, setData] = useState({
    overview: null,
    revenueTrend: [],
    categoryPerformance: [],
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
      case "revenue":
        endpointUrl = `${endpoints.revenue}?period=${timeRange}`;
        dataKey = "revenueTrend";
        break;
      case "categories":
        endpointUrl = endpoints.categories;
        dataKey = "categoryPerformance";
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
  }, [activeTab, timeRange, refreshCounter]);

  useEffect(() => {
    fetchDataForTab();
  }, [fetchDataForTab]);

  const refreshData = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return { data, loading, error, refreshData };
};

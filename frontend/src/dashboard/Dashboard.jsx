import { useState } from "react";
import { BarChart3, CassetteTape, DollarSign, Users } from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import OverviewTab from "../components/OverviewTab";
import RevenueAnalysisTab from "../components/RevenueAnalysisTab";
import TabNavigation from "../components/TabNavigation";
import DashboardHeader from "../components/DashboardHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import CategoryPerformanceTab from "../components/CategoryPerformanceTab";
import CustomerInsightsTab from "../components/CustomerInsightsTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("monthly");

  const { data, loading, error, refreshData } = useAnalytics(
    activeTab,
    timeRange
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "revenue", label: "Revenue Analysis", icon: DollarSign },
    { id: "categories", label: "Category Performance", icon: CassetteTape },
    { id: "customers", label: "Customer Insights", icon: Users },
  ];

  const renderTabContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={refreshData} />;
    }

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            overviewData={data.overview}
            revenueTrend={data.revenueTrend}
          />
        );
      case "revenue":
        return <RevenueAnalysisTab revenueTrend={data.revenueTrend} />;
      case "categories":
        return (
          <CategoryPerformanceTab
            categoryPerformance={data.categoryPerformance}
          />
        );
      case "customers":
        return <CustomerInsightsTab customerInsights={data.customerInsights} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 mt-2">
      <DashboardHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onRefresh={refreshData}
      />
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="max-w-screen mx-auto px-4 md:px-12 py-8">{renderTabContent()}</div>
    </div>
  );
};

export default Dashboard;

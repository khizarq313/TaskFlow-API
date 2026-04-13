import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import StatsCard from '../components/analytics/StatsCard';
import WeeklyBarChart from '../components/analytics/WeeklyBarChart';
import StatusDonutChart from '../components/analytics/StatusDonutChart';
import ActivityFeed from '../components/analytics/ActivityFeed';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const AnalyticsPage: React.FC = () => {
  const { analytics, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <p className="text-error text-lg font-semibold mb-2">Failed to load analytics</p>
          <p className="text-on-surface-variant text-sm mb-4">{error || 'Unknown error'}</p>
          <button
            onClick={() => refetch()}
            className="architectural-gradient text-white font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 px-4 md:px-8 pb-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-white">
          Analytics Overview
        </h1>
        <p className="text-sm text-on-surface-variant font-body mt-2">
          Your performance at a glance
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatsCard
          icon="task_alt"
          iconColor="text-primary"
          value={analytics.totalTasks}
          label="Total Tasks"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          icon="check_circle"
          iconColor="text-tertiary"
          value={analytics.completedTasks}
          label="Completed"
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          icon="schedule"
          iconColor="text-error"
          value={analytics.overdueTasks}
          label="Overdue"
          trend="-3%"
          trendUp={false}
        />
        <StatsCard
          icon="insights"
          iconColor="text-secondary"
          value={`${analytics.completionRate.toFixed(1)}%`}
          label="Rate"
          trend="+5%"
          trendUp={true}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <WeeklyBarChart data={analytics.dailyCompletions} />
        </div>
        <div className="lg:col-span-1">
          <StatusDonutChart data={analytics.statusDistribution} />
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={analytics.recentActivity} />
    </div>
  );
};

export default AnalyticsPage;

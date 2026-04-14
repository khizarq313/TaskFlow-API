import React from 'react';
import { ActivityEntry } from '../../types/user';
import Avatar from '../ui/Avatar';

interface ActivityFeedProps {
  activities: ActivityEntry[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'task_completed':
        return 'check_circle';
      case 'task_created':
        return 'add_circle';
      case 'task_updated':
        return 'edit';
      case 'comment_added':
        return 'chat_bubble';
      default:
        return 'info';
    }
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'task_completed':
        return 'text-tertiary';
      case 'task_created':
        return 'text-primary';
      case 'task_updated':
        return 'text-secondary';
      case 'comment_added':
        return 'text-outline';
      default:
        return 'text-on-surface-variant';
    }
  };

  const getActivityText = (activity: ActivityEntry): string => {
    switch (activity.type) {
      case 'task_completed':
        return 'completed';
      case 'task_created':
        return 'created';
      case 'task_updated':
        return 'updated';
      case 'comment_added':
        return 'commented on';
      default:
        return 'modified';
    }
  };

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <h3 className="font-headline font-bold text-lg text-white mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={`${activity.timestamp}-${index}`} className="flex gap-3 items-start">
            <div className="flex-shrink-0">
              <Avatar src={null} alt={activity.userName} size="sm" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <span
                  className={`material-symbols-outlined text-sm ${getActivityColor(
                    activity.type
                  )} flex-shrink-0 mt-0.5`}
                  aria-hidden="true"
                >
                  {getActivityIcon(activity.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface leading-relaxed">
                    <span className="font-semibold text-white">{activity.userName}</span>{' '}
                    {getActivityText(activity)}{' '}
                    <span className="font-medium text-primary">{activity.taskTitle}</span>
                  </p>
                  <p className="text-xs text-outline mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">
              history
            </span>
            <p className="text-sm text-outline">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

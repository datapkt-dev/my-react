import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import NotificationTable from '../components/NotificationTable';
import type { Notification } from '../types/notification';

// ==========================================
// Mock Data
// ==========================================

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: '發佈標題',
    publishTime: '2025/08/08 10:01',
    targetAudience: '北美, 女性, 20-25歲',
    content: '發佈內容',
  },
  {
    id: 2,
    title: '發佈標題',
    publishTime: '2025/08/08 10:01',
    targetAudience: '北美, 女性, 20-25歲',
    content: '發佈內容',
  },
];

// ==========================================
// Page Component
// ==========================================

const NotificationManagement: React.FC = () => {
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const handleAddNotification = () => {
    console.log('新增發佈');
  };

  return (
    <PageContainer>
      <PageHeader
        title="歷史發佈通知"
        count={notifications.length}
        actionButtons={[
          { label: '新增發佈', onClick: handleAddNotification },
        ]}
      />

      {/* 表格區塊 */}
      <NotificationTable data={notifications} />
    </PageContainer>
  );
};

export default NotificationManagement;

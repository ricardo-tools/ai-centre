'use client';

import { useState } from 'react';
import { Tabs } from '@/platform/components/Tabs';
import { PageHeader } from '@/platform/components/PageHeader';
import { AdminUsers } from './AdminUsers';
import { AdminRoles } from './AdminRoles';
import { AdminPermissions } from './AdminPermissions';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminAnalytics } from './AdminAnalytics';

const TABS = [
  { key: 'users', label: 'Users' },
  { key: 'roles', label: 'Roles' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'audit', label: 'Audit Log' },
  { key: 'analytics', label: 'Analytics' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div>
      <PageHeader title="Admin" subtitle="Manage users, roles, and permissions." />
      <div style={{ marginBottom: 24 }}>
        <Tabs items={TABS} activeKey={activeTab} onChange={setActiveTab} />
      </div>
      {/*
        Grid-stack pattern: all panels rendered and overlapping in the same cell.
        Only the active panel is visible. Height = tallest panel = no layout shift.
      */}
      <div style={{ display: 'grid' }}>
        <div style={{ gridArea: '1 / 1', visibility: activeTab === 'users' ? 'visible' : 'hidden' }}>
          <AdminUsers />
        </div>
        <div style={{ gridArea: '1 / 1', visibility: activeTab === 'roles' ? 'visible' : 'hidden' }}>
          <AdminRoles />
        </div>
        <div style={{ gridArea: '1 / 1', visibility: activeTab === 'permissions' ? 'visible' : 'hidden' }}>
          <AdminPermissions />
        </div>
        <div style={{ gridArea: '1 / 1', visibility: activeTab === 'audit' ? 'visible' : 'hidden' }}>
          <AdminAuditLog />
        </div>
        <div style={{ gridArea: '1 / 1', visibility: activeTab === 'analytics' ? 'visible' : 'hidden' }}>
          <AdminAnalytics />
        </div>
      </div>
    </div>
  );
}

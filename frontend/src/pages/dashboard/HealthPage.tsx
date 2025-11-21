import React from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';

const HealthPage: React.FC = () => {
  return (
    <DashboardShell
      title="Health"
      subtitle="Track your health metrics and wellness"
    >
      <div className="space-y-6">
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Health Module</h3>
            <p className="mt-2 text-sm text-gray-600">
              Health tracking functionality will be implemented here.
            </p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default HealthPage;
import React from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';

const BucketListPage: React.FC = () => {
  return (
    <DashboardShell
      title="Bucket List"
      subtitle="Life experiences you want to achieve"
    >
      <div className="space-y-6">
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Bucket List Module</h3>
            <p className="mt-2 text-sm text-gray-600">
              Bucket list functionality will be implemented here.
            </p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default BucketListPage;
import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Goal, CreateGoalData, UpdateGoalData } from '../../types/Goal';
import { goalsService } from '../../services/goals';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateGoalData>({
    title: '',
    description: '',
    target_date: '',
  });

  const [editFormData, setEditFormData] = useState<UpdateGoalData>({
    title: '',
    description: '',
    target_date: '',
    status: 'active',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsService.getGoals();
      setGoals(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setFormData({
      title: '',
      description: '',
      target_date: '',
    });
  };

  const handleCreateGoal = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await goalsService.createGoal(formData);
      setIsCreateModalOpen(false);
      resetCreateForm();
      fetchGoals();
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    }
  };

  const handleEditGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      await goalsService.updateGoal(selectedGoal.id, editFormData);
      setIsEditModalOpen(false);
      setSelectedGoal(null);
      fetchGoals();
    } catch (err: any) {
      setError(err.message || 'Failed to update goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      await goalsService.deleteGoal(goalId);
      fetchGoals();
    } catch (err: any) {
      setError(err.message || 'Failed to delete goal');
    }
  };

  const openEditModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditFormData({
      title: goal.title,
      description: goal.description || '',
      target_date: goal.target_date || '',
      status: goal.status,
    });
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckIcon className="h-4 w-4" />;
      case 'paused':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardShell
      title="Goals"
      subtitle="Track and achieve your life goals"
    >
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Your Goals ({goals.length})
            </h2>
            <p className="text-sm text-gray-600">
              Manage your personal and professional goals
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Goal</span>
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : goals.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first goal.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Goal</span>
              </Button>
            </div>
          </div>
        ) : (
          // Goals grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="h-full">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                      {goal.title}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${getStatusColor(goal.status)}
                        `}
                      >
                        {getStatusIcon(goal.status)}
                        <span className="ml-1 capitalize">{goal.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {goal.description}
                    </p>
                  )}

                  {/* Target date */}
                  {goal.target_date && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 mt-auto pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(goal)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetCreateForm();
        }}
        title="Create New Goal"
        size="md"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter goal title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your goal..."
            />
          </div>

          <Input
            type="date"
            label="Target Date (Optional)"
            name="target_date"
            value={formData.target_date}
            onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetCreateForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGoal(null);
        }}
        title="Edit Goal"
        size="md"
      >
        <form onSubmit={handleEditGoal} className="space-y-4">
          <Input
            label="Goal Title"
            name="title"
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            placeholder="Enter goal title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              placeholder="Describe your goal..."
            />
          </div>

          <Input
            type="date"
            label="Target Date (Optional)"
            name="target_date"
            value={editFormData.target_date}
            onChange={(e) => setEditFormData({ ...editFormData, target_date: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Goal['status'] })}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedGoal(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Goal
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
};

export default GoalsPage;
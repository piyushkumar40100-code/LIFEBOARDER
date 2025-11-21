import { Request, Response } from 'express';
import { z } from 'zod';
import GoalModel from '../models/Goal';
import ResponseService from '../utils/response';
import { CreateGoalData, UpdateGoalData } from '../types/Goal';

// Validation schemas
const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be in YYYY-MM-DD format').optional(),
});

const updateGoalSchema = z.object({
  title: z.string().min(1, 'Title must be at least 1 character').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be in YYYY-MM-DD format').optional().nullable(),
  status: z.enum(['active', 'completed', 'paused']).optional(),
});

export class GoalsController {
  /**
   * Get all goals for the authenticated user
   */
  static async getGoals(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const goals = await GoalModel.findByUserId(req.user.userId);
      ResponseService.success(res, goals);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific goal by ID
   */
  static async getGoalById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const { id } = req.params;

      if (!id) {
        ResponseService.badRequest(res, 'Goal ID is required');
        return;
      }

      const goal = await GoalModel.findById(id, req.user.userId);
      if (!goal) {
        ResponseService.notFound(res, 'Goal not found');
        return;
      }

      ResponseService.success(res, goal);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new goal
   */
  static async createGoal(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      // Validate request body
      const validatedData = createGoalSchema.parse(req.body) as CreateGoalData;

      // Create goal
      const newGoal = await GoalModel.create(validatedData, req.user.userId);
      ResponseService.created(res, newGoal, 'Goal created successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseService.validationError(res, error.errors.map(e => e.message));
      } else {
        throw error;
      }
    }
  }

  /**
   * Update an existing goal
   */
  static async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const { id } = req.params;

      if (!id) {
        ResponseService.badRequest(res, 'Goal ID is required');
        return;
      }

      // Validate request body
      const validatedData = updateGoalSchema.parse(req.body) as UpdateGoalData;

      // Update goal
      const updatedGoal = await GoalModel.update(id, validatedData, req.user.userId);
      ResponseService.success(res, updatedGoal, 'Goal updated successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseService.validationError(res, error.errors.map(e => e.message));
      } else {
        throw error;
      }
    }
  }

  /**
   * Delete a goal
   */
  static async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const { id } = req.params;

      if (!id) {
        ResponseService.badRequest(res, 'Goal ID is required');
        return;
      }

      // Check if goal exists
      const goalExists = await GoalModel.exists(id, req.user.userId);
      if (!goalExists) {
        ResponseService.notFound(res, 'Goal not found');
        return;
      }

      // Delete goal
      await GoalModel.delete(id, req.user.userId);
      ResponseService.success(res, null, 'Goal deleted successfully');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get goals by status
   */
  static async getGoalsByStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const { status } = req.params;

      if (!status || !['active', 'completed', 'paused'].includes(status)) {
        ResponseService.badRequest(res, 'Invalid status. Must be: active, completed, or paused');
        return;
      }

      const goals = await GoalModel.findByStatus(req.user.userId, status as 'active' | 'completed' | 'paused');
      ResponseService.success(res, goals);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get goal statistics for the user
   */
  static async getGoalStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const stats = await GoalModel.getStats(req.user.userId);
      ResponseService.success(res, stats);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle goal status (quick action)
   */
  static async toggleGoalStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const { id } = req.params;

      if (!id) {
        ResponseService.badRequest(res, 'Goal ID is required');
        return;
      }

      // Find current goal
      const currentGoal = await GoalModel.findById(id, req.user.userId);
      if (!currentGoal) {
        ResponseService.notFound(res, 'Goal not found');
        return;
      }

      // Determine new status
      let newStatus: 'active' | 'completed' | 'paused';
      switch (currentGoal.status) {
        case 'active':
          newStatus = 'completed';
          break;
        case 'completed':
          newStatus = 'paused';
          break;
        case 'paused':
          newStatus = 'active';
          break;
        default:
          newStatus = 'active';
      }

      // Update goal status
      const updatedGoal = await GoalModel.update(id, { status: newStatus }, req.user.userId);
      ResponseService.success(res, updatedGoal, 'Goal status updated successfully');
    } catch (error) {
      throw error;
    }
  }
}

export default GoalsController;
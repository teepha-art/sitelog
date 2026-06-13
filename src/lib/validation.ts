import { z } from 'zod';
import { Role } from '@prisma/client';
import { PROJECT_STATUSES, ISSUE_STATUSES, PRIORITIES, REQUEST_STATUSES } from './constants';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  role: z.nativeEnum(Role, { message: 'Please select a role' }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, 'Reset code must be exactly 6 digits'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
});

export const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectCode: z.string().min(1, 'Project code is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
  expectedEndDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
});

export const updateProjectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(PROJECT_STATUSES),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
  expectedEndDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
});

export const reportSchema = z.object({
  projectId: z.string().uuid('Project is required'),
  reportDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Report date is required'),
  completedWork: z.string().min(1, 'Completed work is required'),
  progressPercentage: z.number().int().min(0).max(100),
  delays: z.string().nullish(),
  weatherCondition: z.string().nullish(),
  notes: z.string().nullish(),
});

export const issueSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(PRIORITIES),
});

export const materialRequestSchema = z.object({
  projectId: z.string().uuid('Project is required'),
  materialName: z.string().min(1, 'Material name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  urgencyLevel: z.enum(PRIORITIES, { message: 'Urgency level is required' }),
  notes: z.string().nullish(),
});

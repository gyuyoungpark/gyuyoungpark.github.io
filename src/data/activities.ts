import type { Activity } from '@/types';
import records from './activities.json';

const activityRecords: Activity[] = records;

export const activities = activityRecords.slice().sort((first, second) => second.date.localeCompare(first.date));

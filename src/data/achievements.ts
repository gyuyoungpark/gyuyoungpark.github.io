import type { Achievement } from '@/types';
import records from './achievements.json';

const achievementRecords: Achievement[] = records;

export const achievements = achievementRecords.slice().sort((first, second) => second.date.localeCompare(first.date));

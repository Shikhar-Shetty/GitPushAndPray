import { mockDashboardData } from '../data/mockData'
import type { DashboardData } from '../types/flood'

/** Temporary frontend boundary until the FastAPI response contract is available. */
export async function getDashboardData(): Promise<DashboardData> {
  return Promise.resolve(mockDashboardData)
}
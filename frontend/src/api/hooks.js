import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'

export function useFrequencyFit(model) {
  return useQuery({
    queryKey: ['frequency', model],
    queryFn: () => apiGet('frequency', { model }),
  })
}

export function useSeverityFit(threshold) {
  return useQuery({
    queryKey: ['severity', threshold],
    queryFn: () => apiGet('severity', { threshold }),
  })
}

export function usePurePremium(threshold, model) {
  return useQuery({
    queryKey: ['pricing', threshold, model],
    queryFn: () => apiGet('pricing', { threshold, model }),
  })
}

export function useDataSummary() {
  return useQuery({
    queryKey: ['data-summary'],
    queryFn: () => apiGet('data/summary'),
  })
}

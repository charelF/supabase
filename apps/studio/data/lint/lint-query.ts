import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { components } from 'data/api'
import { get } from 'data/fetchers'
import { ResponseError } from 'types'
import { lintKeys } from './keys'

export type ProjectLintsVariables = {
  projectRef?: string
}
export type ProjectLintMetadata = components['schemas']['ProjectLintMetadata']
export type ProjectLintResponse = components['schemas']['ProjectLintResponse']
export type Lint = ProjectLintResponse
export type LINT_TYPES = keyof ProjectLintResponse['name']

export async function getProjectLints({ projectRef }: ProjectLintsVariables, signal?: AbortSignal) {
  if (!projectRef) throw new Error('Project ref is required')

  const { data, error } = await get(`/platform/projects/{ref}/run-lints`, {
    params: { path: { ref: projectRef } },
    signal,
  })

  if (error) throw error
  return data
}

export type ProjectLintsData = Awaited<ReturnType<typeof getProjectLints>>
export type ProjectLintsError = ResponseError

export const useProjectLintsQuery = <TData = ProjectLintsData>(
  { projectRef }: ProjectLintsVariables,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<ProjectLintMetadata, ProjectLintsError, TData> = {}
) =>
  useQuery<ProjectLintMetadata, ProjectLintsError, TData>(
    lintKeys.lint(projectRef),
    ({ signal }) => getProjectLints({ projectRef }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined',
      ...options,
    }
  )

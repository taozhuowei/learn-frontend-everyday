/**
 * Module: build_config types
 * Purpose: Provide TypeScript declarations for shared build helpers.
 */

export const PIPELINE_KIND: Readonly<{
  build: 'build'
  verify: 'verify'
}>

export const PIPELINE_STEP: Readonly<{
  format: 'format'
  generateContent: 'generate-content'
  typecheck: 'typecheck'
  bundle: 'bundle'
  browserTest: 'browser-test'
}>

export const CHUNK_WARNING_LIMIT_KB: number

export function getPipelineSteps(pipelineKind: 'build' | 'verify'): string[]

export function getManualChunk(moduleId: string): string | undefined

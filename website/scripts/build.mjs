/**
 * Module: build
 * Purpose: Run the only exposed package command for formatting, docs generation, type checking, and bundling.
 */

import { runBuildPipeline } from './build_pipeline.mjs'

runBuildPipeline().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

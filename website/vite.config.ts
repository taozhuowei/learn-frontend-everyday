import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// @ts-expect-error Shared Node build helpers are authored as .mjs runtime modules.
import { CHUNK_WARNING_LIMIT_KB, getManualChunk } from './scripts/build_config.mjs'

const githubRepository = process.env.GITHUB_REPOSITORY ?? ''
const repositoryName = githubRepository.split('/')[1] ?? ''
const pagesBase = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: CHUNK_WARNING_LIMIT_KB,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return getManualChunk(id)
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
})

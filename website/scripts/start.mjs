/**
 * Module: start
 * Purpose: Build the project and optionally start the preview server on an available port.
 * Usage: npm run start          # Build and start preview server
 *        npm run start -- --build-only  # Build only, don't start server
 */

import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runBuildPipeline } from './build_pipeline.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const websiteRoot = path.resolve(__dirname, '..')

// Parse arguments
const args = process.argv.slice(2)
const buildOnly = args.includes('--build-only')

/**
 * Find an available port in the given range.
 *
 * @param {number} startPort
 * @param {number} endPort
 * @returns {Promise<number>}
 */
function findAvailablePort(startPort = 3000, endPort = 3100) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      if (port > endPort) {
        reject(new Error(`No available port found in range ${startPort}-${endPort}`))
        return
      }

      const server = createServer()
      server.once('error', () => {
        server.close()
        tryPort(port + 1)
      })
      server.once('listening', () => {
        server.close()
        resolve(port)
      })
      server.listen(port, '127.0.0.1')
    }

    tryPort(startPort)
  })
}

/**
 * Start the Vite preview server.
 *
 * @param {number} port
 * @returns {Promise<void>}
 */
function startPreviewServer(port) {
  return new Promise((resolve, reject) => {
    const viteCli = path.join(websiteRoot, 'node_modules', 'vite', 'bin', 'vite.js')
    const child = spawn(process.execPath, [viteCli, 'preview', '--port', String(port), '--host'], {
      cwd: websiteRoot,
      stdio: 'inherit',
      shell: false,
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`Preview server exited with code ${code}`))
    })

    child.on('error', reject)
  })
}

/**
 * Main entry point.
 */
async function main() {
  if (buildOnly) {
    console.log('\n========================================')
    console.log('  Building project...')
    console.log('========================================\n')
  } else {
    console.log('\n========================================')
    console.log('  Starting development server...')
    console.log('========================================\n')
  }

  // Step 1: Run build pipeline
  console.log('📦 Step 1: Building project...')
  try {
    await runBuildPipeline()
    console.log('✅ Build completed\n')
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }

  // If build-only mode, exit here
  if (buildOnly) {
    console.log('========================================')
    console.log('  Build finished successfully!')
    console.log('========================================')
    console.log('\nOutput directory: dist/')
    console.log('\nTo start preview server, run: npm run start')
    process.exit(0)
  }

  // Step 2: Find available port
  console.log('🔍 Step 2: Finding available port...')
  const port = await findAvailablePort()
  console.log(`✅ Found available port: ${port}\n`)

  // Step 3: Wait a moment for any port cleanup
  console.log('⏳ Step 3: Preparing to start server...')
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log('✅ Ready\n')

  // Step 4: Start preview server
  console.log('🚀 Step 4: Starting preview server...\n')
  console.log('========================================')
  console.log('  Preview server is starting...')
  console.log('========================================\n')

  try {
    await startPreviewServer(port)
  } catch (error) {
    console.error('❌ Failed to start preview server:', error.message)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})

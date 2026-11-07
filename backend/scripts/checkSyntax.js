// `npm run check`: parses every backend source file with `node --check`.
import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const roots = ['src', 'scripts', 'tests']
const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (path.endsWith('.js')) files.push(path)
  }
}
roots.forEach(walk)

let failed = 0
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' })
  } catch (error) {
    failed++
    console.error(`✗ ${file}\n${error.stderr}`)
  }
}
console.log(`${files.length - failed}/${files.length} files parsed without errors`)
process.exit(failed ? 1 : 0)

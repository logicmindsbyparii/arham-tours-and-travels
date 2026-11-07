// Minimal leveled logger. Never pass passwords, tokens or cookies to it.
const stamp = () => new Date().toISOString()
const quiet = process.env.NODE_ENV === 'test'

export const logger = {
  info: (...args) => !quiet && console.log(stamp(), 'INFO ', ...args),
  warn: (...args) => !quiet && console.warn(stamp(), 'WARN ', ...args),
  error: (...args) => console.error(stamp(), 'ERROR', ...args),
}

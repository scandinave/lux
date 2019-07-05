

/**
 * @private
 */
export default function isBuffer(value: unknown): boolean {
  return value instanceof Buffer
}

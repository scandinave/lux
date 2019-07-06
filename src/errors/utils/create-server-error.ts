type ServerError<T extends Error> = T & {
  statusCode: number;
}

/**
 * @private
 */
export default function createServerError<T extends Error>(Source: T, statusCode: number): ServerError<T> {

  const Target = class extends Source {
    statusCode: number;
  }

  Object.defineProperty(Target, 'name', {
    value: Source.name,
  })

  Object.defineProperty(Target.prototype, 'statusCode', {
    value: statusCode,
  })

  return Target
}

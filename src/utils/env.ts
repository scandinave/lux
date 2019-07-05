

const isEnv = value => () => process.env.NODE_ENV === value

export const isDevelopment: () => boolean = isEnv('development')
export const isProduction: () => boolean = isEnv('production')
export const isTest: () => boolean = isEnv('test')

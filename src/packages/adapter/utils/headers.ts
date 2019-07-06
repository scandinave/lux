

import entries from '../../../utils/entries'
import { FreezeableMap } from '../../freezeable'
import { ObjectMap } from '../../../interfaces'

type HandleChange = (type: 'SET' | 'DELETE', data: [string, string?]) => void

export class Headers extends FreezeableMap<string, string> {
  constructor(value: ObjectMap<string> = {}) {
    super(entries(value))
  }

  get(key: string): undefined | string {
    return super.get(key.toLowerCase())
  }

  has(key: string): boolean {
    return super.has(key.toLowerCase())
  }

  set(key: string, value: string): Headers {
    super.set(key.toLowerCase(), value)
    return this
  }

  delete(key: string): boolean {
    return super.delete(key.toLowerCase())
  }
}

export class ResponseHeaders extends Headers {
  handleChange: HandleChange;

  constructor(handleChange: HandleChange) {
    super()
    this.handleChange = handleChange
  }

  set(key: string, value: string): Headers {
    this.handleChange('SET', [key, value])
    return super.set(key, value)
  }

  delete(key: string): boolean {
    this.handleChange('DELETE', [key, undefined])
    return super.delete(key)
  }
}

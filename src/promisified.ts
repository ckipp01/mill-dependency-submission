import * as fs from 'fs'
import {promisify} from 'util'

export const readFile = promisify(fs.readFile)
export const exists = promisify(fs.exists)
export const rm = promisify(fs.rm)

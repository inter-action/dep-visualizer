
import * as fs from 'fs'
import * as path from 'path'
import {Option} from 'funfix'
import { assert } from 'console'


const fsp = fs.promises

export async function readFileContent(filepath: string) {
    return fsp.readFile(filepath, { encoding: 'utf-8' })
}

// todo handle the type part
// : AsyncGenerator<IWalk, void, void>
interface IWalk {
    path: string,
    stats: fs.Stats,
    depth: number
}

// https://github.com/Microsoft/TypeScript/issues/11326
export async function* walkDir(dir: string, depth = 0): AsyncIterable<IWalk> {
    let files = await fsp.readdir(dir, { encoding: 'utf-8' })
    for (let file of files) {
        let filepath = path.join(dir, file)
        let stats = await fsp.stat(filepath)
        yield { path: filepath, stats, depth }
        if (stats.isDirectory()) {
            yield* await walkDir(filepath, depth + 1)
        }
    }
}

// return '.'
export function getFileExt(filename: string) {
    let reg = /(\.\w+)$/
    let match = filename.match(reg)
    if (!match) return ''
    return match[1]
}

export function isNotParentOf(subPath: string, rootPath: string) {
    return !rootPath.startsWith(subPath)
}

// filePath should not have an ext
export async function tryResolveFilesUsingExts(filePath: string, exts: string[]): Promise<Option<string>> {
    let i = -1
    let tryPath = filePath

    do {
        try {
            let stats = await fsp.lstat(tryPath)

            assert(!stats.isDirectory(), 'resolve: not directory')
            assert(!stats.isSymbolicLink(), 'resolve: not sys link')

            return Option.of(tryPath)    
            
        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw e
            }
        }

        i++
        tryPath = filePath + exts[i]
    } while (i < exts.length)

    return Option.none()
}

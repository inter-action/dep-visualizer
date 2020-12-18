
import * as fsp from 'fs/promises'
import * as path from 'path'
import {walkDir, getFileExt, isNotParentOf, tryResolveFilesUsingExts} from './common/util'
import {defaultFileIdGenerator} from './common/fileid'
import {getLoader} from './common/loader.manager'
import { IContext, Id, IEntry } from './common/types'



class Entry implements IEntry{
    constructor(public filepath: string, public id: Id, public deps: string[], public depsMap: Map<Id, Entry>){ }

    toString(){
        return `
        filepath: ${this.filepath}
        id: ${this.id}
        deps: 
            ${this.deps.join('\t\n')}
        depsMap: 
            ${[...this.depsMap.values()].join('\t\n')}
        `
    }
}

const MAX_DEPTH = 100

const defaultContext = {
    getConfig(){
        return {
            resolves: ['.hbs', 'js']
        }
    }
}

export async function workYourself(rootDir: string, context = defaultContext) {
    let processed = new Map<string, Id>();
    let result: Entry[] = []
    
    for await (let info of await walkDir(rootDir)) {
        let filePath = info.path
        if (info.stats.isDirectory()) continue
        let entry = await processEntry(rootDir, filePath, false, processed, info.depth, context)
        if (entry) result.push(entry)
    }

    return result
}


async function processEntry(rootDir: string, filePath: string, tryResolve: boolean, processed: Map<string, Id>, depth: number, context: IContext){
    if (depth >= MAX_DEPTH) throw new Error('max depth reached!')
    // throws error if file not found
    let fileId
    // we know this comes from walk dir
    if (!tryResolve) {
        if (processed.has(filePath)) return
    } else {
        let r = await tryResolveFilesUsingExts(filePath, context.getConfig().resolves) 
        if (r.isEmpty()) {
            console.warn(`unknow file type, try add resolve for file type: ${filePath}`)
            return;
        }
        // assertions
        filePath = r.get()
    }


    fileId = defaultFileIdGenerator.next().value
    processed.set(filePath, fileId)

    let ext = getFileExt(filePath)
    let loader = getLoader(ext)

    let deps = []
    let depsMap = new Map<Id, Entry>();
    let entry = new Entry(filePath, fileId, deps, depsMap)

    if (loader) {
        let lr = await loader(filePath)
        Array.prototype.push.apply(deps, lr.deps)

        for (let dep of deps) {
            // skip abs path
            if (path.isAbsolute(dep)) continue;
            let subFile = path.resolve(path.dirname(filePath), dep)

            // ignore file that's outof root path
            if (!isNotParentOf(subFile, rootDir)) continue

            let subEntry = await processEntry(rootDir, subFile, true, processed, depth+1, context)
            if (subEntry) depsMap.set(subEntry.id, subEntry)
        }
    }

    return entry
}
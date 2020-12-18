import { IEntry } from "./types";

export function generate(entries: IEntry[], context: IContext) : string{
    let subgraphes = []
    let nodes = []
    for (let entry of entries) {
        if (entry.depsMap.size) {
            subgraphes.push(entry)
        } else {
            nodes.push(entry)
        }
    }


    let nodeFormatter = createNodeFormatter(context)

    let rootGraph = `
digraph G {
    fontsize=5
    pack=true
    node [shape=box,style=filled,color=".7 .3 1.0"];
    
    
    ${nodes.map(e=> nodeFormatter(e)).join('\n')}
    ${subgraphes.map(e=> formatGraph(e, true, nodeFormatter)).join('\n\n')}
    
}
    `

    return rootGraph
}

function newNode(entry: IEntry) {
    return `node${entry.id}`
}

function newSubGraphName(entry: IEntry) {
    return `subG${entry.id}`
}

function newSubGraphNode(entry: IEntry) {
    return `subGN${entry.id}`
}

function formatGraph(entry: IEntry, isRoot: boolean, nodeFormatter){
    if (entry.depsMap.size) {
        let entries = [...entry.depsMap.entries()]

        let result = [
            ...entries.map(([_id, se])=> {
                return formatGraph(se, false, nodeFormatter)
            }),

            ...entries.map(([_id, se])=> {
                return `${newSubGraphNode(entry)} -> ${newNode(se)};`
            })
        ]

        if (isRoot) {
            return `
            ${newSubGraphNode(entry)}

            subgraph ${newSubGraphName(entry)} {
                ${result.join('\n')}
            }
            `
        } else {
            return result.join('\n')
        }
    } else {
        return nodeFormatter(entry)
    }
}

interface IContext {
    rootPath: string
}

function createNodeFormatter(context: IContext) {
    return function formatNode(entry: IEntry){
        return `${newNode(entry)} [label=${trimRootPath(entry.filepath, context.rootPath)}];`
    }
}


function trimRootPath(path, rootPath) {
    return path.replace(rootPath, '').replace(/\//g, '')
}
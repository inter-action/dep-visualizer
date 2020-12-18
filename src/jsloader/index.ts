
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { ILoaderResult } from "../common/types";
import { readFileContent } from "../common/util";



export default async function (filepath: string): Promise<ILoaderResult> {
    let code = await readFileContent(filepath)

    const ast = parser.parse(code, {
        sourceType: 'module'
    });

    let result = []
    traverse(ast, {
        enter(path) {
            let pipeline = [parseRequireStatement, parseImportStatement]
            let value = runPipeline(pipeline, path)
            if (value) {
                result.push(value)
            }
        }
    });

    return {
        deps: result,
    }
}

function runPipeline(funcs, path) {
    for (let func of funcs) {
        let value = func(path)
        if (value) return value
    }
}

function parseRequireStatement(path){
    if (path.type == 'CallExpression' && path.node.callee.name == 'require') {
        return path.node.arguments[0]?.value
    }
}

function parseImportStatement(path){
    if (path.type == 'ImportDeclaration') {
        return path.node.source.value
    }
}



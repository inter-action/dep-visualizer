
import { ILoaderResult } from "../common/types";
import { readFileContent } from "../common/util";

export default async function (filepath: string): Promise<ILoaderResult> {
    let code = await readFileContent(filepath)
    return {
        deps: parserIncludeDirects(code)
    }
}

function parserIncludeDirects(code: string){
    let reg = /\{\{>([^}]+)\}\}/g
    let result = []
    code.replace(reg, (match, $1)=> {
        result.push($1.trim())
        return match
    })
    return result
}

// {{> legacyddp/script}}
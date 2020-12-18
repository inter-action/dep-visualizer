export interface ILoaderResult {
    deps: string[],
}

export type Loader = (path: string, options: any) => ILoaderResult;

export interface IContext {
    getConfig(): IConfig
}

export interface IConfig {
    resolves: IResolve[]
}

type IResolve = string 


export type Id = number
export interface IEntry {
    filepath: string, id: Id, deps: string[], depsMap: Map<Id, IEntry>
}

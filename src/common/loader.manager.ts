
import hbs from '../hbsloader'
import js from '../jsloader'

export function getLoader(ext: string){
    if (ext.startsWith('.')) {
        ext = ext.slice(1)
    }
    switch (ext) {
        case 'hbs': return hbs;
        case 'js': 
            return js
    }

    return null
}
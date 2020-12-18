import * as assert from 'assert'
import * as path from 'path'
import {generate} from '../src/common/dot.generator'
import {workYourself} from '../src'

describe('#common/dot.generator', function() {
    it('#generate', async function() {
        let rootPath = path.resolve(__dirname, './hbs_walk_test')
        let entries = await workYourself(rootPath)
        console.log('entries: \n', entries)
        let result = generate(entries, {rootPath})
        console.log('result: \n', result)
    })
});



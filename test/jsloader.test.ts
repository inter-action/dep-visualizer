import * as assert from 'assert'
import * as path from 'path'
import loader from '../src/jsloader'

describe('jsloader', function() {
    it('#parse commonjs es6 module should work correctly', async function() {
        let result = await loader(path.resolve(__dirname, './assets/es6-import.js')) 
        assert.ok(result.deps.length == 2)
    })
});



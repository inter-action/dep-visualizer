import * as assert from 'assert'
import * as path from 'path'
import loader from '../src/hbsloader'

describe('jsloader', function() {
    it('#parse commonjs es6 module should work correctly', async function() {
        let result = await loader(path.resolve(__dirname, './assets/basic-hbs-loader.hbs')) 
        assert.strictEqual(result.deps.length, 5)
    })
});



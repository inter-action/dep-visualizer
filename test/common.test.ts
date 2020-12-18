import * as assert from 'assert'
import * as path from 'path'
import {walkDir} from '../src/common/util'

describe('common', function() {
    it('#common/utils', async function() {
        let result = []
        for await(let info of walkDir(path.join(__dirname))) {
            result.push(info)
        }

        assert.strictEqual(result.length,17)
    })
});



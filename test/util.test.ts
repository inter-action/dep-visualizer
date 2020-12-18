import * as assert from 'assert'
import * as path from 'path'

import {isNotParentOf, getFileExt, tryResolveFilesUsingExts} from '../src/common/util'

describe('#util', function() {
    it('#isParentPath should work correctly, positive', async function() {
        assert.ok(isNotParentOf('/a/b/c', '/a/b'))
        assert.ok(isNotParentOf('/a/b/c', '/d/b'))

        assert.ok(isNotParentOf('a/b/c', '/d/b'))
        assert.ok(isNotParentOf('a/b/c', 'd/b'))
    })

    it('#isParentPath should work correctly, negative', async function() {
        assert.ok(!isNotParentOf('/a/b', '/a/b/c'))
        assert.ok(!isNotParentOf('a/b', 'a/b/c'))
    })

    it('#getFileExt ', async function() {
        let ext = getFileExt(path.resolve(__dirname, './util.test.ts'))
        assert.strictEqual(ext, '.ts')
    })


    it('#tryResolveFilesUsingExts ', async function() {
        let result = await tryResolveFilesUsingExts(path.resolve(__dirname, './util.test'), ['.hbs', '.ts'])

        assert.ok(!result.isEmpty())
        assert.strictEqual(result.get(), path.resolve(__dirname, './util.test.ts'))
    })

});



// import * as tt from 'typescript-definition-tester'
const tt = require('typescript-definition-tester')
const path = require('path')

describe('TypeScript definitions', function () {
    it('should compile against index.d.ts', (done) => {
        tt.compileDirectory(
            path.resolve(__dirname,'../lib'),
            fileName => fileName.match(/\.ts$/),
            () => done()
        )
    })
})
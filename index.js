"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mojang_minecraft_1 = require("mojang-minecraft");
const Matrix = "";
const example = "!we 3 5 3 8 3 7 ";
const frame = (x, y, z, dx, dy, dz) => {
};
const pointToVector = () => { };
const square = (bl1, bl2) => {
    let a = bl1, b, c, d, e = bl2, f, g, h;
};
let BlockChunkDataExample = { "1": { "1": { "1": mojang_minecraft_1.world.getDimension("overworld").getBlock(new mojang_minecraft_1.BlockLocation(1, 1, 1)) } } };
const BlockChunk = class {
    constructor(block1, block2, data) {
        //TODO: make sure to not include air blocks
        this.data = [];
        if (data) {
            this.data = data;
        }
        else {
            let offset = {
                x: Math.sqrt(Math.pow(block2.location.x - block1.location.x, 2)),
                y: Math.sqrt(Math.pow(block2.location.y - block1.location.y, 2)),
                z: Math.sqrt(Math.pow(block2.location.z - block1.location.z, 2))
            };
            console.log(offset);
            //for (){}
        }
    }
    get depth() {
        var z;
        for (let i in this.data) {
            if (i)
                for (let j in this.data[i]) {
                    if (j)
                        for (let k in this.data[i][j]) {
                            //@ts-ignore
                            if (this.data[i][j][k].location.z)
                                if (this.data[i][j][k].location.z > z) {
                                    z = this.data[i][j][k].location.z;
                                }
                        }
                }
        }
        return z;
    }
    get width() { return; }
    get height() { return; }
};
// @ts-ignore
new BlockChunk(new mojang_minecraft_1.Block(1, 1, 1), new mojang_minecraft_1.Block(2, 2, 2));
const graph = class {
    constructor(matrix, options) {
        this.options = {};
        this.data = matrix;
        if (options)
            this.options = options;
    }
};

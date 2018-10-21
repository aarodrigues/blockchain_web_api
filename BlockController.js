const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require('./simpleChain.js');

let blockchain;

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/api/block/{index}',
            handler: async (request, h) => {
             const block = await  blockchain.getBlock(encodeURIComponent(request.params.index))
                .then((value)=>{
                    return JSON.parse(value);
                })
             return block;
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/api/block',
            handler: async (request, h) => {
                const payload = request.payload
                const newBlock =  blockchain.getBlockHeight()
                .then((height) =>{
                    let block = new BlockClass.Block(payload.body);
                    return blockchain.addBlock(block);
                });
                return newBlock;
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        blockchain = new BlockChainClass.Blockchain();
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }


}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = __importStar(require("web3"));
const ErrorType_1 = require("../../types/ErrorType");
const types_1 = require("../../types");
const HttpsRpc_1 = require("../../utils/client/HttpsRpc");
const index = __importStar(require("./index"));
async function test_formatRollInInput() {
    let input = await index.formatRollInInput("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1337, "0xffffffffff", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 800000, "0xffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8346");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_formatRollInERC20Input() {
    let estimate_fee = await index.estimateRollInErc20fee(1337, "0x37e6C8116B9f735b469B64Ee59b6464025Db6C31", 5000000, "0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0xffffffffffffff");
    if (estimate_fee == ErrorType_1.ErrorType.FormatInputFailed) {
        return;
    }
    console.log(estimate_fee);
    let input = await index.formatRollInERC20Input("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1337, "0xffffffffffffff", "0x37e6C8116B9f735b469B64Ee59b6464025Db6C31", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 5000000, estimate_fee.basefee, "0x777aDd3378b999235cce77F71292dAc1E8095FFC", estimate_fee.value);
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8346");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_formatRollOutInput() {
    let input = await index.formatRollOutInput("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1337, "0xffffffffff", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 800000000, "0xfffffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8548");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_formatRollOutERC20Input() {
    let input = await index.formatRollOutERC20Input("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1337, "0xffffffffff", "0x37e6C8116B9f735b469B64Ee59b6464025Db6C31", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 800000000, "0xfffffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8548");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_claim() {
    let txs = await (0, HttpsRpc_1.getRollOutTx)("0x777add3378b999235cce77f71292dac1e8095ffc");
    //let params = await getClaimParams("0xabd76b3b5855d0168c06a9739f89390c4bbff2bd5df16a07721e848452b4bc2e")
    let params = await (0, HttpsRpc_1.getClaimParams)(txs[txs.length - 1].txHash);
    var toChainId;
    if (params.data == '') {
        params.data = [];
        //@ts-ignore
        toChainId = await index.getDestChainId(false, params.lrsender, params.txHash);
    }
    else {
        toChainId = await index.getDestChainId(true, params.lrsender);
    }
    //@ts-ignore
    var block_num = await index.getLatestConfirmBlock(toChainId);
    let size = await index.getMerkleTreeState(block_num);
    console.log(size, params.leaf);
    let proof = await index.getRollOutProof(size, params.leaf);
    let input = await index.formatClaimTokenInput(proof, params.leaf, params.lrsender, params.to, params.lrBlock, params.l1Block, params.lrtimestamp, Web3.utils.toHex(Web3.utils.toBigInt(params.value)), params.data);
    var web3 = new Web3.Web3("ws://43.134.20.65:8346");
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    //@ts-ignore
    let toChainInfo = await types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo) {
        var ret = await web3.eth.sendTransaction({
            from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
            to: toChainInfo.OutBox,
            data: input,
            gasLimit: 500000,
        });
        console.log(ret);
    }
}
async function test_le_formatRollInInput() {
    let input = await index.formatRollInInput("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1338, "0xffffffffff", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 800000, "0xffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8646");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_le_formatRollInERC20Input() {
    let estimate_fee = await index.estimateRollInErc20fee(1338, "0x57a3e28f18e2Dd24B648982836aEC4d618d3494F", 500000, "0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0xffffffffff");
    if (estimate_fee == ErrorType_1.ErrorType.FormatInputFailed) {
        return;
    }
    console.log(estimate_fee);
    let input = await index.formatRollInERC20Input("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1338, "0xfffffffffff", "0x57a3e28f18e2Dd24B648982836aEC4d618d3494F", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 500000, estimate_fee.basefee, "0x777aDd3378b999235cce77F71292dAc1E8095FFC", estimate_fee.value);
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8646");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_le_formatRollOutInput() {
    let input = await index.formatRollOutInput("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1338, "0xfffffffff", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 800000000, "0xfffffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8548");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_le_formatRollOutERC20Input() {
    let input = await index.formatRollOutERC20Input("0x777aDd3378b999235cce77F71292dAc1E8095FFC", 1338, "0xffffffffff", "0x57a3e28f18e2Dd24B648982836aEC4d618d3494F", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 800000000, "0xfffffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8548");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_le_claim() {
    let txs = await (0, HttpsRpc_1.getRollOutTx)("0x777add3378b999235cce77f71292dac1e8095ffc");
    //let params = await getClaimParams("0xabd76b3b5855d0168c06a9739f89390c4bbff2bd5df16a07721e848452b4bc2e")
    let params = await (0, HttpsRpc_1.getClaimParams)(txs[txs.length - 1].txHash);
    var web3 = new Web3.Web3("ws://43.134.20.65:8548");
    var toChainId;
    if (params.data == '') {
        params.data = [];
        //@ts-ignore
        toChainId = await index.getDestChainId(false, params.lrsender, params.txHash);
    }
    else {
        toChainId = await index.getDestChainId(true, params.lrsender);
    }
    //@ts-ignore
    var block_num = await index.getLatestConfirmBlock(toChainId);
    let size = await index.getMerkleTreeState(block_num);
    let proof = await index.getRollOutProof(size, params.leaf);
    let input = await index.formatClaimTokenInput(proof, params.leaf, params.lrsender, params.to, params.lrBlock, params.l1Block, params.lrtimestamp, Web3.utils.toHex(Web3.utils.toBigInt(params.value)), params.data);
    var web3 = new Web3.Web3("ws://43.134.20.65:8646");
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    //@ts-ignore
    let toChainInfo = await types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo) {
        var ret = await web3.eth.sendTransaction({
            from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
            to: toChainInfo.OutBox,
            data: input,
            gasLimit: 500000,
        });
        console.log(ret);
    }
}
async function test_estimateRollInErc20gas() {
    let estimate_fee = await index.estimateRollInErc20fee(1337, "0x37e6C8116B9f735b469B64Ee59b6464025Db6C31", 500000, "0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0xffffffffffffff");
    console.log(estimate_fee);
}

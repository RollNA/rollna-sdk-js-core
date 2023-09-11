"use strict";
// usage
// rollin_erc20: node rollin_erc20 chainId token_addr(L1/Le) amount(in hex string) destination
// rollout_erc20: node rollout_erc20 chainId token_addr(L1/Le) amount(in hex string) destination
// claim: node claim addr
// attention: 
// 1. claim will firstly print all rollout tx your addr have sent,and await you to choose a tx to claim
//    paste the tx in terminal and 回车, then it will process claim.
// 2. the test use the address which private-key is "0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f"
//    and its pubkey is "0x777aDd3378b999235cce77F71292dAc1E8095FFC", change it at your own purpose.
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
const ErrorType_1 = require("../package/types/ErrorType");
const types_1 = require("../package/types");
const HttpsRpc_1 = require("../package/utils/client/HttpsRpc");
const index = __importStar(require("../package/src/base/index"));
const readlineSync = require('readline-sync');
async function test_formatRollInERC20Input(chainId, token, amount, to) {
    let estimate_fee = await index.estimateRollInErc20fee(chainId, token, 500000, "0x777aDd3378b999235cce77F71292dAc1E8095FFC", to, amount);
    if (estimate_fee == ErrorType_1.ErrorType.FormatInputFailed) {
        return;
    }
    let input = await index.formatRollInERC20Input("0x777aDd3378b999235cce77F71292dAc1E8095FFC", chainId, amount, token, to, 500000, estimate_fee.gasPrice, to, estimate_fee.value);
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let toChainInfo = await types_1.SupportedChainInfo.getChainInfo(chainId);
        let web3 = new Web3.Web3(toChainInfo?.Provider);
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_formatRollOutERC20Input(chainId, token, amount, to) {
    let input = await index.formatRollOutERC20Input("0x777aDd3378b999235cce77F71292dAc1E8095FFC", chainId, amount, token, to, 800000000, "0xfffffff");
    if (input != ErrorType_1.ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("https://goerli.cyclenetwork.io");
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input);
        console.log(res);
    }
}
async function test_claim(from) {
    let txs = await (0, HttpsRpc_1.getRollOutTx)(from);
    console.log(txs);
    var tx = readlineSync.question('which tx do you want to claim: \n');
    let params = await (0, HttpsRpc_1.getClaimParams)(tx);
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
    console.log(size, params.leaf, toChainId);
    let proof = await index.getRollOutProof(size, params.leaf);
    let input = await index.formatClaimTokenInput(proof, params.leaf, params.lrsender, params.to, params.lrBlock, params.l1Block, params.lrtimestamp, Web3.utils.toHex(Web3.utils.toBigInt(params.value)), params.data);
    let toChainInfo = await types_1.SupportedChainInfo.getChainInfo(Number(toChainId));
    var web3 = new Web3.Web3(toChainInfo?.Provider);
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
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
let args = process.argv;
if (args.length <= 0) {
    console.log("invalid input");
}
if (args[2] == "rollin_erc20") {
    if (args.length != 7) {
        console.log("invaild input");
        process.exit();
    }
    test_formatRollInERC20Input(Number(args[3]), args[4], args[5], args[6]);
    process.exit();
}
if (args[2] == "rollout_erc20") {
    if (args.length != 7) {
        console.log("invaild input");
        process.exit();
    }
    test_formatRollOutERC20Input(Number(args[3]), args[4], args[5], args[6]);
    process.exit();
}
if (args[2] == "claim") {
    if (args.length != 4) {
        console.log("invaild input");
        process.exit();
    }
    //@ts-ignore
    test_claim(args[3]);
    process.exit();
}
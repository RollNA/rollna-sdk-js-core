// usage
// rollin_erc20: node tools.js rollin_erc20 chainId token_addr(L1/Le) amount(in hex string) destination
// rollout_erc20: node tools.js rollout_erc20 chainId token_addr(L1/Le) amount(in hex string) destination
// claim: node tools.js claim addr
// attention: 
// 1. claim will firstly print all rollout tx your addr have sent,and await you to choose a tx to claim
//    paste the tx in terminal and 回车, then it will process claim.
// 2. the test use the address which private-key is "0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f"
//    and its pubkey is "0x777aDd3378b999235cce77F71292dAc1E8095FFC", change it at your own purpose.

import { Numbers} from "web3";
import * as Web3 from "web3";
import { ErrorType } from "../package/types/ErrorType";
import {SupportedChainInfo} from "../package/types";
import { getRollOutTx, getClaimParams } from "../package/utils/client/HttpsRpc"
import * as index from "../package/src/base/index"
const readlineSync = require('readline-sync');

async function test_formatRollInERC20Input(chainId: Numbers, token: string, amount: string, to: string) {
    let estimate_fee = await index.estimateRollInErc20fee(
        chainId, 
        token, 
        500000, 
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 
        to, 
        amount
    )
    if (estimate_fee == ErrorType.FormatInputFailed) {
        return
    }
    let input = await index.formatRollInERC20Input(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        chainId,
        amount,
        token,
        to,
        500000,
        estimate_fee.gasPrice,
        to,
        estimate_fee.value,
    )
    if (input != ErrorType.FormatInputFailed) {
        let toChainInfo = await SupportedChainInfo.getChainInfo(chainId)
        let web3 = new Web3.Web3(toChainInfo?.Provider)
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_formatRollOutERC20Input(chainId: Numbers, token: string, amount: string, to: string) {
    let input = await index.formatRollOutERC20Input(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        chainId,
        amount,
        token,
        to,
        800000000,
        "0xfffffff"
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("https://goerli.cyclenetwork.io")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_claim(from: string) {
    let txs = await getRollOutTx(from)
    console.log(txs)
    var tx = readlineSync.question('which tx do you want to claim: \n');
    let params = await getClaimParams(tx)
    var toChainId
    if (params.data == '') {
        params.data = []
        //@ts-ignore
        toChainId = await index.getDestChainId(false, params.lrsender, params.txHash)
    } else {
        toChainId = await index.getDestChainId(true, params.lrsender)
    }
    //@ts-ignore
    var block_num = await index.getLatestConfirmBlock(toChainId)
    let size = await index.getMerkleTreeState(block_num)
    console.log(size, params.leaf, toChainId)
    let proof = await index.getRollOutProof(size, params.leaf)
    let input = await index.formatClaimTokenInput(
        proof,
        params.leaf,
        params.lrsender,
        params.to,
        params.lrBlock,
        params.l1Block,
        params.lrtimestamp,
        Web3.utils.toHex(Web3.utils.toBigInt(params.value)),
        params.data
    )
    let toChainInfo = await SupportedChainInfo.getChainInfo(Number(toChainId))
    var web3 = new Web3.Web3("https://goerli.base.org")//toChainInfo?.Provider)
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    if (toChainInfo) {
        var ret = await web3.eth.sendTransaction({
            from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
            to: toChainInfo.OutBox,
            data: input,
            gasLimit: 500000,
        })
        console.log(ret)
    }
}

let args = process.argv;
if (args.length <= 0) {
    console.log("invalid input")
}
if (args[2] == "rollin_erc20") {
    if (args.length != 7) {
        console.log("invaild input")
        process.exit()
    }
    test_formatRollInERC20Input(Number(args[3]), args[4], args[5], args[6])
}

if (args[2] == "rollout_erc20") {
    if (args.length != 7) {
        console.log("invaild input")
        process.exit()
    }
    test_formatRollOutERC20Input(Number(args[3]), args[4], args[5], args[6])
}

if (args[2] == "claim") {
    if (args.length != 4) {
        console.log("invaild input")
        process.exit()
    }
    //@ts-ignore
    test_claim(args[3])
}

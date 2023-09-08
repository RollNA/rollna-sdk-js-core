import { Bytes, Numbers} from "web3";
import * as Web3 from "web3";
import { ErrorType } from "../../types/ErrorType";
import {CommonInput, SupportedChainInfo, RollnaChainInfo} from "../../types";
import { ContractInstanceFactory } from "../../contract/instanceFactory"
import { NodeInterfaceContract } from "../../contract/nodeInterface"
import claimAbi from "../../abi/IOutbox.json"
import ArbAbi from "../../abi/ArbSys.json"
import testMint from "../../abi/testErc20.json"
import { ArbSysAddr } from "../../types";
import rollInAbi from "../../abi/IL1GatewayRouter.json"
import { getRollOutTx, getClaimParams } from "../../utils/client/HttpsRpc"
import * as index from "./index"
import rollUpAbi from "../../abi/Rollup.json"
import inbox from "../../abi/IInbox.json"
import { toNumber } from "ethers";
import erc20 from "../../abi/testErc20.json";

async function test_formatRollInInput() {
    let input = await index.formatRollInInput(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        421613,
        "0xfffffffff",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        8000000,
        "0xfffffff"
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("https://goerli-rollup.arbitrum.io/rpc")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_formatRollInERC20Input() {
    let estimate_fee = await index.estimateRollInErc20fee(
        421613, 
        "0x2849370960B4f51c1cCe4B2375Eaf46aE7F7bd2A", 
        500000, 
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC", 
        "0xffffffffffffff"
    )
    if (estimate_fee == ErrorType.FormatInputFailed) {
        return
    }
    console.log(estimate_fee)
    let input = await index.formatRollInERC20Input(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        421613,
        "0xffffffffffffff",
        "0x2849370960B4f51c1cCe4B2375Eaf46aE7F7bd2A",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        500000,
        estimate_fee.gasPrice,
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        estimate_fee.value,
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("https://goerli-rollup.arbitrum.io/rpc")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_formatRollOutInput() {
    let input = await index.formatRollOutInput(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        1337,
        "0xffffffffffff",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        800000000,
        "0xfffffff"
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8548")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_formatRollOutERC20Input() {
    let input = await index.formatRollOutERC20Input(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        59140,
        "0xffffffffff",
        "0x52Aa44f91A9F6477AEBe00b92B102796CE00E3D9",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        800000000,
        "0xfffffff"
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://54.145.16.13:8548")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_claim() {
    let txs = await getRollOutTx("0x777add3378b999235cce77f71292dac1e8095ffc")
    
    //let params = await getClaimParams("0xabd76b3b5855d0168c06a9739f89390c4bbff2bd5df16a07721e848452b4bc2e")
    let params = await getClaimParams(txs[txs.length - 1 -4].txHash)
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
    var web3 = new Web3.Web3("https://rpc.goerli.linea.build/")
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    //@ts-ignore
    let toChainInfo = await SupportedChainInfo.getChainInfo(toChainId)
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


async function get_outbox() {
    var contract = new Web3.eth.contract.Contract(rollUpAbi, "0x8087c1e156564f31efa2911db2d1cb681bc5c901");
    contract.setProvider("https://goerli-rollup.arbitrum.io/rpc")
    var res = await contract.methods.outbox().call()
    console.log(res)
}

async function get_L2_token_addr() {
    var contract = new Web3.eth.contract.Contract(rollInAbi, "0x2FbEDe3a7984e3aA46D61FF5A4C0840962F54b85");
    contract.setProvider("https://goerli-rollup.arbitrum.io/rpc")
    //@ts-ignore
    var res = await contract.methods.calculateL2TokenAddress("0x2849370960B4f51c1cCe4B2375Eaf46aE7F7bd2A").call()
    console.log(res)
}

async function get_balance() {
    let web3 = new Web3.Web3("ws://54.145.16.13:8548")
    let res = await web3.eth.getBalance("0x777aDd3378b999235cce77F71292dAc1E8095FFC")
    console.log(res)
}

async function get_erc20_amount() {
    var contract = new Web3.eth.contract.Contract(erc20, "0x52Aa44f91A9F6477AEBe00b92B102796CE00E3D9");
    contract.setProvider("https://rpc.goerli.linea.build/")
    //@ts-ignore
    var res = await contract.methods.balanceOf("0x777aDd3378b999235cce77F71292dAc1E8095FFC").call()
    console.log(res)
}

async function approve_erc20() {
    var contract = new Web3.eth.contract.Contract(erc20, "0x2849370960B4f51c1cCe4B2375Eaf46aE7F7bd2A");
    contract.setProvider("https://goerli-rollup.arbitrum.io/rpc")
    //@ts-ignore
    let res = contract.methods.approve("0xaF12188A48678812Ad9Ee68024E238E734B87D60", "0xffffffffffffffff").encodeABI()
    let web3 = new Web3.Web3("https://goerli-rollup.arbitrum.io/rpc")
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    let ret = await web3.eth.sendTransaction(
        {
        from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        to: "0x2849370960B4f51c1cCe4B2375Eaf46aE7F7bd2A",
        data: res,
        gas: 8000000,
        gasPrice: "0xfffffff"
        }
    )
    console.log(ret)
}

async function mint_erc20() {
    var contract = new Web3.eth.contract.Contract(erc20, "0x7A7b5a0C9d12DA01603F3198864569879b1134b7");
    contract.setProvider("wss://goerli.infura.io/ws/v3/aa35e7272ee44948b55e4da63ee99cc9")
    //@ts-ignore
    let res = contract.methods.mint("0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0xffffffffffffffff").encodeABI()
    let web3 = new Web3.Web3("wss://goerli.infura.io/ws/v3/aa35e7272ee44948b55e4da63ee99cc9")
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    let ret = await web3.eth.sendTransaction(
        {
        from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        to: "0x7A7b5a0C9d12DA01603F3198864569879b1134b7",
        data: res,
        gas: 8000000,
        gasPrice: "0xfffffff"
        }
    )
    console.log(ret)
}

//test_formatRollInERC20Input()
//test_formatRollOutERC20Input()
test_claim()
//mint_erc20()
//approve_erc20()
//get_L2_token_addr()
//get_erc20_amount()


import { Bytes, Numbers} from "web3";
import * as Web3 from "web3";
import { ErrorType } from "../../types/ErrorType";
import {preComplieAddr, CommonInput, SupportedChainInfo, RollnaChainInfo, ProposalType} from "../../types";
import { ContractInstanceFactory } from "../../contract/instanceFactory"
import { AccountAbstraction } from "../../contract/account_abstraction/accountAbstraction";
import { lookupAAs } from "../../utils/client/HttpsRpc"
import { NodeInterfaceContract } from "../../contract/nodeInterface"
import claimAbi from "../../abi/IOutbox.json"
import ArbAbi from "../../abi/ArbSys.json"
import testMint from "../../abi/testErc20.json"
import { ArbSysAddr } from "../../types";
import rollInAbi from "../../abi/IL1GatewayRouter.json"
import { getRollOutTx, getClaimParams } from "../../utils/client/HttpsRpc"
import * as index from "./index"
import rollUpAbi from "../../abi/Rollup.json"

async function test_formatRollInInput() {
    let input = await index.formatRollInInput(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        1337,
        "0xfffffffffffff",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        800000,
        "0xffff"
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8346")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_formatRollInERC20Input() {
    let input = await index.formatRollInERC20Input(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        1337,
        "0xffffffffffffff",
        "0x37e6C8116B9f735b469B64Ee59b6464025Db6C31",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        8000000,
        "0xfffff",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        "0xfffffffffff"
    )
    if (input != ErrorType.FormatInputFailed) {
        let web3 = new Web3.Web3("ws://43.134.20.65:8346")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        let res = await web3.eth.sendTransaction(input)
        console.log(res)
    }
}

async function test_formatRollOutInput() {
    let input = await index.formatRollOutInput(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        1337,
        "0xffffffffff",
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

// test done
export async function formatRollOutERC20Input(
    fromAddr : string, 
    toChainId: Numbers, 
    amount: Numbers, 
    tokenAddr: string,
    destAddr: string,
    gas: Numbers,
    gasPrice: Numbers,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr, gateWayAddr, rollOutAddr);
            if (contractInstance != undefined) {
               let data = contractInstance.rollOut(destAddr, toChainId, amount, tokenAddr)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollOutContractAddr(),
                   gas: gas,
                   gasPrice: gasPrice,
                   data: data
               }
            }
        }
        return ErrorType.FormatInputFailed
}

async function test_formatRollOutERC20Input() {
    let input = await index.formatRollOutERC20Input(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        1337,
        "0xffffffffff",
        "0x37e6C8116B9f735b469B64Ee59b6464025Db6C31",
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

async function test_claim() {
    let txs = await getRollOutTx("0x777add3378b999235cce77f71292dac1e8095ffc")
    let params = await getClaimParams(txs[txs.length - 1].txHash)
    if (params.data == '') {
        params.data = []
    }
    let size = await index.getMerkleTreeState()
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
    var web3 = new Web3.Web3("ws://43.134.20.65:8346")
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    let toChainInfo = await SupportedChainInfo.getChainInfo(params.chainId)
    
    if (toChainInfo) {
        var ret = await web3.eth.sendTransaction({
            from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
            to: toChainInfo.OutBox,
            data: input,
            gasLimit: 5000000,
        })
        console.log(ret)
    }
}

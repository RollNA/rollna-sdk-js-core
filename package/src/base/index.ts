import { Bytes, Numbers} from "web3";
import * as Web3 from "web3";
import { ErrorType } from "../../types/ErrorType";
import {SupportedChainInfo, RollnaChainInfo} from "../../types";
import { ContractInstanceFactory } from "../../contract/instanceFactory"
import { NodeInterfaceContract } from "../../contract/nodeInterface"
import claimAbi from "../../abi/IOutbox.json"
import ArbAbi from "../../abi/ArbSys.json"
import { ArbSysAddr } from "../../types/";
import rollInAbi from "../../abi/IL1GatewayRouter.json"
import L2Router from "../../abi/L2router.json"
import L2Gateway from "../../abi/L2GatewayRouter.json"
import { getConfirmBlock } from "../../utils/client/HttpsRpc"
import rollUpAbi from "../../abi/Rollup.json"
import { toNumber } from "ethers";

// test done
export async function formatRollInInput(
    fromAddr : string, 
    fromChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas: Numbers,
    gasPrice: string,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) {
        let fromChainInfo = SupportedChainInfo.getChainInfo(fromChainId)
        if (fromChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(false, fromChainId, gateWayAddr, rollOutAddr);
            if (contractInstance != undefined) {
               let data = contractInstance.rollIn(fromAddr, destAddr, amount)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollInContractAddr(),
                   gas: gas,
                   gasPrice: gasPrice,
                   value: Web3.utils.toHex(amount),
                   data: data
               }
            }
        }
        return ErrorType.FormatInputFailed
}

// test done
export async function formatRollInERC20Input(
    fromAddr : string, 
    fromChainId: Numbers, 
    amount: Numbers, 
    tokenAddr: string,
    destAddr: string,
    gas: Numbers,
    gasPrice: Numbers,
    reFundTo: string,
    value: Numbers,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) {
        let fromChainInfo = await SupportedChainInfo.getChainInfo(fromChainId)
        if (fromChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(true, fromChainId, tokenAddr, gateWayAddr, rollOutAddr);
            if (contractInstance != undefined) {
               var contract = new Web3.eth.contract.Contract(rollInAbi, contractInstance.getRollInContractAddr());
               var rollnaInfo = await RollnaChainInfo.getRollNaInfo()
               contract.setProvider(fromChainInfo.Provider)
               //@ts-ignore
               let outboundCalldata = await contract.methods.getOutboundCalldata(tokenAddr, fromAddr, destAddr, amount, []).call()
               if (!outboundCalldata) {
                return ErrorType.FormatInputFailed
               }
               const web3Context = new Web3.Web3Context(rollnaInfo.rollnaProvider);
               //@ts-ignore
               let block = await Web3.eth.getBlock(web3Context)
               //@ts-ignore
               var basefee_num = BigInt(Web3.utils.hexToNumber(block.baseFeePerGas))
               if (fromChainId == 1338) {
                   basefee_num = BigInt(15000000000)
               }
               let maxSubmissionCost = basefee_num * BigInt(((outboundCalldata.length - 2) * 3 + 1400))
               let inner_data = Web3.eth.abi.encodeParameters(['uint256', 'bytes'], [maxSubmissionCost, []]);
               let data = contractInstance.rollIn(destAddr, fromAddr, amount, reFundTo, gas, gasPrice, tokenAddr, inner_data)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollInContractAddr(),
                   gas: gas,
                   gasPrice: gasPrice,
                   data: data,
                   value: value,
                   gasLimit: "0xfffff"
               }
            }
        }
        return ErrorType.FormatInputFailed
}

export async function estimateRollInErc20fee(chainId: Numbers, tokenAddr: string, gas: Numbers, fromAddr: string, destAddr: string, amount: Numbers) {
    let fromChainInfo = await SupportedChainInfo.getChainInfo(chainId)
    if (fromChainInfo != undefined) {
        let contractInstance = await ContractInstanceFactory.getContractInstance(true, chainId, tokenAddr)
        if (contractInstance != undefined) {
            var contract = new Web3.eth.contract.Contract(rollInAbi, contractInstance.getRollInContractAddr());
               var rollnaInfo = await RollnaChainInfo.getRollNaInfo()
               contract.setProvider(fromChainInfo.Provider)
               //@ts-ignore
               let outboundCalldata = await contract.methods.getOutboundCalldata(tokenAddr, fromAddr, destAddr, amount, []).call()
               if (!outboundCalldata) {
                return ErrorType.FormatInputFailed
               }
               const web3Context = new Web3.Web3Context(rollnaInfo.rollnaProvider);
               //@ts-ignore
               let block = await Web3.eth.getBlock(web3Context)
               //@ts-ignore
               var basefee_num = BigInt(Web3.utils.hexToNumber(block.baseFeePerGas))
               if (chainId == 1338) {
                   basefee_num = BigInt(15000000000)
               }
               let maxSubmissionCost = basefee_num * BigInt(((outboundCalldata.length - 2) * 3 + 1400))
               let value = maxSubmissionCost + basefee_num * BigInt(gas)
               return {
                   gasPrice: basefee_num,
                   value: value
               }
        }
    }
    return ErrorType.FormatInputFailed
}

// test done
export async function formatRollOutInput(
    fromAddr : string, 
    toChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas: Numbers,
    gasPrice: Numbers,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(false, toChainId, gateWayAddr, rollOutAddr);
            if (contractInstance != undefined) {
               let data = contractInstance.rollOut(destAddr, toChainId)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollOutContractAddr(),
                   value: Web3.utils.toHex(amount),
                   gas: gas,
                   gasPrice: gasPrice,
                   data: data
               }
            }
        }
        return ErrorType.FormatInputFailed
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

//test done
export async function getMerkleTreeState(block_num: Numbers | undefined): Promise<any> {
    var rollnaInfo = await RollnaChainInfo.getRollNaInfo()

    var contract = new Web3.eth.contract.Contract(ArbAbi, ArbSysAddr)
    contract.setProvider(rollnaInfo.rollnaProvider)
    //@ts-ignore
    var ret = await contract.methods.sendMerkleTreeState().call({}, block_num)
    //@ts-ignore
    return Number(ret["size"])
}
// test done
export async function getRollOutProof(size: Numbers, leaf: Numbers) : Promise<any> {
    let raw_arr =  await NodeInterfaceContract.getProof(size, leaf)
    let ret_arr = []
    for (const v of raw_arr.proof) {
        ret_arr.push(Web3.utils.hexToBytes(v))
    }
    return ret_arr
}

export async function getDestChainId(is_erc20: boolean, gateway?: string, txhash?: string) {
    var rollnaInfo = await RollnaChainInfo.getRollNaInfo()
    if (is_erc20) {
            if (gateway) {
            var contract = new Web3.eth.contract.Contract(L2Gateway, gateway)
            contract.setProvider(rollnaInfo.rollnaProvider)
            //@ts-ignore
            var router_addr = await contract.methods.router().call()
            //@ts-ignore
            var contract = new Web3.eth.contract.Contract(L2Router, router_addr)
            contract.setProvider(rollnaInfo.rollnaProvider)
            //@ts-ignore
            var big_num = await contract.methods.counterpartChainID().call()
            //@ts-ignore
            return toNumber(big_num)
        }
    } else {
        if (txhash) {
            var web3 = new Web3.Web3(rollnaInfo.rollnaProvider)
            var tx = await web3.eth.getTransaction(txhash)
            if (tx.data) {
                var raw_chain_id = "0x" + tx.data.slice(10, 74)
                return Web3.utils.hexToNumber(raw_chain_id)
            }
        }
    }
}

export async function getLatestConfirmBlock(chainId: Numbers) {
    var chainInfo = await SupportedChainInfo.getChainInfo(chainId)
    if (chainInfo) {
        var contract = new Web3.eth.contract.Contract(rollUpAbi, chainInfo.RollUp);
        contract.setProvider(chainInfo.Provider)
        var block_num = await contract.methods.latestConfirmed().call()
        if (block_num) {
            //@ts-ignore
            var confirmdata = await contract.methods.getNode(block_num).call()
            if (confirmdata) {
                //@ts-ignore
                return getConfirmBlock(confirmdata.confirmData)
            }
        }
    }
    return undefined
}

export function formatClaimTokenInput(
    proof : Uint8Array, 
    index : Numbers, 
    lrSender : string, 
    to : string, 
    lrBlock: Numbers, 
    l1Block: Numbers, 
    lrTimestamp: Numbers, 
    value: Numbers,
    data: Bytes,
    ) {
    var contract = new Web3.eth.contract.Contract(claimAbi)
    //@ts-ignore
    return contract.methods.executeTransaction(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value, data).encodeABI()       
}

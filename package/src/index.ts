import { Numbers } from "web3";
import {CommonInput, SupportedChainInfo, RollnaInfo, RollnaChainInfo, RollOutProof} from "../types";
import { ContractInstanceFactory } from "../contract/instanceFactory"
import * as Web3 from "web3"
import { NodeInterfaceContract } from "../contract/nodeInterface"
import claimAbi from "../abi/IOutbox.json"

export function formatRollInInput(
    fromAddr : string, 
    fromChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas: Numbers
    ) : CommonInput | undefined {
        let fromChainInfo = SupportedChainInfo.getChainInfo(fromChainId)
        if (fromChainInfo != undefined) {
            let contractInstance = ContractInstanceFactory.getContractInstance(false, fromChainId);
            if (contractInstance != undefined) {
               let data = contractInstance.rollIn(fromAddr, destAddr, amount)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollInContractAddr(),
                   gas: gas,
                   value: Web3.utils.toHex(amount),
                   data: data
               }
            }
        }
        return undefined
}

export function formatRollInERC20Input(
    fromAddr : string, 
    fromChainId: Numbers, 
    amount: Numbers, 
    tokenAddr: string,
    destAddr: string,
    gas: Numbers,
    gasPrice: Numbers,
    reFundTo: string,
    ) : CommonInput | undefined {
        let fromChainInfo = SupportedChainInfo.getChainInfo(fromChainId)
        if (fromChainInfo != undefined) {
            let contractInstance = ContractInstanceFactory.getContractInstance(true, fromChainId, tokenAddr);
            if (contractInstance != undefined) {
               let data = contractInstance.rollIn(destAddr, fromAddr, amount, reFundTo, gas, gasPrice)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollInContractAddr(),
                   gas: gas,
                   data: data
               }
            }
        }
        return undefined
}

export function formatRollOutInput(
    fromAddr : string, 
    toChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas: Numbers
    ) : CommonInput | undefined {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = ContractInstanceFactory.getContractInstance(false, toChainId);
            if (contractInstance != undefined) {
               let data = contractInstance.rollOut(destAddr, toChainId)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollOutContractAddr(),
                   value: Web3.utils.toHex(amount),
                   gas: gas,
                   data: data
               }
            }
        }
        return undefined
}

export function formatRollOutERC20Input(
    fromAddr : string, 
    toChainId: Numbers, 
    amount: Numbers, 
    tokenAddr: string,
    destAddr: string,
    gas: Numbers
    ) : CommonInput | undefined {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr);
            if (contractInstance != undefined) {
               let data = contractInstance.rollOut(destAddr, toChainId, amount, tokenAddr)
               return {
                   from: fromAddr,
                   to: contractInstance.getRollOutContractAddr(),
                   gas: gas,
                   data: data
               }
            }
        }
        return undefined
}

export async function estimateRollInGasPrice(httpProvider: string, input: CommonInput) : Promise<Numbers> {
    var web3 = new Web3.Web3(httpProvider)
    return await web3.eth.estimateGas(input)
    // need gasfee in LR
    // (TODO:mingxuan)need further design with saitama and jessica
}

export async function getRollnaInfo() : Promise<RollnaInfo|undefined> {
    return await RollnaChainInfo.getRollNaInfo()
}

export async function getRollOutProof(size: Numbers, leaf: Numbers) : Promise<any> {
    return NodeInterfaceContract.getProof(size, leaf)

}

export async function formatClaimTokenInput(
    proof : Uint8Array, 
    index : Numbers, 
    lrSender : string, 
    to : string, 
    lrBlock: Numbers, 
    l1Block: Numbers, 
    lrTimestamp: Numbers, 
    value: Numbers
    ) : Promise<any> {
    var contract = new Web3.eth.contract.Contract(claimAbi)
    //@ts-ignore
    return contract.methods.executeTransaction(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value).encodeABI()       
}
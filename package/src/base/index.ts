import { Numbers } from "web3";
import { ErrorType } from "../../types/ErrorType";
import {preComplieAddr, CommonInput, SupportedChainInfo, RollnaInfo, RollnaChainInfo, ProposalType} from "../../types";
import { ContractInstanceFactory } from "../../contract/instanceFactory"
import { AccountAbstraction } from "../../contract/account_abstraction/accountAbstraction";
import { lookupAAs } from "../../utils/client/HttpsRpc"
import * as Web3 from "web3"
import { NodeInterfaceContract } from "../../contract/nodeInterface"
import claimAbi from "../../abi/IOutbox.json"

export async function formatRollInInput(
    fromAddr : string, 
    fromChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas: Numbers,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) : Promise<CommonInput | ErrorType> {
        let fromChainInfo = SupportedChainInfo.getChainInfo(fromChainId)
        if (fromChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(false, fromChainId, gateWayAddr, rollOutAddr);
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
        return ErrorType.FormatInputFailed
}

export async function formatRollInERC20Input(
    fromAddr : string, 
    fromChainId: Numbers, 
    amount: Numbers, 
    tokenAddr: string,
    destAddr: string,
    gas: Numbers,
    gasPrice: Numbers,
    reFundTo: string,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) : Promise<CommonInput | ErrorType> {
        let fromChainInfo = SupportedChainInfo.getChainInfo(fromChainId)
        if (fromChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(true, fromChainId, tokenAddr, gateWayAddr, rollOutAddr);
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
        return ErrorType.FormatInputFailed
}

export async function formatRollOutInput(
    fromAddr : string, 
    toChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas: Numbers,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) : Promise<CommonInput | ErrorType> {
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
                   data: data
               }
            }
        }
        return ErrorType.FormatInputFailed
}

export async function formatRollOutERC20Input(
    fromAddr : string, 
    toChainId: Numbers, 
    amount: Numbers, 
    tokenAddr: string,
    destAddr: string,
    gas: Numbers,
    gateWayAddr?: string,
    rollOutAddr?: string,
    ) : Promise<CommonInput | ErrorType> {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr, gateWayAddr, rollOutAddr);
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
        return ErrorType.FormatInputFailed
}

export async function estimateRollInGasPrice(httpProvider: string, input: CommonInput) : Promise<Numbers> {
    var web3 = new Web3.Web3(httpProvider)
    return await web3.eth.estimateGas(input)
    // need gasfee in LR
    // (TODO:mingxuan)need further design with saitama and jessica
}

export async function getRollnaInfo() : Promise<RollnaInfo|ErrorType> {
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

export async function getAAVersion(Signer: string, Sender: string) {
    return AccountAbstraction.getAAVersion(Sender, Signer)
} 

export async function getProposalLength(Signer: string, Sender: string) {
    return AccountAbstraction.getProposalLength(Sender, Signer)
} 

export async function isAALocked(Signer: string, Sender: string) {
    return AccountAbstraction.isAALocked(Sender, Signer)
} 

export function formatAccountAbstractionInput(
    owner: string, 
    guardians?: string[], 
    validator?: string, 
    gas?: Numbers
) {
    var innerData = AccountAbstraction.createAccountAbstractionData(owner, guardians, validator)
    return {
        from: owner,
        gas: gas,
        data: innerData
    }
}

export function formatAccountAbstractionFromAAInput(
    signer: string, 
    sender: string, 
    guardians?: string[], 
    validator?: string, 
    gas?: Numbers
) {
    var innerData = AccountAbstraction.createAccountAbstractionFromAAData(signer, sender, guardians, validator)
    return {
        from: signer,
        gas: gas,
        to: preComplieAddr,
        data: innerData
    }
}

export function formatLockInput(
    signer: string, 
    sender: string, 
    gas?: Numbers
) {
    var innerData = AccountAbstraction.lock(sender)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export function formatUnlockInput(
    signer: string, 
    sender: string, 
    proposalId: Numbers,
    gas?: Numbers
) {
    var innerData = AccountAbstraction.unlock(sender, proposalId)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export function formatRecoverInput(
    signer: string, 
    sender: string, 
    proposalId: Numbers,
    newOwner: string,
    gas?: Numbers
) {
    var innerData = AccountAbstraction.recover(sender, proposalId, newOwner)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatSetValidatorInput(
    signer: string, 
    sender: string, 
    validator: string,
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.setValidator(sender, validator)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatAddGuardiansInput(
    signer: string, 
    sender: string, 
    guardians: string[],
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.addGuardians(sender, guardians)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatRemoveGuardiansInput(
    signer: string, 
    sender: string, 
    guardians: string[],
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.removeGuardians(sender, guardians)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export function formatSubmitProposalInput(
    signer: string, 
    sender: string, 
    proposalType: ProposalType,
    gas?: Numbers
) {
    var innerData = AccountAbstraction.submitProposal(sender, proposalType)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatAARolloutInput(
    signer: string, 
    sender: string, 
    toChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.createAARolloutData(
        signer, 
        sender, 
        toChainId, 
        amount, 
        destAddr
    )
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatAARolloutErc20Input(
    signer: string, 
    sender: string, 
    toChainId: Numbers, 
    amount: Numbers, 
    destAddr: string,
    tokenAddr: string,
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.createAARolloutErc20Data(
        signer, 
        sender, 
        toChainId, 
        amount, 
        destAddr, 
        tokenAddr
    )
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatAATransferInput(
    signer: string,
    sender: string,
    to: string,
    amount: Numbers,
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.createAATransferData(signer, sender, to, amount)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatAACallContractInput(
    signer: string,
    sender: string,
    to: string,
    innerData: string,
    gas?: Numbers
) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.createAACallContractData(
        signer, 
        sender, 
        to, 
        innerData
    )
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}

export async function formatUpgradeAAInput(signer: string, sender: string, gas?: Numbers) {
    var AAs = await lookupAAs(signer)
    if (AAs == ErrorType.HttpRpcFailed) {
        return AAs
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType.NotAuthorizedOwner
    }
    var innerData = AccountAbstraction.createUpgradeAAData(signer, sender)
    return {
        from: signer,
        gas: gas,
        data: innerData
    }
}


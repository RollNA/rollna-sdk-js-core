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
import { ArbSysAddr } from "../../types/";
import rollInAbi from "../../abi/IL1GatewayRouter.json"
import { getRollOutTx, getClaimParams } from "../../utils/client/HttpsRpc"
import rollUpAbi from "../../abi/Rollup.json"

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

async function test() {

    let txs = await getRollOutTx("0x777add3378b999235cce77f71292dac1e8095ffc")
    console.log(txs)
    let params = await getClaimParams(txs[0].txHash)
    if (params.data == '') {
        params.data = []
    }
    console.log(params)
    let size = await getMerkleTreeState()
    /*console.log(size)
    let proof = await getRollOutProof(size, params.leaf)
    console.log(proof)
    let input = await formatClaimTokenInput(
        proof.proof,
        params.leaf,
        params.lrsender,
        params.to,
        params.lrBlock,
        params.l1Block,
        params.lrtimestamp,
        Web3.utils.toHex(Web3.utils.toBigInt(params.value)),
        params.data
    )

    var web3 = new Web3.Web3("ws://43.134.20.65:8546")
    web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
    let toChainInfo = await SupportedChainInfo.getChainInfo(params.chainId)
    
    if (toChainInfo) {
        console.log(toChainInfo.OutBox)
        var ret = await web3.eth.call({
            from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
            to: toChainInfo.OutBox,
            data: input,
            gas: 800000,
            gasPrice: "0xfff",
        })
        console.log(ret)
    }

    console.log(input)*/
    /*let res = await formatRollOutInput(
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        1337,
        "0xffffffffffffff",
        "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
        800000000,
        "0xfffffff",
    )
    console.log(res)
    
    if (res != ErrorType.FormatInputFailed) {
        var web3 = new Web3.Web3("ws://43.134.20.65:8548")
        web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        //var test2 = await web3.eth.accounts.signTransaction(res, '0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
        //console.log(test2)
        var ret = await web3.eth.sendTransaction(res)
        //var ret = await web3.eth.call(res)
        console.log(ret)
    }*/
}


//var contract = new Web3.eth.contract.Contract(testMint, "0x57a3e28f18e2Dd24B648982836aEC4d618d3494F")
//var web3 = new Web3.Web3("ws://43.134.20.65:8646")
//contract.setProvider("ws://43.134.20.65:8646")
//web3.eth.accounts.wallet.add('0x0a4eb679dc5fcf150796fca0d0ebdf747ecf4bede66de4f5a7dd01042982f53f');
/*//@ts-ignore
var data1 = contract.methods.mint("0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0xffffffffffffffffffffffffff").encodeABI()
web3.eth.sendTransaction({
    from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
    to: "0x57a3e28f18e2Dd24B648982836aEC4d618d3494F",
    data: data1,
    gas: 8000000,
    gasPrice: "0xfffff"
}).then((value)=>{console.log(value)})*/
//@ts-ignore
//var data1 = contract.methods.approve("0x33A5653c415c5EEcb972e46868bc26F38c1FF380", "0xffffffffffffffffffffffffff").encodeABI()
//web3.eth.sendTransaction({
//    from: "0x777aDd3378b999235cce77F71292dAc1E8095FFC",
//    to: "0x57a3e28f18e2Dd24B648982836aEC4d618d3494F",
//    data: data1,
//    gas: 8000000,
//    gasPrice: "0xfffff"
//}).then((value)=>{console.log(value)})

//@ts-ignore
//contract.methods.allowance("0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0x2C399bAF475979de804e8DB9A3DBB56dc9fde2F4").call().then((value)=>{console.log(value)})
//@ts-ignore
//contract.methods.allowance("0x777aDd3378b999235cce77F71292dAc1E8095FFC", "0x33A5653c415c5EEcb972e46868bc26F38c1FF380").call().then((value)=>{console.log(value)})



//test()
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

export async function estimateRollInGasPrice(httpProvider: string, input: CommonInput) : Promise<Numbers> {
    var web3 = new Web3.Web3(httpProvider)
    return await web3.eth.estimateGas(input)
    // need gasfee in LR
    // (TODO:mingxuan)need further design with saitama and jessica
}

// test done
export async function getRollnaInfo() {
    return await RollnaChainInfo.getRollNaInfo()
}

//test done
export async function getMerkleTreeState(): Promise<any> {
    var rollnaInfo = await RollnaChainInfo.getRollNaInfo()

    var contract = new Web3.eth.contract.Contract(ArbAbi, ArbSysAddr)
    contract.setProvider(rollnaInfo.rollnaProvider)
    //@ts-ignore
    var ret = await contract.methods.sendMerkleTreeState().call()
    //@ts-ignore
    return Number(ret["size"])
}

// test done
export async function getRollOutProof(size: Numbers, leaf: Numbers) : Promise<any> {
    let raw_arr =  await NodeInterfaceContract.getProof(size, leaf)
    let ret_arr = []
    console.log(raw_arr)
    for (const v of raw_arr.proof) {
        ret_arr.push(Web3.utils.hexToBytes(v))
    }
    return ret_arr
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
    console.log(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value, data)
    //@ts-ignore
    return contract.methods.executeTransaction(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value, data).encodeABI()       
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

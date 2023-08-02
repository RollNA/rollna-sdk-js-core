import * as Web3 from "web3"
import { Numbers } from "web3";
import AAAbi from "../../abi/AccountAbstraction.json"
import ProxyAbi from "../../abi/Proxy.json"
import UserOperationAbi from "../../abi/UserOperation.json"
import {SupportedChainInfo, ProposalType, RollnaChainInfo} from "../../types";
import { ErrorType } from "../../types/ErrorType";
import { ContractInstanceFactory } from "../../contract/instanceFactory"

export class AccountAbstraction {
    private signer: string|undefined;
    private sender: string;
    constructor(Sender: string, Signer?: string) {
        if (Signer != undefined) {
            this.signer = Signer;
        }    
        this.sender = Sender;
    }
    static getAAVersion(Sender: string, Signer?: string) {
        var rollnaInfo = RollnaChainInfo.getRollNaInfo()

        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        contract.setProvider(rollnaInfo.rollnaProvider)
        //@ts-ignore
        return contract.methods.VERSION().call({from: Signer})
    }

    static getProposalLength(Sender: string, Signer?: string) {
        var rollnaInfo = RollnaChainInfo.getRollNaInfo()

        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        contract.setProvider(rollnaInfo.rollnaProvider)
        //@ts-ignore
        return contract.methods.proposalLength().call({from: Signer})
    }

    static isAALocked(Sender: string, Signer?: string) {
        var rollnaInfo = RollnaChainInfo.getRollNaInfo()

        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        contract.setProvider(rollnaInfo.rollnaProvider)
        //@ts-ignore
        return contract.methods.locked().call({from: Signer})
    }

    static createAccountAbstractionData(owner: string, guardians?: string[], validator?: string) : string {
        var contract = new Web3.eth.contract.Contract(AAAbi);
        //@ts-ignore
        var AAContractAbi = contract.methods.initialize(owner, guardians, validator).encodeABI()
        var proxyContract = new Web3.eth.contract.Contract(ProxyAbi);
        return proxyContract.methods.constructor(RollnaChainInfo.getAAVersion(), AAContractAbi).encodeABI()
    }

    static createAccountAbstractionFromAAData(Signer: string, Sender: string, guardians?: string[], validator?: string) {
        var innerData = AccountAbstraction.createAccountAbstractionData(Sender, guardians, validator);
        return Web3.eth.abi.encodeParameter(UserOperationAbi, {
            signer: Signer,
            sender: Sender,
            data: innerData
        })
    }

    static lock(Sender: string) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        return contract.methods.lock().encodeABI()
    }

    static unlock(Sender: string, ProposalId: Numbers) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        //@ts-ignore
        return contract.methods.unlock(ProposalId).encodeABI()       
    }

    static recover(Sender: string, ProposalId: Numbers, NewOwner: String) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        //@ts-ignore
        return contract.methods.recover(ProposalId, NewOwner).encodeABI()   
    }

    static setValidator(Sender: string, validator: string) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        //@ts-ignore
        return contract.methods.setCustomValidator(validator).encodeABI()  
    }

    static addGuardians(Sender: string, guardians: string[]) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        //@ts-ignore
        return contract.methods.setGuardians(guardians).encodeABI()         
    }

    static removeGuardians(Sender: string, guardians: string[]) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        //@ts-ignore
        return contract.methods.removeGuardians(guardians).encodeABI()         
    }

    static submitProposal(Sender: string, ProposalType: ProposalType) {
        var contract = new Web3.eth.contract.Contract(AAAbi, Sender)
        //@ts-ignore
        return contract.methods.submitProposal(Number(ProposalType.toString())).encodeABI()          
    }

    static async createAARolloutData(
        Signer: string, 
        Sender: string, 
        toChainId: Numbers, 
        amount: Numbers, 
        destAddr: string
    ) {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(false, toChainId);
            if (contractInstance != undefined) {
               let innerData = contractInstance.rollOut(destAddr, toChainId)
               return Web3.eth.abi.encodeParameter(UserOperationAbi, {
                signer: Signer,
                sender: Sender,
                value: amount,
                data: innerData
            })
            }
        }
        return ErrorType.UnsupportedChainOrToken
    }

    static async createAARolloutErc20Data(
        Signer: string, 
        Sender: string, 
        toChainId: Numbers, 
        amount: Numbers, 
        destAddr: string,
        tokenAddr: string,
    ) {
        let toChainInfo = SupportedChainInfo.getChainInfo(toChainId)
        if (toChainInfo != undefined) {
            let contractInstance = await ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr);
            if (contractInstance != undefined) {
               let innerData = contractInstance.rollOut(destAddr, toChainId, amount, tokenAddr)
               return Web3.eth.abi.encodeParameter(UserOperationAbi, {
                signer: Signer,
                sender: Sender,
                value: amount,
                data: innerData
            })
            }
        }
        return ErrorType.UnsupportedChainOrToken
    }

    static createAATransferData(
        Signer: string, 
        Sender: string,     
        To: string, 
        amount: Numbers, 
    ) {
        return Web3.eth.abi.encodeParameter(UserOperationAbi, {
            signer: Signer,
            sender: Sender,
            value: amount,
            to: To
        })
    }

    static createAACallContractData(
        Signer: string, 
        Sender: string,     
        To: string, 
        innerData: string, 
    ) {
        return Web3.eth.abi.encodeParameter(UserOperationAbi, {
            signer: Signer,
            sender: Sender,
            to: To,
            data: innerData
        })
    }

    static async createUpgradeAAData(Signer: string, Sender: string) {
        var contract = new Web3.eth.contract.Contract(AAAbi);
        await RollnaChainInfo.updateAAVersion()
        //@ts-ignore
        var innerData = contract.methods.upgradeTo(RollnaChainInfo.getAAVersion()).encodeABI()
        return Web3.eth.abi.encodeParameter(UserOperationAbi, {
            signer: Signer,
            sender: Sender,
            data: innerData
        })     
    }
}
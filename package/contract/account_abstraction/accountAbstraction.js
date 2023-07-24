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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAbstraction = void 0;
const Web3 = __importStar(require("web3"));
const AccountAbstraction_json_1 = __importDefault(require("../../abi/AccountAbstraction.json"));
const Proxy_json_1 = __importDefault(require("../../abi/Proxy.json"));
const UserOperation_json_1 = __importDefault(require("../../abi/UserOperation.json"));
const types_1 = require("../../types");
const ErrorType_1 = require("../../types/ErrorType");
const instanceFactory_1 = require("../../contract/instanceFactory");
class AccountAbstraction {
    signer;
    sender;
    constructor(Sender, Signer) {
        if (Signer != undefined) {
            this.signer = Signer;
        }
        this.sender = Sender;
    }
    static getAAVersion(Sender, Signer) {
        var rollnaInfo = types_1.RollnaChainInfo.getRollNaInfo();
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        contract.setProvider(rollnaInfo.rollnaProvider);
        //@ts-ignore
        return contract.methods.VERSION().send({ from: Signer });
    }
    static getProposalLength(Sender, Signer) {
        var rollnaInfo = types_1.RollnaChainInfo.getRollNaInfo();
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        contract.setProvider(rollnaInfo.rollnaProvider);
        //@ts-ignore
        return contract.methods.proposalLength().send({ from: Signer });
    }
    static isAALocked(Sender, Signer) {
        var rollnaInfo = types_1.RollnaChainInfo.getRollNaInfo();
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        contract.setProvider(rollnaInfo.rollnaProvider);
        //@ts-ignore
        return contract.methods.locked().send({ from: Signer });
    }
    static createAccountAbstractionData(owner, guardians, validator) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default);
        //@ts-ignore
        var AAContractAbi = contract.methods.initialize(owner, guardians, validator).encodeABI();
        var proxyContract = new Web3.eth.contract.Contract(Proxy_json_1.default);
        return proxyContract.methods.constructor(types_1.RollnaChainInfo.getAAVersion(), AAContractAbi).encodeABI();
    }
    static createAccountAbstractionFromAAData(Signer, Sender, guardians, validator) {
        var innerData = AccountAbstraction.createAccountAbstractionData(Sender, guardians, validator);
        return Web3.eth.abi.encodeParameter(UserOperation_json_1.default, {
            signer: Signer,
            sender: Sender,
            data: innerData
        });
    }
    static lock(Sender) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        return contract.methods.lock().encodeABI();
    }
    static unlock(Sender, ProposalId) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        //@ts-ignore
        return contract.methods.unlock(ProposalId).encodeABI();
    }
    static recover(Sender, ProposalId, NewOwner) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        //@ts-ignore
        return contract.methods.recover(ProposalId, NewOwner).encodeABI();
    }
    static setValidator(Sender, validator) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        //@ts-ignore
        return contract.methods.setCustomValidator(validator).encodeABI();
    }
    static addGuardians(Sender, guardians) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        //@ts-ignore
        return contract.methods.setGuardians(guardians).encodeABI();
    }
    static removeGuardians(Sender, guardians) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        //@ts-ignore
        return contract.methods.removeGuardians(guardians).encodeABI();
    }
    static submitProposal(Sender, ProposalType) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default, Sender);
        //@ts-ignore
        return contract.methods.submitProposal(Number(ProposalType.toString())).encodeABI();
    }
    static createAARolloutData(Signer, Sender, toChainId, amount, destAddr) {
        let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
        if (toChainInfo != undefined) {
            let contractInstance = instanceFactory_1.ContractInstanceFactory.getContractInstance(false, toChainId);
            if (contractInstance != undefined) {
                let innerData = contractInstance.rollOut(destAddr, toChainId);
                return Web3.eth.abi.encodeParameter(UserOperation_json_1.default, {
                    signer: Signer,
                    sender: Sender,
                    value: amount,
                    data: innerData
                });
            }
        }
        return ErrorType_1.ErrorType.UnsupportedChainOrToken;
    }
    static createAARolloutErc20Data(Signer, Sender, toChainId, amount, destAddr, tokenAddr) {
        let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
        if (toChainInfo != undefined) {
            let contractInstance = instanceFactory_1.ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr);
            if (contractInstance != undefined) {
                let innerData = contractInstance.rollOut(destAddr, toChainId, amount, tokenAddr);
                return Web3.eth.abi.encodeParameter(UserOperation_json_1.default, {
                    signer: Signer,
                    sender: Sender,
                    value: amount,
                    data: innerData
                });
            }
        }
        return ErrorType_1.ErrorType.UnsupportedChainOrToken;
    }
    static createAATransferData(Signer, Sender, To, amount) {
        return Web3.eth.abi.encodeParameter(UserOperation_json_1.default, {
            signer: Signer,
            sender: Sender,
            value: amount,
            to: To
        });
    }
    static createAACallContractData(Signer, Sender, To, innerData) {
        return Web3.eth.abi.encodeParameter(UserOperation_json_1.default, {
            signer: Signer,
            sender: Sender,
            to: To,
            data: innerData
        });
    }
    static async createUpgradeAAData(Signer, Sender) {
        var contract = new Web3.eth.contract.Contract(AccountAbstraction_json_1.default);
        await types_1.RollnaChainInfo.updateAAVersion();
        //@ts-ignore
        var innerData = contract.methods.upgradeTo(types_1.RollnaChainInfo.getAAVersion()).encodeABI();
        return Web3.eth.abi.encodeParameter(UserOperation_json_1.default, {
            signer: Signer,
            sender: Sender,
            data: innerData
        });
    }
}
exports.AccountAbstraction = AccountAbstraction;

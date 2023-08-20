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
exports.formatUpgradeAAInput = exports.formatAACallContractInput = exports.formatAATransferInput = exports.formatAARolloutErc20Input = exports.formatAARolloutInput = exports.formatSubmitProposalInput = exports.formatRemoveGuardiansInput = exports.formatAddGuardiansInput = exports.formatSetValidatorInput = exports.formatRecoverInput = exports.formatUnlockInput = exports.formatLockInput = exports.formatAccountAbstractionFromAAInput = exports.formatAccountAbstractionInput = exports.isAALocked = exports.getProposalLength = exports.getAAVersion = exports.formatClaimTokenInput = exports.getRollOutProof = exports.getMerkleTreeState = exports.getRollnaInfo = exports.estimateRollInGasPrice = exports.formatRollOutERC20Input = exports.formatRollOutInput = exports.formatRollInERC20Input = exports.formatRollInInput = void 0;
const ErrorType_1 = require("../../types/ErrorType");
const types_1 = require("../../types");
const instanceFactory_1 = require("../../contract/instanceFactory");
const accountAbstraction_1 = require("../../contract/account_abstraction/accountAbstraction");
const HttpsRpc_1 = require("../../utils/client/HttpsRpc");
const Web3 = __importStar(require("web3"));
const nodeInterface_1 = require("../../contract/nodeInterface");
const IOutbox_json_1 = __importDefault(require("../../abi/IOutbox.json"));
const ArbSys_json_1 = __importDefault(require("../../abi/ArbSys.json"));
const Consts_1 = require("../../types/Consts");
async function formatRollInInput(fromAddr, fromChainId, amount, destAddr, gas, gateWayAddr, rollOutAddr) {
    let fromChainInfo = types_1.SupportedChainInfo.getChainInfo(fromChainId);
    if (fromChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(false, fromChainId, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollIn(fromAddr, destAddr, amount);
            return {
                from: fromAddr,
                to: contractInstance.getRollInContractAddr(),
                gas: gas,
                value: Web3.utils.toHex(amount),
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollInInput = formatRollInInput;
async function formatRollInERC20Input(fromAddr, fromChainId, amount, tokenAddr, destAddr, gas, gasPrice, reFundTo, gateWayAddr, rollOutAddr) {
    let fromChainInfo = types_1.SupportedChainInfo.getChainInfo(fromChainId);
    if (fromChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(true, fromChainId, tokenAddr, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollIn(destAddr, fromAddr, amount, reFundTo, gas, gasPrice);
            return {
                from: fromAddr,
                to: contractInstance.getRollInContractAddr(),
                gas: gas,
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollInERC20Input = formatRollInERC20Input;
async function formatRollOutInput(fromAddr, toChainId, amount, destAddr, gas, gateWayAddr, rollOutAddr) {
    let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(false, toChainId, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollOut(destAddr, toChainId);
            return {
                from: fromAddr,
                to: contractInstance.getRollOutContractAddr(),
                value: Web3.utils.toHex(amount),
                gas: gas,
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollOutInput = formatRollOutInput;
async function formatRollOutERC20Input(fromAddr, toChainId, amount, tokenAddr, destAddr, gas, gateWayAddr, rollOutAddr) {
    let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollOut(destAddr, toChainId, amount, tokenAddr);
            return {
                from: fromAddr,
                to: contractInstance.getRollOutContractAddr(),
                gas: gas,
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollOutERC20Input = formatRollOutERC20Input;
async function estimateRollInGasPrice(httpProvider, input) {
    var web3 = new Web3.Web3(httpProvider);
    return await web3.eth.estimateGas(input);
    // need gasfee in LR
    // (TODO:mingxuan)need further design with saitama and jessica
}
exports.estimateRollInGasPrice = estimateRollInGasPrice;
async function getRollnaInfo() {
    return await types_1.RollnaChainInfo.getRollNaInfo();
}
exports.getRollnaInfo = getRollnaInfo;
//test done
async function getMerkleTreeState() {
    var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
    var contract = new Web3.eth.contract.Contract(ArbSys_json_1.default, Consts_1.ArbSysAddr);
    contract.setProvider(rollnaInfo.rollnaProvider);
    //@ts-ignore
    var ret = await contract.methods.sendMerkleTreeState().call();
    //@ts-ignore
    return Number(ret["size"]);
}
exports.getMerkleTreeState = getMerkleTreeState;
async function getRollOutProof(size, leaf) {
    return nodeInterface_1.NodeInterfaceContract.getProof(size, leaf);
}
exports.getRollOutProof = getRollOutProof;
async function formatClaimTokenInput(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value) {
    var contract = new Web3.eth.contract.Contract(IOutbox_json_1.default);
    //@ts-ignore
    return contract.methods.executeTransaction(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value).encodeABI();
}
exports.formatClaimTokenInput = formatClaimTokenInput;
async function getAAVersion(Signer, Sender) {
    return accountAbstraction_1.AccountAbstraction.getAAVersion(Sender, Signer);
}
exports.getAAVersion = getAAVersion;
async function getProposalLength(Signer, Sender) {
    return accountAbstraction_1.AccountAbstraction.getProposalLength(Sender, Signer);
}
exports.getProposalLength = getProposalLength;
async function isAALocked(Signer, Sender) {
    return accountAbstraction_1.AccountAbstraction.isAALocked(Sender, Signer);
}
exports.isAALocked = isAALocked;
function formatAccountAbstractionInput(owner, guardians, validator, gas) {
    var innerData = accountAbstraction_1.AccountAbstraction.createAccountAbstractionData(owner, guardians, validator);
    return {
        from: owner,
        gas: gas,
        data: innerData
    };
}
exports.formatAccountAbstractionInput = formatAccountAbstractionInput;
function formatAccountAbstractionFromAAInput(signer, sender, guardians, validator, gas) {
    var innerData = accountAbstraction_1.AccountAbstraction.createAccountAbstractionFromAAData(signer, sender, guardians, validator);
    return {
        from: signer,
        gas: gas,
        to: types_1.preComplieAddr,
        data: innerData
    };
}
exports.formatAccountAbstractionFromAAInput = formatAccountAbstractionFromAAInput;
function formatLockInput(signer, sender, gas) {
    var innerData = accountAbstraction_1.AccountAbstraction.lock(sender);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatLockInput = formatLockInput;
function formatUnlockInput(signer, sender, proposalId, gas) {
    var innerData = accountAbstraction_1.AccountAbstraction.unlock(sender, proposalId);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatUnlockInput = formatUnlockInput;
function formatRecoverInput(signer, sender, proposalId, newOwner, gas) {
    var innerData = accountAbstraction_1.AccountAbstraction.recover(sender, proposalId, newOwner);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatRecoverInput = formatRecoverInput;
async function formatSetValidatorInput(signer, sender, validator, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.setValidator(sender, validator);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatSetValidatorInput = formatSetValidatorInput;
async function formatAddGuardiansInput(signer, sender, guardians, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.addGuardians(sender, guardians);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatAddGuardiansInput = formatAddGuardiansInput;
async function formatRemoveGuardiansInput(signer, sender, guardians, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.removeGuardians(sender, guardians);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatRemoveGuardiansInput = formatRemoveGuardiansInput;
function formatSubmitProposalInput(signer, sender, proposalType, gas) {
    var innerData = accountAbstraction_1.AccountAbstraction.submitProposal(sender, proposalType);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatSubmitProposalInput = formatSubmitProposalInput;
async function formatAARolloutInput(signer, sender, toChainId, amount, destAddr, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.createAARolloutData(signer, sender, toChainId, amount, destAddr);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatAARolloutInput = formatAARolloutInput;
async function formatAARolloutErc20Input(signer, sender, toChainId, amount, destAddr, tokenAddr, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.createAARolloutErc20Data(signer, sender, toChainId, amount, destAddr, tokenAddr);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatAARolloutErc20Input = formatAARolloutErc20Input;
async function formatAATransferInput(signer, sender, to, amount, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.createAATransferData(signer, sender, to, amount);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatAATransferInput = formatAATransferInput;
async function formatAACallContractInput(signer, sender, to, innerData, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.createAACallContractData(signer, sender, to, innerData);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatAACallContractInput = formatAACallContractInput;
async function formatUpgradeAAInput(signer, sender, gas) {
    var AAs = await (0, HttpsRpc_1.lookupAAs)(signer);
    if (AAs == ErrorType_1.ErrorType.HttpRpcFailed) {
        return AAs;
    }
    if (-1 == AAs.indexOf(sender)) {
        return ErrorType_1.ErrorType.NotAuthorizedOwner;
    }
    var innerData = accountAbstraction_1.AccountAbstraction.createUpgradeAAData(signer, sender);
    return {
        from: signer,
        gas: gas,
        data: innerData
    };
}
exports.formatUpgradeAAInput = formatUpgradeAAInput;

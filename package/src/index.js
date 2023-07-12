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
exports.formatClaimTokenInput = exports.getRollOutProof = exports.getRollnaInfo = exports.estimateRollInGasPrice = exports.formatRollOutERC20Input = exports.formatRollOutInput = exports.formatRollInERC20Input = exports.formatRollInInput = void 0;
const types_1 = require("../types");
const instanceFactory_1 = require("../contract/instanceFactory");
const Web3 = __importStar(require("web3"));
const nodeInterface_1 = require("../contract/nodeInterface");
const IOutbox_json_1 = __importDefault(require("../abi/IOutbox.json"));
function formatRollInInput(fromAddr, fromChainId, amount, destAddr, gas) {
    let fromChainInfo = types_1.SupportedChainInfo.getChainInfo(fromChainId);
    if (fromChainInfo != undefined) {
        let contractInstance = instanceFactory_1.ContractInstanceFactory.getContractInstance(false, fromChainId);
        if (contractInstance != undefined) {
            let data = contractInstance.rollIn(fromAddr, destAddr, amount);
            return {
                from: fromAddr,
                to: contractInstance.getRollInContractAddr(),
                gas: gas,
                data: data
            };
        }
    }
    return undefined;
}
exports.formatRollInInput = formatRollInInput;
function formatRollInERC20Input(fromAddr, fromChainId, amount, tokenAddr, destAddr, gas, gasPrice, reFundTo) {
    let fromChainInfo = types_1.SupportedChainInfo.getChainInfo(fromChainId);
    if (fromChainInfo != undefined) {
        let contractInstance = instanceFactory_1.ContractInstanceFactory.getContractInstance(true, fromChainId, tokenAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollIn(destAddr, fromAddr, amount, reFundTo, gas);
            return {
                from: fromAddr,
                to: contractInstance.getRollInContractAddr(),
                gas: gas,
                data: data
            };
        }
    }
    return undefined;
}
exports.formatRollInERC20Input = formatRollInERC20Input;
function formatRollOutInput(fromAddr, toChainId, amount, destAddr, gas) {
    let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo != undefined) {
        let contractInstance = instanceFactory_1.ContractInstanceFactory.getContractInstance(false, toChainId);
        if (contractInstance != undefined) {
            let data = contractInstance.rollOut(destAddr, toChainId);
            return {
                from: fromAddr,
                to: contractInstance.getRollOutContractAddr(),
                gas: gas,
                data: data
            };
        }
    }
    return undefined;
}
exports.formatRollOutInput = formatRollOutInput;
function formatRollOutERC20Input(fromAddr, toChainId, amount, tokenAddr, destAddr, gas) {
    let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo != undefined) {
        let contractInstance = instanceFactory_1.ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr);
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
    return undefined;
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
async function getRollOutProof(size, leaf) {
    return nodeInterface_1.NodeInterfaceContract.getProof(size, leaf);
}
exports.getRollOutProof = getRollOutProof;
async function formatClaimTokenInput(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value) {
    var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
    var contract = new Web3.eth.contract.Contract(IOutbox_json_1.default);
    //@ts-ignore
    return contract.methods.executeTransaction(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value).encodeABI();
}
exports.formatClaimTokenInput = formatClaimTokenInput;

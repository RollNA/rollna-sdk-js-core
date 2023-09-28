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
exports.checkClaimStatus = exports.formatClaimTokenInput = exports.getLatestConfirmBlock = exports.getDestChainId = exports.getRollOutProof = exports.getMerkleTreeState = exports.formatRollOutERC20Input = exports.formatRollOutInput = exports.estimateRollInErc20fee = exports.formatRollInERC20Input = exports.formatRollInInput = void 0;
const Web3 = __importStar(require("web3"));
const HttpsRpc_1 = require("../../utils/client/HttpsRpc");
const ErrorType_1 = require("../../types/ErrorType");
const types_1 = require("../../types");
const instanceFactory_1 = require("../../contract/instanceFactory");
const nodeInterface_1 = require("../../contract/nodeInterface");
const IOutbox_json_1 = __importDefault(require("../../abi/IOutbox.json"));
const ArbSys_json_1 = __importDefault(require("../../abi/ArbSys.json"));
const types_2 = require("../../types/");
const IL1GatewayRouter_json_1 = __importDefault(require("../../abi/IL1GatewayRouter.json"));
const L2router_json_1 = __importDefault(require("../../abi/L2router.json"));
const L2GatewayRouter_json_1 = __importDefault(require("../../abi/L2GatewayRouter.json"));
const IOutbox_json_2 = __importDefault(require("../../abi/IOutbox.json"));
const HttpsRpc_2 = require("../../utils/client/HttpsRpc");
const Rollup_json_1 = __importDefault(require("../../abi/Rollup.json"));
const ethers_1 = require("ethers");
// test done
async function formatRollInInput(fromAddr, fromChainId, amount, destAddr, gas, gasPrice, gateWayAddr, rollOutAddr) {
    let fromChainInfo = types_1.SupportedChainInfo.getChainInfo(fromChainId);
    if (fromChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(false, fromChainId, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollIn(fromAddr, destAddr, amount);
            return {
                from: fromAddr,
                to: contractInstance.getRollInContractAddr(),
                gas: gas,
                gasPrice: gasPrice,
                value: Web3.utils.toHex(amount),
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollInInput = formatRollInInput;
// test done
async function formatRollInERC20Input(fromAddr, fromChainId, amount, tokenAddr, destAddr, gas, gasPrice, reFundTo, value, gateWayAddr, rollOutAddr) {
    let fromChainInfo = await types_1.SupportedChainInfo.getChainInfo(fromChainId);
    if (fromChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(true, fromChainId, tokenAddr, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            var contract = new Web3.eth.contract.Contract(IL1GatewayRouter_json_1.default, contractInstance.getRollInContractAddr());
            var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
            contract.setProvider(fromChainInfo.Provider);
            //@ts-ignore
            let outboundCalldata = await contract.methods.getOutboundCalldata(tokenAddr, fromAddr, destAddr, amount, []).call();
            if (!outboundCalldata) {
                return ErrorType_1.ErrorType.FormatInputFailed;
            }
            const web3Context = new Web3.Web3Context(rollnaInfo.rollnaProvider);
            //@ts-ignore
            let block = await Web3.eth.getBlock(web3Context);
            //@ts-ignore
            var basefee_num = BigInt(Web3.utils.hexToNumber(block.baseFeePerGas));
            if (fromChainId != 5) {
                basefee_num = BigInt(15000000000);
            }
            let maxSubmissionCost = basefee_num * BigInt(((outboundCalldata.length - 2) * 3 + 1400));
            let inner_data = Web3.eth.abi.encodeParameters(['uint256', 'bytes'], [maxSubmissionCost, []]);
            let data = contractInstance.rollIn(destAddr, fromAddr, amount, reFundTo, gas, gasPrice, tokenAddr, inner_data);
            return {
                from: fromAddr,
                to: contractInstance.getRollInContractAddr(),
                gas: gas,
                gasPrice: gasPrice,
                data: data,
                value: value,
                gasLimit: "0xfffff"
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollInERC20Input = formatRollInERC20Input;
async function estimateRollInErc20fee(chainId, tokenAddr, gas, fromAddr, destAddr, amount) {
    let fromChainInfo = await types_1.SupportedChainInfo.getChainInfo(chainId);
    if (fromChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(true, chainId, tokenAddr);
        if (contractInstance != undefined) {
            var contract = new Web3.eth.contract.Contract(IL1GatewayRouter_json_1.default, contractInstance.getRollInContractAddr());
            var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
            contract.setProvider(fromChainInfo.Provider);
            //@ts-ignore
            let outboundCalldata = await contract.methods.getOutboundCalldata(tokenAddr, fromAddr, destAddr, amount, []).call();
            if (!outboundCalldata) {
                return ErrorType_1.ErrorType.FormatInputFailed;
            }
            const web3Context = new Web3.Web3Context(rollnaInfo.rollnaProvider);
            //@ts-ignore
            let block = await Web3.eth.getBlock(web3Context);
            //@ts-ignore
            var basefee_num = BigInt(Web3.utils.hexToNumber(block.baseFeePerGas));
            if (chainId != 5) {
                basefee_num = BigInt(15000000000);
            }
            let maxSubmissionCost = basefee_num * BigInt(((outboundCalldata.length - 2) * 3 + 1400));
            let value = maxSubmissionCost + basefee_num * BigInt(gas);
            return {
                gasPrice: basefee_num,
                value: value
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.estimateRollInErc20fee = estimateRollInErc20fee;
// test done
async function formatRollOutInput(fromAddr, toChainId, amount, destAddr, gas, gasPrice, gateWayAddr, rollOutAddr) {
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
                gasPrice: gasPrice,
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollOutInput = formatRollOutInput;
// test done
async function formatRollOutERC20Input(fromAddr, toChainId, amount, tokenAddr, destAddr, gas, gasPrice, gateWayAddr, rollOutAddr) {
    let toChainInfo = types_1.SupportedChainInfo.getChainInfo(toChainId);
    if (toChainInfo != undefined) {
        let contractInstance = await instanceFactory_1.ContractInstanceFactory.getContractInstance(true, toChainId, tokenAddr, gateWayAddr, rollOutAddr);
        if (contractInstance != undefined) {
            let data = contractInstance.rollOut(destAddr, toChainId, amount, tokenAddr);
            return {
                from: fromAddr,
                to: contractInstance.getRollOutContractAddr(),
                gas: gas,
                gasPrice: gasPrice,
                data: data
            };
        }
    }
    return ErrorType_1.ErrorType.FormatInputFailed;
}
exports.formatRollOutERC20Input = formatRollOutERC20Input;
//test done
async function getMerkleTreeState(block_num) {
    var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
    var contract = new Web3.eth.contract.Contract(ArbSys_json_1.default, types_2.ArbSysAddr);
    contract.setProvider(rollnaInfo.rollnaProvider);
    //@ts-ignore
    var ret = await contract.methods.sendMerkleTreeState().call({}, block_num);
    //@ts-ignore
    return Number(ret["size"]);
}
exports.getMerkleTreeState = getMerkleTreeState;
// test done
async function getRollOutProof(size, leaf) {
    let raw_arr = await nodeInterface_1.NodeInterfaceContract.getProof(size, leaf);
    let ret_arr = [];
    for (const v of raw_arr.proof) {
        ret_arr.push(Web3.utils.hexToBytes(v));
    }
    return ret_arr;
}
exports.getRollOutProof = getRollOutProof;
async function getDestChainId(is_erc20, gateway, txhash) {
    var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
    if (is_erc20) {
        if (gateway) {
            var contract = new Web3.eth.contract.Contract(L2GatewayRouter_json_1.default, gateway);
            contract.setProvider(rollnaInfo.rollnaProvider);
            //@ts-ignore
            var router_addr = await contract.methods.router().call();
            //@ts-ignore
            var contract = new Web3.eth.contract.Contract(L2router_json_1.default, router_addr);
            contract.setProvider(rollnaInfo.rollnaProvider);
            //@ts-ignore
            var big_num = await contract.methods.counterpartChainID().call();
            //@ts-ignore
            return (0, ethers_1.toNumber)(big_num);
        }
    }
    else {
        if (txhash) {
            var web3 = new Web3.Web3(rollnaInfo.rollnaProvider);
            var tx = await web3.eth.getTransaction(txhash);
            if (tx.data) {
                var raw_chain_id = "0x" + tx.data.slice(10, 74);
                return Web3.utils.hexToNumber(raw_chain_id);
            }
        }
    }
}
exports.getDestChainId = getDestChainId;
async function getLatestConfirmBlock(chainId) {
    var chainInfo = await types_1.SupportedChainInfo.getChainInfo(chainId);
    if (chainInfo) {
        var contract = new Web3.eth.contract.Contract(Rollup_json_1.default, chainInfo.RollUp);
        contract.setProvider(chainInfo.Provider);
        var block_num = await contract.methods.latestConfirmed().call();
        if (block_num) {
            //@ts-ignore
            var confirmdata = await contract.methods.getNode(block_num).call();
            if (confirmdata) {
                //@ts-ignore
                return (0, HttpsRpc_2.getConfirmBlockNum)(confirmdata.confirmData);
            }
        }
    }
    return undefined;
}
exports.getLatestConfirmBlock = getLatestConfirmBlock;
function formatClaimTokenInput(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value, data) {
    var contract = new Web3.eth.contract.Contract(IOutbox_json_1.default);
    //@ts-ignore
    return contract.methods.executeTransaction(proof, index, lrSender, to, lrBlock, l1Block, lrTimestamp, value, data).encodeABI();
}
exports.formatClaimTokenInput = formatClaimTokenInput;
async function checkClaimStatus(tx, chainId) {
    let toChainInfo = await types_1.SupportedChainInfo.getChainInfo(chainId);
    var contract = new Web3.eth.contract.Contract(IOutbox_json_2.default, toChainInfo?.OutBox);
    let params = await (0, HttpsRpc_1.getClaimParams)(tx);
    contract.setProvider(toChainInfo?.Provider);
    //@ts-ignore
    return await contract.methods.isSpent(params.leaf).call();
}
exports.checkClaimStatus = checkClaimStatus;

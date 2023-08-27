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
exports.NodeInterfaceContract = void 0;
const web3 = __importStar(require("web3"));
const NodeInterface_json_1 = __importDefault(require("../abi/NodeInterface.json"));
const types_1 = require("../types");
class NodeInterfaceContract {
    static async getProof(size, leaf) {
        var rollnaInfo = await types_1.RollnaChainInfo.getRollNaInfo();
        var contract = new web3.eth.contract.Contract(NodeInterface_json_1.default, types_1.nodeInterfaceContractAddr);
        contract.setProvider(rollnaInfo?.rollnaProvider);
        //@ts-ignore
        return contract.methods.constructOutboxProof(size, leaf).call(); //.send({from: from})       
    }
}
exports.NodeInterfaceContract = NodeInterfaceContract;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedChainInfo = exports.RollnaChainInfo = exports.ProposalType = exports.preComplieAddr = exports.nodeInterfaceContractAddr = void 0;
const ErrorType_1 = require("./ErrorType");
const HttpsRpc_1 = require("../utils/client/HttpsRpc");
var https_request = require('request');
const node_fetch_1 = __importDefault(require("node-fetch"));
const rollnaInfoUrl = "https://rollna.io/get_rollna_info";
const chainInfosUrl = "https://rollna.io/get_chain_infos";
exports.nodeInterfaceContractAddr = "0xfffffffff";
exports.preComplieAddr = "0xfffffff";
var ProposalType;
(function (ProposalType) {
    ProposalType[ProposalType["Lock"] = 0] = "Lock";
    ProposalType[ProposalType["Unlock"] = 1] = "Unlock";
    ProposalType[ProposalType["Recover"] = 2] = "Recover";
})(ProposalType || (exports.ProposalType = ProposalType = {}));
class RollnaChainInfo {
    static rollnaInfo;
    static accountAbstractionTemplate;
    static async updateRollNaInfo() {
        if (RollnaChainInfo.rollnaInfo) {
            var ret = await (0, node_fetch_1.default)(rollnaInfoUrl);
            if (ret.ok) {
                var res = ret.body?.read().toString();
                if (res != undefined) {
                    const infoJson = JSON.parse(res);
                    if (infoJson.provider && infoJson.chainId && infoJson.symbol) {
                        RollnaChainInfo.rollnaInfo.rollnaProvider = infoJson.provider;
                        RollnaChainInfo.rollnaInfo.rollnaChainId = infoJson.chainId;
                        RollnaChainInfo.rollnaInfo.rollnaTokenSymbols = infoJson.symbol;
                    }
                }
            }
        }
    }
    static async updateAAVersion() {
        var ret = await (0, HttpsRpc_1.updateLatestAAVersion)();
        if (ret != ErrorType_1.ErrorType.HttpRpcFailed && ret != null) {
            RollnaChainInfo.accountAbstractionTemplate = ret;
        }
        return ret;
    }
    static getRollNaInfo() {
        return RollnaChainInfo.rollnaInfo;
    }
    static getAAVersion() {
        return RollnaChainInfo.accountAbstractionTemplate;
    }
}
exports.RollnaChainInfo = RollnaChainInfo;
class SupportedChainInfo {
    static ChainInfos;
    constructor() { }
    static async updateChainInfos() {
        var ret = await (0, node_fetch_1.default)(rollnaInfoUrl);
        if (ret.ok) {
            var res = ret.body?.read().toString();
            if (res != undefined) {
                const infoJson = JSON.parse(res);
                SupportedChainInfo.ChainInfos = infoJson;
            }
        }
    }
    static async getChainInfo(chainId) {
        if (!SupportedChainInfo.ChainInfos) {
            await SupportedChainInfo.updateChainInfos();
        }
        return SupportedChainInfo.ChainInfos.get(chainId);
    }
}
exports.SupportedChainInfo = SupportedChainInfo;

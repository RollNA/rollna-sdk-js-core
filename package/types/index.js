"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedChainInfo = exports.RollnaChainInfo = exports.nodeInterfaceContractAddr = void 0;
var https_request = require('request');
const rollnaInfoUrl = "https://rollna.io/get_rollna_info";
const chainInfosUrl = "https://rollna.io/get_chain_infos";
exports.nodeInterfaceContractAddr = "0xfffffffff";
class RollnaChainInfo {
    static rollnaInfo;
    constructor() { }
    static async getRollNaInfo() {
        if (!RollnaChainInfo.rollnaInfo) {
            await https_request({ url: rollnaInfoUrl }, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    const infoJson = JSON.parse(body);
                    if (infoJson.provider && infoJson.chainId && infoJson.symbol) {
                        RollnaChainInfo.rollnaInfo.rollnaProvider = infoJson.provider;
                        RollnaChainInfo.rollnaInfo.rollnaChainId = infoJson.chainId;
                        RollnaChainInfo.rollnaInfo.rollnaTokenSymbols = infoJson.symbol;
                        return RollnaChainInfo.rollnaInfo;
                    }
                }
            });
            return undefined;
        }
        return RollnaChainInfo.rollnaInfo;
    }
}
exports.RollnaChainInfo = RollnaChainInfo;
class SupportedChainInfo {
    static ChainInfos;
    constructor() { }
    static async updateChainInfos() {
        await https_request({ url: chainInfosUrl }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                const infoJson = JSON.parse(body);
                SupportedChainInfo.ChainInfos = infoJson;
            }
        });
    }
    static async getChainInfo(chainId) {
        if (!SupportedChainInfo.ChainInfos) {
            await SupportedChainInfo.updateChainInfos();
        }
        return SupportedChainInfo.ChainInfos.get(chainId);
    }
}
exports.SupportedChainInfo = SupportedChainInfo;

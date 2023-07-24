import { Numbers } from "web3";
import { ErrorType } from "./ErrorType"
import {updateLatestAAVersion} from "../utils/client/HttpsRpc"
var https_request = require('request');
import fetch from "node-fetch"

const rollnaInfoUrl = "https://rollna.io/get_rollna_info";
const chainInfosUrl = "https://rollna.io/get_chain_infos";
export const nodeInterfaceContractAddr = "0xfffffffff";
export const preComplieAddr = "0xfffffff";

export enum ProposalType {
    Lock,
    Unlock,
    Recover
}

export type AccountType = 'EOA' | 'AA';

export interface CommonInput {
    from: string;
    to?: string;
    value?: string;
    gas?: Numbers;
    gasPrice?: Numbers;
    data?: string;
}

export interface EstimateGasInfo {
    from: string;
    gaslimit?: Numbers;
    value?: Numbers; 
}

export interface RollOutProof {
    send: string;
    root: string;
    proof: string;
}

export interface UserOperation {
    signer: string;
    sender: string;
    to: string; 
    value: Numbers;
    data: string;
}

export type RollnaInfo = {
    rollnaProvider: string;
    rollnaChainId: Numbers;
    rollnaTokenSymbols: string;
}

export type NativeContractInfo = {
    RollnaContractAddr: string;
    TokenSymbol: string;
}

export type ChainInfo = {
    Provider?: string;
    ContractInfos: Map<string, NativeContractInfo>;
}

export class RollnaChainInfo {
    private static rollnaInfo : RollnaInfo;
    private static accountAbstractionTemplate : string;
    static async updateRollNaInfo() {
        if (RollnaChainInfo.rollnaInfo) {
            var ret = await fetch(rollnaInfoUrl)
            if (ret.ok) {
                var res = ret.body?.read().toString()
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
        var ret = await updateLatestAAVersion()
        if (ret != ErrorType.HttpRpcFailed && ret != null) {
            RollnaChainInfo.accountAbstractionTemplate = ret
        }       
        return ret
    }

    static getRollNaInfo() {
        return RollnaChainInfo.rollnaInfo;
    }
    static getAAVersion() {
        return RollnaChainInfo.accountAbstractionTemplate
    }
}

export class SupportedChainInfo {
    protected static ChainInfos : Map<Numbers, ChainInfo>;
    private  constructor() {}
    static async updateChainInfos() {
        var ret = await fetch(rollnaInfoUrl)
        if (ret.ok) {
            var res = ret.body?.read().toString()
            if (res != undefined) {
                const infoJson = JSON.parse(res) as Map<Numbers, ChainInfo>;
                SupportedChainInfo.ChainInfos = infoJson;
            }
        }
    }

    static async getChainInfo(chainId : Numbers) {
        if (!SupportedChainInfo.ChainInfos) {
            await SupportedChainInfo.updateChainInfos();
        }
        return SupportedChainInfo.ChainInfos.get(chainId)
    }
}
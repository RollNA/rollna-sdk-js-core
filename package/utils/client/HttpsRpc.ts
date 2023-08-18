import fetch from "node-fetch"

import { ErrorType } from "../../types/ErrorType";
const mappingAAUrl = "https://rollna.io/mappingAA"
const latestAAAddr = "https://rollna.io/latestAAAddr"
const getClaimParamsUrl = "https://rollna.io/api/getClaimParams"
const getRollOutTxUrl = "https://rollna.io/api/getRollOutTx"
export async function  lookupAAs(Eoa: string) {
    var ret =  await fetch(mappingAAUrl + "?eoa=" + Eoa)
    if (ret.ok) {
        var rawRes = ret.body?.read().toString()
        if (rawRes != undefined) {
            var res = JSON.parse(rawRes)
            if (Array.isArray(res)) {
                return res
            }
        }
    }
    return ErrorType.HttpRpcFailed
}

export async function  updateLatestAAVersion() {
    var ret = await fetch(latestAAAddr)
    if (ret.status != 200) {
        return ErrorType.HttpRpcFailed
    } else {
        return ret.body?.read().toString()
    }
}

export async function getClaimParams(TxHash: string) {
    var ret =  await fetch(getClaimParamsUrl + "txhash?=" + TxHash)
    if (ret.ok) {
        var rawRes = ret.body?.read().toString()
        if (rawRes != undefined) {
            return JSON.parse(rawRes)
        }
    }
    return ErrorType.HttpRpcFailed
}

export async function getRollOutTx(sender: string) {
    var ret =  await fetch(getRollOutTxUrl + "?sender=" + sender)
    if (ret.ok) {
        var rawRes = ret.body?.read().toString()
        if (rawRes != undefined) {
            return JSON.parse(rawRes)
        }
    }
    return ErrorType.HttpRpcFailed
}
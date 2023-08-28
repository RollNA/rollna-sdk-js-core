

import { ErrorType } from "../../types/ErrorType";
const mappingAAUrl = "https://rollna.io/mappingAA"
const latestAAAddr = "https://rollna.io/latestAAAddr"
const getClaimParamsUrl = "http://127.0.0.1:8331/api/getClaimParams"
const getRollOutTxUrl = "http://127.0.0.1:8331/api/getRollOutTx"
const getConfirmBlockUrl = "http://127.0.0.1:8331/api/getConfirmBlock"
export async function  lookupAAs(Eoa: string) {
    var ret =  await fetch(mappingAAUrl + "?eoa=" + Eoa)
    if (ret.ok) {
        var res = await ret.json()
        if (res != undefined) {
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
        return await ret.json()
    }
}

// test done
export async function getClaimParams(TxHash: string) {
    var ret =  await fetch(getClaimParamsUrl + "?txhash=" + TxHash)
    if (ret.ok) {
        var res = await ret.json()
        if (res != undefined) {
            if (res["code"] == 0)
            return res["data"]
        }
    }
    return ErrorType.HttpRpcFailed
}

// test done
export async function getRollOutTx(sender: string) {
    var ret =  await fetch(getRollOutTxUrl + "?sender=" + sender)
    if (ret.ok) {
        var res = await ret.json()
        if (res != undefined) {
            if (res["code"] == 0)
            return res["data"]
        }
    }
    return ErrorType.HttpRpcFailed
}

export async function getConfirmBlock(confirmdata: string) {
    let body = new FormData();
    body.append("confirmdata", confirmdata)
    var ret =  await fetch(getConfirmBlockUrl, {
        method: "POST",
        body: body
    })
    if (ret.ok) {
        var res = await ret.json()
        if (res != undefined) {
            if (res["code"] == 0)
            return res["data"]["blocknum"]
        }
    }
    return ErrorType.HttpRpcFailed
}



import { ErrorType } from "../../types/ErrorType";
const getClaimParamsUrl = "https://openapi.rollna.io/api/getClaimParams"
const getRollOutTxUrl = "https://openapi.rollna.io/api/getRollOutTx"
const getConfirmBlockUrl = "https://openapi.rollna.io/api/getConfirmBlock"

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

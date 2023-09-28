

import { ErrorType } from "../../types/ErrorType";
const getClaimParamsUrl = "https://openapi.cyclenetwork.io/api/getClaimParams"
const getRollOutTxUrl = "https://openapi.cyclenetwork.io/api/getRollOutTx"
const getConfirmBlockNumUrl = "https://openapi.cyclenetwork.io/api/getConfirmBlockNum"

// test done
export async function getClaimParams(TxHash: string) {
    let url = getClaimParamsUrl
    if (process.env.CYCLE_ENV == "test" && process.env.CONFIG_ENV) {
        res = JSON.parse(process.env.CONFIG_ENV)
        url = res.getClaimParamsUrl
    }
    var ret =  await fetch(url + "?txhash=" + TxHash)
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
    let url = getRollOutTxUrl
    if (process.env.CYCLE_ENV == "test" && process.env.CONFIG_ENV) {
        res = JSON.parse(process.env.CONFIG_ENV)
        url = res.getRollOutTxUrl
    }
    var ret =  await fetch(url + "?sender=" + sender)
    if (ret.ok) {
        var res = await ret.json()
        if (res != undefined) {
            if (res["code"] == 0)
            return res["data"]
        }
    }
    return ErrorType.HttpRpcFailed
}

export async function getConfirmBlockNum(confirmdata: string) {
    let url = getConfirmBlockNumUrl
    if (process.env.CYCLE_ENV == "test" && process.env.CONFIG_ENV) {
        res = JSON.parse(process.env.CONFIG_ENV)
        url = res.getConfirmBlockUrl
    }
    var ret =  await fetch(url + "?confirm_data=" + confirmdata)
    if (ret.ok) {
        var res = await ret.json()
        if (res != undefined) {
            if (res["code"] == 0)
            return res["data"]["blocknum"]
        }
    }
    return ErrorType.HttpRpcFailed
}


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfirmBlockNum = exports.getRollOutTx = exports.getClaimParams = void 0;
const ErrorType_1 = require("../../types/ErrorType");
const getClaimParamsUrl = "https://openapi.cyclenetwork.io/api/getClaimParams";
const getRollOutTxUrl = "https://openapi.cyclenetwork.io/api/getRollOutTx";
const getConfirmBlockNumUrl = "https://openapi.cyclenetwork.io/api/getConfirmBlockNum";
// test done
async function getClaimParams(TxHash) {
    let url = getClaimParamsUrl;
    if (process.env.CYCLE_ENV == "test" && process.env.CONFIG_ENV) {
        res = JSON.parse(process.env.CONFIG_ENV);
        url = res.getClaimParamsUrl;
    }
    var ret = await fetch(url + "?txhash=" + TxHash);
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getClaimParams = getClaimParams;
// test done
async function getRollOutTx(sender) {
    let url = getRollOutTxUrl;
    if (process.env.CYCLE_ENV == "test" && process.env.CONFIG_ENV) {
        res = JSON.parse(process.env.CONFIG_ENV);
        url = res.getRollOutTxUrl;
    }
    var ret = await fetch(url + "?sender=" + sender);
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getRollOutTx = getRollOutTx;
async function getConfirmBlockNum(confirmdata) {
    let url = getConfirmBlockNumUrl;
    if (process.env.CYCLE_ENV == "test" && process.env.CONFIG_ENV) {
        res = JSON.parse(process.env.CONFIG_ENV);
        url = res.getConfirmBlockUrl;
    }
    var ret = await fetch(url + "?confirm_data=" + confirmdata);
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"]["blocknum"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getConfirmBlockNum = getConfirmBlockNum;

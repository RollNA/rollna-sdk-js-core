"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfirmBlock = exports.getRollOutTx = exports.getClaimParams = void 0;
const ErrorType_1 = require("../../types/ErrorType");
const getClaimParamsUrl = "https://openapi.rollna.io/api/getClaimParams";
const getRollOutTxUrl = "https://openapi.rollna.io/api/getRollOutTx";
const getConfirmBlockUrl = "https://openapi.rollna.io/api/getConfirmBlock";
// test done
async function getClaimParams(TxHash) {
    var ret = await fetch(getClaimParamsUrl + "?txhash=" + TxHash);
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
    var ret = await fetch(getRollOutTxUrl + "?sender=" + sender);
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
async function getConfirmBlock(confirmdata) {
    let body = new FormData();
    body.append("confirmdata", confirmdata);
    var ret = await fetch(getConfirmBlockUrl, {
        method: "POST",
        body: body
    });
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"]["blocknum"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getConfirmBlock = getConfirmBlock;

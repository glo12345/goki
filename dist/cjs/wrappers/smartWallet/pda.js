"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSubaccountInfoAddress =
  exports.findOwnerInvokerAddress =
  exports.findWalletDerivedAddress =
  exports.findTransactionAddress =
  exports.findSmartWallet =
    void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@project-serum/anchor");
const token_utils_1 = require("@saberhq/token-utils");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../../constants");
const findSmartWallet = (base) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield web3_js_1.PublicKey.findProgramAddress(
      [anchor_1.utils.bytes.utf8.encode("GokiSmartWallet"), base.toBuffer()],
      constants_1.GOKI_ADDRESSES.SmartWallet
    );
  });
exports.findSmartWallet = findSmartWallet;
const findTransactionAddress = (smartWallet, index) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield web3_js_1.PublicKey.findProgramAddress(
      [
        anchor_1.utils.bytes.utf8.encode("GokiTransaction"),
        smartWallet.toBuffer(),
        new token_utils_1.u64(index).toBuffer(),
      ],
      constants_1.GOKI_ADDRESSES.SmartWallet
    );
  });
exports.findTransactionAddress = findTransactionAddress;
/**
 * Finds a derived address of a Smart Wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
const findWalletDerivedAddress = (smartWallet, index) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield web3_js_1.PublicKey.findProgramAddress(
      [
        anchor_1.utils.bytes.utf8.encode("GokiSmartWalletDerived"),
        smartWallet.toBuffer(),
        new token_utils_1.u64(index).toBuffer(),
      ],
      constants_1.GOKI_ADDRESSES.SmartWallet
    );
  });
exports.findWalletDerivedAddress = findWalletDerivedAddress;
/**
 * Finds an Owner Invoker address of a Smart Wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
const findOwnerInvokerAddress = (smartWallet, index) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield web3_js_1.PublicKey.findProgramAddress(
      [
        anchor_1.utils.bytes.utf8.encode("GokiSmartWalletOwnerInvoker"),
        smartWallet.toBuffer(),
        new token_utils_1.u64(index).toBuffer(),
      ],
      constants_1.GOKI_ADDRESSES.SmartWallet
    );
  });
exports.findOwnerInvokerAddress = findOwnerInvokerAddress;
/**
 * Finds the subaccount info address of a subaccount of a smart wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
const findSubaccountInfoAddress = (subaccount) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield web3_js_1.PublicKey.findProgramAddress(
      [
        anchor_1.utils.bytes.utf8.encode("GokiSubaccountInfo"),
        subaccount.toBuffer(),
      ],
      constants_1.GOKI_ADDRESSES.SmartWallet
    );
  });
exports.findSubaccountInfoAddress = findSubaccountInfoAddress;
//# sourceMappingURL=pda.js.map

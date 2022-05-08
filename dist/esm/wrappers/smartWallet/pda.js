import { __awaiter } from "tslib";
import { utils } from "@project-serum/anchor";
import { u64 } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { GOKI_ADDRESSES } from "../../constants";
export const findSmartWallet = (base) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("GokiSmartWallet"), base.toBuffer()],
      GOKI_ADDRESSES.SmartWallet
    );
  });
export const findTransactionAddress = (smartWallet, index) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("GokiTransaction"),
        smartWallet.toBuffer(),
        new u64(index).toBuffer(),
      ],
      GOKI_ADDRESSES.SmartWallet
    );
  });
/**
 * Finds a derived address of a Smart Wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
export const findWalletDerivedAddress = (smartWallet, index) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("GokiSmartWalletDerived"),
        smartWallet.toBuffer(),
        new u64(index).toBuffer(),
      ],
      GOKI_ADDRESSES.SmartWallet
    );
  });
/**
 * Finds an Owner Invoker address of a Smart Wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
export const findOwnerInvokerAddress = (smartWallet, index) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("GokiSmartWalletOwnerInvoker"),
        smartWallet.toBuffer(),
        new u64(index).toBuffer(),
      ],
      GOKI_ADDRESSES.SmartWallet
    );
  });
/**
 * Finds the subaccount info address of a subaccount of a smart wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
export const findSubaccountInfoAddress = (subaccount) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("GokiSubaccountInfo"), subaccount.toBuffer()],
      GOKI_ADDRESSES.SmartWallet
    );
  });
//# sourceMappingURL=pda.js.map

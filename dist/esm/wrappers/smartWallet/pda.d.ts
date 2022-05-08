import { PublicKey } from "@solana/web3.js";
export declare const findSmartWallet: (base: PublicKey) => Promise<[PublicKey, number]>;
export declare const findTransactionAddress: (smartWallet: PublicKey, index: number) => Promise<[PublicKey, number]>;
/**
 * Finds a derived address of a Smart Wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
export declare const findWalletDerivedAddress: (smartWallet: PublicKey, index: number) => Promise<[PublicKey, number]>;
/**
 * Finds an Owner Invoker address of a Smart Wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
export declare const findOwnerInvokerAddress: (smartWallet: PublicKey, index: number) => Promise<[PublicKey, number]>;
/**
 * Finds the subaccount info address of a subaccount of a smart wallet.
 * @param smartWallet
 * @param index
 * @returns
 */
export declare const findSubaccountInfoAddress: (subaccount: PublicKey) => Promise<[PublicKey, number]>;
//# sourceMappingURL=pda.d.ts.map
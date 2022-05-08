import type { AnchorDefined, AnchorTypes } from "@saberhq/anchor-contrib";
import type { AccountMeta } from "@solana/web3.js";
import type { SmartWalletIDL } from "../idls/smart_wallet";
export * from "../idls/smart_wallet";
export declare type SmartWalletTypes = AnchorTypes<SmartWalletIDL, {
    smartWallet: SmartWalletData;
    transaction: SmartWalletTransactionData;
    subaccountInfo: SubaccountInfoData;
}, {
    TXInstruction: SmartWalletInstruction;
    TXAccountMeta: AccountMeta;
}>;
declare type Accounts = SmartWalletTypes["Accounts"];
export declare type SmartWalletData = Accounts["SmartWallet"];
export declare type SmartWalletTransactionData = Accounts["Transaction"];
export declare type SubaccountInfoData = Accounts["SubaccountInfo"];
export declare type SmartWalletInstruction = Omit<AnchorDefined<SmartWalletIDL>["TXInstruction"], "keys"> & {
    keys: AccountMeta[];
};
export declare type SmartWalletError = SmartWalletTypes["Error"];
export declare type SmartWalletEvents = SmartWalletTypes["Events"];
export declare type SmartWalletProgram = SmartWalletTypes["Program"];
export declare type WalletCreateEvent = SmartWalletEvents["WalletCreateEvent"];
export declare type WalletSetOwnersEvent = SmartWalletEvents["WalletSetOwnersEvent"];
export declare type WalletChangeThresholdEvent = SmartWalletEvents["WalletChangeThresholdEvent"];
export declare type TransactionCreateEvent = SmartWalletEvents["TransactionCreateEvent"];
export declare type TransactionApproveEvent = SmartWalletEvents["TransactionApproveEvent"];
export declare type TransactionExecuteEvent = SmartWalletEvents["TransactionExecuteEvent"];
//# sourceMappingURL=smartWallet.d.ts.map
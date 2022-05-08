import type { AugmentedProvider } from "@saberhq/solana-contrib";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { SmartWalletData, SmartWalletProgram, SmartWalletTransactionData } from "../../programs";
import type { GokiSDK } from "../../sdk";
import type { InitSmartWalletWrapperArgs, NewTransactionArgs, PendingSmartWalletTransaction } from "./types";
export * from "./pda";
export * from "./types";
export declare class SmartWalletWrapper {
    readonly sdk: GokiSDK;
    readonly bump: number;
    readonly key: PublicKey;
    readonly program: SmartWalletProgram;
    private _data?;
    constructor(sdk: GokiSDK, args: InitSmartWalletWrapperArgs);
    get provider(): AugmentedProvider;
    get data(): SmartWalletData | undefined;
    /**
     * reloadData
     */
    reloadData(): Promise<SmartWalletData>;
    /**
     * Proposes a new transaction.
     * @returns
     */
    newTransaction({ proposer, payer, instructions: ixs, eta, }: NewTransactionArgs): Promise<PendingSmartWalletTransaction>;
    /**
     * Creates a new transaction from an envelope.
     * @returns
     */
    newTransactionFromEnvelope({ tx, ...args }: Omit<NewTransactionArgs, "instructions"> & {
        tx: TransactionEnvelope;
    }): Promise<PendingSmartWalletTransaction>;
    /**
     * Fetches a transaction by its index.
     */
    fetchTransactionByIndex(index: number): Promise<SmartWalletTransactionData | null>;
    /**
     * fetchTransaction
     */
    fetchTransaction(key: PublicKey): Promise<SmartWalletTransactionData>;
    /**
     * Approves a transaction.
     */
    approveTransaction(transactionKey: PublicKey, owner?: PublicKey): TransactionEnvelope;
    /**
     * Executes a transaction as the Smart Wallet.
     */
    executeTransaction({ transactionKey, owner, }: {
        transactionKey: PublicKey;
        owner?: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Finds the derived wallet address and bump of a given index.
     * @param index
     * @returns
     */
    findWalletDerivedAddress(index: number): Promise<[PublicKey, number]>;
    /**
     * Finds the owner invoker address and bump of a given index.
     * @param index
     * @returns
     */
    findOwnerInvokerAddress(index: number): Promise<[PublicKey, number]>;
    private _fetchExecuteTransactionContext;
    /**
     * Executes a transaction using a wallet-derived address.
     */
    executeTransactionDerived({ transactionKey, walletIndex, owner, }: {
        transactionKey: PublicKey;
        walletIndex: number;
        owner?: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Executes a transaction using an owner invoker address.
     */
    ownerInvokeInstruction({ instruction, index, owner, }: {
        instruction: TransactionInstruction;
        index: number;
        owner?: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Executes a transaction using an owner invoker address.
     */
    ownerInvokeInstructionV2({ instruction, index, owner, }: {
        instruction: TransactionInstruction;
        index: number;
        owner?: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * setOwners
     */
    setOwners(owners: PublicKey[]): TransactionEnvelope;
    /**
     * changeThreshold
     */
    changeThreshold(threshold: number): TransactionEnvelope;
    /**
     * Loads a SmartWallet
     */
    static load(sdk: GokiSDK, key: PublicKey): Promise<SmartWalletWrapper>;
}
//# sourceMappingURL=index.d.ts.map
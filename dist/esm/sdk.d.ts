import type { AugmentedProvider, Provider } from "@saberhq/solana-contrib";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import type { PublicKey, Signer } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import type { Programs } from "./constants";
import type { PendingSmartWallet } from "./wrappers/smartWallet";
import { SmartWalletWrapper } from "./wrappers/smartWallet";
/**
 * Goki SDK.
 */
export declare class GokiSDK {
    readonly provider: AugmentedProvider;
    readonly programs: Programs;
    constructor(provider: AugmentedProvider, programs: Programs);
    /**
     * Creates a new instance of the SDK with the given keypair.
     */
    withSigner(signer: Signer): GokiSDK;
    /**
     * loadSmartWallet
     */
    loadSmartWallet(key: PublicKey): Promise<SmartWalletWrapper>;
    /**
     * Creates a subaccount info.
     * @returns
     */
    createSubaccountInfo({ smartWallet, index, type, payer, }: {
        smartWallet: PublicKey;
        index: number;
        type: "derived" | "ownerInvoker";
        payer?: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Create a new multisig account
     */
    newSmartWallet({ owners, threshold, numOwners, base, delay, }: {
        owners: PublicKey[];
        threshold: BN;
        /**
         * Number of owners in the smart wallet.
         */
        numOwners: number;
        base?: Keypair;
        /**
         * Timelock delay in seconds
         */
        delay?: BN;
    }): Promise<PendingSmartWallet>;
    /**
     * Loads the SDK.
     * @returns
     */
    static load({ provider, addresses, }: {
        provider: Provider;
        addresses?: {
            [K in keyof Programs]?: PublicKey;
        };
    }): GokiSDK;
}
//# sourceMappingURL=sdk.d.ts.map
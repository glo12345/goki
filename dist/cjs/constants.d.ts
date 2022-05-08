import { PublicKey } from "@solana/web3.js";
import type { SmartWalletProgram, SmartWalletTypes } from "./programs";
export interface Programs {
    SmartWallet: SmartWalletProgram;
}
export declare const GOKI_ADDRESSES: {
    SmartWallet: PublicKey;
    TokenSigner: PublicKey;
};
export declare const GOKI_IDLS: {
    SmartWallet: import("./programs").SmartWalletIDL;
    TokenSigner: import("./idls/token_signer").TokenSignerIDL;
};
export declare const GOKI_CODERS: {
    SmartWallet: import("@saberhq/anchor-contrib").SuperCoder<SmartWalletTypes>;
};
//# sourceMappingURL=constants.d.ts.map
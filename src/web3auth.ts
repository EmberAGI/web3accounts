import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0xA4B1',
    rpcTarget: 'https://rpc.cyan.network',
    // Avoid using public rpc targets in production
    // Use Service like infura, QuickNode etc
    displayName: 'Airbitrum Mainnet',
    blockExplorer: 'https://arbitrum.io/',
    ticker: 'AETH',
    tickerName: 'AETH'
}

const CLIENT_ID = 'BAHV09FJDTIaPSyykoKgdGXximyKaq1P5V26R_lXIQyi3KR5DN8eT2V4en1_yiyWFLjM3UGdfKkTUgletJHN604';  // Environment Variable

const web3Aauth = new Web3Auth({
    clientId: CLIENT_ID,
    web3AuthNetwork: 'cyan',
    chainConfig
});

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
        uxMode: "redirect", // redirect or popup
        loginConfig: {
            jwt: {
                verifier: "verifier-name", // name of the verifier created on Web3Auth Dashboard
                typeOfLogin: "jwt",
                clientId: CLIENT_ID, // Web3Auth Client ID
            },
        },
    },
    privateKeyProvider,
});

export  async function autentication() {
    const response = await web3Aauth.connectTo(WALLET_ADAPTERS.OPENLOGIN, openloginAdapter);

    return response
}


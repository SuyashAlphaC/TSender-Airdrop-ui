"use-client"

import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {zksync, anvil, mainnet} from "wagmi/chains";

export default getDefaultConfig ({
    appName: "TSender",
    chains: [zksync, anvil,mainnet],
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    ssr: false
})
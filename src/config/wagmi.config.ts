import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { mainnet, sepolia, polygonAmoy } from "wagmi/chains";

export const getWagmiConfig = () => {
  return createConfig({
    chains: [mainnet, sepolia, polygonAmoy],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygonAmoy.id]: http(),
    },
  });
};

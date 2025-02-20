import { providers } from "ethers";
import { toEth } from "@colony/sdk";
import { ColonyNetwork, ColonyRpcEndpoint } from "@colony/sdk";

const provider = new providers.JsonRpcProvider(ColonyRpcEndpoint.ArbitrumOne);
const colonyAddress = "0x8e389bf45f926dDDB2BE3636290de42B68aefd51";
const ETH_TOKEN_ADDRESS = "0x5C3D4231090311b375149687fbc33a0555Af69D8";
const USDC_TOKEN_ADDRESS = "0xfd7dDFaCBBa559C7f68ad15f8Cd9256bc14de588";

// Mapping of domain IDs to names
const domainNames = {
  1: "General",
  4: "🅿 Intuition",
  3: "🅿 Eco",
  5: "🅿 Jokerace",
};

// Function to fetch BPT funds for each domain in both ETH and USDC
export async function fetchDomainFunds() {
  try {
    const colonyNetwork = new ColonyNetwork(provider);
    const colony = await colonyNetwork.getColony(colonyAddress);

    const domainFunds = await Promise.all(
      Object.keys(domainNames).map(async (domainId) => {
        domainId = Number(domainId);

        try {
          // Fetch ETH balance
          const balanceETHWei = await colony.getBalance(ETH_TOKEN_ADDRESS, domainId);
          const balanceETH = toEth(balanceETHWei); // Convert from wei to ETH

          // Fetch USDC balance
          const balanceUSDCWei = await colony.getBalance(USDC_TOKEN_ADDRESS, domainId);
          const balanceUSDC = toEth(balanceUSDCWei); // Convert from wei to USDC

          return {
            domainId,
            domainName: domainNames[domainId] || `Domain ${domainId}`,
            funds: [
              { ticker: "ETH", amount: balanceETH },
              { ticker: "USDC", amount: balanceUSDC },
            ],
          };
        } catch (error) {
          console.error(`Error fetching funds for domain ${domainId}:`, error);
          return {
            domainId,
            domainName: domainNames[domainId] || `Domain ${domainId}`,
            funds: [
              { ticker: "ETH", amount: "0" },
              { ticker: "USDC", amount: "0" },
            ],
          };
        }
      })
    );

    return domainFunds;
  } catch (error) {
    console.error("❌ Error fetching domain funds:", error);
    return [];
  }
}

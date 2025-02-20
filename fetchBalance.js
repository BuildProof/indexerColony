import { providers } from 'ethers';
import { toEth } from '@colony/sdk';
import { ColonyNetwork, ColonyRpcEndpoint } from '@colony/sdk';

const provider = new providers.JsonRpcProvider(ColonyRpcEndpoint.ArbitrumOne);
const colonyAddress = '0x8e389bf45f926dDDB2BE3636290de42B68aefd51';
const BPT_TOKEN_ADDRESS = '0x20dAF9EF97da8d58012E6C4F572bECBd6b374844';

// Mapping of domain IDs to names
const domainNames = {
  1: 'General',
  4: '🅿 Intuition',
  3: '🅿 Eco',
  5: '🅿 Jokerace',
};

// Function to fetch BPT funds for each domain
export async function fetchDomainFunds() {
  try {
    const colonyNetwork = new ColonyNetwork(provider);
    const colony = await colonyNetwork.getColony(colonyAddress);

    const domainFunds = await Promise.all(Object.keys(domainNames).map(async (domainId) => {
      domainId = Number(domainId);

      try {
        const balanceWei = await colony.getBalance(BPT_TOKEN_ADDRESS, domainId);
        const balance = toEth(balanceWei); // Convert from wei to BPT

        return {
          domainId,
          domainName: domainNames[domainId] || `Domain ${domainId}`,
          ticker: 'BPT',
          funds: `${balance} BPT`, // Show BPT instead of ETH
        };
      } catch (error) {
        console.error(`Error fetching funds for domain ${domainId}:`, error);
        return {
          domainId,
          domainName: domainNames[domainId] || `Domain ${domainId}`,
          funds: "0 BPT",
        };
      }
    }));

    return domainFunds;
  } catch (error) {
    console.error('❌ Error fetching domain funds:', error);
    return [];
  }
}

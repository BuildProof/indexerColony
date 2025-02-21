import { providers } from "ethers";
import { toEth } from "@colony/sdk";
import { ColonyNetwork, ColonyRpcEndpoint } from "@colony/sdk";
import dotenv from "dotenv";
import fs from "fs";


dotenv.config(); // Charger les variables d'environnement

const provider = new providers.JsonRpcProvider(ColonyRpcEndpoint.ArbitrumOne);

// Charger les adresses depuis le fichier .env
const colonyAddress = process.env.COLONY_ADDRESS
const ETH_TOKEN_ADDRESS = process.env.ETH_TOKEN_ADDRESS
const USDC_TOKEN_ADDRESS = process.env.USDC_TOKEN_ADDRESS

// Mapping des domaines
const domainNames = {
  1: "General",
  4: "🅿 Intuition",
  3: "🅿 Eco",
  5: "🅿 Jokerace",
};

const CACHE_FILE = "domainsData.json";
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

// Function to read the cache
function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");

      // Handle empty file
      if (!data.trim()) throw new Error("Cache file is empty");

      const parsedData = JSON.parse(data);

      // Ensure valid cache structure
      if (!parsedData.timestamp || !Array.isArray(parsedData.funds)) {
        throw new Error("Invalid cache format");
      }

      const now = Date.now();
      if (now - parsedData.timestamp < CACHE_EXPIRATION) {
        console.log("✅ Using cached data.");
        return parsedData.funds;
      }
    }
  } catch (error) {
    console.error("⚠️ Error reading cache (will be refreshed):", error.message);
  }
  return null;
}



// Function to write to the cache
function writeCache(data) {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format for cache");
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), funds: data }, null, 2), "utf-8");
    console.log("✅ Cache updated.");
  } catch (error) {
    console.error("⚠️ Error writing cache:", error.message);
  }
}


// Fonction pour récupérer les fonds des domaines
export async function fetchDomainFunds() {
  try {
    if (!colonyAddress) {
      throw new Error("❌ COLONY_ADDRESS is not defined in .env");
    }

    // Check cache first
    const cachedData = readCache();
    if (cachedData) return cachedData;

    const colonyNetwork = new ColonyNetwork(provider);
    const colony = await colonyNetwork.getColony(colonyAddress);

    const domainFunds = await Promise.all(
      Object.keys(domainNames).map(async (domainId) => {
        domainId = Number(domainId);
        try {
          const balanceETHWei = await colony.getBalance(ETH_TOKEN_ADDRESS, domainId);
          const balanceETH = toEth(balanceETHWei);

          const balanceUSDCWei = await colony.getBalance(USDC_TOKEN_ADDRESS, domainId);
          const balanceUSDC = toEth(balanceUSDCWei);

          return {
            domainId,
            domainName: domainNames[domainId] || `Domain ${domainId}`,
            funds: [
              { ticker: "ETH", amount: balanceETH },
              { ticker: "USDC", amount: balanceUSDC },
            ],
          };
        } catch (error) {
          console.error(`⚠️ Error fetching funds for domain ${domainId}:`, error);
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

    // Cache the new data
    writeCache(domainFunds);
    return domainFunds;
  } catch (error) {
    console.error("❌ Error fetching domain funds:", error);
    return [];
  }
}


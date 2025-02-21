import express from "express";
import cors from "cors";
import fs from "fs/promises";
import { fetchUsersWithRoles } from "./fetchData.js";
import { fetchDomainFunds } from './fetchBalance.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());

let cachedUsers = [];

// Function to read data from file safely
const getData = async () => {
  try {
    const rawData = await fs.readFile("data.json", "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("⚠️ Error reading data.json:", error.message);
    return [];
  }
};

// Function to save data safely
const saveData = async (data) => {
  try {
    if (!data) throw new Error("Data is undefined or null");

    await fs.writeFile("data.json", JSON.stringify(data, null, 2));
    console.log("✅ Data saved to data.json");
  } catch (error) {
    console.error("❌ Error saving data:", error.message);
  }
};

// Function to refresh users data
async function refreshData() {
  try {
    console.log("🔄 Fetching updated user data...");
    cachedUsers = await fetchUsersWithRoles();

    console.log("📊 Fetched Users Data:", cachedUsers);

    if (!cachedUsers || !Array.isArray(cachedUsers)) {
      throw new Error("Fetched data is invalid");
    }

    await saveData(cachedUsers);
    console.log("✅ Data refreshed successfully");
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
  }
}

// Function to safely fetch and cache domain funds
async function refreshDomainFunds() {
  try {
    console.log("🔄 Fetching domain balances...");
    const funds = await fetchDomainFunds();

    if (!funds || typeof funds !== "object") {
      throw new Error("Invalid funds data format");
    }

    await fs.writeFile("domainsData.json", JSON.stringify(funds, null, 2));
    console.log("✅ Domain funds cached successfully");
  } catch (error) {
    console.error("❌ Error fetching domain funds:", error.message);
  }
}

// Fetch data initially and set up intervals
refreshData();
setInterval(refreshData, 5 * 60 * 1000);

refreshDomainFunds();
setInterval(refreshDomainFunds, 5 * 60 * 1000);

// API Endpoints
app.get("/api/users", async (req, res) => {
  const usersData = await getData();
  res.json(usersData);
});

app.get("/api/domains", async (req, res) => {
  try {
    const rawFunds = await fs.readFile("domainsData.json", "utf-8");
    const funds = JSON.parse(rawFunds);
    res.json(funds);
  } catch (error) {
    console.error("⚠️ Error reading domain funds cache:", error.message);
    res.status(500).json({ error: "Failed to fetch domain funds" });
  }
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

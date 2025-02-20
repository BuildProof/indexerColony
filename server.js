import express from "express";
import cors from "cors";
import fs from "fs/promises";
import { fetchUsersWithRoles } from "./fetchData.js";
import { fetchDomainFunds } from './fetchBalance.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let cachedUsers = [];

const getData = async () => {
  try {
    const rawData = await fs.readFile("data.json", "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading data.json:", error);
    return [];
  }
};

// Function to save data to data.json
const saveData = async (data) => {
  try {
    if (!data) {
      throw new Error("Data is undefined or null");
    }
    await fs.writeFile("data.json", JSON.stringify(data, null, 2));
    console.log("✅ Data saved to data.json");
  } catch (error) {
    console.error("❌ Error saving data:", error);
  }
};


// Function to refresh data periodically
async function refreshData() {
  try {
    console.log("🔄 Fetching updated user data...");
    cachedUsers = await fetchUsersWithRoles();

    console.log("Fetched Data:", cachedUsers); // Ajout d'un log pour vérifier les données

    if (!cachedUsers || !Array.isArray(cachedUsers)) {
      throw new Error("Fetched data is invalid");
    }

    await saveData(cachedUsers);
    console.log("✅ Data refreshed successfully");
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  }
}


// Fetch data initially and set up an interval
refreshData();
setInterval(refreshData, 5 * 60 * 1000);

// API Endpoint
app.get("/api/users", async (req, res) => {
  const usersData = await getData();
  res.json(usersData);
});

app.get('/api/domains', async (req, res) => {
  try {
    const funds = await fetchDomainFunds();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domain funds' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

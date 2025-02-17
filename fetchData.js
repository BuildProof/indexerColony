import { providers } from 'ethers';
import { Id, ColonyRole } from '@colony/sdk';
import { ColonyNetwork, ColonyRpcEndpoint } from '@colony/sdk';
import fs from 'fs/promises';  // Utilise la version promesse de fs

export async function fetchUsersWithRoles() {
  const provider = new providers.JsonRpcProvider(ColonyRpcEndpoint.ArbitrumOne);
  const colonyAddress = '0x8e389bf45f926dDDB2BE3636290de42B68aefd51';

  // Mapping of domain IDs to names
  const domainNames = {
    1: 'General',
    4: '🅿 Intuition',
    3: '🅿 Eco',
    5: '🅿 Jokerace',
  };

  // Fetch domain reputation
  const getDomainReputation = async (colony, domainIds) => {
    return await Promise.all(domainIds.map(async (domainId) => {
      try {
        const { skillId } = await colony.getTeam(domainId);
        const totalReputation = await colony.reputation.getTotalReputation(skillId);
        const membersReputation = await colony.reputation.getMembersReputation(skillId);

        const reputationList = await Promise.all(membersReputation.addresses.map(async (address) => {
          const { reputationAmount } = await colony.reputation.getReputation(skillId, address);
          const percentage = reputationAmount.mul(10000).div(totalReputation.reputationAmount).toNumber() / 100;
          return { address, reputation: `${percentage.toFixed(2)}%` };
        }));

        return { domainId, domainName: domainNames[domainId] || `Domain ${domainId}`, reputationList };
      } catch (error) {
        console.error(`Error fetching reputation for domain ${domainId}:`, error);
        return { domainId, domainName: domainNames[domainId] || `Domain ${domainId}`, reputationList: [] };
      }
    }));
  };

  // Fetch users, their roles & reputation
  const colonyNetwork = new ColonyNetwork(provider);
  const colony = await colonyNetwork.getColony(colonyAddress);
  const domainIds = Object.keys(domainNames).map(Number);
  const domainReputationData = await getDomainReputation(colony, domainIds);

  const { skillId } = await colony.getTeam(Id.RootDomain);
  const membersReputation = await colony.reputation.getMembersReputation(skillId);
  const addresses = membersReputation.addresses;

  const users = await Promise.all(addresses.map(async (address) => {
    const domains = await Promise.all(domainIds.map(async (domainId) => {
      const roles = await colony.getRoles(address, domainId);
      const domainReputation = domainReputationData.find(d => d.domainId === domainId);
      const userReputation = domainReputation?.reputationList.find(rep => rep.address === address);

      return {
        domainId,
        domainName: domainNames[domainId] || `Domain ${domainId}`,
        roles: roles.map(role => ColonyRole[role] || `Unknown Role (${role})`).join(', '),
        reputation: userReputation ? userReputation.reputation : '0%',
      };
    }));

    return { address, domains };
  }));

  return users;
}

export async function saveData() {
  try {
    console.log('Fetching users & roles...');
    const data = await fetchUsersWithRoles();
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
    console.log('Data saved to data.json ✅');
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
}

// Run fetching process
saveData();

import fetch from 'node-fetch';

async function action(headers: Record<string, string>): Promise<boolean> {
  const res = await fetch(
    "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
    {
      method: "POST",
      headers,
    }
  );

  const json = await res.json();
  return res.status === 201;
}

async function getNextTime(headers: Record<string, string>): Promise<number> {
  const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
    headers,
  });

  if (res.status !== 200) {
    throw new Error("Get missions request failed");
  }

  const data = await res.json();
  return data["SPECIAL MISSION"][0]["next_time_execute"];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleToken(authToken: string): Promise<void> {
  const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };
  let nextTime = await getNextTime(headers);

  while (true) {
    const now = Math.floor(Date.now() / 1000);
    
    if (now >= nextTime) {
      const result = await action(headers);
      if (result) {
        console.log(`Success: Action to earn was successfully completed with token ${authToken}`);
        nextTime = await getNextTime(headers);
        console.log(`Success: Got new nextTime with token ${authToken}: ${nextTime}`);
      } else {
        console.log(`Failed: Action to earn failed with token ${authToken}`);
      }
    } else {
      // console.log(`Waiting: Time left for next action with token ${authToken}: ${nextTime - now}s`);
    }

    await delay(1000);
  }
}

async function makeMoney(authTokens: string[]): Promise<void> {
  // Create an array of promises, one for each token
  const promises = authTokens.map(token => handleToken(token));

  // Use Promise.all to run all promises concurrently
  await Promise.all(promises);
}

// List of your authorization tokens
const authTokens: string[] = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE4YTM5YTlkNTdkOTNmMDAzODU4IiwiaWF0IjoxNzI2ODI2MzMxLCJleHAiOjE3MjY5MTI3MzEsInR5cGUiOiJhY2Nlc3MifQ.tJTEbZmVDksqgYnOa_JKl5sSBr0aRj8HkwBmg6X09O0" ,
  //09357792770
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE2M2E5YTlkNTdkOTNmZmJhZDcxIiwiaWF0IjoxNzI2ODI0MTEyLCJleHAiOjE3MjY5MTA1MTIsInR5cGUiOiJhY2Nlc3MifQ.EFT6obc9WINbDfxYDwcRLZfn-B5Jlg5NDJO_IDZ9P40",
  //09036567864
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzEwNTc2M2Y3Mzg1MGY4M2ZkN2Y1IiwiaWF0IjoxNzI2ODI2OTM4LCJleHAiOjE3MjY5MTMzMzgsInR5cGUiOiJhY2Nlc3MifQ.MoV11oV77jJtglZCqM6Mfnft01nj6RL8nAqMvx7mNiE",
  //09197473984
 


];

makeMoney(authTokens);

console.log("Executed: Started...");

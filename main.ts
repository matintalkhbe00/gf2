import fetch from 'node-fetch';

let totalRewards = 0; // جمع کل جوایز در سطح کل برنامه

async function action(headers: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(
      "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
      {
        method: "POST",
        headers,
      }
    );

    return res.ok; // اگر درخواست موفق بود، true برمی‌گرداند
  } catch (error) {
    console.error('Error in action:', error);
    return false;
  }
}

async function getNextTime(headers: Record<string, string>): Promise<number> {
  try {
    const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
      headers,
    });

    if (!res.ok) {
      console.error(`Get missions request failed: ${res.status} ${res.statusText}`);
      const now = Math.floor(Date.now() / 1000);
      return now + 60; // زمان پیش‌فرض
    }

    const data = await res.json();
    return data["SPECIAL MISSION"][0]["next_time_execute"];
  } catch (error) {
    console.error('Error in getNextTime:', error);
    const now = Math.floor(Date.now() / 1000);
    return now + 60; // زمان پیش‌فرض
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleToken(authToken: string, tokenNumber: number): Promise<void> {
  const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };
  let nextTime = await getNextTime(headers);
  let rewardsCount = 0; // شمارش جوایز برای هر توکن

  while (true) {
    const now = Math.floor(Date.now() / 1000);

    if (now >= nextTime) {
      const result = await action(headers);
      if (result) {
        rewardsCount += 200; // هر بار که عمل موفقیت‌آمیز باشد، 200 به شمارش جوایز اضافه می‌شود
        totalRewards += 200; // به جمع کل جوایز اضافه می‌شود
        console.log(`Success: Action to earn was successfully completed for token number ${tokenNumber}.`);
        console.log(`Total rewards for token number ${tokenNumber}: ${rewardsCount}`);
        console.log(`Total rewards accumulated: ${totalRewards}`);
        nextTime = await getNextTime(headers);
        console.log(`Success: Got new nextTime for token number ${tokenNumber}: ${nextTime}`);
      } else {
        console.log(`Failed: Action to earn failed for token number ${tokenNumber}`);
      }
    }

    // زمان باقی‌مانده تا اجرای بعدی محاسبه می‌شود
    const waitTime = Math.max(nextTime - now, 1); // حداقل 1 ثانیه تاخیر
    await delay(waitTime * 1000); // تبدیل به میلی‌ثانیه
  }
}

async function makeMoney(tokensAndNumbers: { token: string, number: number }[]): Promise<void> {
  const promises = tokensAndNumbers.map(({ token, number }) => handleToken(token, number));
  await Promise.all(promises);
}

// لیستی از توکن‌ها و شماره‌های مرتبط با آن‌ها
const tokensAndNumbers = [
 
  { token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzEwNTc2M2Y3Mzg1MGY4M2ZkN2Y1IiwiaWF0IjoxNzI4MDY5MzQxLCJleHAiOjE3MjgxNTU3NDEsInR5cGUiOiJhY2Nlc3MifQ.1rzAOAZ1pnoehzudMtIoSJVotAyuHi0KxqwGA-6Tyvw" , number: 1},
  { token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE2M2E5YTlkNTdkOTNmZmJhZDcxIiwiaWF0IjoxNzI4MDY5NDM4LCJleHAiOjE3MjgxNTU4MzgsInR5cGUiOiJhY2Nlc3MifQ.6No0EHPztuTpABgjaJUSXbg99RbUvp_KriFzXw9ch_4" , number:2 },
  { token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE4YTM5YTlkNTdkOTNmMDAzODU4IiwiaWF0IjoxNzI4MDY5NTY1LCJleHAiOjE3MjgxNTU5NjUsInR5cGUiOiJhY2Nlc3MifQ.o9pTAfPyJ8ABbmnVywMpjhDPymvhtYsLbkf9iEEfzHU" , number:3 },
  { token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZkZGZiNjYxZjdmMGYxNGZmYzkxNDAyIiwiaWF0IjoxNzI4MDY5NzM2LCJleHAiOjE3MjgxNTYxMzYsInR5cGUiOiJhY2Nlc3MifQ.U0iMKaMSCqYoXzvEvNSTN6Pd2_JcJBXrv7o0py_BEeE" , number:4 },
  { token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2Y2OThmZjM0YmE2YzMyYzM3ZGFmIiwiaWF0IjoxNzI4MDY5ODM5LCJleHAiOjE3MjgxNTYyMzksInR5cGUiOiJhY2Nlc3MifQ.7_9UeIe8OTXd3Zxu50gUpH07jNJCuWQUDtIyPbBttmY" , number:5 },
  { token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI4MDY5OTc0LCJleHAiOjE3MjgxNTYzNzQsInR5cGUiOiJhY2Nlc3MifQ.U9AyMaahfAebD__anRJo3bCAGBj9bw-mO3iaLYwhI58" , number:6 },

];



makeMoney(tokensAndNumbers);

console.log("Executed: Started...");

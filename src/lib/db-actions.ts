import { createServerFn } from "@tanstack/react-start";
import { getCollection as getCol, updateCollection } from "./db.server";

// Wrapper to make getCollection accessible to client as a server function if needed,
// but usually we should have specific functions for each collection.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCollection = createServerFn("GET", async (collection: any) => {
  return await getCol(collection);
});

// Profiles
export const getProfiles = createServerFn("GET", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await getCol("profiles")) as any[];
});

export const getProfile = createServerFn("GET", async (userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profiles = (await getCol("profiles")) as any[];
  return profiles.find((p) => p.id === userId) || null;
});

export const updateProfile = createServerFn(
  "POST",
  async (payload: { id: string; updates: Record<string, unknown> }) => {
    const profiles = (await getCol("profiles")) as Record<string, unknown>[];
    const index = profiles.findIndex((p) => p.id === payload.id);
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...payload.updates };
      await updateCollection("profiles", profiles);
    } else {
      profiles.push({ id: payload.id, ...payload.updates });
      await updateCollection("profiles", profiles);
    }
    return { success: true };
  },
);

// Wallets
export const getWallets = createServerFn("GET", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await getCol("wallets")) as any[];
});

export const getWallet = createServerFn("GET", async (userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wallets = (await getCol("wallets")) as any[];
  return wallets.find((w) => w.user_id === userId) || null;
});

export const adjustWalletBalance = createServerFn(
  "POST",
  async (payload: {
    user_id: string;
    balance_inr: number;
    delta: number;
    type: string;
    reason: string;
  }) => {
    const wallets = (await getCol("wallets")) as Record<string, unknown>[];
    const index = wallets.findIndex((w) => w.user_id === payload.user_id);
    if (index !== -1) {
      wallets[index].balance_inr = payload.balance_inr;
      wallets[index].updated_at = new Date().toISOString();
    } else {
      wallets.push({
        user_id: payload.user_id,
        balance_inr: payload.balance_inr,
        updated_at: new Date().toISOString(),
      });
    }
    await updateCollection("wallets", wallets);

    const transactions = (await getCol("wallet_transactions")) as Record<string, unknown>[];
    transactions.push({
      user_id: payload.user_id,
      amount: Math.abs(payload.delta),
      type: payload.type,
      reason: payload.reason,
      created_at: new Date().toISOString(),
    });
    await updateCollection("wallet_transactions", transactions);

    return { success: true };
  },
);

// Deployments
export const getDeployments = createServerFn("GET", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await getCol("deployments")) as any[];
});

export const getUserDeployments = createServerFn("GET", async (userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deployments = (await getCol("deployments")) as any[];
  return deployments.filter((d) => d.user_id === userId);
});

export const createDeployment = createServerFn("POST", async (payload: Record<string, unknown>) => {
  const deployments = (await getCol("deployments")) as Record<string, unknown>[];
  const id = crypto.randomUUID();
  const newDep = {
    ...payload,
    id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  deployments.push(newDep);
  await updateCollection("deployments", deployments);
  return newDep;
});

export const updateDeployment = createServerFn(
  "POST",
  async (payload: { id: string; updates: Record<string, unknown> }) => {
    const deployments = (await getCol("deployments")) as Record<string, unknown>[];
    const index = deployments.findIndex((d) => d.id === payload.id);
    if (index !== -1) {
      deployments[index] = {
        ...deployments[index],
        ...payload.updates,
        updated_at: new Date().toISOString(),
      };
      await updateCollection("deployments", deployments);
    }
    return { success: true };
  },
);

export const deleteDeployment = createServerFn("POST", async (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deployments = (await getCol("deployments")) as any[];
  const next = deployments.filter((d) => d.id !== id);
  await updateCollection("deployments", next);
  return { success: true };
});

// Logs
export const getDeploymentLogs = createServerFn("GET", async (deploymentId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logs = (await getCol("deployment_logs")) as any[];
  return logs.filter((l) => l.deployment_id === deploymentId);
});

export const addDeploymentLog = createServerFn(
  "POST",
  async (payload: { deployment_id: string; user_id: string; message: string; level: string }) => {
    const logs = (await getCol("deployment_logs")) as Record<string, unknown>[];
    const newLog = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    logs.push(newLog);
    await updateCollection("deployment_logs", logs);
    return newLog;
  },
);

// Env
export const getDeploymentEnv = createServerFn("GET", async (deploymentId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const envs = (await getCol("deployment_env")) as any[];
  return envs.filter((e) => e.deployment_id === deploymentId);
});

export const addDeploymentEnvs = createServerFn(
  "POST",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (envsToAdd: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const envs = (await getCol("deployment_env")) as any[];
    const next = [...envs, ...envsToAdd.map((e) => ({ ...e, id: crypto.randomUUID() }))];
    await updateCollection("deployment_env", next);
    return { success: true };
  },
);

// Referrals
export const getReferralEarnings = createServerFn("GET", async (userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const earnings = (await getCol("referral_earnings")) as any[];
  return earnings.filter((e) => e.referrer_id === userId);
});

// Chats
export const getChats = createServerFn("GET", async () => {
  return (await getCol("chats")) as unknown[];
});

export const getChatsForUser = createServerFn("GET", async (userId: string) => {
  const chats = (await getCol("chats")) as Record<string, unknown>[];
  return chats.filter((c) => c.user_id === userId);
});

export const sendChatMessage = createServerFn(
  "POST",
  async (payload: { user_id: string; message: string; sender: string }) => {
    const chats = (await getCol("chats")) as Record<string, unknown>[];
    chats.push({
      id: crypto.randomUUID(),
      user_id: payload.user_id,
      message: payload.message,
      sender: payload.sender,
      created_at: new Date().toISOString(),
      read: false,
    });
    await updateCollection("chats", chats);
    return { success: true };
  },
);

type PassportResponse = {
  passport: PassportResult;
  error?: string;
};

export type PassportResult = {
  score: number;
  passport_id: number;
  human_checkmark: boolean;
  user: {
    profile_picture_url: string;
    username: string;
  } | null;
  passport_profile: {
    image_url: string;
    name: string;
    bio: string;
  } | null;
  passport_socials: {
    profile_name: string;
    source: string;
  }[];
  verified_wallets: Array<string>;
};

export type PassportCredentials = {
  passport_credentials: {
    id: string;
    last_calculated_at: string;
    max_score: number;
    name: string;
    score: number;
    type: string;
    value: string;
  }[];
};

export const getTalentProtocolUser = async (walletId: string) => {
  const api_url = process.env.PASSPORT_API_URL;
  const api_token = process.env.PASSPORT_API_TOKEN;
  const url = `${api_url}/api/v2/passports/${walletId}`;
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": api_token || "",
  };

  try {
    const response = await fetch(url, { headers });
    const data = (await response.json()) as PassportResponse;
    if (!response.ok) return null;
    if (response.status !== 200) return null;
    if (data.error) return null;
    if (!data.passport) return null;
    return data.passport;
  } catch (error) {
    return null;
  }
};

export const getCredentialsForPassport = async (passportId: number | null) => {
  const api_url = process.env.PASSPORT_API_URL;
  const api_token = process.env.PASSPORT_API_TOKEN;
  const id = passportId;

  if (!id) return [];

  const url = `${api_url}/api/v2/passport_credentials?id=${id}`;
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": api_token || "",
  };

  try {
    const response = await fetch(url, { headers });
    const data = (await response.json()) as PassportCredentials;

    const credentials = data.passport_credentials.filter((c) => c.score > 0.0);

    return credentials;
  } catch {
    return [];
  }
};

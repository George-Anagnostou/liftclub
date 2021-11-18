import { Team, User, ShortUser } from "../../types/interfaces";
import { getHeaderToken } from "../auth/token";

export const getUserFromUsername = async (username: string): Promise<User | false> => {
  try {
    const res = await fetch(`/api/users/null?username=${username}`);
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveProfileImgUrl = async (user_id: string, username: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ profileImgUrl: username }),
      headers: { token: getHeaderToken() },
    });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveUserWeight = async (weight: number, user_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ weight }),
      headers: { token: getHeaderToken() },
    });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveUserBio = async (user_id: string, bio: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ bio }),
      headers: { token: getHeaderToken() },
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getUsersFromIdArr = async (idArr: string[]): Promise<ShortUser[] | false> => {
  try {
    const res = await fetch(`/api/users/queryMultiple`, {
      method: "POST",
      body: JSON.stringify({ idArr }),
    });

    const users = await res.json();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Queries
export const queryShortUsersByUsername = async (
  query: string
): Promise<Team["trainers"] | false> => {
  try {
    const res = await fetch(`/api/users/searchUsername?query=${query}`, {
      method: "GET",
    });

    const users = await res.json();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }
};

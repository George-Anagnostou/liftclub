import { Team, User, ShortUser } from "../../types/interfaces";

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

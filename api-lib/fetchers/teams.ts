import { NewTeam, Team } from "../../types/interfaces";
import { getHeaderToken } from "../auth/token";

export const getTeamById = async (team_id: string): Promise<Team | false> => {
  try {
    const res = await fetch(`/api/teams/${team_id}`);
    const team = await res.json();
    return team;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getUserMadeTeams = async (user_id: string): Promise<Team[] | false> => {
  try {
    const res = await fetch(`/api/teams?creator_id=${user_id}`);
    const teams = await res.json();
    return teams;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addTrainerToTeam = async (team_id: string, trainer_id: string, creator_id: string) => {
  try {
    const res = await fetch(
      `/api/teams/${team_id}?addTrainer=${trainer_id}&creator_id=${creator_id}`,
      { method: "PUT", headers: { token: getHeaderToken() } }
    );
    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const removeTrainerFromTeam = async (
  team_id: string,
  trainer_id: string,
  creator_id: string
) => {
  try {
    const res = await fetch(
      `/api/teams/${team_id}?removeTrainer=${trainer_id}&creator_id=${creator_id}`,
      { method: "PUT", headers: { token: getHeaderToken() } }
    );
    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getTeamsFromIdArray = async (idArr: string[]): Promise<Team[]> => {
  if (!Boolean(idArr.length)) return [];

  try {
    const res = await fetch("/api/teams/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });
    const teams = await res.json();

    // Sort teams to be in the same order that the irArr requests them
    teams.sort(
      (a: Team, b: Team) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString())
    );

    return teams;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const postNewTeam = async (team: NewTeam): Promise<Team["_id"] | false> => {
  try {
    const dbTeam = {
      teamName: team.teamName,
      members: [],
      dateCreated: new Date().toISOString(),
      creatorName: team.creatorName,
      creator_id: team.creator_id,
      trainers: team.trainers.map((trainer) => trainer._id),
      routine_id: team.routine_id,
    };

    const res = await fetch("/api/teams", {
      method: "POST",
      body: JSON.stringify(dbTeam),
    });

    const team_id = await res.json();
    return team_id;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateTeam = async (team: Team) => {
  try {
    const dbTeam = {
      _id: team._id,
      teamName: team.teamName,
      members: [...team.members],
      dateCreated: team.dateCreated,
      creatorName: team.creatorName,
      creator_id: team.creator_id,
      trainers: team.trainers.map((trainer) => trainer._id),
      routine_id: team.routine_id,
    };

    const res = await fetch(`/api/teams/${dbTeam._id}?wholeTeam=true`, {
      method: "PUT",
      body: JSON.stringify(dbTeam),
      headers: { token: getHeaderToken() },
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteTeam = async (team_id: string) => {
  try {
    const res = await fetch(`/api/teams/${team_id}`, {
      method: "DELETE",
      headers: { token: getHeaderToken() },
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAllTeamsByMemberCount = async () => {
  try {
    const res = await fetch(`/api/teams/queryMultiple?sort=members`, {
      method: "GET",
    });

    const teams: Team[] = await res.json();

    return teams;
  } catch (e) {
    console.log(e);
    return false;
  }
};

import { legacy, matches, type Match } from "@/data/football";

export type Filters = { teamId: string; competitionId: string };
export type Result = "W" | "D" | "L";
export const resultOf = (m: Match): Result => m.goalsFor > m.goalsAgainst ? "W" : m.goalsFor < m.goalsAgainst ? "L" : "D";
export const sortedMatches = (list: Match[]) => [...list].sort((a, b) => b.date.localeCompare(a.date));
export const filterMatches = (f: Filters) => sortedMatches(matches.filter((m) =>
  (!f.teamId || m.teamId === f.teamId) && (!f.competitionId || m.competitionId === f.competitionId)));

export const detailedStats = (list: Match[]) => {
  const wins = list.filter((m) => resultOf(m) === "W").length;
  const draws = list.filter((m) => resultOf(m) === "D").length;
  const goals = list.reduce((s, m) => s + m.playerGoals, 0);
  const assists = list.reduce((s, m) => s + m.playerAssists, 0);
  return { matches: list.length, wins, draws, losses: list.length - wins - draws, goals, assists,
    contributions: goals + assists, winRate: list.length ? Math.round(wins / list.length * 100) : 0,
    goalsPerMatch: list.length ? goals / list.length : 0,
    contributionsPerMatch: list.length ? (goals + assists) / list.length : 0 };
};

export const careerStats = {
  matches: legacy.matches + matches.length,
  goals: legacy.goals + matches.reduce((s, m) => s + m.playerGoals, 0),
  assists: legacy.assists + matches.reduce((s, m) => s + m.playerAssists, 0),
  contributions: legacy.goals + legacy.assists + matches.reduce((s, m) => s + m.playerGoals + m.playerAssists, 0),
  motm: legacy.motm + matches.filter((m) => m.awards?.motm).length,
  teamOfRound: legacy.teamOfRound + matches.filter((m) => m.awards?.teamOfRound).length,
  playerOfRound: legacy.playerOfRound + matches.filter((m) => m.awards?.playerOfRound).length,
};

export function streaks(list: Match[]) {
  let currentWins = 0, bestWins = 0, currentScoring = 0, bestScoring = 0;
  for (const m of sortedMatches(list).reverse()) {
    currentWins = resultOf(m) === "W" ? currentWins + 1 : 0;
    currentScoring = m.playerGoals > 0 ? currentScoring + 1 : 0;
    bestWins = Math.max(bestWins, currentWins); bestScoring = Math.max(bestScoring, currentScoring);
  }
  return { currentWins, bestWins, currentScoring, bestScoring };
}

export function teamCareerStats(teamId: string) {
  const base = legacy.teams[teamId as keyof typeof legacy.teams];
  const list = matches.filter((m) => m.teamId === teamId);
  const d = detailedStats(list);
  return { matches: base.matches + d.matches, goals: base.goals + d.goals,
    assists: base.assists + d.assists, contributions: base.goals + base.assists + d.contributions,
    motm: base.motm + list.filter((m) => m.awards?.motm).length };
}

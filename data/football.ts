export type Match = {
  id: string; date: string; teamId: string; opponent?: string;
  competitionId?: string; seasonId?: string;
  goalsFor: number; goalsAgainst: number; playerGoals: number; playerAssists: number;
  minutes?: number; firstGoalSecond?: number; comment?: string;
  awards?: { motm?: boolean; teamOfRound?: boolean; playerOfRound?: boolean };
};

export type Team = {
  id: string; name: string; monogram: string; crest?: string;
  crestPosition?: string; accent: string;
};

export const player = {
  name: "Сергей Лапин", initials: "SL", number: 11, position: "ПЗ",
  photo: "/player-sergey-lapin.jpg",
};

export const teams: Team[] = [
  { id: "aura", name: "Аура", monogram: "AU", crest: "/teams/aura.png", accent: "#d7ff3f" },
  { id: "ararat", name: "Арарат", monogram: "AR", crest: "/teams/ararat.png", accent: "#ffd84a" },
  { id: "intelcom", name: "Интелком", monogram: "IN", crest: "/teams/intelcom.png", accent: "#d9b27c" },
  { id: "titan", name: "Титан", monogram: "TT", accent: "#aab3b0" },
];

export const competitions = [
  { id: "summer-cup-2", name: "Summer Cup 2" },
  { id: "rcl-night-league", name: "RCL Night League" },
  { id: "night-league", name: "Night League" },
  { id: "friendly", name: "Товарищеский" },
];

export const legacy = {
  matches: 56, goals: 45, assists: 26, motm: 6, teamOfRound: 6, playerOfRound: 1, cleanSheets: 3,
  teams: {
    aura: { matches: 19, goals: 16, assists: 12, motm: 3 },
    ararat: { matches: 20, goals: 16, assists: 9, motm: 2 },
    intelcom: { matches: 16, goals: 10, assists: 3, motm: 1 },
    titan: { matches: 1, goals: 3, assists: 2, motm: 0 },
  },
};

// Добавляйте новые матчи только сюда — остальные показатели пересчитаются автоматически.
export const matches: Match[] = [
  { id: "ararat-0707", date: "2026-07-07", teamId: "ararat", competitionId: "rcl-night-league", goalsFor: 4, goalsAgainst: 6, playerGoals: 0, playerAssists: 0 },
  { id: "aura-1107", date: "2026-07-11", teamId: "aura", competitionId: "summer-cup-2", goalsFor: 5, goalsAgainst: 4, playerGoals: 0, playerAssists: 2 },
  { id: "ararat-1407", date: "2026-07-14", teamId: "ararat", competitionId: "friendly", goalsFor: 7, goalsAgainst: 7, playerGoals: 3, playerAssists: 3 },
  { id: "aura-1907", date: "2026-07-19", teamId: "aura", competitionId: "summer-cup-2", goalsFor: 5, goalsAgainst: 3, playerGoals: 3, playerAssists: 1, awards: { motm: true, teamOfRound: true } },
  { id: "intelcom-2307", date: "2026-07-23", teamId: "intelcom", competitionId: "night-league", goalsFor: 7, goalsAgainst: 2, playerGoals: 0, playerAssists: 2 },
  {
    id: "ararat-2807",
    date: "2026-07-28",
    teamId: "ararat",
    goalsFor: 3,
    goalsAgainst: 1,
    playerGoals: 0,
    playerAssists: 1,
    comment: "Провёл хороший матч: отдал охуевшую передачу шведой перед первым голом и гениальный ассист в касание на третий. Хорошо отборолся, часть матча провёл в защите в меньшинстве и там тоже сыграл уверенно.",
  },
  {
    id: "aura-0108",
    date: "2026-08-01",
    teamId: "aura",
    competitionId: "summer-cup-2",
    goalsFor: 2,
    goalsAgainst: 3,
    playerGoals: 1,
    playerAssists: 0,
    firstGoalSecond: 15,
    comment: "Бездарно вылетели из кубка от слабой команды. Забил на 15-й секунде — это мой самый быстрый гол в карьере. В остальном сыграли просто отвратно; возможно, это матч, после которого у меня горело сильнее всего.",
  },
  {
    id: "ararat-0408",
    date: "2026-08-04",
    teamId: "ararat",
    competitionId: "rcl-night-league",
    goalsFor: 5,
    goalsAgainst: 3,
    playerGoals: 2,
    playerAssists: 0,
    awards: { teamOfRound: true },
  },
  {
    id: "ararat-1108",
    date: "2026-08-11",
    teamId: "ararat",
    competitionId: "rcl-night-league",
    goalsFor: 2,
    goalsAgainst: 1,
    playerGoals: 1,
    playerAssists: 0,
    comment: "Был ебануто тяжёлый матч — буквально выстояли, а я забил победный гол. Мог, конечно, забить ещё один-два: было несколько хороших моментов, но с клюшками всё же сложно играть))",
  },
];

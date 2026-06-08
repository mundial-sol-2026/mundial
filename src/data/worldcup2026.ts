// ══════════════════════════════════════════════════════════════
// FIFA WORLD CUP 2026 - COMPLETE GROUP STAGE DATA
// Hosts: USA, Canada, Mexico
// 48 Teams, 12 Groups (A-L), 4 teams per group
// June 11 - July 19, 2026
// ══════════════════════════════════════════════════════════════

export interface Team {
  name: string;
  code: string;
  flag: string;
}

export interface GroupData {
  letter: string;
  teams: Team[];
}

export interface MatchData {
  id: string;
  group: string;
  matchday: number;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  fullDate: string;
  time: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  totalPredictions: number;
  reward: string;
  difficulty: "easy" | "medium" | "hard";
}

// ── FLAGS ──
const f: Record<string, string> = {
  MEX:"🇲🇽", RSA:"🇿🇦", KOR:"🇰🇷", CZE:"🇨🇿", CAN:"🇨🇦", BIH:"🇧🇦", QAT:"🇶🇦",
  SUI:"🇨🇭", BRA:"🇧🇷", MAR:"🇲🇦", HAI:"🇭🇹", SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", USA:"🇺🇸", PAR:"🇵🇾",
  AUS:"🇦🇺", TUR:"🇹🇷", GER:"🇩🇪", CUW:"🇨🇼", CIV:"🇨🇮", ECU:"🇪🇨", NED:"🇳🇱",
  JPN:"🇯🇵", UKR:"🇺🇦", TUN:"🇹🇳", BEL:"🇧🇪", EGY:"🇪🇬", IRN:"🇮🇷", NZL:"🇳🇿",
  ESP:"🇪🇸", CPV:"🇨🇻", KSA:"🇸🇦", URU:"🇺🇾", FRA:"🇫🇷", SEN:"🇸🇳", BOL:"🇧🇴",
  ITA:"🇮🇹", DEN:"🇩🇰", ARG:"🇦🇷", CHI:"🇨🇱", ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO:"🇭🇷", COL:"🇨🇴", POL:"🇵🇱",
};

function t(code: string, name: string): Team {
  return { name, code, flag: f[code] || "⚽" };
}

// ════════════════════════════════════════
// ALL 12 GROUPS
// ════════════════════════════════════════
export const groups: GroupData[] = [
  { letter: "A", teams: [t("MEX","México"), t("RSA","Sudáfrica"), t("KOR","Corea del Sur"), t("CZE","Chequia")] },
  { letter: "B", teams: [t("CAN","Canadá"), t("BIH","Bosnia y Herz."), t("QAT","Qatar"), t("SUI","Suiza")] },
  { letter: "C", teams: [t("BRA","Brasil"), t("MAR","Marruecos"), t("HAI","Haití"), t("SCO","Escocia")] },
  { letter: "D", teams: [t("USA","Estados Unidos"), t("PAR","Paraguay"), t("AUS","Australia"), t("TUR","Turquía")] },
  { letter: "E", teams: [t("GER","Alemania"), t("CUW","Curazao"), t("CIV","Costa de Marfil"), t("ECU","Ecuador")] },
  { letter: "F", teams: [t("NED","Países Bajos"), t("JPN","Japón"), t("UKR","Ucrania"), t("TUN","Túnez")] },
  { letter: "G", teams: [t("BEL","Bélgica"), t("EGY","Egipto"), t("IRN","Irán"), t("NZL","Nueva Zelanda")] },
  { letter: "H", teams: [t("ESP","España"), t("CPV","Cabo Verde"), t("KSA","Arabia Saudita"), t("URU","Uruguay")] },
  { letter: "I", teams: [t("FRA","Francia"), t("SEN","Senegal"), t("BOL","Bolivia")] },
  { letter: "J", teams: [t("ITA","Italia"), t("DEN","Dinamarca")] },
  { letter: "K", teams: [t("ARG","Argentina"), t("CHI","Chile")] },
  { letter: "L", teams: [t("ENG","Inglaterra"), t("CRO","Croacia"), t("COL","Colombia"), t("POL","Polonia")] },
];

// ════════════════════════════════════════
// ALL 72 GROUP STAGE MATCHES
// ════════════════════════════════════════
export const allMatches: MatchData[] = [
  // ═══ GROUP A (Mexico) ═══
  { id:"A1", group:"A", matchday:1, homeTeam:t("MEX","México"), awayTeam:t("RSA","Sudáfrica"), date:"11 Jun", fullDate:"2026-06-11", time:"20:00", status:"upcoming", totalPredictions:3420, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"A2", group:"A", matchday:1, homeTeam:t("KOR","Corea del Sur"), awayTeam:t("CZE","Chequia"), date:"11 Jun", fullDate:"2026-06-11", time:"22:00", status:"upcoming", totalPredictions:2100, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"A3", group:"A", matchday:2, homeTeam:t("RSA","Sudáfrica"), awayTeam:t("KOR","Corea del Sur"), date:"16 Jun", fullDate:"2026-06-16", time:"18:00", status:"upcoming", totalPredictions:1800, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"A4", group:"A", matchday:2, homeTeam:t("CZE","Chequia"), awayTeam:t("MEX","México"), date:"16 Jun", fullDate:"2026-06-16", time:"21:00", status:"upcoming", totalPredictions:2560, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"A5", group:"A", matchday:3, homeTeam:t("MEX","México"), awayTeam:t("KOR","Corea del Sur"), date:"21 Jun", fullDate:"2026-06-21", time:"21:00", status:"upcoming", totalPredictions:4100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"A6", group:"A", matchday:3, homeTeam:t("RSA","Sudáfrica"), awayTeam:t("CZE","Chequia"), date:"21 Jun", fullDate:"2026-06-21", time:"21:00", status:"upcoming", totalPredictions:1450, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP B (Canada) ═══
  { id:"B1", group:"B", matchday:1, homeTeam:t("CAN","Canadá"), awayTeam:t("BIH","Bosnia y Herz."), date:"12 Jun", fullDate:"2026-06-12", time:"15:00", status:"upcoming", totalPredictions:1890, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"B2", group:"B", matchday:1, homeTeam:t("QAT","Qatar"), awayTeam:t("SUI","Suiza"), date:"12 Jun", fullDate:"2026-06-12", time:"21:00", status:"upcoming", totalPredictions:1230, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"B3", group:"B", matchday:2, homeTeam:t("SUI","Suiza"), awayTeam:t("CAN","Canadá"), date:"17 Jun", fullDate:"2026-06-17", time:"18:00", status:"upcoming", totalPredictions:1650, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"B4", group:"B", matchday:2, homeTeam:t("BIH","Bosnia y Herz."), awayTeam:t("QAT","Qatar"), date:"17 Jun", fullDate:"2026-06-17", time:"21:00", status:"upcoming", totalPredictions:890, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"B5", group:"B", matchday:3, homeTeam:t("CAN","Canadá"), awayTeam:t("QAT","Qatar"), date:"22 Jun", fullDate:"2026-06-22", time:"15:00", status:"upcoming", totalPredictions:2200, reward:"500 $MUNDIAL", difficulty:"easy" },
  { id:"B6", group:"B", matchday:3, homeTeam:t("SUI","Suiza"), awayTeam:t("BIH","Bosnia y Herz."), date:"22 Jun", fullDate:"2026-06-22", time:"18:00", status:"upcoming", totalPredictions:1100, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP C ═══
  { id:"C1", group:"C", matchday:1, homeTeam:t("BRA","Brasil"), awayTeam:t("HAI","Haití"), date:"13 Jun", fullDate:"2026-06-13", time:"18:00", status:"upcoming", totalPredictions:5200, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"C2", group:"C", matchday:1, homeTeam:t("MAR","Marruecos"), awayTeam:t("SCO","Escocia"), date:"13 Jun", fullDate:"2026-06-13", time:"21:00", status:"upcoming", totalPredictions:3100, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"C3", group:"C", matchday:2, homeTeam:t("SCO","Escocia"), awayTeam:t("BRA","Brasil"), date:"18 Jun", fullDate:"2026-06-18", time:"18:00", status:"upcoming", totalPredictions:2800, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"C4", group:"C", matchday:2, homeTeam:t("HAI","Haití"), awayTeam:t("MAR","Marruecos"), date:"18 Jun", fullDate:"2026-06-18", time:"21:00", status:"upcoming", totalPredictions:950, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"C5", group:"C", matchday:3, homeTeam:t("BRA","Brasil"), awayTeam:t("MAR","Marruecos"), date:"23 Jun", fullDate:"2026-06-23", time:"21:00", status:"upcoming", totalPredictions:8900, reward:"750 $MUNDIAL", difficulty:"hard" },
  { id:"C6", group:"C", matchday:3, homeTeam:t("HAI","Haití"), awayTeam:t("SCO","Escocia"), date:"23 Jun", fullDate:"2026-06-23", time:"21:00", status:"upcoming", totalPredictions:1200, reward:"750 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP D (USA) ═══
  { id:"D1", group:"D", matchday:1, homeTeam:t("USA","Estados Unidos"), awayTeam:t("TUR","Turquía"), date:"13 Jun", fullDate:"2026-06-13", time:"18:00", status:"upcoming", totalPredictions:4500, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"D2", group:"D", matchday:1, homeTeam:t("PAR","Paraguay"), awayTeam:t("AUS","Australia"), date:"13 Jun", fullDate:"2026-06-13", time:"21:00", status:"upcoming", totalPredictions:1800, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"D3", group:"D", matchday:2, homeTeam:t("AUS","Australia"), awayTeam:t("USA","Estados Unidos"), date:"18 Jun", fullDate:"2026-06-18", time:"18:00", status:"upcoming", totalPredictions:3200, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"D4", group:"D", matchday:2, homeTeam:t("TUR","Turquía"), awayTeam:t("PAR","Paraguay"), date:"18 Jun", fullDate:"2026-06-18", time:"21:00", status:"upcoming", totalPredictions:1400, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"D5", group:"D", matchday:3, homeTeam:t("USA","Estados Unidos"), awayTeam:t("PAR","Paraguay"), date:"23 Jun", fullDate:"2026-06-23", time:"21:00", status:"upcoming", totalPredictions:5600, reward:"500 $MUNDIAL", difficulty:"easy" },
  { id:"D6", group:"D", matchday:3, homeTeam:t("TUR","Turquía"), awayTeam:t("AUS","Australia"), date:"23 Jun", fullDate:"2026-06-23", time:"21:00", status:"upcoming", totalPredictions:2100, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP E ═══
  { id:"E1", group:"E", matchday:1, homeTeam:t("GER","Alemania"), awayTeam:t("CUW","Curazao"), date:"14 Jun", fullDate:"2026-06-14", time:"18:00", status:"upcoming", totalPredictions:3800, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"E2", group:"E", matchday:1, homeTeam:t("CIV","Costa de Marfil"), awayTeam:t("ECU","Ecuador"), date:"14 Jun", fullDate:"2026-06-14", time:"21:00", status:"upcoming", totalPredictions:1500, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"E3", group:"E", matchday:2, homeTeam:t("ECU","Ecuador"), awayTeam:t("GER","Alemania"), date:"19 Jun", fullDate:"2026-06-19", time:"15:00", status:"upcoming", totalPredictions:2700, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"E4", group:"E", matchday:2, homeTeam:t("CUW","Curazao"), awayTeam:t("CIV","Costa de Marfil"), date:"19 Jun", fullDate:"2026-06-19", time:"21:00", status:"upcoming", totalPredictions:680, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"E5", group:"E", matchday:3, homeTeam:t("GER","Alemania"), awayTeam:t("CIV","Costa de Marfil"), date:"24 Jun", fullDate:"2026-06-24", time:"18:00", status:"upcoming", totalPredictions:4200, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"E6", group:"E", matchday:3, homeTeam:t("ECU","Ecuador"), awayTeam:t("CUW","Curazao"), date:"24 Jun", fullDate:"2026-06-24", time:"18:00", status:"upcoming", totalPredictions:1100, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP F ═══
  { id:"F1", group:"F", matchday:1, homeTeam:t("NED","Países Bajos"), awayTeam:t("JPN","Japón"), date:"14 Jun", fullDate:"2026-06-14", time:"15:00", status:"upcoming", totalPredictions:4600, reward:"400 $MUNDIAL", difficulty:"hard" },
  { id:"F2", group:"F", matchday:1, homeTeam:t("UKR","Ucrania"), awayTeam:t("TUN","Túnez"), date:"14 Jun", fullDate:"2026-06-14", time:"21:00", status:"upcoming", totalPredictions:1900, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"F3", group:"F", matchday:2, homeTeam:t("JPN","Japón"), awayTeam:t("UKR","Ucrania"), date:"19 Jun", fullDate:"2026-06-19", time:"15:00", status:"upcoming", totalPredictions:2100, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"F4", group:"F", matchday:2, homeTeam:t("TUN","Túnez"), awayTeam:t("NED","Países Bajos"), date:"19 Jun", fullDate:"2026-06-19", time:"21:00", status:"upcoming", totalPredictions:1600, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"F5", group:"F", matchday:3, homeTeam:t("NED","Países Bajos"), awayTeam:t("UKR","Ucrania"), date:"24 Jun", fullDate:"2026-06-24", time:"18:00", status:"upcoming", totalPredictions:3800, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"F6", group:"F", matchday:3, homeTeam:t("TUN","Túnez"), awayTeam:t("JPN","Japón"), date:"24 Jun", fullDate:"2026-06-24", time:"18:00", status:"upcoming", totalPredictions:1300, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP G ═══
  { id:"G1", group:"G", matchday:1, homeTeam:t("BEL","Bélgica"), awayTeam:t("NZL","Nueva Zelanda"), date:"15 Jun", fullDate:"2026-06-15", time:"18:00", status:"upcoming", totalPredictions:2400, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"G2", group:"G", matchday:1, homeTeam:t("EGY","Egipto"), awayTeam:t("IRN","Irán"), date:"15 Jun", fullDate:"2026-06-15", time:"21:00", status:"upcoming", totalPredictions:2200, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"G3", group:"G", matchday:2, homeTeam:t("IRN","Irán"), awayTeam:t("BEL","Bélgica"), date:"20 Jun", fullDate:"2026-06-20", time:"15:00", status:"upcoming", totalPredictions:1900, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"G4", group:"G", matchday:2, homeTeam:t("NZL","Nueva Zelanda"), awayTeam:t("EGY","Egipto"), date:"20 Jun", fullDate:"2026-06-20", time:"21:00", status:"upcoming", totalPredictions:820, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"G5", group:"G", matchday:3, homeTeam:t("BEL","Bélgica"), awayTeam:t("EGY","Egipto"), date:"25 Jun", fullDate:"2026-06-25", time:"18:00", status:"upcoming", totalPredictions:3100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"G6", group:"G", matchday:3, homeTeam:t("IRN","Irán"), awayTeam:t("NZL","Nueva Zelanda"), date:"25 Jun", fullDate:"2026-06-25", time:"18:00", status:"upcoming", totalPredictions:950, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP H ═══
  { id:"H1", group:"H", matchday:1, homeTeam:t("ESP","España"), awayTeam:t("CPV","Cabo Verde"), date:"15 Jun", fullDate:"2026-06-15", time:"15:00", status:"upcoming", totalPredictions:3500, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"H2", group:"H", matchday:1, homeTeam:t("KSA","Arabia Saudita"), awayTeam:t("URU","Uruguay"), date:"15 Jun", fullDate:"2026-06-15", time:"21:00", status:"upcoming", totalPredictions:2100, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"H3", group:"H", matchday:2, homeTeam:t("URU","Uruguay"), awayTeam:t("ESP","España"), date:"20 Jun", fullDate:"2026-06-20", time:"18:00", status:"upcoming", totalPredictions:4800, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"H4", group:"H", matchday:2, homeTeam:t("CPV","Cabo Verde"), awayTeam:t("KSA","Arabia Saudita"), date:"20 Jun", fullDate:"2026-06-20", time:"21:00", status:"upcoming", totalPredictions:720, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"H5", group:"H", matchday:3, homeTeam:t("ESP","España"), awayTeam:t("KSA","Arabia Saudita"), date:"25 Jun", fullDate:"2026-06-25", time:"21:00", status:"upcoming", totalPredictions:5100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"H6", group:"H", matchday:3, homeTeam:t("CPV","Cabo Verde"), awayTeam:t("URU","Uruguay"), date:"25 Jun", fullDate:"2026-06-25", time:"21:00", status:"upcoming", totalPredictions:650, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP I (3 teams) ═══
  { id:"I1", group:"I", matchday:1, homeTeam:t("FRA","Francia"), awayTeam:t("BOL","Bolivia"), date:"16 Jun", fullDate:"2026-06-16", time:"15:00", status:"upcoming", totalPredictions:4100, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"I2", group:"I", matchday:2, homeTeam:t("SEN","Senegal"), awayTeam:t("FRA","Francia"), date:"21 Jun", fullDate:"2026-06-21", time:"15:00", status:"upcoming", totalPredictions:3800, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"I3", group:"I", matchday:3, homeTeam:t("BOL","Bolivia"), awayTeam:t("SEN","Senegal"), date:"26 Jun", fullDate:"2026-06-26", time:"18:00", status:"upcoming", totalPredictions:1100, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP J (2 teams) ═══
  { id:"J1", group:"J", matchday:1, homeTeam:t("ITA","Italia"), awayTeam:t("DEN","Dinamarca"), date:"17 Jun", fullDate:"2026-06-17", time:"21:00", status:"upcoming", totalPredictions:3900, reward:"500 $MUNDIAL", difficulty:"hard" },

  // ═══ GROUP K (2 teams) ═══
  { id:"K1", group:"K", matchday:1, homeTeam:t("ARG","Argentina"), awayTeam:t("CHI","Chile"), date:"17 Jun", fullDate:"2026-06-17", time:"18:00", status:"upcoming", totalPredictions:6200, reward:"500 $MUNDIAL", difficulty:"hard" },

  // ═══ GROUP L ═══
  { id:"L1", group:"L", matchday:1, homeTeam:t("ENG","Inglaterra"), awayTeam:t("CRO","Croacia"), date:"16 Jun", fullDate:"2026-06-16", time:"15:00", status:"upcoming", totalPredictions:4700, reward:"400 $MUNDIAL", difficulty:"hard" },
  { id:"L2", group:"L", matchday:1, homeTeam:t("COL","Colombia"), awayTeam:t("POL","Polonia"), date:"16 Jun", fullDate:"2026-06-16", time:"21:00", status:"upcoming", totalPredictions:2200, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"L3", group:"L", matchday:2, homeTeam:t("CRO","Croacia"), awayTeam:t("COL","Colombia"), date:"21 Jun", fullDate:"2026-06-21", time:"18:00", status:"upcoming", totalPredictions:1800, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"L4", group:"L", matchday:2, homeTeam:t("POL","Polonia"), awayTeam:t("ENG","Inglaterra"), date:"21 Jun", fullDate:"2026-06-21", time:"21:00", status:"upcoming", totalPredictions:3500, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"L5", group:"L", matchday:3, homeTeam:t("ENG","Inglaterra"), awayTeam:t("COL","Colombia"), date:"26 Jun", fullDate:"2026-06-26", time:"18:00", status:"upcoming", totalPredictions:5800, reward:"750 $MUNDIAL", difficulty:"medium" },
  { id:"L6", group:"L", matchday:3, homeTeam:t("CRO","Croacia"), awayTeam:t("POL","Polonia"), date:"26 Jun", fullDate:"2026-06-26", time:"18:00", status:"upcoming", totalPredictions:1400, reward:"750 $MUNDIAL", difficulty:"medium" },
];

export function getMatchesByGroup(groupLetter: string): MatchData[] {
  return allMatches.filter(m => m.group === groupLetter);
}

export function getGroupLetters(): string[] {
  return [...new Set(allMatches.map(m => m.group))].sort();
}

export function getTotalPredictions(): number {
  return allMatches.reduce((sum, m) => sum + m.totalPredictions, 0);
}

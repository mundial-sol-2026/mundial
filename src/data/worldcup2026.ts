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
  JPN:"🇯🇵", SWE:"🇸🇪", TUN:"🇹🇳", BEL:"🇧🇪", EGY:"🇪🇬", IRN:"🇮🇷", NZL:"🇳🇿",
  ESP:"🇪🇸", CPV:"🇨🇻", KSA:"🇸🇦", URU:"🇺🇾", FRA:"🇫🇷", SEN:"🇸🇳", IRQ:"🇮🇶",
  NOR:"🇳🇴", ARG:"🇦🇷", ALG:"🇩🇿", AUT:"🇦🇹", JOR:"🇯🇴", POR:"🇵🇹", COD:"🇨🇩",
  UZB:"🇺🇿", COL:"🇨🇴", ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO:"🇭🇷", GHA:"🇬🇭", PAN:"🇵🇦",
};

function t(code: string, name: string): Team {
  return { name, code, flag: f[code] || "⚽" };
}

// ════════════════════════════════════════
// ALL 12 GROUPS (FIXTURE OFICIAL FIFA 2026)
// ════════════════════════════════════════
export const groups: GroupData[] = [
  { letter: "A", teams: [t("MEX","México"), t("RSA","Sudáfrica"), t("KOR","Corea del Sur"), t("CZE","Chequia")] },
  { letter: "B", teams: [t("CAN","Canadá"), t("BIH","Bosnia y Herz."), t("QAT","Qatar"), t("SUI","Suiza")] },
  { letter: "C", teams: [t("BRA","Brasil"), t("MAR","Marruecos"), t("HAI","Haití"), t("SCO","Escocia")] },
  { letter: "D", teams: [t("USA","Estados Unidos"), t("PAR","Paraguay"), t("AUS","Australia"), t("TUR","Turquía")] },
  { letter: "E", teams: [t("GER","Alemania"), t("CUW","Curazao"), t("CIV","Costa de Marfil"), t("ECU","Ecuador")] },
  { letter: "F", teams: [t("NED","Países Bajos"), t("JPN","Japón"), t("SWE","Suecia"), t("TUN","Túnez")] },
  { letter: "G", teams: [t("BEL","Bélgica"), t("EGY","Egipto"), t("IRN","Irán"), t("NZL","Nueva Zelanda")] },
  { letter: "H", teams: [t("ESP","España"), t("CPV","Cabo Verde"), t("KSA","Arabia Saudita"), t("URU","Uruguay")] },
  { letter: "I", teams: [t("FRA","Francia"), t("SEN","Senegal"), t("IRQ","Irak"), t("NOR","Noruega")] },
  { letter: "J", teams: [t("ARG","Argentina"), t("ALG","Argelia"), t("AUT","Austria"), t("JOR","Jordania")] },
  { letter: "K", teams: [t("POR","Portugal"), t("COD","RD Congo"), t("UZB","Uzbekistán"), t("COL","Colombia")] },
  { letter: "L", teams: [t("ENG","Inglaterra"), t("CRO","Croacia"), t("GHA","Ghana"), t("PAN","Panamá")] },
];

// ════════════════════════════════════════
// Status dinámico calculado en runtime
// ════════════════════════════════════════
type MatchStatus = "upcoming" | "live" | "finished";

function calculateMatchStatus(fullDate: string, time: string): MatchStatus {
  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  const matchDateTime = new Date(`${fullDate}T${time}:00Z`); // UTC
  const matchEnd = new Date(matchDateTime.getTime() + 2 * 60 * 60 * 1000); // ~2h duración
  
  if (now < matchDateTime) return "upcoming";
  if (now >= matchDateTime && now < matchEnd) return "live";
  return "finished";
}

// ════════════════════════════════════════
// ALL 72 GROUP STAGE MATCHES (Datos oficiales FIFA 2026)
// Horarios en UTC para consistencia
// ════════════════════════════════════════
export const allMatches: MatchData[] = [

  // ═══ GROUP A (Mexico) ═══
  { id:"A1", group:"A", matchday:1, homeTeam:t("MEX","México"), awayTeam:t("RSA","Sudáfrica"), date:"11 Jun", fullDate:"2026-06-11", time:"19:00", totalPredictions:3420, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"A2", group:"A", matchday:1, homeTeam:t("KOR","Corea del Sur"), awayTeam:t("CZE","Chequia"), date:"11 Jun", fullDate:"2026-06-11", time:"22:00", totalPredictions:2100, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"A3", group:"A", matchday:2, homeTeam:t("RSA","Sudáfrica"), awayTeam:t("KOR","Corea del Sur"), date:"16 Jun", fullDate:"2026-06-16", time:"16:00", totalPredictions:1800, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"A4", group:"A", matchday:2, homeTeam:t("CZE","Chequia"), awayTeam:t("MEX","México"), date:"16 Jun", fullDate:"2026-06-16", time:"21:00", totalPredictions:2560, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"A5", group:"A", matchday:3, homeTeam:t("MEX","México"), awayTeam:t("KOR","Corea del Sur"), date:"21 Jun", fullDate:"2026-06-21", time:"21:00", totalPredictions:4100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"A6", group:"A", matchday:3, homeTeam:t("RSA","Sudáfrica"), awayTeam:t("CZE","Chequia"), date:"21 Jun", fullDate:"2026-06-21", time:"21:00", totalPredictions:1450, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP B (Canada) ═══
  { id:"B1", group:"B", matchday:1, homeTeam:t("CAN","Canadá"), awayTeam:t("BIH","Bosnia y Herz."), date:"12 Jun", fullDate:"2026-06-12", time:"15:00", totalPredictions:1890, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"B2", group:"B", matchday:1, homeTeam:t("QAT","Qatar"), awayTeam:t("SUI","Suiza"), date:"12 Jun", fullDate:"2026-06-12", time:"19:00", totalPredictions:1230, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"B3", group:"B", matchday:2, homeTeam:t("SUI","Suiza"), awayTeam:t("BIH","Bosnia y Herz."), date:"18 Jun", fullDate:"2026-06-18", time:"19:00", totalPredictions:1650, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"B4", group:"B", matchday:2, homeTeam:t("BIH","Bosnia y Herz."), awayTeam:t("QAT","Qatar"), date:"18 Jun", fullDate:"2026-06-18", time:"22:00", totalPredictions:890, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"B5", group:"B", matchday:3, homeTeam:t("CAN","Canadá"), awayTeam:t("QAT","Qatar"), date:"24 Jun", fullDate:"2026-06-24", time:"19:00", totalPredictions:2200, reward:"500 $MUNDIAL", difficulty:"easy" },
  { id:"B6", group:"B", matchday:3, homeTeam:t("SUI","Suiza"), awayTeam:t("BIH","Bosnia y Herz."), date:"24 Jun", fullDate:"2026-06-24", time:"19:00", totalPredictions:1100, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP C ═══
  { id:"C1", group:"C", matchday:1, homeTeam:t("BRA","Brasil"), awayTeam:t("MAR","Marruecos"), date:"13 Jun", fullDate:"2026-06-13", time:"22:00", totalPredictions:5200, reward:"400 $MUNDIAL", difficulty:"hard" },
  { id:"C2", group:"C", matchday:1, homeTeam:t("HAI","Haití"), awayTeam:t("SCO","Escocia"), date:"13 Jun", fullDate:"2026-06-14", time:"01:00", totalPredictions:3100, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"C3", group:"C", matchday:2, homeTeam:t("SCO","Escocia"), awayTeam:t("MAR","Marruecos"), date:"19 Jun", fullDate:"2026-06-19", time:"22:00", totalPredictions:2800, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"C4", group:"C", matchday:2, homeTeam:t("HAI","Haití"), awayTeam:t("BRA","Brasil"), date:"19 Jun", fullDate:"2026-06-20", time:"00:30", totalPredictions:950, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"C5", group:"C", matchday:3, homeTeam:t("BRA","Brasil"), awayTeam:t("HAI","Haití"), date:"24 Jun", fullDate:"2026-06-24", time:"22:00", totalPredictions:8900, reward:"750 $MUNDIAL", difficulty:"hard" },
  { id:"C6", group:"C", matchday:3, homeTeam:t("MAR","Marruecos"), awayTeam:t("SCO","Escocia"), date:"24 Jun", fullDate:"2026-06-24", time:"22:00", totalPredictions:1200, reward:"750 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP D (USA) ═══
  { id:"D1", group:"D", matchday:1, homeTeam:t("USA","Estados Unidos"), awayTeam:t("PAR","Paraguay"), date:"13 Jun", fullDate:"2026-06-13", time:"01:00", totalPredictions:4500, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"D2", group:"D", matchday:1, homeTeam:t("AUS","Australia"), awayTeam:t("TUR","Turquía"), date:"13 Jun", fullDate:"2026-06-14", time:"04:00", totalPredictions:1800, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"D3", group:"D", matchday:2, homeTeam:t("USA","Estados Unidos"), awayTeam:t("AUS","Australia"), date:"19 Jun", fullDate:"2026-06-19", time:"19:00", totalPredictions:3200, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"D4", group:"D", matchday:2, homeTeam:t("TUR","Turquía"), awayTeam:t("PAR","Paraguay"), date:"19 Jun", fullDate:"2026-06-20", time:"03:00", totalPredictions:1400, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"D5", group:"D", matchday:3, homeTeam:t("PAR","Paraguay"), awayTeam:t("AUS","Australia"), date:"26 Jun", fullDate:"2026-06-26", time:"02:00", totalPredictions:5600, reward:"500 $MUNDIAL", difficulty:"easy" },
  { id:"D6", group:"D", matchday:3, homeTeam:t("TUR","Turquía"), awayTeam:t("USA","Estados Unidos"), date:"26 Jun", fullDate:"2026-06-26", time:"02:00", totalPredictions:2100, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP E ═══
  { id:"E1", group:"E", matchday:1, homeTeam:t("GER","Alemania"), awayTeam:t("CUW","Curazao"), date:"14 Jun", fullDate:"2026-06-14", time:"17:00", totalPredictions:3800, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"E2", group:"E", matchday:1, homeTeam:t("CIV","Costa de Marfil"), awayTeam:t("ECU","Ecuador"), date:"14 Jun", fullDate:"2026-06-14", time:"23:00", totalPredictions:1500, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"E3", group:"E", matchday:2, homeTeam:t("GER","Alemania"), awayTeam:t("CIV","Costa de Marfil"), date:"20 Jun", fullDate:"2026-06-20", time:"20:00", totalPredictions:2700, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"E4", group:"E", matchday:2, homeTeam:t("CUW","Curazao"), awayTeam:t("ECU","Ecuador"), date:"20 Jun", fullDate:"2026-06-21", time:"00:00", totalPredictions:680, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"E5", group:"E", matchday:3, homeTeam:t("CUW","Curazao"), awayTeam:t("CIV","Costa de Marfil"), date:"25 Jun", fullDate:"2026-06-25", time:"20:00", totalPredictions:4200, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"E6", group:"E", matchday:3, homeTeam:t("ECU","Ecuador"), awayTeam:t("GER","Alemania"), date:"25 Jun", fullDate:"2026-06-25", time:"20:00", totalPredictions:1100, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP F (Países Bajos, Japón, Suecia, Túnez) ═══
  { id:"F1", group:"F", matchday:1, homeTeam:t("NED","Países Bajos"), awayTeam:t("JPN","Japón"), date:"14 Jun", fullDate:"2026-06-14", time:"20:00", totalPredictions:4600, reward:"400 $MUNDIAL", difficulty:"hard" },
  { id:"F2", group:"F", matchday:1, homeTeam:t("SWE","Suecia"), awayTeam:t("TUN","Túnez"), date:"14 Jun", fullDate:"2026-06-15", time:"02:00", totalPredictions:1900, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"F3", group:"F", matchday:2, homeTeam:t("NED","Países Bajos"), awayTeam:t("SWE","Suecia"), date:"20 Jun", fullDate:"2026-06-20", time:"17:00", totalPredictions:2100, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"F4", group:"F", matchday:2, homeTeam:t("TUN","Túnez"), awayTeam:t("JPN","Japón"), date:"20 Jun", fullDate:"2026-06-21", time:"04:00", totalPredictions:1600, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"F5", group:"F", matchday:3, homeTeam:t("JPN","Japón"), awayTeam:t("SWE","Suecia"), date:"25 Jun", fullDate:"2026-06-25", time:"23:00", totalPredictions:3800, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"F6", group:"F", matchday:3, homeTeam:t("TUN","Túnez"), awayTeam:t("NED","Países Bajos"), date:"25 Jun", fullDate:"2026-06-25", time:"23:00", totalPredictions:1300, reward:"500 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP G ═══
  { id:"G1", group:"G", matchday:1, homeTeam:t("BEL","Bélgica"), awayTeam:t("EGY","Egipto"), date:"15 Jun", fullDate:"2026-06-15", time:"19:00", totalPredictions:2400, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"G2", group:"G", matchday:1, homeTeam:t("IRN","Irán"), awayTeam:t("NZL","Nueva Zelanda"), date:"15 Jun", fullDate:"2026-06-16", time:"01:00", totalPredictions:2200, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"G3", group:"G", matchday:2, homeTeam:t("BEL","Bélgica"), awayTeam:t("IRN","Irán"), date:"21 Jun", fullDate:"2026-06-21", time:"19:00", totalPredictions:1900, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"G4", group:"G", matchday:2, homeTeam:t("NZL","Nueva Zelanda"), awayTeam:t("EGY","Egipto"), date:"21 Jun", fullDate:"2026-06-22", time:"01:00", totalPredictions:820, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"G5", group:"G", matchday:3, homeTeam:t("EGY","Egipto"), awayTeam:t("IRN","Irán"), date:"27 Jun", fullDate:"2026-06-27", time:"03:00", totalPredictions:3100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"G6", group:"G", matchday:3, homeTeam:t("NZL","Nueva Zelanda"), awayTeam:t("BEL","Bélgica"), date:"27 Jun", fullDate:"2026-06-27", time:"03:00", totalPredictions:950, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP H ═══
  { id:"H1", group:"H", matchday:1, homeTeam:t("ESP","España"), awayTeam:t("CPV","Cabo Verde"), date:"15 Jun", fullDate:"2026-06-15", time:"16:00", totalPredictions:3500, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"H2", group:"H", matchday:1, homeTeam:t("KSA","Arabia Saudita"), awayTeam:t("URU","Uruguay"), date:"15 Jun", fullDate:"2026-06-15", time:"22:00", totalPredictions:2100, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"H3", group:"H", matchday:2, homeTeam:t("ESP","España"), awayTeam:t("KSA","Arabia Saudita"), date:"21 Jun", fullDate:"2026-06-21", time:"16:00", totalPredictions:4800, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"H4", group:"H", matchday:2, homeTeam:t("URU","Uruguay"), awayTeam:t("CPV","Cabo Verde"), date:"21 Jun", fullDate:"2026-06-21", time:"22:00", totalPredictions:720, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"H5", group:"H", matchday:3, homeTeam:t("CPV","Cabo Verde"), awayTeam:t("KSA","Arabia Saudita"), date:"27 Jun", fullDate:"2026-06-27", time:"00:00", totalPredictions:5100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"H6", group:"H", matchday:3, homeTeam:t("URU","Uruguay"), awayTeam:t("ESP","España"), date:"27 Jun", fullDate:"2026-06-27", time:"00:00", totalPredictions:650, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP I (Francia, Senegal, Irak, Noruega) ═══
  { id:"I1", group:"I", matchday:1, homeTeam:t("FRA","Francia"), awayTeam:t("SEN","Senegal"), date:"16 Jun", fullDate:"2026-06-16", time:"19:00", totalPredictions:4100, reward:"400 $MUNDIAL", difficulty:"easy" },
  { id:"I2", group:"I", matchday:1, homeTeam:t("IRQ","Irak"), awayTeam:t("NOR","Noruega"), date:"16 Jun", fullDate:"2026-06-16", time:"22:00", totalPredictions:2800, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"I3", group:"I", matchday:2, homeTeam:t("FRA","Francia"), awayTeam:t("IRQ","Irak"), date:"22 Jun", fullDate:"2026-06-22", time:"21:00", totalPredictions:3800, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"I4", group:"I", matchday:2, homeTeam:t("NOR","Noruega"), awayTeam:t("SEN","Senegal"), date:"22 Jun", fullDate:"2026-06-23", time:"00:00", totalPredictions:1100, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"I5", group:"I", matchday:3, homeTeam:t("NOR","Noruega"), awayTeam:t("FRA","Francia"), date:"26 Jun", fullDate:"2026-06-26", time:"19:00", totalPredictions:5100, reward:"500 $MUNDIAL", difficulty:"medium" },
  { id:"I6", group:"I", matchday:3, homeTeam:t("SEN","Senegal"), awayTeam:t("IRQ","Irak"), date:"26 Jun", fullDate:"2026-06-26", time:"19:00", totalPredictions:650, reward:"500 $MUNDIAL", difficulty:"easy" },

  // ═══ GROUP J (Argentina, Argelia, Austria, Jordania) ═══
  { id:"J1", group:"J", matchday:1, homeTeam:t("ARG","Argentina"), awayTeam:t("ALG","Argelia"), date:"17 Jun", fullDate:"2026-06-17", time:"01:00", totalPredictions:6200, reward:"500 $MUNDIAL", difficulty:"hard" },
  { id:"J2", group:"J", matchday:1, homeTeam:t("AUT","Austria"), awayTeam:t("JOR","Jordania"), date:"17 Jun", fullDate:"2026-06-17", time:"04:00", totalPredictions:2100, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"J3", group:"J", matchday:2, homeTeam:t("ARG","Argentina"), awayTeam:t("AUT","Austria"), date:"22 Jun", fullDate:"2026-06-22", time:"17:00", totalPredictions:4200, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"J4", group:"J", matchday:2, homeTeam:t("JOR","Jordania"), awayTeam:t("ALG","Argelia"), date:"22 Jun", fullDate:"2026-06-23", time:"03:00", totalPredictions:890, reward:"350 $MUNDIAL", difficulty:"easy" },
  { id:"J5", group:"J", matchday:3, homeTeam:t("ALG","Argelia"), awayTeam:t("AUT","Austria"), date:"28 Jun", fullDate:"2026-06-28", time:"02:00", totalPredictions:5800, reward:"750 $MUNDIAL", difficulty:"medium" },
  { id:"J6", group:"J", matchday:3, homeTeam:t("JOR","Jordania"), awayTeam:t("ARG","Argentina"), date:"28 Jun", fullDate:"2026-06-28", time:"02:00", totalPredictions:1400, reward:"750 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP K (Portugal, RD Congo, Uzbekistán, Colombia) ═══
  { id:"K1", group:"K", matchday:1, homeTeam:t("POR","Portugal"), awayTeam:t("COD","RD Congo"), date:"17 Jun", fullDate:"2026-06-17", time:"17:00", totalPredictions:4700, reward:"400 $MUNDIAL", difficulty:"hard" },
  { id:"K2", group:"K", matchday:1, homeTeam:t("UZB","Uzbekistán"), awayTeam:t("COL","Colombia"), date:"17 Jun", fullDate:"2026-06-18", time:"02:00", totalPredictions:2200, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"K3", group:"K", matchday:2, homeTeam:t("POR","Portugal"), awayTeam:t("UZB","Uzbekistán"), date:"23 Jun", fullDate:"2026-06-23", time:"17:00", totalPredictions:1800, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"K4", group:"K", matchday:2, homeTeam:t("COL","Colombia"), awayTeam:t("COD","RD Congo"), date:"23 Jun", fullDate:"2026-06-24", time:"02:00", totalPredictions:3500, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"K5", group:"K", matchday:3, homeTeam:t("COL","Colombia"), awayTeam:t("POR","Portugal"), date:"27 Jun", fullDate:"2026-06-27", time:"23:30", totalPredictions:5800, reward:"750 $MUNDIAL", difficulty:"medium" },
  { id:"K6", group:"K", matchday:3, homeTeam:t("COD","RD Congo"), awayTeam:t("UZB","Uzbekistán"), date:"27 Jun", fullDate:"2026-06-27", time:"23:30", totalPredictions:1400, reward:"750 $MUNDIAL", difficulty:"medium" },

  // ═══ GROUP L (Inglaterra, Croacia, Ghana, Panamá) ═══
  { id:"L1", group:"L", matchday:1, homeTeam:t("ENG","Inglaterra"), awayTeam:t("CRO","Croacia"), date:"17 Jun", fullDate:"2026-06-17", time:"20:00", totalPredictions:4700, reward:"400 $MUNDIAL", difficulty:"hard" },
  { id:"L2", group:"L", matchday:1, homeTeam:t("GHA","Ghana"), awayTeam:t("PAN","Panamá"), date:"17 Jun", fullDate:"2026-06-17", time:"23:00", totalPredictions:2200, reward:"400 $MUNDIAL", difficulty:"medium" },
  { id:"L3", group:"L", matchday:2, homeTeam:t("ENG","Inglaterra"), awayTeam:t("GHA","Ghana"), date:"23 Jun", fullDate:"2026-06-23", time:"20:00", totalPredictions:1800, reward:"350 $MUNDIAL", difficulty:"medium" },
  { id:"L4", group:"L", matchday:2, homeTeam:t("PAN","Panamá"), awayTeam:t("CRO","Croacia"), date:"23 Jun", fullDate:"2026-06-23", time:"23:00", totalPredictions:3500, reward:"350 $MUNDIAL", difficulty:"hard" },
  { id:"L5", group:"L", matchday:3, homeTeam:t("CRO","Croacia"), awayTeam:t("GHA","Ghana"), date:"27 Jun", fullDate:"2026-06-27", time:"21:00", totalPredictions:5800, reward:"750 $MUNDIAL", difficulty:"medium" },
  { id:"L6", group:"L", matchday:3, homeTeam:t("PAN","Panamá"), awayTeam:t("ENG","Inglaterra"), date:"27 Jun", fullDate:"2026-06-27", time:"21:00", totalPredictions:1400, reward:"750 $MUNDIAL", difficulty:"medium" },
];

// Función que agrega el status dinámico
export function getMatchesWithStatus(): (MatchData & { status: MatchStatus })[] {
  return allMatches.map(match => ({
    ...match,
    status: calculateMatchStatus(match.fullDate, match.time)
  }));
}

export function getMatchesByGroup(groupLetter: string): MatchData[] {
  return allMatches.filter(m => m.group === groupLetter);
}

export function getGroupLetters(): string[] {
  return [...new Set(allMatches.map(m => m.group))].sort();
}

export function getTotalPredictions(): number {
  return allMatches.reduce((sum, m) => sum + m.totalPredictions, 0);
}

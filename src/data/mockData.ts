export interface Gate {
  id: string
  label: string
  stand: string
  capacity: number
  section: string
}

export interface FoodItem {
  id: string
  name: string
  price: number
  category: string
  emoji: string
}

export interface IPLTeam {
  id: string
  name: string
  short: string
  primary: string
  secondary: string
  emoji: string
  tagline: string
}

export interface Match {
  id: string
  homeTeam: IPLTeam
  awayTeam: IPLTeam
  venue: string
  date: string
  time: string
  score?: { home: string; away: string }
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED'
  ticketCode?: string
}

export const IPL_TEAMS: IPLTeam[] = [
  { id: 'MI',   name: 'Mumbai Indians',             short: 'MI',   primary: '#004B8D', secondary: '#FFD141', emoji: '💙', tagline: 'Duniya Hila Denge' },
  { id: 'CSK',  name: 'Chennai Super Kings',        short: 'CSK',  primary: '#F9CD05', secondary: '#1D418C', emoji: '💛', tagline: 'Whistle Podu' },
  { id: 'RCB',  name: 'Royal Challengers Bengaluru',short: 'RCB',  primary: '#E63329', secondary: '#C9920E', emoji: '❤️', tagline: 'Ee Sala Cup Namde' },
  { id: 'KKR',  name: 'Kolkata Knight Riders',      short: 'KKR',  primary: '#3A225D', secondary: '#F7D54E', emoji: '💜', tagline: 'Korbo Lorbo Jeetbo' },
  { id: 'DC',   name: 'Delhi Capitals',              short: 'DC',   primary: '#2561AE', secondary: '#D71921', emoji: '🔵', tagline: 'Dil Walon Ki Dilli' },
  { id: 'RR',   name: 'Rajasthan Royals',            short: 'RR',   primary: '#E60693', secondary: '#254AA5', emoji: '🌸', tagline: 'Halla Bol' },
  { id: 'PBKS', name: 'Punjab Kings',                short: 'PBKS', primary: '#DD1F2D', secondary: '#F2D1A0', emoji: '❤️', tagline: 'Sadda Punjab' },
  { id: 'SRH',  name: 'Sunrisers Hyderabad',         short: 'SRH',  primary: '#EE7429', secondary: '#FCCB11', emoji: '🧡', tagline: 'Orange Army' },
  { id: 'LSG',  name: 'Lucknow Super Giants',        short: 'LSG',  primary: '#0057E2', secondary: '#FECC00', emoji: '💙', tagline: 'Nakko Darao' },
  { id: 'GT',   name: 'Gujarat Titans',              short: 'GT',   primary: '#1B2133', secondary: '#DBBE6E', emoji: '🔷', tagline: 'Aava Do' },
]

export const getTeam = (id: string) => IPL_TEAMS.find(t => t.id === id)!

export const INITIAL_GATES: Gate[] = [
  { id: 'A', label: 'Gate A', stand: 'North Stand',        capacity: 72, section: 'N1–N8'   },
  { id: 'B', label: 'Gate B', stand: 'North-East Stand',   capacity: 45, section: 'NE1–NE6' },
  { id: 'C', label: 'Gate C', stand: 'East Stand',         capacity: 28, section: 'E1–E10'  },
  { id: 'D', label: 'Gate D', stand: 'South-East Stand',   capacity: 61, section: 'SE1–SE8' },
  { id: 'E', label: 'Gate E', stand: 'South Stand',        capacity: 83, section: 'S1–S12'  },
  { id: 'F', label: 'Gate F', stand: 'South-West Stand',   capacity: 35, section: 'SW1–SW6' },
  { id: 'G', label: 'Gate G', stand: 'West Stand',         capacity: 19, section: 'W1–W10'  },
  { id: 'H', label: 'Gate H', stand: 'North-West Stand',   capacity: 54, section: 'NW1–NW8' },
]

const MI  = IPL_TEAMS[0]
const CSK = IPL_TEAMS[1]
const RCB = IPL_TEAMS[2]
const KKR = IPL_TEAMS[3]
const DC  = IPL_TEAMS[4]
const SRH = IPL_TEAMS[7]

export const MOCK_MATCHES: Match[] = [
  {
    id: 'match1',
    homeTeam: MI,
    awayTeam: RCB,
    venue: 'Wankhede Stadium, Mumbai',
    date: 'Today · May 3',
    time: '7:30 PM IST',
    score: { home: '186/4 (18.2)', away: 'Yet to bat' },
    status: 'LIVE',
    ticketCode: 'WK2026-MI01',
  },
  {
    id: 'match2',
    homeTeam: CSK,
    awayTeam: KKR,
    venue: 'MA Chidambaram Stadium, Chennai',
    date: 'May 10',
    time: '3:30 PM IST',
    status: 'UPCOMING',
    ticketCode: 'MA2026-CSK05',
  },
  {
    id: 'match3',
    homeTeam: DC,
    awayTeam: SRH,
    venue: 'Arun Jaitley Stadium, Delhi',
    date: 'May 12',
    time: '7:30 PM IST',
    status: 'UPCOMING',
  },
]

export const LIVE_MATCH = MOCK_MATCHES[0]

export const MOCK_SEAT = {
  section: 'W',
  row: 12,
  seat: 7,
  gate: 'G',
  stand: 'West Stand',
}

export const FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Vada Pav',         price: 80,  category: 'Snacks',    emoji: '🫓' },
  { id: '2', name: 'Pav Bhaji',         price: 120, category: 'Snacks',    emoji: '🥘' },
  { id: '3', name: 'Samosa (2 pcs)',    price: 60,  category: 'Snacks',    emoji: '🥟' },
  { id: '4', name: 'Cold Drink (500ml)',price: 50,  category: 'Beverages', emoji: '🥤' },
  { id: '5', name: 'Water Bottle',      price: 30,  category: 'Beverages', emoji: '💧' },
  { id: '6', name: 'Ice Cream Cup',     price: 70,  category: 'Desserts',  emoji: '🍨' },
  { id: '7', name: 'Popcorn (Large)',   price: 100, category: 'Snacks',    emoji: '🍿' },
  { id: '8', name: 'Biryani Box',       price: 180, category: 'Meals',     emoji: '🍱' },
]

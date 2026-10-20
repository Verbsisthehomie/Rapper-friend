import { LcarsEra } from '../../types/lcars';

export interface LcarsThemeConfig {
  id: LcarsEra;
  name: string;
  subsystemCode: string;
  primary: string; // Key visual color
  secondary: string; // Header accents / buttons
  accent: string; // Highlighting
  auxiliary: string; // Secondary telemetry
  neutral: string; // Labels & subtle telemetry
  alert: string; // Red alert / warnings
  bgDark: string;
  panelBg: string;
  borderStroke: string;
}

/**
 * Canon Star Trek LCARS theme configurations derived directly from
 * www.thelcars.com (Jim Robertus LCARS-26 standards)
 */
export const LCARS_THEMES: Record<LcarsEra, LcarsThemeConfig> = {
  tng: {
    id: 'tng',
    name: '2360s TNG / NCC-1701-D',
    subsystemCode: 'SYS-2364.7',
    primary: '#eb943a', // thelcars.com --orange
    secondary: '#fcc19f', // thelcars.com --almond-creme
    accent: '#baa4e5', // thelcars.com --african-violet
    auxiliary: '#8899ff', // thelcars.com --bluey
    neutral: '#d29b7f', // thelcars.com --almond
    alert: '#cf4f4f', // thelcars.com --red
    bgDark: '#000000',
    panelBg: '#0f1118',
    borderStroke: '#eb943a',
  },
  voyager: {
    id: 'voyager',
    name: '2370s VOYAGER / DS9',
    subsystemCode: 'VOY-74656.4',
    primary: '#ffbb33', // thelcars.com --command-gold
    secondary: '#55a7ff', // thelcars.com --andorian-blue
    accent: '#828cad', // thelcars.com --silver
    auxiliary: '#2288ff', // thelcars.com --science-blue
    neutral: '#bec2cf', // thelcars.com --luna
    alert: '#ff3300', // thelcars.com --red-alert
    bgDark: '#05070a',
    panelBg: '#0f141d',
    borderStroke: '#828cad',
  },
  nemesis: {
    id: 'nemesis',
    name: '2379 NEMESIS BLUE',
    subsystemCode: 'E-E-SOV-1701E',
    primary: '#2266ff', // thelcars.com --evening
    secondary: '#6699ff', // thelcars.com --cool
    accent: '#d1a16c', // thelcars.com --wheat
    auxiliary: '#88bbff', // thelcars.com --ghost
    neutral: '#52526a', // thelcars.com --galaxy-gray
    alert: '#da2537', // thelcars.com --cardinal
    bgDark: '#02050e',
    panelBg: '#080f24',
    borderStroke: '#2266ff',
  },
  lowerdecks: {
    id: 'lowerdecks',
    name: 'LOWER DECKS CERRITOS',
    subsystemCode: 'NCC-75567',
    primary: '#ff7700', // thelcars.com --orange
    secondary: '#ffaa44', // thelcars.com --harvestgold
    accent: '#ffcc99', // thelcars.com --honey
    auxiliary: '#ff9911', // thelcars.com --daybreak
    neutral: '#ffeecc', // thelcars.com --butter
    alert: '#ff4400', // thelcars.com --october-sunset
    bgDark: '#000000',
    panelBg: '#13110d',
    borderStroke: '#ff7700',
  },
  ldpadd: {
    id: 'ldpadd',
    name: 'LOWER DECKS PADD',
    subsystemCode: 'PADD-75567-LD',
    primary: '#5588ee', // thelcars.com --alpha-blue
    secondary: '#7799dd', // thelcars.com --beta-blue
    accent: '#66ccff', // thelcars.com --arctic-ice
    auxiliary: '#88eeff', // thelcars.com --radioactive
    neutral: '#455580', // thelcars.com --night-rain
    alert: '#ff3300', // thelcars.com --sunset-red
    bgDark: '#050914',
    panelBg: '#0e1628',
    borderStroke: '#5588ee',
  },
  picard: {
    id: 'picard',
    name: '25th CENTURY PICARD',
    subsystemCode: 'TITAN-NCC-80102',
    primary: '#e7442a', // thelcars.com --orange-red
    secondary: '#ff6753', // thelcars.com --light-orange-red
    accent: '#41c4f7', // thelcars.com --bright-blue
    auxiliary: '#37a6d1', // thelcars.com --blue
    neutral: '#9ea5ba', // thelcars.com --light-gray
    alert: '#ff977b', // thelcars.com --pale-orange-red
    bgDark: '#050406',
    panelBg: '#130d12',
    borderStroke: '#41c4f7',
  },
};

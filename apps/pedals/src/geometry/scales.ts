// Data → pixel mapping for the scatter plot.
// Margins are a touch roomier than the original artifact so markers breathe.
export const W = 1000;
export const H = 680;
export const M = { L: 72, R: 32, T: 40, B: 72 } as const;
export const MARKER_R = 11;

export const px = (clip: number): number => M.L + (clip / 10) * (W - M.L - M.R);
export const py = (gain: number): number => H - M.B - (gain / 10) * (H - M.T - M.B);

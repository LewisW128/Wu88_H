// The one mock member ("Jessica") every logged-in page shows. There's no real
// account system yet, so her level lives here instead of being retyped per page
// -- Figma's Reward Center reference frame (657:18891) is this member at Lv.8,
// 700 of 1,500 exp, 10,000 continuous deposit.
export const MEMBER_LEVEL = 8;
export const MEMBER_EXP = 700;
export const MEMBER_MAX_EXP = 1500;
export const MEMBER_CONTINUOUS_DEPOSIT = "10,000";
export const MEMBER_LEVEL_LABEL = `Lv.${MEMBER_LEVEL}`;
// Level badges are colored by bracket; Lv.8 is the site's brand green, the same
// #23f3d5 as this member's avatar ring.
export const MEMBER_LEVEL_COLOR = "#23f3d5";

// Her wallet balance, shown on TopUp (compact), the profile's balance card, the
// wallet page and the top-up modal, so they all agree.
export const MEMBER_BALANCE = 10_000_000;
export const MEMBER_BALANCE_TEXT = MEMBER_BALANCE.toLocaleString("en-US");
// "10M" style for the tight TopUp pill.
export const MEMBER_BALANCE_COMPACT =
  MEMBER_BALANCE >= 1_000_000 ? `${+(MEMBER_BALANCE / 1_000_000).toFixed(2)}M` : MEMBER_BALANCE >= 1_000 ? `${+(MEMBER_BALANCE / 1_000).toFixed(1)}K` : String(MEMBER_BALANCE);

// Lifetime ledger behind that balance. The balance is not an independent number
// -- it has to equal what came in minus what went out:
//
//   balance = deposits - withdrawals + net profit + rebate
//
// so the 投注紀錄 cards and the wallet stats are derived from it rather than
// typed in separately:
// - 累計儲值 / 累計託售 / 累計返水 are the inputs;
// - 總獲利 (net profit: payouts minus stakes) is what makes the balance add up;
// - 總投注 follows from the rebate, which is a flat share of everything staked.
export const MEMBER_TOTAL_DEPOSIT = 3_000_000;
export const MEMBER_TOTAL_WITHDRAW = 2_500_000;
export const MEMBER_TOTAL_REBATE = 3_480_000;
export const REBATE_RATE = 0.01;
export const MEMBER_TOTAL_PROFIT = MEMBER_BALANCE - MEMBER_TOTAL_DEPOSIT + MEMBER_TOTAL_WITHDRAW - MEMBER_TOTAL_REBATE;
export const MEMBER_TOTAL_BET = Math.round(MEMBER_TOTAL_REBATE / REBATE_RATE);
// Share of rounds won -- a real percentage (never above 100), a bit over half
// since the member is up overall.
export const MEMBER_WIN_RATE = 52;
// Her single biggest round, as it appears in the home page's 玩家排名 list and
// the win ticker: a win of this size on this stake (so its odds are win/bet),
// well inside her lifetime profit. Ranked by win amount against the other
// players' rows it lands 6th, which is what the profile's 排名 card shows --
// keep the two in step if either is changed.
export const MEMBER_BEST_BET = 1_000;
export const MEMBER_BEST_WIN = 1_500_000;
export const MEMBER_RANK = 6;
// Today's game income / outlay, both already included in the balance above.
export const MEMBER_TODAY_INCOME = 8_200;
export const MEMBER_TODAY_EXPENSE = 1_500;

export const formatMoney = (n: number) => n.toLocaleString("en-US");

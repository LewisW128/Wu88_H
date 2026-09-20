"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import DayRewards from "./DayRewards";
import FavoriteGamesEmpty from "./FavoriteGamesEmpty";
import { useFavorites } from "./FavoritesProvider";
import Footer from "./Footer";
import GeneralGames from "./GeneralGames";
import GuestPromoCard from "./GuestPromoCard";
import Language from "./Language";
import MinPanelHeight from "./MinPanelHeight";
import ProfileCard from "./ProfileCard";
import { type PromotionCardProps } from "./PromotionCard";
import Promotions from "./Promotions";
import QuickLinks from "./QuickLinks";
import ScaleToFit from "./ScaleToFit";
import Search from "./Search";
import ProfileSidebar from "./ProfileSidebar";
import SocialLinks from "./SocialLinks";
import Statistics from "./Statistics";
import StickyUtilityBar from "./StickyUtilityBar";
import TalkingBar from "./TalkingBar";
import TopBar from "./TopBar";
import TopUp from "./TopUp";
import RewardVipCard, { VIP_CARD_CRYSTAL_IMAGE } from "./RewardVipCard";
import { ALL_GAMES } from "../lib/games";
import { topBarAnnouncements, talkingBarMessages, talkingBarSimulatedMessages, talkingBarFriends } from "../lib/chatMockData";

// Figma "Promotions" (node 451:18295, seen live at 428:17332): same 優惠活動
// row as the homepage's own -- one Large countdown card plus three General
// cards.
const promotions: (PromotionCardProps & { key: string })[] = [
  {
    key: "usdt",
    size: "Large",
    image: "/assets/promotions/large-usdt.png",
    lines: ["新會員首儲『贈』", "200,000"],
    countdown: { days: "08", hours: "08", minutes: "12", seconds: "32" },
  },
  { key: "rebate", size: "General", image: "/assets/promotions/rebate.png", lines: ["ＵＳＤＴ返利無上限", "每筆加碼贈 20%"] },
  { key: "store", size: "General", image: "/assets/promotions/convenience-store.png", lines: ["超商儲值禮", "送 G-CLASS"] },
  { key: "wheel", size: "General", image: "/assets/promotions/wheel.png", lines: ["天天轉 8,888", "武財神風輪盤"] },
];

// `isGuest` follows the same shared AuthProvider state TopUp's own avatar/
// hover view reacts to (not a local flag) -- logging in via TopUp's popup
// now updates this page's content too, wherever you logged in from.
// Previously `isGuest` only ever looked at the `?guest=1` URL param, so
// logging in here left everything below TopUp stuck showing the guest view
// even after a successful login.
//
// `?guest=1` (passed down as `forceGuest`) still exists as a quick way to
// land on this page already logged out without using the sidebar's own
// 登出 button first. It logs out ON LOAD (once, via the effect below)
// rather than pinning guest permanently, so a real login started from this
// same page still takes effect live instead of being silently overridden
// by the param that got you here.
//
// Figma's guest page keeps the same row order as logged-in, just with
// different content per row: 電子遊戲推薦 becomes "收藏的遊戲" (node
// 455:23414) -- reused here for BOTH the guest empty state and a logged-in
// member who hasn't liked anything yet (`favoritedGames.length === 0`),
// since neither has anything real to show there; a logged-in member who
// has liked something sees an actual GeneralGames grid instead, filtered
// to just those titles (see `favoritedGames` below and ProductCard/
// FavoritesProvider's own comments). 投注紀錄 keeps its 4-card layout but
// shows placeholder "---"/"0" values (node 459:85252) instead of real
// numbers, and 優惠活動 is unchanged -- it's generic marketing content,
// not member data, so it shows for guests exactly as logged-in.
export default function ProfileContent({ forceGuest }: { forceGuest: boolean }) {
  const { loggedIn, setLoggedIn } = useAuth();

  useEffect(() => {
    if (forceGuest) setLoggedIn(false);
    // Only ever meant to apply once, from the URL this page was loaded
    // with -- not re-run if `setLoggedIn` itself changes identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceGuest]);

  const isGuest = !loggedIn;

  const { liked } = useFavorites();
  const favoritedGames = ALL_GAMES.filter((game) => liked.has(game.title));

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
        </div>

        <div className="sticky top-[38px] left-0 z-30 h-0">
          <div
            className="pointer-events-none size-[60px]"
            style={{ background: "radial-gradient(circle at 100% 100%, transparent 60px, #f4f4f4 60px)" }}
          />
        </div>

        {/* No Container_BG on this page -- Figma's own page frame (node
            428:17332) has no hero instance at all, unlike home/casino/
            sports. Content starts right below the utility row. */}
        <div className="relative rounded-tl-[60px] bg-white">
          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            {/* top-[58px] matches StickyUtilityBar/TalkingBar's own sticky
                offset (Top_bar's 38px height + the 20px gap below it) --
                previously top-[79px], ~20px lower than either, which left
                ProfileSidebar's own back button visibly sitting below the
                search/language/儲值 row and TalkingBar's channel switch
                instead of level with them. */}
            <div className="sticky top-[58px] z-10 self-start justify-self-start pl-[30px]">
              <ProfileSidebar />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp />
              </StickyUtilityBar>

              {/* `items-end`, not `items-start`: Figma has these two cards at
                  different heights (ProfileCard 303px vs its sibling's
                  236px) but the SAME bottom edge (76+303 = 143+236 = 379) --
                  the sibling's own top sits 67px lower than ProfileCard's,
                  not shorter-and-top-aligned. Guest pairs ProfileCard with
                  GuestPromoCard (node 595:15300, seen live at 455:23317) --
                  new since the last pass here, previously ProfileCard just
                  spanned the row alone -- with a wider 32px gap than the
                  logged-in ProfileCard/VipCard pairing's usual 20px
                  (614+594+32=1240 vs 614+614+20=1248, both approximating
                  this page's own ~1249px content width; Figma's own
                  numbers, not rounded to match each other). Despite
                  sharing its exact countdown copy with the Promotions
                  row's own "usdt" entry, GuestPromoCard is its own
                  component, not a PromotionCard reuse -- see its own
                  comment for why. */}
              <div className={`flex w-full items-end ${isGuest ? "gap-[32px]" : "gap-[20px]"}`}>
                {isGuest ? (
                  <>
                    <ProfileCard loggedIn={false} />
                    <GuestPromoCard />
                  </>
                ) : (
                  <>
                    <ProfileCard loggedIn avatar="/assets/profile/avatar-placeholder.png" name="JESSICA" email="JESSICA123@gmail.com" memberId="1234567890" />
                    <RewardVipCard level={8} currentExp={700} maxExp={1500} continuousDeposit="10,000" crystalImage={VIP_CARD_CRYSTAL_IMAGE} className="flex-1" />
                  </>
                )}
              </div>

              {/* Figma (node 601:14802, seen live at 428:17332) only shows
                  this 7-day login-streak row on the logged-in page -- the
                  guest page's own frame (455:23317) has no such instance,
                  which tracks: there's nothing to have logged in 7 days
                  straight for yet. DayRewards gates itself on the shared
                  AuthProvider state now (it's reused on /promotions too,
                  which has no isGuest of its own to check), so this just
                  renders it unconditionally. */}
              <DayRewards />

              {isGuest || favoritedGames.length === 0 ? (
                <FavoriteGamesEmpty />
              ) : (
                <GeneralGames games={favoritedGames} title="收藏的遊戲" icon="/assets/section-header/icon-favorite-games.svg" />
              )}

              <Statistics
                guest={isGuest}
                balance={isGuest ? "---" : "10,000,000"}
                stats={
                  isGuest
                    ? [
                        { icon: "/assets/statistics/icon-diamond.svg", value: "---", label: "總投注" },
                        { icon: "/assets/statistics/icon-win.svg", value: "---", label: "總獲利" },
                        { icon: "/assets/statistics/icon-trophy.svg", value: "---", label: "排名" },
                        { icon: "/assets/statistics/icon-fraction.svg", value: "---", label: "平均勝率" },
                      ]
                    : [
                        { icon: "/assets/statistics/icon-diamond.svg", value: "10,000", label: "總投注" },
                        { icon: "/assets/statistics/icon-win.svg", value: "10,000,000", label: "總獲利" },
                        { icon: "/assets/statistics/icon-trophy.svg", value: "6", label: "排名" },
                        { icon: "/assets/statistics/icon-fraction.svg", value: "100,000%", label: "平均勝率" },
                      ]
                }
              />

              <Promotions promotions={promotions} />

              {/* 80px above this row (Figma node 455:23317: Promotions
                  bottom at y=1266, this row at y=1346), not the column's
                  shared gap-[25px] every other pair uses -- same +55px
                  bump home/promotions already apply above their own
                  SocialLinks/QuickLinks row. */}
              <div className="mt-[55px] flex items-center justify-between">
                <SocialLinks />
                <QuickLinks />
              </div>

              <Footer />
            </div>

            <div className="sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar
                messages={talkingBarMessages}
                friends={talkingBarFriends}
                simulatedMessages={talkingBarSimulatedMessages}
              />
            </div>
          </MinPanelHeight>
        </div>
      </ScaleToFit>
    </div>
  );
}

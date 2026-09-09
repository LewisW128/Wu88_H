"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import Footer from "./Footer";
import Language from "./Language";
import MinPanelHeight from "./MinPanelHeight";
import ProfileSidebar from "./ProfileSidebar";
import ScaleToFit from "./ScaleToFit";
import Search from "./Search";
import StickyUtilityBar from "./StickyUtilityBar";
import TalkingBar, { type Friend } from "./TalkingBar";
import type { TalkSectionProps } from "./TalkSection";
import TopBar from "./TopBar";
import TopUp from "./TopUp";
import { withBasePath } from "../lib/asset";

// Same group chat / friend list data as every other page's TalkingBar --
// not a trimmed-down version. There's only one chat, not a separate one
// per page.
const talkingBarMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "嗨～！剛剛進來玩", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "有什麼好玩的呢？有誰可以推薦嗎？", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "我剛剛才中了時二十萬出來",
    variant: "other",
    replyTo: { name: "Jessica", text: "有什麼好玩的呢？有誰可以推薦嗎？" },
  },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "真的假的，這麼容易嗎？", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "真的啊～趕快去試試！",
    variant: "other",
  },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "你玩哪個遊戲？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "3 分鐘前", text: "XXX電子 射龍門", variant: "other" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "剛剛輸慘了 IOI", variant: "other" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "你玩什麼？",
    variant: "other",
  },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "XXX 真人", variant: "other" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "拍拍 多下幾注就會贏回來了",
    variant: "other",
  },
];

const talkingBarFriends: Friend[] = [
  {
    id: "jackson",
    name: "@ Jackson",
    avatar: "/assets/talk-section/avatar-jackson.png",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    status: "online",
    timestamp: "3 分鐘前",
    lastMessage: "剛剛那個遊戲的連結可以給我嗎？",
    messages: [
      { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)", timestamp: "5 分鐘前", text: "嗨，方便私訊聊嗎？", variant: "other" },
      { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "4 分鐘前", text: "可以啊，怎麼了？", variant: "myself" },
      { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)", timestamp: "3 分鐘前", text: "剛剛那個遊戲的連結可以給我嗎？", variant: "other" },
    ],
  },
  {
    id: "johnny",
    name: "@ Johnny",
    avatar: "/assets/talk-section/avatar-johnny.png",
    levelLabel: "Lv.79",
    levelBackground: "#79d4a2",
    status: "away",
    timestamp: "10 分鐘前",
    lastMessage: "XXX電子 射龍門，一起來",
    messages: [
      { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "12 分鐘前", text: "在嗎？想約你打幾把", variant: "other" },
      { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "11 分鐘前", text: "在啊，玩什麼？", variant: "myself" },
      { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "10 分鐘前", text: "XXX電子 射龍門，一起來", variant: "other" },
    ],
  },
  {
    id: "arick",
    name: "@ Arick",
    avatar: "/assets/talk-section/avatar-arick.png",
    levelLabel: "Lv.53",
    levelBackground: "#ffcf00",
    status: "offline",
    timestamp: "1 小時前",
    messages: [],
  },
];

// The dot-grid decoration behind the header card's diagonal ribbons
// (Figma "Ellipse 2" repeated 36 times in a plain 6x6 grid) -- built as
// CSS dots rather than downloading and re-laying-out 36 copies of a
// 4px circle SVG.
function DotGrid() {
  return (
    <div className="flex flex-col items-end gap-[7.75px]">
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="flex items-center gap-[7.75px]">
          {Array.from({ length: 6 }).map((_, col) => (
            <div key={col} className="size-[3.875px] shrink-0 rounded-full bg-[#3e4140]" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Figma "Information kit" (Components Library node 312:2261, seen live
// throughout node 106:10667): a label + value pair, with a trailing edit
// pencil for fields that actually have an edit affordance. 手機/信箱 in
// Figma's own 安全與隱私 card have neither -- muted #dadada text and no
// icon at all, matching how they're masked (0912***7890) rather than
// editable -- so `editable` also swaps the value's own color, not just
// whether the pencil renders.
function InfoRow({ label, value, editable = true }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex w-full flex-col items-start gap-[10px]">
      <p className="w-full whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{label}</p>
      <div className="relative h-[32px] w-full">
        <p
          className={`absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] ${editable ? "text-[#3e4140]" : "text-[#dadada]"}`}
        >
          {value}
        </p>
        {editable && (
          <button type="button" aria-label={`編輯${label}`} className="absolute right-0 top-[3.5px] size-[25px]">
            <img alt="" src={withBasePath("/assets/account/icon-edit.svg")} className="size-full" />
          </button>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px] text-[#3e4140]">{children}</p>;
}

// Figma "Profile_informations_topbar" (05_WU88-H-PC-Profile-Page node
// 272:7824, seen live at node 106:10667's own 帳戶設定 page): a 142px
// header card -- avatar/name/ID/VIP row over a plain white background
// carrying two decorative layers (header-shape.svg's diagonal ribbons,
// bleeding off the top-right corner; the dot grid tucked into the
// bottom-right). Distinct from ProfileCard/VipCard's own header treatment
// elsewhere on /profile -- this page's own single combined card, not a
// two-card pairing.
function AccountHeader() {
  return (
    <div className="relative h-[142px] w-full overflow-hidden rounded-[20px] border-2 border-[#f4f4f4] bg-white">
      <div className="absolute right-0 top-0 h-[198px] w-[583px] overflow-hidden">
        <img alt="" src={withBasePath("/assets/account/header-shape.svg")} className="absolute -right-[124px] -top-[230px] h-[499px] w-[607px]" />
      </div>
      <div className="absolute bottom-[40px] right-[20px]">
        <DotGrid />
      </div>

      <div className="absolute left-[18px] top-1/2 flex -translate-y-1/2 items-center gap-[20px]">
        <div className="size-[98px] shrink-0 overflow-hidden rounded-full border-2 border-[#23f3d5]">
          <img alt="" src={withBasePath("/assets/profile/avatar-placeholder.png")} className="size-full object-cover" />
        </div>
        <div className="flex w-[327px] flex-col items-start gap-[10px]">
          <p className="min-w-full truncate text-[20px] font-black leading-[32px] tracking-[0.35px] text-[#3e4140]">@ JESSICA</p>
          <div className="flex items-center gap-[20px]">
            <p className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[0.15px] text-[#a2a2a2]">ID 20260612</p>
            <button type="button" className="flex items-center justify-center gap-[10px] rounded-[20px] bg-[#3e4140] px-[10px] py-[5px]">
              <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">VIP Lv.13</span>
              <img alt="" src={withBasePath("/assets/account/icon-chevron-right.svg")} className="size-[25px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Figma "MacBook Pro 16' - 14" (05_WU88-H-PC-Profile-Page node 106:10667):
// the account-settings sub-page, reached from ProfileSidebar's own 個人資訊
// icon (previously mislabeled 投注紀錄, and previously decorative -- no
// page existed yet; the rail's separate 帳戶設定 icon is a different,
// still-unbuilt destination, not this page). Shares /profile's own page
// shell (ScaleToFit/
// TopBar/ProfileSidebar/TalkingBar/Footer, the same 164px/1fr/295px grid)
// since Figma's own frame reuses that exact rail/chat-panel pairing, not
// a bespoke layout.
//
// All values here are static mock content, matching this project's
// established "no real backend" pattern (TopUp's 儲值, ProfileCard's
// 註冊, etc.) -- the edit pencils and VIP/dropdown chevrons are
// decorative, not wired to any real edit flow.
//
// Unlike DayRewards/Statistics (which stay on the page and swap to a
// placeholder look for guests), this whole page only makes sense once
// you're actually logged in -- there's no guest variant in Figma, and
// showing "JESSICA"'s real personal info to a guest would be wrong
// regardless of how it's styled. Guests get bounced to /profile instead
// of seeing a flash of this content first.
export default function AccountSettings() {
  const { loggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) router.replace("/profile");
  }, [loggedIn, router]);

  if (!loggedIn) return null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar
            onlineCount="900"
            totalReward="10,000,000"
            announcements={[
              { name: "Jessica", amount: "USDT10,000,000" },
              { name: "Jackson", amount: "USDT9,000,000" },
              { name: "Alex", amount: "USDT800,000" },
            ]}
          />
        </div>

        <div className="sticky top-[38px] left-0 z-30 h-0">
          <div
            className="pointer-events-none size-[60px]"
            style={{ background: "radial-gradient(circle at 100% 100%, transparent 60px, #f4f4f4 60px)" }}
          />
        </div>

        <div className="relative rounded-tl-[60px] bg-white">
          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            {/* top-[58px], matching StickyUtilityBar/TalkingBar's own
                sticky offset -- see ProfileContent's own comment on this
                same fix. */}
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

              <div className="mt-[40px] flex w-full flex-col items-start gap-[40px]">
                <AccountHeader />

                <div className="flex w-full flex-col items-start gap-[25px]">
                  <div className="flex w-full flex-col items-start gap-[20px]">
                    <SectionTitle>安全與隱私</SectionTitle>
                    <div className="grid w-full grid-cols-2 gap-[20px] rounded-[20px] bg-white p-[20px]">
                      <InfoRow label="手機" value="0912***7890" editable={false} />
                      <div />
                      <InfoRow label="信箱" value="nickolas@gmail.com" editable={false} />
                      <div />
                      <InfoRow label="帳戶密碼" value="＊＊＊＊＊＊＊＊" />
                      <InfoRow label="託售密碼" value="＊＊＊＊＊＊＊＊" />
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-start gap-[20px]">
                    <div className="flex w-full flex-col items-start gap-[20px]">
                      <SectionTitle>帳戶</SectionTitle>
                      <div className="grid w-full grid-cols-2 gap-[20px] rounded-[20px] bg-white p-[20px]">
                        <InfoRow label="帳號" value="Mikamiyua12345" />
                        <InfoRow label="戶名" value="未填寫" />
                        <div className="col-span-2">
                          <InfoRow label="暱稱" value="欠錢不還因為沒錢還" />
                        </div>
                        <div className="col-span-2">
                          <InfoRow label="出生日期" value="1999 / 01 / 04" />
                        </div>
                        <InfoRow label="地址" value="台北市信義區市府路 1 號" />
                      </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-[20px] rounded-[20px] bg-white p-[20px]">
                      <InfoRow label="語系切換" value="繁體中文" />
                      <InfoRow label="時區設定" value="GMT +08:00" />
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </div>

            <div className="sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar messages={talkingBarMessages} friends={talkingBarFriends} />
            </div>
          </MinPanelHeight>
        </div>
      </ScaleToFit>
    </div>
  );
}

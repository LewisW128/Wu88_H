import Link from "next/link";
import { withBasePath } from "../lib/asset";

export type TopUpProps = {
  account: string;
};

// Figma "TopUp" component (Components Library, Hover=off at node 750:8076,
// Hover=on at node 750:8115). Collapsed: just the placeholder avatar circle
// (plain gray-bordered outline icon, unrelated to the VIP Avatar component
// elsewhere) and a notification bell. On hover it expands to reveal the
// account handle, a purple "註冊" (sign up) button and a green "登入"
// (log in) button, then a divider before the bell. Since Figma only gives
// two static snapshots (collapsed / expanded), the expansion itself is
// built as a real width transition -- a grid-template-columns 0fr->1fr
// animation, which can animate to an unknown natural width smoothly (a
// plain width/max-width transition can't without hardcoding a guessed px
// value).
//
// The avatar circle links to /profile (per request) even in this
// logged-out state -- there's no real auth here to gate it behind, and
// QuickLinks' own 會員中心 pill already points there the same way.
//
// The pill's own bg-[#f4f4f4] and backdrop-blur are plain and permanent
// in both Figma states -- not something that fades with scroll position.
//
// No `gap` on the outer flex: with 3 children where the middle one
// collapses to a real 0px wide box (not just visually hidden), `gap`
// still reserves its full width on BOTH sides of that box -- doubling
// up into 76px of dead space at rest instead of the 38px Figma actually
// specifies between the avatar and the bell. Margins on the two OUTER
// children instead (38px at rest, 20px on hover, matching the two
// states' own gap value) give exactly one gap's worth of space at rest,
// since the collapsed middle child contributes nothing between them.
export default function TopUp({ account }: TopUpProps) {
  return (
    <div className="group flex h-[65px] items-center rounded-[50px] bg-[#f4f4f4] p-[15px] backdrop-blur-[15px]">
      <div className="mr-[38px] flex shrink-0 items-center gap-[10px] transition-[margin] duration-300 group-hover:mr-[20px]">
        <Link
          href="/profile"
          aria-label="會員中心"
          className="relative size-[34px] shrink-0 overflow-hidden rounded-full border-2 border-[#3e4140] bg-white"
        >
          <img
            alt=""
            src={withBasePath("/assets/top-up/avatar-icon.svg")}
            className="absolute inset-[calc(18.64%-1.25px)_calc(7.63%-1.69px)_calc(-3.39%-2.14px)_calc(7.63%-1.69px)] block size-full max-w-none"
          />
        </Link>

        <p className="hidden whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-[#a2a2a2] group-hover:block">
          {`@ ${account}`}
        </p>
      </div>

      <div className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 group-hover:grid-cols-[1fr]">
        <div className="flex items-center gap-[20px] overflow-hidden">
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              className="flex h-[40px] items-center justify-between gap-[10px] rounded-[15px] bg-[#8d54d8] p-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-white">註冊</span>
              <img alt="" src={withBasePath("/assets/top-up/arrow-register.svg")} className="size-[25px]" />
            </button>

            <button
              type="button"
              className="flex h-[40px] items-center justify-between gap-[10px] rounded-[15px] bg-[#23f3d5] p-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">登入</span>
              <img alt="" src={withBasePath("/assets/top-up/arrow-topup.svg")} className="size-[25px]" />
            </button>
          </div>

          <img alt="" src={withBasePath("/assets/top-up/divider.svg")} className="h-[2px] w-[16px] shrink-0 rotate-90" />
        </div>
      </div>

      <img
        alt="notifications"
        src={withBasePath("/assets/top-up/notify-icon.svg")}
        className="ml-0 size-[25px] shrink-0 transition-[margin] duration-300 group-hover:ml-[20px]"
      />
    </div>
  );
}

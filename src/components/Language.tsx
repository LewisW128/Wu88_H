import { withBasePath } from "../lib/asset";

export type LanguageProps = {
  label?: string;
};

// Figma "Language" component (Components Library node 635:4317). A frosted
// pill showing the current language with a chevron -- static display only,
// no dropdown variant exists in the source file.
export default function Language({ label = "繁體" }: LanguageProps) {
  return (
    <div className="flex h-[65px] w-[127px] shrink-0 items-center justify-between rounded-[50px] bg-[#f4f4f4] px-[21px] py-[19px] backdrop-blur-[15px]">
      <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{label}</p>
      <img alt="" src={withBasePath("/assets/language/arrow.svg")} className="size-[25px]" />
    </div>
  );
}

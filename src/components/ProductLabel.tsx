export type ProductLabelType = "NEW" | "WU88" | "HOT";

const GRADIENT_WU88 =
  "linear-gradient(-27deg, rgb(1,250,176) 19.4%, rgb(20,232,184) 1%, rgb(72,186,206) 33.1%, rgb(154,113,241) 83%, rgb(182,90,253) 98.7%, rgb(141,84,216) 159.1%, rgb(111,79,189) 211.6%, rgb(100,78,179) 243.1%)";

// Figma "Lebal" component (Components Library, style=ProductState). Three
// fixed variants: red/white HOT, yellow-green/dark NEW, gradient/white WU88.
export default function ProductLabel({ type }: { type: ProductLabelType }) {
  const isNew = type === "NEW";
  const isWu88 = type === "WU88";
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-clip rounded-full px-[5px] py-[2px] ${
        isWu88 ? "" : isNew ? "bg-[#e2ff25]" : "bg-[#e80800]"
      }`}
      style={isWu88 ? { backgroundImage: GRADIENT_WU88 } : undefined}
    >
      <p className={`whitespace-nowrap text-[10px] font-bold leading-[18px] tracking-[0.15px] ${isNew ? "text-[#3e4140]" : "text-white"}`}>
        {isWu88 ? "WU88" : isNew ? "NEW" : "HOT"}
      </p>
    </div>
  );
}

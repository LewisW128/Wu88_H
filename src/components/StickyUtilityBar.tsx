// A plain sticky positioning wrapper for the Search/Language/Top_up row --
// no background of its own, and no scroll-triggered state. It used to
// flip an opaque white fill on once scrolling carried the hero-associated
// zone (hero art, Form Bar, Hot Games) out of view, on the idea that
// transparent icons floating over General Games/etc. below would look
// unfinished. That was never actually part of the spec: this row is sticky
// from scroll position 0, same as Top_bar/Sidebar/Talking_Bar, and each
// child owns its own look the whole time -- Top_up and Language are their
// own permanently-opaque pills (see their own components), Search has no
// background at all. Nothing here should "activate" partway down the page.
export default function StickyUtilityBar({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-[38px] z-10 flex items-center justify-between pt-[21px]">{children}</div>;
}

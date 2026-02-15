import React from "react";

type BottomBarItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
};

type BottomBarProps = {
  items: BottomBarItem[];
  activeId?: string;
  className?: string;
  safeArea?: boolean; // adds extra padding for iOS home indicator
};

export default function BottomBar({
  items,
  activeId,
  className = "",
  safeArea = true,
}: BottomBarProps) {
  return (
    <nav
      className={[
        "fixed inset-x-0 bottom-0 z-50", //"fixed" makes the position:fixed inset-x-0 makes it stuck all the way to the left and the right. bottom-0 makes it all the way on the bottom and z-50 is the index layer, makes it in front of everything.
        "border-t border-slate-200 bg-white/90 backdrop-blur", // border-t makes a line on the top of the nav, border-slate colors it. bg-white/90 makes it 90% white, a little see-through and backdrop-blur blurs the area around it.
        safeArea ? "pb-[env(safe-area-inset-bottom)]" : "", // makes the bottom bar not interfere with safe areas on moblie phones. That makes sure that all of the items on the bottom bar are visible and click-able.
        className,
      ].join(" ")} // A way of formatting the CSS tailwind styles. Makes it easy to add and remove styles.
      aria-label="Bottom navigation" // Makes it so that users that use screen readers, the screen reader reads "Bottom navigation" instead of just "Navigation"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-2">
        {" "}
        {/*mx-auto makes everything centered horizontally, flex uses flexbox. */}
        {items.map((item) => {
          const isActive = item.id === activeId;
          const base =
            "group flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition";
          const active = isActive
            ? "text-slate-900"
            : "text-slate-500 hover:text-slate-900";
          const disabled = item.disabled
            ? "opacity-40 pointer-events-none"
            : "";

          const content = (
            <>
              <span
                className={[
                  "grid h-8 w-8 place-items-center rounded-lg transition",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-slate-200",
                ].join(" ")}
                aria-hidden="true"
              >
                {item.icon ?? <DefaultDotIcon />}
              </span>
              <span className="leading-none text-lg">{item.label}</span>
              <span
                className={[
                  "mt-1 h-1 w-13 rounded-full transition",
                  isActive
                    ? "bg-slate-900"
                    : "bg-transparent group-hover:bg-slate-200",
                ].join(" ")}
                aria-hidden="true"
              />
            </>
          );

          const commonProps = {
            className: [base, active, disabled].join(" "),
            "aria-current": isActive ? ("page" as const) : undefined,
            "aria-disabled": item.disabled ? true : undefined,
          };

          // Prefer href when provided; otherwise use button
          return (
            <li key={item.id} className="flex w-full">
              {item.href ? (
                <a href={item.href} {...commonProps}>
                  {content}
                </a>
              ) : (
                <button type="button" onClick={item.onClick} {...commonProps}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DefaultDotIcon() {
  return <span className="block h-2 w-2 rounded-full bg-current" />;
}

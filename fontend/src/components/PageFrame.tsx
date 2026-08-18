import { type ReactNode } from "react";
import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";
import { Atmosphere } from "./Atmosphere";

interface PageFrameProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  appTheme: AppTheme;
  weatherTheme: WeatherTheme;
  children: ReactNode;
  trailing?: ReactNode;
}

export function PageFrame({
  title,
  subtitle,
  isOpen,
  isClosing,
  onClose,
  appTheme,
  weatherTheme,
  children,
  trailing,
}: PageFrameProps) {
  const ui = getUi(appTheme);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        animation: isClosing
          ? "pageSlideOut 0.22s ease-in forwards"
          : "pageSlideIn 0.36s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <Atmosphere theme={weatherTheme} appTheme={appTheme} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className={`sticky top-0 z-20 backdrop-blur-xl ${ui.light ? "bg-white/35" : "bg-[#071410]/45"}`}>
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 pt-4 pb-3">
            <button
              onClick={onClose}
              className={`-ml-2 rounded-full p-2 transition-all ${ui.text} ${ui.invertBtn}`}
              aria-label="Go back"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <div className={`truncate text-base font-medium tracking-wide ${ui.text}`}>{title}</div>
              {subtitle && <div className={`truncate text-xs font-light ${ui.muted}`}>{subtitle}</div>}
            </div>
            {trailing}
          </div>
          <div className={`h-px ${ui.hairline}`} />
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-3xl px-4 pb-14 pt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

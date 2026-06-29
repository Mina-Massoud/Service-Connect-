"use client";

import type { ReactNode } from "react";
import { IPhoneMockup } from "react-device-mockup";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Centers the app inside a modern device frame on desktop (react-device-mockup,
 * iPhone 15 Pro style with a Dynamic Island) and renders full-bleed on mobile.
 *
 * `hideStatusBar` lets our own <StatusBar/> own the top of the screen while the
 * library overlays the Dynamic Island on top of it. The library renders the
 * home-indicator swipe bar below our content automatically.
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-page md:p-10">
      {/* Mobile: full-bleed */}
      <div className="relative flex min-h-screen w-full max-w-[420px] flex-col bg-background md:hidden">
        {children}
      </div>

      {/* Desktop: framed device */}
      <div className="hidden md:block">
        <IPhoneMockup
          screenWidth={375}
          screenType="island"
          frameColor="#1d1d1f"
          statusbarColor="#ffffff"
          hideStatusBar
        >
          <div className="relative flex h-full w-full flex-col bg-background">
            {children}
          </div>
        </IPhoneMockup>
      </div>
    </div>
  );
}

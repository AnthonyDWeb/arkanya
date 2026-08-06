import type { ReactNode } from "react";
import { NotificationScheduler } from "@/components/notifications";
import { AppUpdateWatcher } from "@/components/updates";
import { AppHeader } from "./AppHeader";
import { PrivacyFooterLink } from "./PrivacyFooterLink";
import { NestedRouteBackLink } from "./NestedRouteBackLink";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <NotificationScheduler />
      <AppUpdateWatcher />
      <AppHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
        <NestedRouteBackLink />
        {children}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-6 text-center text-xs text-slate-500">
        ArkCare aide au suivi et ne remplace ni un avis médical ni les instructions d’un
        professionnel de santé. En cas de doute, contactez votre professionnel de santé.
        <PrivacyFooterLink />
      </footer>
    </div>
  );
}

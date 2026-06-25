import { PageShell } from "@/components/dashboard/page-shell"
import { SettingsTabs } from "@/components/settings/settings-tabs"

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Manage your clinic profile, team, and billing preferences."
    >
      <SettingsTabs />
    </PageShell>
  )
}

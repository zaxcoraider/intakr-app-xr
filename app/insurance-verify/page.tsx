import { PageShell } from "@/components/dashboard/page-shell"
import { InsuranceVerify } from "@/components/insurance/insurance-verify"

export default function InsuranceVerifyPage() {
  return (
    <PageShell
      title="Insurance Verify"
      description="Look up patient policies and confirm coverage before appointments."
    >
      <InsuranceVerify />
    </PageShell>
  )
}

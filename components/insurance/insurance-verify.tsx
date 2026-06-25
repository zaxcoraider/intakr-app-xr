"use client"

import { useState } from "react"
import { Search, ShieldCheck, Layers, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Result = {
  policy: string
  status: string
  provider: string
  coverage: string
  deductible: string
  copay: string
  network: string
}

export function InsuranceVerify() {
  const [policy, setPolicy] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!policy.trim()) return
    setLoading(true)
    setResult(null)
    // Simulated verification lookup
    setTimeout(() => {
      setResult({
        policy: policy.trim().toUpperCase(),
        status: "Verified",
        provider: "BlueCross",
        coverage: "80%",
        deductible: "$500",
        copay: "$25",
        network: "In-Network",
      })
      setLoading(false)
    }, 900)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Lookup panel */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Look up Policy</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter a policy number to verify coverage in real time.
          </p>
          <form onSubmit={handleLookup} className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="e.g. BC-4471-22"
                className="pl-9"
                aria-label="Policy number"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  Look up Policy
                </>
              )}
            </Button>
          </form>

          <div className="my-5 h-px bg-border" />

          <h3 className="text-sm font-semibold text-foreground">Bulk actions</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Verify all pending policies from today&apos;s intake queue at once.
          </p>
          <Button variant="outline" className="mt-3 w-full bg-transparent">
            <Layers className="size-4" />
            Run Batch Verification
          </Button>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        {result ? (
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Policy {result.policy}</p>
                  <p className="text-xs text-muted-foreground">{result.provider}</p>
                </div>
              </div>
              <Badge className="border-transparent bg-accent text-accent-foreground">
                {result.status}
              </Badge>
            </div>
            <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
              <DetailCell label="Status" value={result.status} />
              <DetailCell label="Provider" value={result.provider} />
              <DetailCell label="Coverage" value={result.coverage} />
              <DetailCell label="Deductible" value={result.deductible} />
              <DetailCell label="Co-pay" value={result.copay} />
              <DetailCell label="Network" value={result.network} />
            </dl>
          </Card>
        ) : (
          <Card className="flex h-full min-h-[18rem] flex-col items-center justify-center p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <ShieldCheck className="size-6" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">No policy verified yet</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Enter a policy number on the left and run a lookup to see coverage details here.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-6 py-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
    </div>
  )
}

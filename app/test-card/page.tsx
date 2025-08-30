import { SimpleCard } from "@/components/simple-card"

export default function TestCardPage() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Simple Card Test</h1>
      <SimpleCard title="Henderson Golf Simulator" subtitle="£38,000 / £45,000 budget" />
    </div>
  )
}

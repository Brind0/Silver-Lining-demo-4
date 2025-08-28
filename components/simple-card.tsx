interface SimpleCardProps {
  title: string
  subtitle: string
}

export function SimpleCard({ title, subtitle }: SimpleCardProps) {
  return (
    <div
      className="bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-4 shadow-md"
      style={{
        width: "300px",
        height: "120px",
      }}
    >
      <h3 className="font-bold text-base text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  )
}

import { PopulationRecord } from "@/types/population";

export function DataTable(data: PopulationRecord) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-foreground/20 text-left">
            <th className="py-2 pr-4">Location</th>
            <th className="py-2 pr-4">Variant</th>
            <th className="py-2 pr-4">Year</th>
            <th className="py-2 pr-4 text-right">Male (thousands)</th>
            <th className="py-2 pr-4 text-right">Female (thousands)</th>
            <th className="py-2 pr-4 text-right">Total (thousands)</th>
            <th className="py-2 text-right">Density</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 100).map((row) => (
            <tr
              key={row.ID}
              className="border-b border-foreground/10 hover:bg-foreground/5"
            >
              <td className="py-1.5 pr-4">{row.Location}</td>
              <td className="py-1.5 pr-4">{row.Variant}</td>
              <td className="py-1.5 pr-4">{row.Time}</td>
              <td className="py-1.5 pr-4 text-right">
                {row.PopMale?.toLocaleString()}
              </td>
              <td className="py-1.5 pr-4 text-right">
                {row.PopFemale?.toLocaleString()}
              </td>
              <td className="py-1.5 pr-4 text-right">
                {row.PopTotal?.toLocaleString()}
              </td>
              <td className="py-1.5 text-right">
                {row.PopDensity?.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 100 && (
        <p className="mt-4 text-sm text-foreground/50">
          Showing first 100 of {data.length} records
        </p>
      )}
    </div>
  );
}

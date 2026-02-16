import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  const countries = new Set<string>();

  const { data, error } = await supabaseClient
    .from("DemographicIndicators")
    .select("Location")
    .eq("Time", "2025");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const row of data) {
    countries.add(row.Location);
  }

  return NextResponse.json([...countries].sort());
}

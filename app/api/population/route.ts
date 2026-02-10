import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location")

  let query = supabase.from("Pop5YearGroup").select("*").eq("Time", "2026")

  if (location) {
    query = query.eq("Location", location)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

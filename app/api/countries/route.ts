import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");
  const time = request.nextUrl.searchParams.get("time");

  let query = supabase
    .from("TotalPopBySex")
    .select("*")
    .eq("Variant", "Constant mortality")
    .order("Time", { ascending: true });

  if (location) {
    query = query.eq("Location", location);
  }

  if (time) {
    query = query.eq("Time", time);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

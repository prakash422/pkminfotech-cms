import { NextResponse } from "next/server"
import { getChooseYourExamItems } from "@/lib/choose-your-exam"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = getChooseYourExamItems()
    return NextResponse.json({ data })
  } catch (e) {
    console.error("choose-your-exam API error:", e)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

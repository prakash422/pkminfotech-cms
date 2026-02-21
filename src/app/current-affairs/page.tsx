import { redirect } from "next/navigation"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

/** Redirect old /current-affairs to /daily-current-affairs (avoids [slug] conflict) */
export default async function CurrentAffairsRedirectPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = params.page || "1"
  redirect(page === "1" ? "/daily-current-affairs" : `/daily-current-affairs?page=${page}`)
}

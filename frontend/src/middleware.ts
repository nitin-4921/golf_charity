import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Note: Client-side storage is not accessible in edge middleware easily
  // We handle specific redirection in the client components for role-based access
  // But we can check for the presence of a token if we use cookies.
  // For now, we'll keep it simple and handle it in the Page components.
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/dashboard/:path*'],
}

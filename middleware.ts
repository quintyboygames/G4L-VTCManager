import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import AppConfig from './models/AppConfig';

export function middleware(request: NextRequest) {
  if (!request.cookies.get('vtcm_session'))
    return NextResponse.redirect(new URL('/login', request.url));

  let url = AppConfig.server_url + 'api/webapp/check';

  fetch(url, { headers: new Headers({ 'Authorization': 'Bearer ' + atob(request.cookies.get('vtcm_session')), 'Accept': 'application/json' }) }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }).then(authResult => {
    if (!authResult["id"]) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }).catch(e => {
    return NextResponse.redirect(new URL('/login', request.url));
  });
}

export const config = {
  matcher: ['/company/:path*', '/job/:path*', '/companies', '/dashboard', '/logbook', '/logout'],
}
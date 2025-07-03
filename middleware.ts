import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
    console.log(request.nextUrl)
    //   const token = request.cookies.get('auth_token')?.value;
    //   const currentPath = request.nextUrl.pathname;

    //   // Check if it's a dashboard route
    //   const dashboardMatch = currentPath.match(/^\/dashboard\/([^\/]+)\/([^\/]+)/);

    //   if (dashboardMatch) {
    //     const [, roleFromUrl, idFromUrl] = dashboardMatch;

    //     // Check if user is authenticated
    //     if (!token) {
    //       return NextResponse.redirect(new URL('/', request.url));
    //     }

    //     try {
    //       // Decode and validate JWT
    //       const decoded = jwtDecode<JWTPayload>(token);

    //       // Check if token is expired
    //       if (decoded.exp < Date.now() / 1000) {
    //         const response = NextResponse.redirect(new URL('/login', request.url));
    //         response.cookies.delete('auth_token');
    //         return response;
    //       }

    //       // Validate role access
    //       if (decoded.role !== roleFromUrl) {
    //         console.log(`Role mismatch: ${decoded.role} !== ${roleFromUrl}`);
    //         return NextResponse.redirect(new URL(`/dashboard/${decoded.role}/${decoded.userId}`, request.url));
    //       }

    //       // Validate ID access (users can only access their own dashboard)
    //       if (decoded.userId !== idFromUrl) {
    //         console.log(`ID mismatch: ${decoded.userId} !== ${idFromUrl}`);
    //         return NextResponse.redirect(new URL(`/dashboard/${decoded.role}/${decoded.userId}`, request.url));
    //       }

    //       // Set user info in headers for the page component
    //       const requestHeaders = new Headers(request.headers);
    //       requestHeaders.set('x-user-id', decoded.userId);
    //       requestHeaders.set('x-user-role', decoded.role);

    //       return NextResponse.next({
    //         request: {
    //           headers: requestHeaders,
    //         },
    //       });

    //     } catch (error) {
    //       console.error('Token validation error:', error);
    //       const response = NextResponse.redirect(new URL('/login', request.url));
    //       response.cookies.delete('auth_token');
    //       return response;
    //     }
    //   }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};
// ENV keys
export const BASE_URI = process.env.NEXT_PUBLIC_API_URL;

// API keys
export const VERSION = '/api';
export const AUTH_TOKEN_KEY = 'CliniTrackToken';
export const API_TIMEOUT = 30000 

// Redux persist keys
export const REDUX_PERSIST_KEY = 'root';



// export const ROUTES = {
//   HOME: '/',
//   WATCH: '/watch',
//   SEARCH: '/search',
//   TRENDING: '/trending',
//   SUBSCRIPTIONS: '/subscriptions',
//   LIBRARY: '/library',
//   HISTORY: '/library/history',
//   WATCH_LATER: '/library/watch-later',
//   LIKED_VIDEOS: '/library/liked-videos',
//   CHANNEL: '/channel',
// } as const

// export const VIDEO_CATEGORIES = [
//   'All',
//   'Music',
//   'Gaming',
//   'Movies',
//   'News',
//   'Sports',
//   'Technology',
//   'Comedy',
//   'Education',
//   'Entertainment',
//   'How-to & Style',
//   'Science & Technology',
//   'Travel & Events',
// ] as const

// export const SIDEBAR_ITEMS = [
//   { name: 'Home', icon: 'Home', href: ROUTES.HOME },
//   { name: 'Trending', icon: 'TrendingUp', href: ROUTES.TRENDING },
//   { name: 'Subscriptions', icon: 'Users', href: ROUTES.SUBSCRIPTIONS },
//   { name: 'Library', icon: 'Library', href: ROUTES.LIBRARY },
//   { name: 'History', icon: 'History', href: ROUTES.HISTORY },
//   { name: 'Watch Later', icon: 'Clock', href: ROUTES.WATCH_LATER },
//   { name: 'Liked Videos', icon: 'ThumbsUp', href: ROUTES.LIKED_VIDEOS },
// ] as const
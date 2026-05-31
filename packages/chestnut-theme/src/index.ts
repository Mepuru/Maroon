// Types
export type {
  SiteConfig,
  ThemeConfig,
  NavItem,
} from './types/site';
export type {
  SeriesConfig,
  SeriesData,
  SortField,
  SortOrder,
} from './types/series';
export type {
  BlogPost,
  PostCardProps,
  PostData,
} from './types/blog';
export type {
  HeroProps,
  SeriesSectionProps,
  SeriesCardProps,
  SidebarProps,
} from './types/components';

// Utils
export { formatDate } from './utils/date';
export { estimateReadingTime } from './utils/reading-time';
export { themes, defaultTheme } from './utils/themes';
export type { Theme } from './utils/themes';

// Styles — imported for side effects when needed
// import './styles/global.css';

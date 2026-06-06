// Types
export type {
  SiteConfig,
  ThemeConfig,
  NavItem,
  RoutesConfig,
} from './types/site';
export type {
  SeriesConfig,
  SeriesData,
  SortField,
  SortOrder,
} from './types/series';
export type {
  PostCardProps,
  PostData,
} from './types/blog';

// Components
export { default as PageNav } from './components/shared/PageNav.astro';
export { default as LicenseCard } from './components/shared/LicenseCard.astro';
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
export { generatePath } from './utils/generate-path';

// Content utilities
export { getTagStats, buildSidebarData, groupDocsByCategory } from './utils/content';
export type { TagCount, SidebarData, DocNavItem, DocCategory, DocsGroupResult } from './utils/content';

// Styles are imported per-layout in BaseLayout.astro (global.css + layout.css)

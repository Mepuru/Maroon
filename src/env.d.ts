/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    site: {
      title: string;
      description: string;
      author: string;
      authorSeo?: string;
      avatar: string;
      bio: string;
      nav: Array<{ href: string; label: string }>;
      social: { github?: string };
      footer: { icp?: string; icpUrl?: string };
      docs: { emptyTexts: string[] };
      license?: { enable?: boolean; name?: string; url?: string };
      themes: Array<{ id: string; name: string }>;
      defaultTheme: string;
      routes: import('astro-maroon/types/site').RoutesConfig;
    };
  }
}

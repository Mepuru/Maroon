import type { SiteConfig } from '@kurikana/astro-theme/types/site';
import { generateNavItems } from '../content/registry';

export const siteConfig: SiteConfig = {
  title: '栗かな',
  description: '记录生活与技术的个人博客',
  author: '栗かな',
  avatar: '/icon.png',
  icon: '/icon.png',
  bio: '日语专业 / 技术探索中',
  // 导航由 registry 中 showInNav 的条目自动生成，如需自定义可在此覆盖
  nav: generateNavItems(),
  social: {
    github: 'https://github.com/Mepuru',
  },
  footer: {
    icp: '鲁ICP备2024121288号',
    icpUrl: 'https://beian.miit.gov.cn/',
  },
  docs: {
    emptyTexts: [
      '『 四季轮回 岁岁年年 』',
      '『 今天吃什么呢？ 』\n『 是啊，吃什么呢？ 』',
      '『 到处点一点试试看？ 』',
    ],
  },
};

export const defaultTitle = siteConfig.title;
export const defaultDescription = siteConfig.description;

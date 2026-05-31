/**
 * rehype-image-caption
 *
 * 将 Markdown 中带 title 的图片 `![alt](src "caption")`
 * 渲染为 <figure><img ...><figcaption>caption</figcaption></figure>
 *
 * 用法：
 *   ![风景](photo.jpg "夕阳下的海岸")
 *   → <figure><img src="photo.jpg" alt="风景"><figcaption>夕阳下的海岸</figcaption></figure>
 */

import { visit } from 'unist-util-visit';

export function rehypeImageCaption() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName !== 'img' ||
        !node.properties ||
        !parent ||
        typeof index !== 'number'
      ) {
        return;
      }

      const props = node.properties;
      const title = props.title;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return;
      }

      const figCaption = {
        type: 'element',
        tagName: 'figcaption',
        properties: {},
        children: [{ type: 'text', value: title.trim() }],
      };

      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: { class: 'image-caption' },
        children: [
          {
            type: 'element',
            tagName: 'img',
            properties: { ...props, title: undefined },
            children: [],
          },
          figCaption,
        ],
      };

      parent.children.splice(index, 1, figure);
    });
  };
}

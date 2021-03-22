# AT-SITEMAP

For Gatsby.

Works with `@alextim/at-site-core` and `@alextim/at-blog` plugins.

During build it generates

- i18n XML sitemap for `MdPage` and `MdPost`
- simple sitemap for images.
  Looks for images in Frontmatter and markdown body.

## Plugin options

| Name                   | Default value
|---                     |---
| excludePaths           | ['/dev-404-page', '/404', '/404.html']
| mainSitemap            | 'sitemap.xml'
| mainSitemap            | 'sitemap.xml'
| imageSitemap           | 'image-sitemap.xml'
| buildDir               | './public'
| ignoreImagesWithoutAlt | true
| createLinkInHead       | true
| specialFolder          | 'assets'

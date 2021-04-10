const sanitize = (x, defaultValue) => x === undefined ? defaultValue : x;
const sanitizeTrue = (x) => !!sanitize(x, true);

module.exports = (pluginOptions) => ({
  // default: true
  createRobotsTxt: sanitizeTrue(pluginOptions.createRobotsTxt),
  // default: true
  noRobots: sanitizeTrue(pluginOptions.noRobots),

  // pages to exclude.
  // Paths must start with "/"
  excludePaths: pluginOptions.excludePaths || ['/dev-404-page', '/404', '/404.html'],

  // generated sitemap filenames
  mainSitemap: pluginOptions.mainSitemap || 'sitemap.xml',
  imageSitemap: pluginOptions.imageSitemap || 'image-sitemap.xml',

  // build dir to read the output files from
  // also to write the sitemap to
  buildDir: pluginOptions.buildDir || './public',

  
  // default: 1
  // 0 - no
  // 1 - build date
  // 2 - dateModified
  lastmod: pluginOptions.lastmod == null ? 1 : Number(pluginOptions.lastmod),
  
  // don't add images with missing alt tag to sitemap
  ignoreImagesWithoutAlt: sanitizeTrue(pluginOptions.ignoreImagesWithoutAlt),

  // add sitemaps link to pages' head
  createLinkInHead: sanitizeTrue(pluginOptions.createLinkInHead),

  specialFolder: pluginOptions.specialFolder || 'assets',
});

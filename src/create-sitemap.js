const writeSiteMap = require('./write-sitemap');
const getNodeImages = require('./get-node-images');

const getPureSlug = (slug, localeCodes) => {
  const a = slug.split('/');
  const locale = a[1];
  const isLocalized = localeCodes.some((el) => locale === el);
  if (!isLocalized) {
    return slug;
  }
  return `/${a.slice(2).join('/')}`;
};

module.exports = (allPages, reporter, options, siteUrl, allLocales) => {
  reporter.info(`Generating main sitemap for ${allPages.length} nodes...`);

  const localeCodes = allLocales.map(({ code }) => code);

  const locales = allLocales.reduce((acc, { code, htmlLang }) => {
    acc[code] = htmlLang;
    return acc;
  }, {});

  const buildDate = new Date().toISOString();

  const urlData = allPages.map(({ node }) => {
    const { slug } = node;
    const pureSlug = getPureSlug(slug, localeCodes);

    const result = {
      url: siteUrl + slug,
      changefreq: 'weekly',
      priority: 0.7,
    };

    if (options.lastmod === 1) {
      result.lastmod = buildDate;
    } else if (options.lastmod === 2 && node.dateModified) {
      result.lastmod = new Date(node.dateModified).toISOString();
    }

    const links = allPages
      .filter(({ node: { slug: linkSlug } }) => getPureSlug(linkSlug, localeCodes) === pureSlug)
      .map(({ node: { slug: linkSlug, locale: linkLocale } }) => ({
        url: siteUrl + linkSlug,
        lang: locales[linkLocale],
      }));

    if (links) {
      result.links = links;
    }

    if (options.includeImages) {
      const img = getNodeImages(siteUrl, node, options.ignoreImagesWithoutAlt);
      if (img) {
        result.img = img;
      }
    }

    return result;
  });

  if (!urlData.length) {
    reporter.info('No data for sitemap. Nothing generated.');
    return false;
  }

  const generationOptions = {
    hostname: siteUrl,
    lastmodDateOnly: options.lastmodDateOnly,
    xmlns: {
      news: false,
      xhtml: true,
      image: options.includeImages,
      video: false,
    },
  };

  reporter.info(`Creating sitemap for ${urlData.length} nodes.`);
  const filePath = `${options.buildDir}/${options.sitemapFileName}`;
  return writeSiteMap(urlData, generationOptions, filePath).then(() => {
    reporter.info(`Sitemap successfully written to ${filePath}`);
    return true;
  });
};

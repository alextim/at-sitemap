const createSiteMap = require('./createSiteMap');
const createImageSiteMap = require('./createImageSiteMap');
const createRobotsTxt = require('./createRobotsTxt');

const withOptions = require('./plugin-options');

module.exports = async ({ graphql, reporter }, pluginOptions) => {
  reporter.info('at-sitemap: started...');

  const options = withOptions(pluginOptions);

  const result = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
          locales {
            code
            htmlLang
          }
        }
      }
      pages: allMdPage {
        edges {
          node {
            slug
            locale
            dateModified
            cover {
              title
              alt
              xl {
                publicURL
              }
              sm {
                publicURL
              }
            }
            sections {
              image {
                title
                alt
                xl {
                  publicURL
                }
                sm {
                  publicURL
                }
              }
              items {
                image {
                  title
                  alt
                  sm {
                    publicURL
                  }
                  xl {
                    publicURL
                  }
                }
              }
            }
            htmlAst
          }
        }
      }
      posts: allMdPost {
        edges {
          node {
            slug
            locale
            dateModified
            cover {
              title
              alt
              xl {
                publicURL
              }
              sm {
                publicURL
              }
            }
            sections {
              image {
                title
                alt
                xl {
                  publicURL
                }
                sm {
                  publicURL
                }
              }
              items {
                image {
                  title
                  alt
                  sm {
                    publicURL
                  }
                  xl {
                    publicURL
                  }
                }
              }
            }
            htmlAst
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
    return;
  }
  const { siteUrl, locales } = result.data.site.siteMetadata;

  const inExcludedPaths = (slug) =>
    options.excludePaths.some((exPath) => slug.indexOf(exPath) !== -1);

  const pages = result.data.pages.edges.filter(({ node: { slug } }) => !inExcludedPaths(slug));
  const posts = result.data.posts.edges.filter(({ node: { slug } }) => !inExcludedPaths(slug));

  const allPages = [...pages, ...posts];

  let mainNotEmpty;
  let imagesNotEmpty;
  if (allPages.length) {
    reporter.info(`Posts: ${posts.length}`);
    reporter.info(`Pages: ${pages.length}`);
    mainNotEmpty = createSiteMap(allPages, reporter, options, siteUrl, locales);
    imagesNotEmpty = createImageSiteMap(allPages, reporter, options, siteUrl);
  } else {
    reporter.info('No data for sitemap');
  }

  createRobotsTxt(reporter, options, siteUrl, mainNotEmpty, imagesNotEmpty);
};

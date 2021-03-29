const fs = require('fs');

module.exports = (reporter, options, siteUrl, mainNotEmpty, imagesNotEmpty) => {
  if (!options.createRobotsTxt) {
    reporter.info('"robots.txt" generation is disabled');
    return;
  }

  let s = `
User-agent: *
Disallow: ${options.noRobots ? '/' : ''}`;
  
  if (mainNotEmpty) {
    s += `\nsitemap: ${siteUrl}/${options.mainSitemap}`;
  }
  if (imagesNotEmpty) {
    s += `\nsitemap: ${siteUrl}/${options.imageSitemap}`;
  }
  
  const filePath = `${options.buildDir}/robots.txt`;

  fs.writeFileSync(filePath, s);
  reporter.info('"robots.txt" created');
};
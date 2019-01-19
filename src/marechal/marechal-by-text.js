/* eslint-disable no-cond-assign */
// Required libs
const path = require('path');
const util = require('../../lib/all');
const marechalCore = require('./marechal-core');


const marechalByData = (originalData, configs) => {
  // Keep original data and set it to another
  let finalData = originalData;

  // Go to each <Marech@...> tag
  const marechExp = util.regExp.marechTag;

  while (finalData.match(marechExp) !== null) {
    let match;
    while ((match = marechExp.exec(finalData)) !== null) {
      // Normalize if user use break-line inside marech tag
      match[0] = match[0].replace(/(\r|\t|\n| {2,})/g, ' ');

      // Text before MarechTag definition
      const beforeTag = util.marechHelpers.beforeAndAfterMatch.before(finalData, match);
      // Before tag + tag
      const beforeAndTag = beforeTag + match[0];
      // Text after MarechTag definition
      const afterTag = util.marechHelpers.beforeAndAfterMatch.after(finalData, match);

      // Get Teleg name
      const name = util.marechHelpers.nameOrProps('name', match[0]);
      // Get Properties definition
      const props = util.marechHelpers.nameOrProps('props', match[0]);
      // Pre-props (marech UX)
      const preProps = util.marechHelpers.uxMarech(match[0], beforeAndTag);


      // Find teleg file from Marech@... definition
      const telegFile = util.marechHelpers.findTelegName(name, configs);
      // Read the teleg
      const telegPath = path.join(configs.telegs.path, telegFile);
      const originalMarechTeleg = util.disk.file.readFile(telegPath);

      // Split to content and args
      const splitedItens = util.marechHelpers.execObj(originalMarechTeleg, props, preProps);
      const { marechTeleg, args, defaultTelegArgs } = splitedItens;


      // MarechalCORE
      const mareched = marechalCore(marechTeleg, args, defaultTelegArgs);


      // Replace the <Marech@...> to imported teleg
      finalData = beforeTag + mareched + afterTag;
    }
  }

  // Convert multiples empty break lines to one only
  finalData = finalData.replace(/\n {3,}\n/g, '\n');

  // Return mareched
  return finalData;
};

module.exports = marechalByData;

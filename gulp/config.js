
var assetsSrc ='assets/**/*';
var baseBuildDest = 'build';
var baseContent = 'content';
var markDownExtension = '.md';
var baseFrontMatterConfig = {property: 'page', remove: true};
var baseTemplates = '/templates/';
var htmlRenameExt = '.html';
var mediaSrc = '/media';
var rePostName   = /(\d{4})-(\d{1,2})-(\d{1,2})-(.*)/;
var siteConfig = require('../site.json');

module.exports = {
  assets:{
    src:assetsSrc,
    dest:baseBuildDest+'/'
  },
  pages:{
    src: baseContent+'/pages/'+'*'+markDownExtension,
    frontMatterConfig:baseFrontMatterConfig,
    defaultTemplate:'../..'+baseTemplates+'page.html',
    renameExt: htmlRenameExt,
    dest:baseBuildDest
  },
  media:{
    src: baseContent+mediaSrc+'/**/*',
    dest: baseBuildDest+mediaSrc
  },
  posts:{
    rePostName: rePostName,
    src: baseContent+'/posts/'+'*'+markDownExtension,
    frontMatterConfig:baseFrontMatterConfig,
    summarizeSign:'<!--more-->',
    defaultTemplate:'../..'+baseTemplates+'post.html',
    renameExt: htmlRenameExt,
    dest: baseBuildDest
  },
  index:{
    dummy:'index.html',
    defaultTemplate:'../..'+baseTemplates+'index.html',
    dest: baseBuildDest+'/'
  },
  archive:{
    baseName:'journal',
    count:10,
    defaultTemplate:'../..'+baseTemplates+'journal.html',
    dest: baseBuildDest+'/'
  },
  tags:{
    defaultTemplate:'../..'+baseTemplates+'tag.html',
    dest: baseBuildDest+'/tag'
  },
  rss:{
    dummy:'atom.xml',
    defaultTemplate:'../..'+baseTemplates+'atom.xml',
    dest: baseBuildDest+'/'
  },
  clean:{
    src:baseBuildDest+'/',
    read: {read: false}
  },
  watch:{
    assetsSrc:[assetsSrc],
    mediaSrc:[baseContent+mediaSrc],
    pagesSrc:['../..'+baseTemplates+'page.html',baseContent+'/pages/'+'*'+markDownExtension],
    blogSrc:['../..'+baseTemplates+'post.html', '../..'+baseTemplates+'index.html','../..'+baseTemplates+'journal.html',baseContent+'/posts/'+'*'+markDownExtension]
  },
  applyTemplate:{
    siteConfig:siteConfig,
    templateSrc:"./"+baseTemplates
  },
  collectPosts:{
    siteConfig:siteConfig
  },
  dummy:{
    siteConfig:siteConfig
  },
  fileName2Date:{
    rePostName: rePostName,
    markDownExtension:markDownExtension
  },
  postsUtil:{
    siteConfig:siteConfig
  },
  tagsUtil:{
    siteConfig:siteConfig
  }
};

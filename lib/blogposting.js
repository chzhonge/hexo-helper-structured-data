
const cheerio = require('cheerio');

module.exports = (hexo, option) => {
  const {config, page: post} = hexo;

  const blogposting = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description || cheerio(post.excerpt).text(),
    "datePublished": post.date.toISOString(),
    "dateModified": post.updated.toISOString(),
    "articleBody": cheerio(post.content).text(),
    "inLanguage": config.language,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.permalink
    },    
    "author": {
      "@type": "Person",
      "name": config.author
    },
    "publisher": {
      "@type": "Organization",
      "name": config.title,
      "logo": {
        "@type": "ImageObject",
        "url": config.url + config.root + option.logo.path,
        "width": option.logo.width,
        "height": option.logo.height
      }
    }
  };

  let photo = cheerio(post.content).find('img');
  let image_url = (0 != photo.length) ? photo.attr('src') : '';

  blogposting.wordCount = blogposting.articleBody.length;

  if(post.categories && post.categories.length) {
    blogposting.articleSection = post.categories.data[0].name;
  }

  if(post.tags && post.tags.length) {
    blogposting.keywords =  post.tags.map((tag) => tag.name).join(',');
  }

  if(image_url !== '') {
    blogposting.image = {
      "@type": "ImageObject",
      "url": image_url,
      "width" : option.article.eyecatch.width,
      "height" : option.article.eyecatch.height
    };
  }

  return blogposting;
};

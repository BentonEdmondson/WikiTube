
var wiki = require('wikijs').default;
var getTopicSentences = require('./topic-sentences-finder');
var curateContent = require('./content-curator');

(generateVideo = async subject => {
    const MIN_SLIDES_IN_VIDEO = 4;
    var page = await wiki().page(subject);

    var topicSentences = getTopicSentences(await page.summary());
    if (topicSentences.length < MIN_SLIDES_IN_VIDEO) throw new Error(`There are too few topic sentences.`);

    var images = (await page.rawImages()).filter(image => image.title.toLowerCase().endsWith('.jpg'));
    if (images.length < MIN_SLIDES_IN_VIDEO) throw new Error(`There are too few images.`);

    var videoContent = curateContent(topicSentences, images);

    console.log(videoContent);

})('Wisconsin');


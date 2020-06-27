var keywordExtractor = require('keyword-extractor');
var stringSimilarity = require('string-similarity');

module.exports = (topicSentences, images) => {
    images.forEach(image =>
        image.titleKeywords = keywordExtractor.extract(image.title.toLowerCase().slice(5, -4), { return_changed_case: true }).join(' ')
    );
    var curatedContent = [];
    for (topicSentence of topicSentences) {
        var topicSentenceKeywords = keywordExtractor.extract(topicSentence, { return_changed_case: true }).join(' ');
        var indexOfBestImage = stringSimilarity.findBestMatch(
            topicSentenceKeywords,
            images.map(image => image.titleKeywords)
        ).bestMatchIndex;
        curatedContent.push({
            subtitle: topicSentence,
            image: images[indexOfBestImage].imageinfo[0].url
        });
        images.splice(indexOfBestImage, 1);
    }
    return curatedContent;
}
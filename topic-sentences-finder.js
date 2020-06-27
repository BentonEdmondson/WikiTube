var English = require('parse-english');
var toString = require('nlcst-to-string');
var visit = require('unist-util-visit');

var fs = require('fs');

module.exports = summary => {
    var topicSentences = [];
    var tree = new English().parse(summary);
    visit(tree, 'ParagraphNode', node => {
        // eliminate all parantheses, and then again in case some are nested:
        topicSentences.push(toString(node.children[0].children).replace(/\s*\([^()]*\)/g, '').replace(/\s*\([^()]*\)/g, ''));
    });
    return topicSentences;
}
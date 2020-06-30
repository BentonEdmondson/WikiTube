var ffmpeg = require('fluent-ffmpeg');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
var needle = require('needle');
var fs = require('fs');
const WORKING_DIR = './testDir'; // eventually this will automatically check for what the next dir should be

module.exports = async videoSlides => {
    var jpgToMp4Promises = [];
    videoSlides.forEach((slide, i) => {
        jpgToMp4Promises.push(saveJpgAsMp4WithSubtitles(slide, `${WORKING_DIR}/${i}.mp4`));
    });
    await Promise.all(jpgToMp4Promises);
}

var saveJpgAsMp4WithSubtitles = async ({ subtitle, image: jpgUrl }, mp4Path) => new Promise((resolve, reject) => {
    var stream = needle.get(jpgUrl);

    ffmpeg(stream)
        .inputFps(0.07) // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/593#issuecomment-258465774
        .loop(5)
        .fps(25)
        .size('1920x1080')
        .autopad()
        .videoFilter('subtitles=subtitles.ass')
        .outputOptions('-pix_fmt yuv420p')
        .on('start', console.log)
        .on('error', reject)
        .on('end', resolve)
        .save(mp4Path)
});

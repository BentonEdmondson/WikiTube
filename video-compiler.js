var download = require('image-downloader');
var editly = require('editly');
var fs = require('fs').promises;

module.exports = async (videoSlides, dir) => {
    await Promise.all(videoSlides.map((videoSlide, i) => {
        videoSlide.imagePath = `${dir}/image${i}.jpg`;
        return download.image({ url: videoSlide.imageUrl, dest: videoSlide.imagePath });
    }));

    await editly({
        outPath: `${dir}/video.mp4`,
        width: 1920,
        height: 1080,
        fps: 60,
        defaults: {
            duration: 15, // TODO: make the duration depend on the subtitle length
            transition: {
                duration: 0.5,
                name: 'fade'
            }
        },
        audioFilePath: undefined,
        clips: videoSlides.map(({ imagePath, subtitle }) => ({
            layers: [
                {
                    type: 'image',
                    path: imagePath,
                    zoomDirection: Math.random() < 0.5 ? 'in' : 'out',
                    zoomAmount: 0.1 // TODO: choose zoom amount
                },
                {
                    type: 'subtitle',
                    fontPath: 'font.ttf',
                    text: subtitle,
                    textColor: '#ffffff'
                }
            ]
        })),

        enableFfmpegLog: false,
        verbose: false,
        fast: false
    });

    await videoSlides.map(({ imagePath }) => fs.unlink(imagePath));
}
const Jimp = require('jimp');
const _ = require('lodash');
const createImage = require('./createImage');
const localImagePath = require('./localImagePath');
const WIDTH_GAP = 10;
const HEIGHT_GAP = 5;
let starImage = null;

(async () => {
    starImage = await Jimp.read(localImagePath('common/ui_icon_star_01'));
})();

async function getStarsImage (count) {
    let container = await createImage(starImage.bitmap.width * count    , starImage.bitmap.height);

    let x = 0;
    for (let i = 0; i < count; i++) {
        await container.composite(starImage, x, 0);
        x = x + starImage.bitmap.width;
    }

    return container;
}

async function renderForm (form) {
    const sprite = await Jimp.read(localImagePath(`heroes/${form.image}`));
    const stars = await getStarsImage(form.star);
    const canvas = await createImage(Math.max(sprite.bitmap.width, stars.bitmap.width), sprite.bitmap.height + stars.bitmap.height + 2);

    await canvas.composite(sprite, (canvas.bitmap.width - sprite.bitmap.width) / 2, 0);
    await canvas.composite(stars, (canvas.bitmap.width - stars.bitmap.width) / 2, sprite.bitmap.height + 2);

    return canvas;
}

async function createRow (sprites, targetSpriteWidth) {
    const height = Math.max(...(sprites.map(s => s.bitmap.height)));

    let container = await createImage(WIDTH_GAP * (sprites.length - 1) + targetSpriteWidth * sprites.length, height + 10);
    let x = 0;

    for (let sprite of sprites) {
        await container.composite(sprite, x + (targetSpriteWidth - sprite.bitmap.width) / 2, height - sprite.bitmap.height + 5);
        x = x + WIDTH_GAP + targetSpriteWidth;
    }

    return container;
}

module.exports = async (forms) => {
    let sprites = await Promise.all(forms.map(renderForm));
    const per5Sprites = _.chunk(sprites, 5);

    const spriteWidth = per5Sprites.reduce((r, sprites) => Math.max(r, sprites.reduce((r, sprite) => Math.max(r, sprite.bitmap.width), 0)), 0);
    let totalHeight = 0;

    for (const i in per5Sprites) {
        per5Sprites[i] = await createRow(per5Sprites[i], spriteWidth);
        totalHeight += per5Sprites[i].bitmap.height;
    }

    const canvas = await createImage(spriteWidth * 5 + WIDTH_GAP * 4, totalHeight + HEIGHT_GAP * (per5Sprites.length - 1));
    let y = 0;

    for (const i in per5Sprites) {
        const sprite = per5Sprites[i];
        await canvas.composite(sprite, 0, y);
        y = y + HEIGHT_GAP + sprite.bitmap.height;
    }

    return canvas;
};

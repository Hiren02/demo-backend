const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const { PATHS } = require("../Configs/constants");
const sharp = require("sharp");
const { IMAGES } = PATHS;

const openai = new OpenAI({
	apiKey: process.env.OPEN_API_KEY,
	dangerouslyAllowBrowser: true,
});

class ImageCreation {
	async createImage(prompt, model = "dall-e-3", style = "vivid", size = "1024x1024", numberOfImage = 1) {
		try {
			const image = await openai.images.generate({
				prompt: prompt,
				model: model,
				style: style,
				size,
				n: numberOfImage,
				response_format: "b64_json",
			});
			return image;
		} catch (err) {
			console.log(err);
		}
	}

	async variationOfImage(image, isPngImage = false) {
		try {
			const filePath = path.join(__dirname, "./../Assets/Images" + IMAGES.USER_PROFILE + "/") + image;
			let outputFilePath = filePath;
			if (!isPngImage) {
				outputFilePath = path.join(__dirname, "./../Assets/Images" + IMAGES.USER_PROFILE + "/" + `${path.parse(image).name}.png`);
				await sharp(filePath).resize(1000).png().toFile(outputFilePath);
			}
			const variationOfImage = await openai.images.createVariation({
				image: fs.createReadStream(outputFilePath),
				response_format: "b64_json",
			});
			return variationOfImage;
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = new ImageCreation();

const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const multer = require("multer");

//Helpers
const StringHelper = require("../Helpers/String.Helper");

//Default Resolution
const IMAGE_RESIZE_RESOLUTION = parseInt(process.env.IMAGE_RESIZE_RESOLUTION) || 600;

//Bucket Is Public
const isBucketPublic = process.env.AWS_BUCKET_TYPE === "public";

// PATH DATA OF WHERE TO STORE FILES
const { MEDIA_TYPE, PATHS } = require("../Configs/constants");
const { IMAGES } = PATHS;

//GET AWS CONFIG
const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	Bucket: process.env.AWS_BUCKET_NAME,
	region: process.env.AWS_REGION,
	signatureVersion: "v4",
};

//S3 CONFIG
const s3 = new AWS.S3(credentials);

// SAVE THIS TEMP FOLDER PATH ONE TIME
let tempPath = {
	original: path.join(__dirname, "./../Assets/Images" + IMAGES.USER_PROFILE + "/"),
	thumb: path.join(__dirname, "./../Assets/Images" + IMAGES.USER_MEDIA + "/"),
	gif: path.join(__dirname, "./../Assets/Images" + IMAGES.USER_MEDIA + "/"),
};
tempPath[IMAGES.ORIGINAL] = tempPath.original;
tempPath[IMAGES.THUMB] = tempPath.thumb;
tempPath[IMAGES.GIF] = tempPath.gif;

module.exports = class FileManager {
	//Multer setup
	static upload() {
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, tempPath.original);
			},
			filename: function (req, file, cb) {
				let fileName = FileManager.getNameFormFileName(file.originalname);
				if (!req.body[file.fieldname]) {
					req.body[file.fieldname] = [];
				}
				req.body[file.fieldname].push(fileName);
				cb(null, fileName);
			},
		});

		return multer({ storage });
	}

	static getNameFormFileName(fileName) {
		return fileName.split(".")[0].replace(/[^A-Z0-9]/gi, "_") + "_" + Date.now() + "_" + Math.floor(Math.random() * 999) + 99 + path.extname(fileName);
	}

	//Get filename from url
	static getFileNameFromUrl(url) {
		return url.split("/").pop().split("#").shift().split("?").shift();
	}

	//Get url from cloud
	static getUrl(pathName, fileName, isPublic = isBucketPublic) {
		const bucket = process.env.AWS_BUCKET_NAME;
		const path = process.env.AWS_BUCKET_PATH;
		const key = (process.env.AWS_BUCKET_FOLDER || "") + pathName + "/" + fileName;

		if (isPublic) {
			if (path) {
				return `https://${path}/${key}`;
			} else {
				return `https://${bucket}.s3.amazonaws.com/${key}`;
			}
		} else {
			return s3.getSignedUrl("getObject", {
				Bucket: bucket,
				Key: key,
				Expires: 5 * 24 * 60 * 60, //5 day
			});
		}
	}

	//Upload file or files to cloud
	static async uploadToCloud(files, primary, secondary) {
		if (!files) return;
		const arrayFiles = Array.isArray(files) ? files : [files];

		return await Promise.all(
			arrayFiles.map((file) => {
				//Upload single file to aws
				let localFile = tempPath[secondary] + file;

				return new Promise((resolve, reject) => {
					let params = {
						Bucket: process.env.AWS_BUCKET_NAME,
						Body: fs.createReadStream(localFile),
						Key: (process.env.AWS_BUCKET_FOLDER || "") + primary + "/" + file,
						ContentType: path.extname(file),
					};

					if (isBucketPublic) params.ACL = "public-read";

					s3.upload(params, function (err, data) {
						if (err) reject(err);
						else {
							// If Success then Remove file from local
							// console.log(data)
							fs.unlink(localFile, function (err) {
								if (err) console.log(err);
							});
							resolve(data);
						}
					});
				});
			})
		);
	}

	static async uploadB64ImageToCloud(encodedImage, path, fileName) {
		const buffer = Buffer.from(encodedImage, "base64");

		let params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			ContentEncoding: "base64",
			ContentType: "image/png",
			Body: buffer,
			Key: (process.env.AWS_BUCKET_FOLDER || "") + path + "/" + fileName,
		};
		try {
			return await new Promise((resolve, reject) =>
				s3.upload(params, function (err, data) {
					if (err) reject(err);
					else {
						resolve(data);
					}
				})
			);
		} catch (err) {
			console.log(err);
		}
	}

	//Delete file or files from cloud
	static async delete(files, primary) {
		if (!files) return;
		const arrayFileNames = Array.isArray(files) ? files : [files];

		return await Promise.all(
			arrayFileNames.map((fileName) => {
				let params = {
					Bucket: process.env.AWS_BUCKET_NAME,
					Key: (process.env.AWS_BUCKET_FOLDER || "") + primary + "/" + fileName,
				};

				return new Promise((resolve, reject) => {
					s3.deleteObject(params, function (err, data) {
						if (err) reject(err);
						else resolve(data);
					});
				});
			})
		);
	}
};

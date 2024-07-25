/* 
HOW TO USE THIS TO SEND RESPONSE

In your controller you can use

res.handler.*function*(data object*, message* , error*)
Ex : 
res.handler.success()
res.handler.success({userName : "John"})
res.handler.success({userName : "John"}, "User created")
res.handler.success(undefined, "User created")
res.handler.serverError(undefined, undefined, undefined, error object)

for message you can pass simple string
1. We have sent an email to your account
or for with values like
We have sent an email to %s,
{
    key : "TRANSLATION KEY",
    value : "value of %s"
}
*/

const { encryptionResponse } = require("../Utils/encryptionDecryption");

class ResponseHandler {
	constructor(req, res) {
		this.req = req;
		this.res = res;
	}

	sender(code, message, data, error) {
		const responsePayload = {
			message: typeof message === "string" ? this.res.__(message) : this.res.__(message.key, message.value),
			data,
		};

		if (this.req.headers["content-type"] === "application/encrypted-json") {
			this.res.set("Content-Type", "application/encrypted-json");
			return this.res.status(code).send(encryptionResponse(responsePayload));
		}

		this.res.status(code).json(responsePayload);
		if (error) {
			// HANDLE LOGS AND OTHER STUFF
			console.log("ERROR", error);
		}
	}

	/* 
        ARGUMENTS : Status code, message, data object,  error object
    */
	custom(...args) {
		this.sender(...args);
	}

	/* 
        ARGUMENTS : data o̥̥bject, message, error object
    */

	// 2XX SUCCESS
	success(data, message, error) {
		this.sender(STATUS_CODES.SUCCESS, message || "STATUS.SUCCESS", data, error);
	}

	created(data, message, error) {
		this.sender(STATUS_CODES.CREATED, message || "STATUS.CREATED", data, error);
	}

	update(data, message, error) {
		this.sender(STATUS_CODES.SUCCESS, message || "STATUS.UPDATED", data, error);
	}

	// 4XX CLIENT ERROR
	badRequest(data, message, error) {
		this.sender(STATUS_CODES.BAD_REQUEST, data || "STATUS.BAD_REQUEST", message, error);
	}

	unauthorized(data, message, error) {
		this.sender(STATUS_CODES.UNAUTHORIZED, message || "STATUS.UNAUTHORIZED", data, error);
	}

	forbidden(data, message, error) {
		this.sender(STATUS_CODES.FORBIDDEN, message || "STATUS.FORBIDDEN", data, error);
	}

	notFound(data, message, error) {
		this.sender(STATUS_CODES.NOT_FOUND, message || "STATUS.NOT_FOUND", data, error);
	}

	noContent(data, message, error) {
		this.sender(STATUS_CODES.NO_CONTENT, message || "", data, error);
	}

	conflict(data, message, error) {
		this.sender(STATUS_CODES.CONFLICT, message || "STATUS.CONFLICT", data, error);
	}

	preconditionFailed(data, message, error) {
		this.sender(STATUS_CODES.PRECONDITION_FAILED, message || "STATUS.PRECONDITION_FAILED", data, error);
	}

	validationError(data, message, error) {
		this.sender(STATUS_CODES.VALIDATION_ERROR, message || "STATUS.VALIDATION_ERROR", data, error);
	}

	// 5XX SERVER ERROR
	serverError(data, message, error) {
		this.sender(STATUS_CODES.SERVER_ERROR, message || "STATUS.SERVER_ERROR", data, error);
	}
}

module.exports = ResponseHandler;

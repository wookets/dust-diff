
import fs from "fs";
import dust from "dustjs-linkedin";

import check from "../lib/check";
import step from "../lib/step-thru-template";

describe("check", function () {

	it("should", function () {

		var template = fs.readFileSync("dust/sample.dust").toString("utf8");
		var ast = dust.parse(template);
		// console.log("ast", ast);
		var context = {
			name: "",
			within: [],
			reference: []
		};
		step(context, ast, check);

	});

});

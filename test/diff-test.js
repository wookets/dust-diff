
import fs from "fs";
import dust from "dustjs-linkedin";

import diff from "../lib";
import data from "./mockdata/example1";

describe("check", function () {

	it("should", function () {

		var errors = diff("dust/sample.dust", data);
		console.log("errors", errors);

	});

});


import fs from "fs";
import dust from "dustjs-linkedin";

import check from "./check";
import step from "./step";

export default function diff (template, data) {

	var result = [];

	var templateString = fs.readFileSync(template).toString("utf8");
	var ast = dust.parse(templateString);
	var context = {
		name: "",
		within: [],
		reference: []
	};
	step(context, ast, function (context, node) {
		result = result.concat(check(context, node, data));
	});

	return result;
}

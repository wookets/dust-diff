
import fs from "fs";
import dust from "dustjs-linkedin";

import check from "./check";
import step from "./step";

export default function diff (template, data) {

	// read in template from fs
	// parse template
	// step thru template
	// build schema
	// compare schema to actual data
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

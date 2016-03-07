
import _ from "lodash";

import data from "../mockdata/example1";

export default function check (context, node) {
	console.log("check", context.name, context.within, context.reference); //, node);

	var refArray = _.clone(context.reference);
	if (_.has(context.within, "#")) {
		refArray.push("0");
	}

	refArray.push(context.name);
	console.log("data", data);
	if (_.has(data, refArray)) {
		console.log("has", refArray.join("."));
	} else {
		console.log("missing var", refArray.join("."));
	}
}

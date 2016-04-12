
import _ from "lodash";

export default function checkData (context, node, data) {
	console.log("check", context.name, context.within, context.reference); //, node);

	var errors = [];

	var refArray = _.clone(context.reference);
	if (_.includes(context.within, "#")) {
		refArray.push("0");
	}

	refArray.push(context.name);
	//console.log("data", data);
	if (_.has(data, refArray)) {
		//console.log("has", refArray.join("."));
	} else {
		errors.push("missing var " + refArray.join("."));
		//console.log("missing var", refArray.join("."));
	}

	return errors;
}

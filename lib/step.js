
import fs from "fs";
import dust from "dustjs-linkedin";

var nodes = {
	"body": function (context, node, check) {
		for (var i=1, len=node.length; i < len - 2; i++) {
			step(context, node[i], check);
		}
	},
	"reference": function (context, node, check) {
		context.name = node[1][1];
		check(context, node);
	},
	"?": function (context, node, check) {
		stepThruSection(context, node, check);
	},
	"^": function (context, node, check) {
		stepThruSection(context, node, check);
	},
	"#": function (context, node, check) {
		stepThruSection(context, node, check);
	},
	"partial": function (context, node, check) {
		context.within.push(node[0]);
		var template = fs.readFileSync(node[1][1] + ".dust").toString("utf8");
		var ast = dust.parse(template);
		check(context, node);
		step(context, ast, check);//node[1]);
		context.within.pop();
	},
	"<": function (context, node, check) {
		context.name = node[1][1];
		check(context, node);
		step(context, node[4], check);
	},
	"+": function (context, node, check) {
    },
	"@": function (context, node, check) {
		var type = node[0],
		name = node[1][1];
		context.within.push(type);
		context.within.push(type + name);
		context.name = name;
		check(context, node);
		step(context, node[4], check);
		context.within.pop();
		context.within.pop();
	},
	"param": function (context, node, check) {
		step(context, node[1], check);
		step(context, node[2], check);
	},
	"literal": function () {
		return true;
	},
	"buffer": function () {
    },
	"format": function () {
    },
	"params": function () {
    },
	"bodies": function (context, node, check) {
		for (var i=1, len=node.length; i<len; i++) {
			step(context, node[i], check);
		}
	},
	"special": function (context, node, check) {
		context.name = node[1];
		check(context, node);
	},
	"comment": function (context, node, check) {
		check(context, node);
	},
	"%": function (context, node, check) {
		check(context, node);
	}
};

function stepThruSection (context, node, check) {
	var type = node[0];
	context.name = node[1][1];
	context.within.push(type);
	check(context, node);
	context.reference.push(node[1][1]);
	step(context, node[4], check);
	context.reference.pop();
	context.within.pop();
}

export default function step (context, node, check) {
	nodes[node[0]](context, node, check);
}


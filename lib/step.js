
import fs from "fs";
import dust from "dustjs-linkedin";

var nodes = {
	"body": function (context, node, hook) {
		for (var i=1, len=node.length; i < len - 2; i++) {
			step(context, node[i], hook);
		}
	},
	"reference": function (context, node, hook) {
		context.name = node[1][1];
		hook(context, node);
	},
	"?": function (context, node, hook) {
		stepThruSection(context, node, hook);
	},
	"^": function (context, node, hook) {
		stepThruSection(context, node, hook);
	},
	"#": function (context, node, hook) {
		stepThruSection(context, node, hook);
	},
	"partial": function (context, node, hook) {
		context.within.push(node[0]);
		var template = fs.readFileSync(node[1][1] + ".dust").toString("utf8");
		var ast = dust.parse(template);
		hook(context, node);
		step(context, ast, hook); // node[1]);
		context.within.pop();
	},
	"<": function (context, node, hook) {
		context.name = node[1][1];
		hook(context, node);
		step(context, node[4], hook);
	},
	"+": function (context, node, hook) {
    },
	"@": function (context, node, hook) {
		var type = node[0],
		name = node[1][1];
		context.within.push(type);
		context.within.push(type + name);
		context.name = name;
		hook(context, node);
		step(context, node[4], hook);
		context.within.pop();
		context.within.pop();
	},
	"param": function (context, node, hook) {
		step(context, node[1], hook);
		step(context, node[2], hook);
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
	"bodies": function (context, node, hook) {
		for (var i=1, len=node.length; i<len; i++) {
			step(context, node[i], hook);
		}
	},
	"special": function (context, node, hook) {
		context.name = node[1];
		hook(context, node);
	},
	"comment": function (context, node, hook) {
		hook(context, node);
	},
	"%": function (context, node, hook) {
		hook(context, node);
	}
};

function stepThruSection (context, node, hook) {
	var type = node[0];
	context.name = node[1][1];
	context.within.push(type);
	hook(context, node);
	context.reference.push(node[1][1]);
	step(context, node[4], hook);
	context.reference.pop();
	context.within.pop();
}

export default function step (context, node, hook) {
	nodes[node[0]](context, node, hook);
}


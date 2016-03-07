
var _ = require("lodash");
var fs = require("fs");
var dust = require('dustjs-linkedin');

var data = require("../mockdata/example1");

var nodes = {
    'body': function(context, node) {
        stepParts(context, node);
    },
    'reference': function(context, node) {
        context.name = node[1][1];
        check(context, node);
    },
    '?': function(context, node) {
        stepThruSection(context, node);
    },
    '^': function(context, node) {
        stepThruSection(context, node);
    },
    '#': function(context, node) {
        stepThruSection(context, node);
    },
    'partial': function(context, node) {
        context.within.push(node[0]);
        var template = fs.readFileSync(node[1][1] + ".dust").toString('utf8');
        var ast = dust.parse(template);
        check(context, node);
        step(context, ast); // node[1]);
        context.within.pop();
    },
    '<': function(context, node) {
        context.name = node[1][1];
        check(context, node);
        step(context, node[4]);
    },
    '+': function(context, node) {
    },
    '@': function(context, node) {
        var type = node[0],
            name = node[1][1];
        context.within.push(type);
        context.within.push(type + name);
        context.name = name;
        check(context, node);
        step(context, node[4]);
        context.within.pop();
        context.within.pop();
    },
    'param': function(context, node) {
        step(context, node[1]);
        step(context, node[2]);
    },
    'literal': function() {
        return true;
    },
    'buffer': function() {
    },
    'format': function() {
    },
    'params': function(context, node) {
    },
    'bodies': function(context, node) {
        for (var i=1, len=node.length; i<len; i++) {
            step(context, node[i]);
        }
    },
    'special': function(context, node) {
        context.name = node[1];
        check(context, node);
    },
    'comment': function(context, node) {
        check(context, node);
    },
    '%': function(context, node) {
        check(context, node);
    }
};

function stepParts (context, node) {
    for (var i=1, len=node.length; i < len - 2; i++) {
        step(context, node[i]);
    }
}

function step (context, node) {
    nodes[node[0]](context, node);
}

function stepThruSection (context, node) {
    var type = node[0];
    context.name = node[1][1];
    context.within.push(type);
    check(context, node);
    context.reference.push(node[1][1]);
    step(context, node[4]);
    context.reference.pop();
    context.within.pop();
}

function check (context, node) {
    console.log("check", context.name, context.within, context.reference); //, node);
    var refArray = _.clone(context.reference);
    if (_.has(context.within, '#')) {
        refArray.push("0")
    }
    refArray.push(context.name);
    console.log("data", data);
    if (_.has(data, refArray)) {
        console.log("has", refArray.join("."))
    } else {
        console.log("missing var", refArray.join("."))
    }
}

var template = fs.readFileSync("dust/sample.dust").toString('utf8');
var ast = dust.parse(template);
//console.log("ast", ast);
var context = {
    name: "",
    within: [],
    reference: []
};
step(context, ast);

//var tmpl = dust.compile("Hello world! Using Dust version {version}!", "hello");
//dust.loadSource(tmpl);
//
//dust.render("hello", { version: dust.version }, function(err, out) {
//    if(err) {
//        console.error(err);
//    } else {
//        console.log(out);
//    }
//});

"use strict";
/**
 * Created by user on 2018/6/4/004.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = require("acorn");
const params_1 = require("./params");
exports.SUPPORT_FUNCTION_TO_STRING = /\{ \[native code\] \}$/.test(toString(Math.abs));
function parse(fn, options, allowNative) {
    let source = toString(fn, true);
    if (typeof options === 'boolean') {
        [options, allowNative] = [allowNative, options];
    }
    options = Object.assign({
        ecmaVersion: 8,
    }, options);
    let native = false;
    let _ast;
    try {
        // @ts-ignore
        _ast = acorn.parse(source, options).body[0].expression;
    }
    catch (e) {
        source = toString(fn);
        //console.log(source);
        if (/\{ \[native code\] \}$/.test(source)) {
            native = true;
            if (allowNative) {
                source = source.replace(/\{ \[native code\] \}$/, '{}');
            }
        }
        try {
            // @ts-ignore
            _ast = acorn.parse(source).body[0].expression;
        }
        catch (e) {
            if (native && allowNative) {
            }
            else {
                throw e;
            }
        }
    }
    let ast;
    let args = [];
    if (_ast) {
        ast = fnType(_ast);
        args = params_1.parseFnParams(ast.params);
        //		console.dir(ast, {
        //			depth: 1
        //		});
    }
    else {
        // @ts-ignore
        ast = {};
    }
    return {
        type: ast.type,
        name: fn.name,
        native,
        generator: ast.generator,
        async: ast.async,
        args,
        params: params_1.toValues(args),
        source: toString(fn),
    };
}
exports.parse = parse;
function toString(fn, wrap) {
    let s = Function.prototype.toString.call(fn);
    if (wrap)
        s = '(' + s + ')';
    return s;
}
exports.toString = toString;
function fnType(ast) {
    if (ast.type == 'ArrowFunctionExpression') {
        return ast;
    }
    else if (ast.type == 'FunctionExpression') {
        return ast;
    }
    throw new TypeError(`Expected an Function but got ${ast.type}.`);
}
exports.fnType = fnType;
function parseFunc(fn, options, allowNative) {
    return parse(fn, options, allowNative);
}
exports.parseFunc = parseFunc;
exports.default = parse;

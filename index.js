"use strict";
/**
 * Created by user on 2018/6/4/004.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = require("acorn");
exports.SUPPORT_FUNCTION_TO_STRING = /\{ \[native code\] \}$/.test(toString(Math.abs));
function parseFunc(fn, options, allowNative) {
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
        args = parseFnParams(ast.params);
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
        params: toValues(args),
        source: toString(fn),
    };
}
exports.parseFunc = parseFunc;
function toValues(args) {
    // @ts-ignore
    return Object.values(args).reduce(function (a, b) {
        if (typeof b !== 'string') {
            a.push(...toValues(b));
        }
        else {
            a.push(b);
        }
        return a;
    }, []);
}
exports.toValues = toValues;
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
function parseFnParams(elems) {
    return elems.reduce(function (arr, node) {
        switch (node.type) {
            case 'Identifier':
                arr.push(node.name);
                break;
            case 'ObjectPattern':
                let k = node.properties.reduce(function (a, b) {
                    if (b.type == 'Property') {
                        let key = b.key.name;
                        a[key] = key;
                    }
                    else {
                        unknowWarn(b);
                    }
                    return a;
                }, {});
                arr.push(k);
                break;
            case 'AssignmentPattern':
                // @ts-ignore
                arr.push(node.left.name);
                break;
            case 'RestElement':
                // @ts-ignore
                arr.push('...' + node.argument.name);
                break;
            case 'ArrayPattern':
                arr.push(parseFnParams(node.elements));
                break;
            default:
                unknowWarn(node);
                break;
        }
        return arr;
    }, []);
}
exports.parseFnParams = parseFnParams;
function unknowWarn(node) {
    console.warn(`[skip] unknow type ${node.type}, ${JSON.stringify(node)}`);
}
exports.unknowWarn = unknowWarn;
exports.default = parseFunc;

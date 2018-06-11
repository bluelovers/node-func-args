"use strict";
/**
 * Created by user on 2018/6/11/011.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function parseFnParams(elems) {
    return elems.reduce(function (arr, node) {
        switch (node.type) {
            case 'Identifier':
                arr.push(node.name);
                break;
            case 'ObjectPattern':
            // @ts-ignore
            // support babylon
            case 'ObjectProperty':
                // @ts-ignore
                let keys = node.type == 'ObjectProperty' ? node.key : node.properties;
                let k = keys.reduce(function (a, b) {
                    if (b.type == 'Property' || b.type == 'ObjectProperty') {
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
    //console.dir(node, {depth: 5});
}
exports.unknowWarn = unknowWarn;
exports.default = parseFnParams;
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

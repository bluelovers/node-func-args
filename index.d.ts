/**
 * Created by user on 2018/6/4/004.
 */
import * as acorn from 'acorn';
import * as ESTree from 'estree';
import { _IParams } from './params';
export declare const SUPPORT_FUNCTION_TO_STRING: boolean;
export interface IParseFunc {
    type: "FunctionExpression" | "ArrowFunctionExpression";
    name: string;
    native: boolean;
    generator: boolean;
    async: boolean;
    args: (string | string[] | {
        [k: string]: string;
    } | _IParams[])[];
    params: string[];
    source: string;
}
export declare function parse(fn: any, allowNative?: boolean, options?: acorn.Options): IParseFunc;
export declare function parse(fn: any, options?: acorn.Options, allowNative?: boolean): IParseFunc;
export declare function toString(fn: any, wrap?: boolean): string;
export declare function fnType<T extends ESTree.Function>(ast: T): ESTree.FunctionExpression | ESTree.ArrowFunctionExpression;
export declare function parseFunc(fn: any, allowNative?: boolean, options?: acorn.Options): IParseFunc;
export declare function parseFunc(fn: any, options?: acorn.Options, allowNative?: boolean): IParseFunc;
export default parse;

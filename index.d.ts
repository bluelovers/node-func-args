/**
 * Created by user on 2018/6/4/004.
 */
import * as acorn from 'acorn';
import { ArrowFunctionExpression, FunctionExpression } from 'estree';
import * as ESTree from 'estree';
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
export declare function parseFunc(fn: any, allowNative?: boolean, options?: acorn.Options): IParseFunc;
export declare function parseFunc(fn: any, options?: acorn.Options, allowNative?: boolean): IParseFunc;
export declare function toValues(args: IParams | _IParams): string[];
export declare function toString(fn: any, wrap?: boolean): string;
export declare function fnType<T extends ESTree.Function>(ast: T): FunctionExpression | ArrowFunctionExpression;
export declare type _IParams = string | string[] | {
    [k: string]: string;
};
export declare type IParams = Array<_IParams | _IParams[]>;
export declare function parseFnParams(elems: ESTree.Function["params"]): IParams;
export declare function unknowWarn(node: ESTree.Node): void;
export default parseFunc;

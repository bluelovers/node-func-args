/**
 * Created by user on 2018/6/11/011.
 */
import * as ESTree from 'estree';
export declare type _IParams = string | string[] | {
    [k: string]: string;
};
export declare type IParams = Array<_IParams | _IParams[]>;
export declare function parseFnParams(elems: ESTree.Function["params"]): IParams;
export declare function unknowWarn(node: ESTree.Node): void;
export default parseFnParams;
export declare function toValues(args: IParams | _IParams): string[];

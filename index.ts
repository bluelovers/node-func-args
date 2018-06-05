/**
 * Created by user on 2018/6/4/004.
 */

import * as acorn from 'acorn';
import { ArrowFunctionExpression, Expression, FunctionDeclaration, FunctionExpression } from 'estree';
import * as ESTree from 'estree';

export const SUPPORT_FUNCTION_TO_STRING = /\{ \[native code\] \}$/.test(toString(Math.abs));

export interface IParseFunc
{
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

export function parse(fn, allowNative?: boolean, options?: acorn.Options): IParseFunc
export function parse(fn, options?: acorn.Options, allowNative?: boolean): IParseFunc
export function parse(fn, options?, allowNative?): IParseFunc
{
	let source = toString(fn, true);

	if (typeof options === 'boolean')
	{
		[options, allowNative] = [allowNative, options];
	}

	options = Object.assign({
		ecmaVersion: 8,
	} as acorn.Options, options) as acorn.Options;

	let native = false;

	let _ast;

	try
	{
		// @ts-ignore
		_ast = acorn.parse(source, options).body[0].expression
	}
	catch (e)
	{
		source = toString(fn);

		//console.log(source);

		if (/\{ \[native code\] \}$/.test(source))
		{
			native = true;

			if (allowNative)
			{
				source = source.replace(/\{ \[native code\] \}$/, '{}');
			}
		}

		try
		{
			// @ts-ignore
			_ast = acorn.parse(source).body[0].expression
		}
		catch (e)
		{
			if (native && allowNative)
			{

			}
			else
			{
				throw e;
			}
		}

	}

	let ast: ReturnType<typeof fnType>;
	let args: ReturnType<typeof parseFnParams> = [];

	if (_ast)
	{
		ast = fnType(_ast);
		args = parseFnParams(ast.params);

//		console.dir(ast, {
//			depth: 1
//		});
	}
	else
	{
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
	} as IParseFunc;
}

export function toValues(args: IParams | _IParams): string[]
{
	// @ts-ignore
	return Object.values(args).reduce(function (a: string[], b)
	{
		if (typeof b !== 'string')
		{
			a.push(...toValues(b))
		}
		else
		{
			a.push(b);
		}

		return a;
	}, [] as string[])
}

export function toString(fn, wrap?: boolean): string
{
	let s = Function.prototype.toString.call(fn);

	if (wrap) s = '(' + s + ')';

	return s;
}

export function fnType<T extends ESTree.Function>(ast: T)
{
	if (ast.type == 'ArrowFunctionExpression')
	{
		return ast as ESTree.ArrowFunctionExpression
	}
	else if (ast.type == 'FunctionExpression')
	{
		return ast as ESTree.FunctionExpression
	}

	throw new TypeError(`Expected an Function but got ${ast.type}.`)
}

export type _IParams = string | string[] | {
	[k: string]: string,
};
export type IParams = Array<_IParams | _IParams[]>;

export function parseFnParams(elems: ESTree.Function["params"]): IParams
{
	return elems.reduce(function (arr, node)
	{
		switch (node.type)
		{
			case 'Identifier':
				arr.push(node.name);
				break;
			case 'ObjectPattern':
			// @ts-ignore
			// support babylon
			case 'ObjectProperty':

				// @ts-ignore
				let keys = node.type == 'ObjectProperty' ? node.key : node.properties;

				let k = keys.reduce(function (a, b: ESTree.Property)
				{
					if (b.type == 'Property' || b.type == 'ObjectProperty')
					{
						let key = (b.key as ESTree.Identifier).name;

						a[key] = key;
					}
					else
					{
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

export function unknowWarn(node: ESTree.Node)
{
	console.warn(`[skip] unknow type ${node.type}, ${JSON.stringify(node)}`);

	//console.dir(node, {depth: 5});
}

export function parseFunc(fn, allowNative?: boolean, options?: acorn.Options): IParseFunc
export function parseFunc(fn, options?: acorn.Options, allowNative?: boolean): IParseFunc
export function parseFunc(fn, options?, allowNative?): IParseFunc
{
	return parse(fn, options, allowNative);
}

export default parse

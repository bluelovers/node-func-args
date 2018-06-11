/**
 * Created by user on 2018/6/4/004.
 */

import * as acorn from 'acorn';
import * as ESTree from 'estree';
import { ArrowFunctionExpression, FunctionExpression } from 'estree';
import { IParams, _IParams, parseFnParams, toValues } from './params';

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

export function parseFunc(fn, allowNative?: boolean, options?: acorn.Options): IParseFunc
export function parseFunc(fn, options?: acorn.Options, allowNative?: boolean): IParseFunc
export function parseFunc(fn, options?, allowNative?): IParseFunc
{
	return parse(fn, options, allowNative);
}

export default parse

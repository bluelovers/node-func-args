/**
 * Created by user on 2018/6/11/011.
 */

import * as ESTree from 'estree';

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

export default parseFnParams;

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

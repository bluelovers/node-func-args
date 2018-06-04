/**
 * Created by user on 2018/6/4/004.
 */

import { toString, parseFunc } from '../index';

// @formatter:off

let fn = async (a, b, c, {e, d, }, [aa1, aa2, { aaa3 }, [ bbb1, bbb2, { bbb4 } ], ...rrr], e2 = null, f = { g: 7, a: 8, b: { c: 555, d: true, }, }, f2 = (333), ...argv) => {};

let fn2 = (a, b, c, {e, d, }, [aa1, aa2, { aaa3 }, [ bbb1, bbb2, { bbb4 } ], ...rrr], e2 = null, f = { g: 7, a: 8, b: { c: 555, d: true, }, }, f2 = (333), ...argv) => {};

let fn3 = function (a, b, c, {e, d, }, [aa1, aa2, { aaa3 }, [ bbb1, bbb2, { bbb4 } ], ...rrr], e2 = null, f = { g: 7, a: 8, b: { c: 555, d: true, }, }, f2 = (333), ...argv) {};

let fn4 = async function (a, b, c, {e, d, }, [aa1, aa2, { aaa3 }, [ bbb1, bbb2, { bbb4 } ], ...rrr], e2 = null, f = { g: 7, a: 8, b: { c: 555, d: true, }, }, f2 = (333), ...argv) {};

let fn5 = function *(a, b, c, {e, d, }, [aa1, aa2, { aaa3 }, [ bbb1, bbb2, { bbb4 } ], ...rrr], e2 = null, f = { g: 7, a: 8, b: { c: 555, d: true, }, }, f2 = (333), ...argv) {};

// @formatter:on

const ARGS = [
	'a',
	'b',
	'c',
	{ e: 'e', d: 'd' },
	[
		'aa1',
		'aa2',
		{ aaa3: 'aaa3' },
		['bbb1', 'bbb2', { bbb4: 'bbb4' }],
		'...rrr'
	],
	'e2',
	'f',
	'f2',
	'...argv'
];

const PARAMS = [
	'a',
	'b',
	'c',
	'e',
	'd',
	'aa1',
	'aa2',
	'aaa3',
	'bbb1',
	'bbb2',
	'bbb4',
	'...rrr',
	'e2',
	'f',
	'f2',
	'...argv'
];

export const tests = [

	{
		label: null,
		args: [
			fn,
		],
		expected: {
			type: 'ArrowFunctionExpression',
			name: 'fn',
			native: false,
			generator: false,
			async: true,
			args: ARGS,
			params: PARAMS,
			source: toString(fn),
		}
	},

	{
		label: null,
		args: [
			async (a,
				b,
				c,
				{ e, d, },
				[aa1, aa2, { aaa3 }, [bbb1, bbb2, { bbb4 }], ...rrr],
				e2 = null,
				f = { g: 7, a: 8, b: { c: 555, d: true, }, },
				f2 = (333),
				...argv
			) =>
			{},
		],
		expected: {
			type: 'ArrowFunctionExpression',
			name: '',
			native: false,
			generator: false,
			async: true,
			args:
				[
					'a',
					'b',
					'c',
					{ e: 'e', d: 'd' },
					[
						'aa1',
						'aa2',
						{ aaa3: 'aaa3' },
						['bbb1', 'bbb2', { bbb4: 'bbb4' }],
						'...rrr'
					],
					'e2',
					'f',
					'f2',
					'...argv'
				],
			params:
				[
					'a',
					'b',
					'c',
					'e',
					'd',
					'aa1',
					'aa2',
					'aaa3',
					'bbb1',
					'bbb2',
					'bbb4',
					'...rrr',
					'e2',
					'f',
					'f2',
					'...argv'
				],
			source:
				"async (a, b, c, { e, d, }, [aa1, aa2, { aaa3 }, [bbb1, bbb2, { bbb4 }], ...rrr], e2 = null, f = { g: 7, a: 8, b: { c: 555, d: true, }, }, f2 = (333), ...argv) => { }",
		}
	},

	{
		label: null,
		args: [
			fn2,
		],
		expected: {
			type: 'ArrowFunctionExpression',
			name: 'fn2',
			native: false,
			generator: false,
			async: false,
			args: ARGS,
			params: PARAMS,
			source: toString(fn2),
		}
	},

	{
		label: null,
		args: [
			fn3,
		],
		expected: {
			type: 'FunctionExpression',
			name: 'fn3',
			native: false,
			generator: false,
			async: false,
			args: ARGS,
			params: PARAMS,
			source: toString(fn3),
		}
	},

	{
		label: null,
		args: [
			fn4,
		],
		expected: {
			type: 'FunctionExpression',
			name: 'fn4',
			native: false,
			generator: false,
			async: true,
			args: ARGS,
			params: PARAMS,
			source: toString(fn4),
		}
	},

	{
		label: 'generator',
		args: [
			fn5,
		],
		expected: {
			type: 'FunctionExpression',
			name: 'fn5',
			native: false,
			generator: true,
			async: false,
			args: ARGS,
			params: PARAMS,
			source: toString(fn5),
		}
	},

	{
		label: 'Math.abs',
		args: [
			Math.abs, true,
		],
		expected: {
			type: undefined,
			name: 'abs',
			native: true,
			generator: undefined,
			async: undefined,
			args: [],
			params: [],
			source: 'function abs() { [native code] }'
		}
	},

	{
		label: '[throw] Math.abs',
		args: [
			Math.abs,
		],
		throw: true,
	},

	{
		label: '[allowNative] bind',
		args: [
			(() => {}).bind(null), true,
		],
		expected: {
			"args": [],
			"async": undefined,
			"generator": undefined,
			"name": "bound ",
			"native": true,
			"params": [],
			"source": "function () { [native code] }",
			"type": undefined,
		},
	},
	{
		label: '[throw] bind',
		args: [
			(() => {}).bind(null),
		],
		throw: true,
	},
];

export default tests;

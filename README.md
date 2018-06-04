# func-args

    ECMAScript Function Arguments parser, Get arguments of a function, useful for and used in dependency injectors. Works for regular functions, generator functions and arrow functions.


```nodemon
npm install func-args
```

## api

* [index.d.ts](index.d.ts)
* by default will throw error if func is native or bounded func

## demo

see [_tests.ts](test/_tests.ts)

```ts
import { parseFunc } from 'func-args';

let fn = async (a, b, c, {e, d, }, [aa1, aa2, { aaa3 }, [ bbb1, bbb2, { bbb4 } ], ...rrr], e2 = null, f = {
		g: 7,
		a: 8,
		b: {
			c: 555,
			d: true,
		},
	},
	f2 = (333), ...argv) => {};


let { args, params } = parseFunc(fn);

console.dir({

	/**
	 * func args with structure
	 */
	args,

	/**
	 * all func args name
	 *
	 * @type string[]
	 */
	params,

}, {
	depth: 6,
});
/*
{ args:
   [ 'a',
     'b',
     'c',
     { e: 'e', d: 'd' },
     [ 'aa1',
       'aa2',
       { aaa3: 'aaa3' },
       [ 'bbb1', 'bbb2', { bbb4: 'bbb4' } ],
       '...rrr' ],
     'e2',
     'f',
     'f2',
     '...argv' ],
  params:
   [ 'a',
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
     '...argv' ] }
 */

// skip throw error if func is native or bounded func
console.dir(parseFunc(Math.abs, true), {
	depth: 6,
});
/*
{ type: undefined,
  name: 'abs',
  native: true,
  generator: undefined,
  async: undefined,
  args: [],
  params: [],
  source: 'function abs() { [native code] }' }
*/
```

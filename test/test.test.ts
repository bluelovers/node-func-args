/**
 * Created by user on 2018/6/4/004.
 */

/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />

import { chai, relative, expect, path, assert, util, mochaAsync } from './_local-dev';

// @ts-ignore
import { ITest } from 'mocha';

import { tests } from './_tests';
import { parseFunc } from '../index';

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest: ITest;

	beforeEach(function ()
	{
		currentTest = this.currentTest as ITest;

		//console.log('it:before', currentTest.title);
		//console.log('it:before', currentTest.fullTitle());
	});

	// @ts-ignore
	describe(`suite`, () =>
	{
		tests.forEach((testCase, index) => {

			let label = (typeof testCase.label === 'undefined' || testCase.label === null) ? `Test#${index}` : testCase.label;

			// @ts-ignore
			it(label, function ()
			{
				if (testCase.throw)
				{
					expect(function ()
					{
						// @ts-ignore
						return parseFunc(...testCase.args)
					}).to.be.throw();
				}
				else
				{
					// @ts-ignore
					let actual = parseFunc(...testCase.args);
					let expected = testCase.expected;

					expect(actual).to.be.ok;
					expect(actual).to.be.deep.equal(expected);
				}
			})

		});
	});
});

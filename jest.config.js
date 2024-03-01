/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
	'**/*.ts',
	'!**/node_modules/**',
	'!**/dist/**'
  ],
};

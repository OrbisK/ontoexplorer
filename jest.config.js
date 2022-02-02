module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  collectCoverage:true,
  coverageDirectory: 'coverage',
  coverageReporters: ["text","text-summary","cobertura"],
  testPathIgnorePatterns: [
  "/nodeModules/"
  ],
  verbose:true,
  coverageThreshold: {
	global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
	}
  }
} 

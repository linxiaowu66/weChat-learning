module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'webpack/webpack.config.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    "semi": 0,
    "max-len": ["error", 120, 4, {
      "comments": 80
    }],
    "comma-dangle": ["error", "never"],
    'no-underscore-dangle': 0,
    'func-names': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  "env": {
    "browser": true,
    "node": true,
    "jasmine": true,
    "jquery": true
  },
  "globals": {
    "wx": true
  }
}

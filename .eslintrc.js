module.exports = {
   "env": {
       "commonjs": true,
       "es2021": true,
       "node": true
   },
   "overrides": [
       {
           "env": {
               "node": true
           },
           "files": [
               ".eslintrc.{js,cjs}"
           ],
           "parserOptions": {
               "sourceType": "script"
           }
       }
   ],
   "parserOptions": {
       "ecmaVersion": "latest"
   },
   'plugins': [
      '@stylistic/js'
  ],
  'extends': 'eslint:recommended',
  'rules': {
      '@stylistic/js/indent': [
          'error',
          2
      ],
      '@stylistic/js/linebreak-style': [
          'error',
          'unix'
      ],
      '@stylistic/js/quotes': [
          'error',
          'single'
      ],
      '@stylistic/js/semi': [
          'error',
          'never'
      ],
  }
}
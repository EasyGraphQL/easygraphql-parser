<h1 align="center">
  <img src="https://raw.githubusercontent.com/EasyGraphQL/easygraphql-now/master/logo.png" alt="EasyGraphQL Mock " width="350">
  <br>
    easygraphql-parser
  <br>
  <br>
</h1>

[![Coverage Status](https://coveralls.io/repos/github/EasyGraphQL/easygraphql-parser/badge.svg?branch=master)](https://coveralls.io/github/EasyGraphQL/easygraphql-parser?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/EasyGraphQL/easygraphql-parser.svg)](https://greenkeeper.io/)

easygraphql-parser is a node library used to parse the GraphQL schema into a JS object.

## Installation

```bash
$ npm install easygraphql-parser --save
```

## Usage
To get started with the mocks, you might need to follow the next steps:

### Schema

```gql
type Family {
  name: String!
  ages: [Int!]!
}

type Query {
  getFamily: Family
}
```

### Parser
```js
'use strict'

const fs = require('fs')
const path = require('path')
const easygraphqlSchemaParser = require('easygraphql-parser')

const schemaCode = fs.readFileSync(path.join(__dirname, 'schema', 'schema.gql'), 'utf8')

const schema = easygraphqlSchemaParser(schemaCode)
console.log(schema)
```

### Result
```js
{ 
  Family: { 
    type: 'ObjectType',
    description: undefined,
    fields: [ 
      { 
        name: 'name',
        arguments: [],
        noNull: true,
        isArray: false,
        noNullArrayValues: false
        type: 'String',
        isDeprecated: false
      },
      { 
        name: 'ages',
        arguments: [],
        noNull: true,
        isArray: true,
        noNullArrayValues: true
        type: 'Int',
        isDeprecated: false
      } 
    ],
    values: [] 
  },
  Query: { 
    type: 'ObjectType',
    description: undefined,
    fields:  [ 
      { 
        name: 'getFamily',
        arguments: [],
        noNull: false,
        isArray: false,
        noNullArrayValues: false
        type: 'Family',
        isDeprecated: false
      } 
    ],
    values: [] 
  } 
}
```

# License
### The MIT License

Copyright (c) 2018 EasyGraphQL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
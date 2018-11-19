/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

'use strict'

const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const schemaParser = require('../lib/schemaParser')

const schemaCode = fs.readFileSync(path.join(__dirname, 'schema', 'schema.gql'), 'utf8')
const studentSchema = fs.readFileSync(path.join(__dirname, 'schema', 'student.gql'), 'utf8')
const schoolSchema = fs.readFileSync(path.join(__dirname, 'schema', 'school.gql'), 'utf8')
const invalidSchemaDefinition = fs.readFileSync(path.join(__dirname, 'schema', 'invalidSchemaDefinition.gql'), 'utf8')
const invalidSchemaTypeName = fs.readFileSync(path.join(__dirname, 'schema', 'invalidSchemaTypeName.gql'), 'utf8')
const multiplesOperations = fs.readFileSync(path.join(__dirname, 'schema', 'multiplesOperations.gql'), 'utf8')
const missingOperation = fs.readFileSync(path.join(__dirname, 'schema', 'missingOperation.gql'), 'utf8')

describe('Parse GraphQL schema into an object', () => {
  let schema

  before(() => {
    schema = schemaParser(schemaCode)
  })

  describe('schemaDefinition', () => {
    it('Schema should have the Query property', () => {
      expect(schema).to.exist
      expect(schema.Query).to.exist
    })
  })

  describe('Type Me', () => {
    it('Schema should have the type Me', () => {
      expect(schema.Me).to.exist
      expect(schema.Me.type).to.be.eq('ObjectType')
      expect(schema.Me.description).to.be.eq(undefined)
      expect(schema.Me.fields.length).to.be.gt(0)
      expect(schema.Me.fields.length).to.be.eq(9)
    })

    it('Schema should have the properties with the null type and array type', () => {
      expect(schema.Me.fields).to.have.deep.include({ name: 'id', type: 'ID', noNull: true, isArray: false, arguments: [] })
      expect(schema.Me.fields).to.have.deep.include({ name: 'email', type: 'String', noNull: false, isArray: false, arguments: [] })
      expect(schema.Me.fields).to.have.deep.include({ name: 'username', type: 'String', noNull: true, isArray: true, arguments: [] })
      expect(schema.Me.fields).to.have.deep.include({ name: 'fullName', type: 'String', noNull: true, isArray: false, arguments: [] })
      expect(schema.Me.fields).to.have.deep.include({ name: 'phone', type: 'Int', noNull: true, isArray: true, arguments: [] })
      expect(schema.Me.fields).to.have.deep.include({ name: 'apiKey', type: 'String', noNull: true, isArray: false, arguments: [] })
    })
  })

  describe('Type User', () => {
    it('Schema should have the type User', () => {
      expect(schema.User).to.exist
      expect(schema.User.type).to.be.eq('ObjectType')
      expect(schema.User.description).to.be.eq(undefined)
      expect(schema.User.fields.length).to.be.gt(0)
      expect(schema.User.fields.length).to.be.eq(5)
    })

    it('Schema should have the properties with the null type and array type', () => {
      expect(schema.User.fields).to.have.deep.include({ name: 'email', type: 'String', noNull: true, isArray: false, arguments: [] })
      expect(schema.User.fields).to.have.deep.include({ name: 'username', type: 'String', noNull: true, isArray: false, arguments: [] })
      expect(schema.User.fields).to.have.deep.include({ name: 'fullName', type: 'String', noNull: true, isArray: false, arguments: [] })
      expect(schema.User.fields).to.have.deep.include({ name: 'phone', type: 'String', noNull: true, isArray: false, arguments: [] })
    })
  })

  describe('Type Query', () => {
    it('Schema should have the type Query with all the queries', () => {
      expect(schema.Query).to.exist
      expect(schema.Query.type).to.be.eq('ObjectType')
      expect(schema.Query.description).to.be.eq(undefined)
      expect(schema.Query.fields.length).to.be.gt(0)
      expect(schema.Query.fields.length).to.be.eq(2)
    })

    it('Schema should have the properties with the null type and array type', () => {
      const getUserByUsernameArguments = [{ name: 'username', noNull: true, isArray: false, type: 'String' }, { name: 'id', noNull: true, isArray: false, type: 'Int' }]
      expect(schema.Query.fields).to.have.deep.include({ name: 'getMe', type: 'Me', noNull: false, isArray: false, arguments: [] })
      expect(schema.Query.fields).to.have.deep.include({ name: 'getUserByUsername', type: 'User', noNull: false, isArray: false, arguments: getUserByUsernameArguments })
    })
  })
})

describe('Parse GraphQL schema arr into an object', () => {
  let schema

  before(() => {
    schema = schemaParser([studentSchema, schoolSchema])
  })

  describe('schemaDefinition', () => {
    it('Schema should have the Query property', () => {
      expect(schema).to.exist
      expect(schema.Query).to.exist
    })
  })
})

describe('Should return an error if there are multiples schema definition', () => {
  describe('schemaDefinition', () => {
    it('Should be an error if there are multiples schemas definitions', () => {
      let error
      try {
        schemaParser(invalidSchemaDefinition)
      } catch (err) {
        error = err
      }

      expect(error).to.exist
      expect(error.message).to.be.eq('Must provide only one schema definition.')
    })
  })
})

describe('Should return an error if there are multiples types with the same name', () => {
  describe('schemaDefinition', () => {
    it('Should be an error if there are multiples types with the same name', () => {
      let error
      try {
        schemaParser(invalidSchemaTypeName)
      } catch (err) {
        error = err
      }

      expect(error).to.exist
      expect(error.message).to.be.eq('Type "School" was defined more than once.')
    })
  })
})

describe('Should return an error if there are multiples operations on schema definition', () => {
  describe('schemaDefinition', () => {
    it('Should be an error if there are multiples operations schemas definitions', () => {
      let error
      try {
        schemaParser(multiplesOperations)
      } catch (err) {
        error = err
      }

      expect(error).to.exist
      expect(error.message).to.be.eq('Must provide only one query type in schema.')
    })
  })
})

describe('Should return an error if there is a missing operation on schema definition', () => {
  describe('schemaDefinition', () => {
    it('Should be an error if there is a missing operation schemas definitions', () => {
      let error
      try {
        schemaParser(missingOperation)
      } catch (err) {
        error = err
      }

      expect(error).to.exist
      expect(error.message).to.be.eq('Specified query type "Query" not found in document.')
    })
  })
})

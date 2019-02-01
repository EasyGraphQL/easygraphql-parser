/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

'use strict'

const { Kind } = require('graphql')
const { expect } = require('chai')
const schemaParser = require('../lib/schemaParser')
const schemaCode = require('./schema-json/schema')

describe('Parse GraphQL schema into an object', () => {
  let schema

  before(() => {
    schema = schemaParser(schemaCode)
  })

  describe('schemaDefinition', () => {
    it('Schema should have the query/mutation property', () => {
      expect(schema).to.exist
      expect(schema.schemaDefinition.query).to.exist
      expect(schema.schemaDefinition.mutation).to.exist
    })
  })

  describe('Type RootQuery', () => {
    it('Schema should have the type RootQuery', () => {
      expect(schema.RootQuery).to.exist
      expect(schema.RootQuery.type).to.be.eq(Kind.OBJECT_TYPE_DEFINITION)
      expect(schema.RootQuery.description).to.be.eq(undefined)
      expect(schema.RootQuery.fields.length).to.be.gt(0)
      expect(schema.RootQuery.fields.length).to.be.eq(1)
    })

    it('Schema should have the properties with the null type and array type', () => {
      expect(schema.RootQuery.fields).to.have.deep.include({ name: 'getUser', type: 'User', noNull: false, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
    })
  })

  describe('Type RootMutation', () => {
    it('Schema should have the type RootMutation', () => {
      expect(schema.RootMutation).to.exist
      expect(schema.RootMutation.type).to.be.eq(Kind.OBJECT_TYPE_DEFINITION)
      expect(schema.RootMutation.description).to.be.eq(undefined)
      expect(schema.RootMutation.fields.length).to.be.gt(0)
      expect(schema.RootMutation.fields.length).to.be.eq(1)
    })

    it('Schema should have the properties with the null type and array type', () => {
      const args = [{ name: 'input', noNull: true, isArray: false, type: 'UserInput', noNullArrayValues: false, isDeprecated: false }]
      expect(schema.RootMutation.fields).to.have.deep.include({ name: 'createUser', type: 'User', noNull: false, isArray: false, arguments: args, noNullArrayValues: false, isDeprecated: false })
    })
  })

  describe('Type User', () => {
    it('Schema should have the type User', () => {
      expect(schema.User).to.exist
      expect(schema.User.type).to.be.eq(Kind.OBJECT_TYPE_DEFINITION)
      expect(schema.User.description).to.be.eq(undefined)
      expect(schema.User.fields.length).to.be.gt(0)
      expect(schema.User.fields.length).to.be.eq(5)
    })

    it('Schema should have the properties with the null type and array type', () => {
      expect(schema.User.fields).to.have.deep.include({ name: 'id', type: 'ID', noNull: true, isArray: true, arguments: [], noNullArrayValues: true, isDeprecated: false })
      expect(schema.User.fields).to.have.deep.include({ name: 'email', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
      expect(schema.User.fields).to.have.deep.include({ name: 'username', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
      expect(schema.User.fields).to.have.deep.include({ name: 'fullName', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
      expect(schema.User.fields).to.have.deep.include({ name: 'lastNames', type: 'String', noNull: true, isArray: true, arguments: [], noNullArrayValues: false, isDeprecated: false })
    })
  })

  describe('Type UserInput', () => {
    it('Schema should have the type UserInput', () => {
      expect(schema.UserInput).to.exist
      expect(schema.UserInput.type).to.be.eq(Kind.INPUT_OBJECT_TYPE_DEFINITION)
      expect(schema.UserInput.description).to.be.eq(undefined)
      expect(schema.UserInput.fields.length).to.be.gt(0)
      expect(schema.UserInput.fields.length).to.be.eq(4)
    })

    it('Schema should have the properties with the null type and array type', () => {
      expect(schema.UserInput.fields).to.have.deep.include({ name: 'email', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
      expect(schema.UserInput.fields).to.have.deep.include({ name: 'username', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
      expect(schema.UserInput.fields).to.have.deep.include({ name: 'fullName', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
      expect(schema.UserInput.fields).to.have.deep.include({ name: 'password', type: 'String', noNull: true, isArray: false, arguments: [], noNullArrayValues: false, isDeprecated: false })
    })
  })
})

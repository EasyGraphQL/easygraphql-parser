'use strict'

const { parse, Kind, printSchema, buildClientSchema, GraphQLSchema, buildASTSchema } = require('graphql')
const { mergeTypes } = require('merge-graphql-schemas')

function getOperationTypes (schema, nodeMap) {
  const opTypes = {}
  const s = parseSchema(nodeMap)
  schema.operationTypes.forEach((operationType) => {
    const typeName = operationType.type.name.value
    const operation = operationType.operation

    if (opTypes[operation]) {
      throw new Error('Must provide only one ' + operation + ' type in schema.')
    }
    if (!nodeMap[typeName]) {
      throw new Error('Specified ' + operation + ' type "' + typeName + '" not found in document.')
    }

    opTypes[operation] = {
      type: operationType.kind,
      operation,
      field: typeName
    }
  })

  return Object.assign({ schemaDefinition: opTypes }, s)
}

function schemaBuilder (doc) {
  let schemaDef = void 0

  const nodeMap = Object.create(null)
  const directiveDefs = []
  for (let i = 0; i < doc.definitions.length; i++) {
    const d = doc.definitions[i]
    const typeName = d && d.name ? d.name.value : undefined
    switch (d.kind) {
      case Kind.SCHEMA_DEFINITION:
        if (schemaDef) {
          throw new Error('Must provide only one schema definition.')
        }
        schemaDef = d
        break
      case Kind.SCALAR_TYPE_DEFINITION:
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.INTERFACE_TYPE_DEFINITION:
      case Kind.ENUM_TYPE_DEFINITION:
      case Kind.UNION_TYPE_DEFINITION:
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        // Check if it is already define, it can only be one time
        if (nodeMap[typeName]) {
          throw new Error('Type "' + typeName + '" was defined more than once.')
        }
        nodeMap[typeName] = d
        break
      case Kind.OBJECT_TYPE_EXTENSION:
        if (nodeMap[typeName]) {
          nodeMap[typeName].fields = [].concat(nodeMap[typeName].fields, d.fields)
          break
        }
        nodeMap[typeName] = d
        break
      case Kind.DIRECTIVE_DEFINITION:
        directiveDefs.push(d)
        break

      default:
        break
    }
  }

  const operationTypes = schemaDef ? getOperationTypes(schemaDef, nodeMap) : parseSchema(nodeMap)

  return operationTypes
}

/**
 * Find the type of a field on the Schema
 * @param node - The graph schema
 * @param typeInfo - The object with the recursive values
 * @returns {{type: String, noNull: Boolean, isArray: Boolean}}
 */
function findType (node, typeInfo, nestedCall) {
  typeInfo = typeInfo || { noNull: false, isArray: false, noNullArrayValues: false }
  if (!node) {
    return typeInfo
  }

  // Validate nested call, the parser will check first if the array can be null
  // then it will check if the values inside can be null
  if (!nestedCall && node.kind === 'NonNullType') {
    typeInfo.noNull = true
  }

  // If it is an array, validate if the values inside can be null
  if (nestedCall && typeInfo.isArray && node.kind === 'NonNullType') {
    typeInfo.noNullArrayValues = true
  }

  if (node.kind === 'ListType') {
    typeInfo.isArray = true
  }

  if (node.name) {
    typeInfo.type = node.name.value
  }

  return findType(node.type, typeInfo, true)
}

/**
 * Find the arguments that are used on the Schema
 * @param node - The graph schema
 * @returns {[{name: String, noNull: Boolean, isArray: Boolean, type: String}]}
 */
function findArguments (node) {
  if (!node) {
    return []
  }

  return node.map(arg => {
    const name = arg.name.value
    const fieldType = findType(arg.type)
    const isDeprecated = validateIfDeprecated(arg.directives)

    return Object.assign({ name, isDeprecated }, fieldType)
  })
}

/**
 * Check if a field is deprecated
 * @param directives - Receive the directives array
 * @returns {boolean}
 */
function validateIfDeprecated (directives) {
  if (!directives.length) {
    return false
  }

  return directives.some(directive => directive.name.value === 'deprecated')
}

function parseSchema (types) {
  const parsedTypes = {}
  // Loop all the types (Scalar, Type, Input, Query, Mutation)
  for (const key of Object.keys(types)) {
    const type = types[key]
    const parsedType = {
      type: type.kind,
      description: type.description,
      fields: [],
      values: [],
      types: [],
      implementedTypes: []
    }

    if (type.fields) {
      const fields = []
      type.fields.forEach(field => {
        // Set the name of the field used on the Schema
        const name = field.name.value
        // Get the type of the field, also check if is require and array
        const fieldType = findType(field.type)
        // Get the arguments that are require on the Schema
        const typeArguments = findArguments(field.arguments)

        const isDeprecated = validateIfDeprecated(field.directives)
        const newField = Object.assign({ name, arguments: typeArguments, isDeprecated }, fieldType)
        fields.push(newField)
      })
      parsedType.fields = fields
    } else if (type.values) {
      const values = type.values.map(val => val.name.value)
      parsedType.values = values
    } else if (type.types) {
      const types = type.types.map(val => val.name.value)
      parsedType.types = types
    }

    if (type.interfaces) {
      const types = type.interfaces.map(val => val.name.value)
      parsedType.implementedTypes = types
    }

    parsedTypes[key] = parsedType
  }

  // loop all the parsed types to check if those types implements an interface
  for (const key of Object.keys(parsedTypes)) {
    const implementedTypes = parsedTypes[key].implementedTypes
    if (implementedTypes.length) {
      // set to each interface the types that implement itself.
      implementedTypes.forEach(implementedType => {
        if (parsedTypes[implementedType].type === Kind.INTERFACE_TYPE_DEFINITION) {
          parsedTypes[implementedType].implementedTypes.push(key)
        }
      })
    }
  }

  return parsedTypes
}

function schemaParser (source) {
  if (Array.isArray(source)) {
    source = mergeTypes(source, { all: true })
  }

  if (typeof source === 'object') {
    if (source instanceof GraphQLSchema) {
      source = printSchema(source)
    } else if (source.kind === 'Document') {
      source = printSchema(buildASTSchema(source))
    } else {
      source = source.data ? source.data : source
      source = printSchema(buildClientSchema(source))
    }
  }

  return schemaBuilder(parse(source, { allowLegacySDLImplementsInterfaces: true }))
}

module.exports = schemaParser

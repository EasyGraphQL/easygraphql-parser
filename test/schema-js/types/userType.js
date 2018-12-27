const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} = require('graphql')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
      id: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))) },
      email: { type: GraphQLNonNull(GraphQLString) },
      username: { type: GraphQLNonNull(GraphQLString) },
      fullName: { type: GraphQLNonNull(GraphQLString) },
      lastNames: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
    }
  }
})

module.exports = UserType

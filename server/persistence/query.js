import JWT from 'jsonwebtoken'
import sha1 from 'sha1'

const query = secret => ({
  schemaComposer,
  composers,
}) => {
  const userFindById = composers.User.getResolver('findById')
  const userFindOne = composers.User.getResolver('findOne')
  const userCreateOne = composers.User.getResolver('createOne')
  const userUpdateById = composers.User.getResolver('updateById')


  schemaComposer.Query.addFields({
    auth: {
      type: `type Auth {
            success:Boolean
            user:User
            message:String
        }`,
      resolve: async (source, args, context, info) => {
        if (!context.user._id) {
          return {
            success: false,
            message: 'Nope',
          }
        }
        const user = await userFindById.resolve({
          source,
          args: context.user,
          context,
          info,
        })
        if (String(user._id) === String(context.user._id)) {
          return {
            success: true,
            user,
          }
        }
        return {
          success: false,
          message: 'Nope',
        }
      },
    },
    connect: {
      args: {
        mail: 'String',
        password: 'String',
      },
      type: `type Connect {
        token:String
        error:String
    }`,
      resolve: async (source, args, context, info) => {
        const user = await userFindOne.resolve({
          source,
          info,
          context,
          args: {
            filter: {
              mail: args.mail,
            },
          },
        })
        if (!user) {
          return {
            error: 'Who are you ???? User not found.',
          }
        }
        const pwd = sha1(args.password + user._id)
        if (user.password === pwd) {
          return {
            token: JWT.sign(
              { id: user._id },
              secret,
              { expiresIn: '7d' },
            ),
          }
        }
        return {
          error: 'NOPE. Wrong credentials',
        }
      },
    },
  })

  schemaComposer.Mutation.addFields({
    register: {
      args: {
        password: 'String',
        mail: 'String',
        username: 'String',
      },
      type: 'Boolean',
      resolve: async (source, args, context, info) => {
        const user = await userCreateOne.resolve({
          source,
          info,
          context,
          args: {
            record: {
              username: args.username,
              mail: args.mail,
            },
          },
        })
        const pwd = sha1(args.password + user.recordId)
        await userUpdateById.resolve({
          source,
          info,
          context,
          args: {
            record: {
              _id: user.recordId,
              password: pwd,
            },
          },
        })
        return true
      },
    },
  })
}

export default query

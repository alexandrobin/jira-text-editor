import {SchemaTypes as Types,} from 'mongoose'

export default {
  username: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mail: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  admin: Boolean,
  notes: [{
    type: Types.ObjectId,
    ref: 'notes',
  }],
}

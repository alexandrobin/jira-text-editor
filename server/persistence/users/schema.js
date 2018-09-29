import {
  SchemaTypes as Types,
} from 'mongoose'

export default {
  username: {
    type: String,
    required: true,
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
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: Boolean,
  notes: [{
    type: Types.ObjectId,
    ref: 'notes',
  }],
}

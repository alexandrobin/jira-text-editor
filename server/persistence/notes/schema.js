import {
  SchemaTypes as Types,
} from 'mongoose'

export default {
  title: Types.String,
  value: Types.String,
  status: Types.Number, // 0 - Draft // 1 - Active // 2 - Archive
  createdBy: {
    type: Types.ObjectId,
    ref: 'users',
  },
  sharedTo: {
    type: Types.ObjectId,
    ref: 'users',
  },
  ts: {
    type: Date,
    required: true,
    default: Date.now,
  },
}

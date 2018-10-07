export default async ({
  args,
  context,
}) => {
  const newArgs = { ...args  }

  newArgs.filter = newArgs.filter || {}
  newArgs.filter.createdBy = context.user._id

  if (!newArgs.filter.createdBy) {
    throw new Error('Notes can only be accessed while logged in!')
  }

  return newArgs
}

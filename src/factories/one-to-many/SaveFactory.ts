import { Relationship } from '../../types/Factory'

export const OneToManySaveFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.PostSaveMiddleware | undefined => {
  if (!localField || !foreignField) return undefined
  return async function (doc) {
    const foreignModel = doc.$model(foreignModelName)
    const { modelName: initiator } = doc.$model()

    // Update related documents
    const isRequired = foreignModel.schema.path(foreignField)?.isRequired
    if (isRequired || cascade) {
      await foreignModel.deleteMany(
        {
          _id: { $nin: doc.get(localField) },
          [foreignField]: doc._id,
        },
        { initiator }
      )
    } else {
      await foreignModel.updateMany(
        { _id: { $nin: doc.get(localField) }, [foreignField]: doc._id },
        { $unset: { [foreignField]: 1 } },
        { initiator }
      )
    }
    await foreignModel.updateMany(
      { _id: doc.get(localField) },
      { [foreignField]: doc._id },
      { initiator }
    )
  }
}

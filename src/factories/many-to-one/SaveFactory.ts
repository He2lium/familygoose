import { Relationship } from '../../types/Factory'

export const ManyToOneSaveFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string
): Relationship.PostSaveMiddleware | undefined => {
  if (!foreignField || !localField) return undefined
  return async function (doc) {
    const foreignModel = doc.$model(foreignModelName)
    const { modelName: localModelName } = doc.$model()

    if (!doc.get(localField)) return

    // Update related documents
    await foreignModel.updateMany(
      { _id: doc.get(localField) },
      { $addToSet: { [foreignField]: doc._id } },
      { initiator: localModelName }
    )
    await foreignModel.updateMany(
      { [foreignField]: doc._id, _id: { $ne: doc.get(localField) } },
      { $pull: { [foreignField]: doc._id } },
      { initiator: localModelName }
    )
  }
}

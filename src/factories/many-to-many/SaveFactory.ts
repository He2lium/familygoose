import { Model, models, Types } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToManySaveFactory = (
  foreignModelName: string,
  foreignField: string,
  localField?: string
): Relationship.PostSaveMiddleware | undefined => {
  if (!localField) return undefined
  return async function (doc) {
    if (!doc.get(localField)) return
    const foreignModel = doc.$model(foreignModelName)
    const { modelName } = this.constructor as Model<any>

    // Update related documents
    await foreignModel.updateMany(
      { _id: { $nin: doc.get(localField) }, [foreignField]: doc._id },
      { $pull: { [foreignField]: doc._id } },
      { initiator: modelName }
    )
    await foreignModel.updateMany(
      { _id: { $in: doc.get(localField) } },
      { $addToSet: { [foreignField]: doc._id } },
      { initiator: modelName }
    )
  }
}

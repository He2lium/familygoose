import { models } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToOneDestroyFactory = (
  foreignModelName: string,
  foreignField?: string,
): Relationship.PostQueryMiddleware | undefined => {
  if (!foreignField) return undefined
  return async function (doc) {
    const foreignModel = models[foreignModelName]
    if (!foreignModel.schema.path(foreignField)) return

    // Update related documents
    await foreignModel.updateMany(
      { [foreignField]: doc._id },
      { $pull: { [foreignField]: doc._id } },
      { initiator: this.model.modelName },
    )
  }
}

export const ManyToOneDestroyManyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!foreignField || !localField) return undefined
  return async function (_res) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = models[foreignModelName]

    // Update related documents
    await foreignModel.updateMany(
      { [foreignField]: { $in: this.localIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName },
    )
  }
}

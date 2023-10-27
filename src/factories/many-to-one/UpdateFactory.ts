import { Types } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToOneUpdateFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string
): Relationship.PostQueryMiddleware | undefined => {
  if (!foreignField || !localField) return undefined
  return async function (doc) {
    const foreignModel = doc.$model(foreignModelName)

    if (!doc.get(localField)) {
      // consider the case for { overwrite: true }
      await foreignModel.updateMany(
        { [foreignField]: doc._id },
        { $pull: { [foreignField]: doc._id } },
        { initiator: this.model.modelName }
      )
      return
    }

    // Update related documents
    await foreignModel.updateMany(
      { _id: doc.get(localField) },
      { $addToSet: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
    await foreignModel.updateMany(
      { [foreignField]: doc._id, _id: { $ne: doc.get(localField) } },
      { $pull: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
  }
}

export const ManyToOneUpdateManyFactory = (
  localField?: string,
  foreignField?: string
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!foreignField || !localField) return undefined
  return async function (_res) {
    if (this.getOptions().initiator === this.foreignModel.modelName) return

    const foreignIds = await this.model.distinct<Types.ObjectId>(localField, this.getFilter())

    // Update related documents
    if (foreignIds)
      await this.foreignModel.updateMany(
        { _id: foreignIds },
        { $addToSet: { [foreignField]: this.localIds } },
        { initiator: this.model.modelName }
      )
    await this.foreignModel.updateMany(
      { [foreignField]: { $in: this.localIds }, _id: { $nin: foreignIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName }
    )
  }
}

import { models, Types } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToManyUpdateFactory = (
  foreignModelName: string,
  foreignField: string,
  localField?: string
): Relationship.PostQueryMiddleware | undefined => {
  if (!localField) return undefined
  return async function (doc) {
    const foreignModel = doc.$model(foreignModelName)

    // Update related documents
    await foreignModel.updateMany(
      { _id: { $nin: doc.get(localField) }, [foreignField]: doc._id },
      { $pull: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
    await foreignModel.updateMany(
      { _id: { $in: doc.get(localField) } },
      { $addToSet: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
  }
}

export const ManyToManyUpdateManyFactory = (
  foreignModelName: string,
  foreignField: string,
  localField?: string
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!localField) return undefined
  return async function (_res, next) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = this.mongooseCollection.conn.models[foreignModelName]

    this.foreignIds = await this.model.distinct<Types.ObjectId>(localField, this.getFilter())

    // Update related documents
    await foreignModel.updateMany(
      {
        _id: { $nin: this.foreignIds },
        [foreignField]: { $in: this.localIds },
      },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName }
    )
    await foreignModel.updateMany(
      { _id: { $in: this.foreignIds } },
      { $addToSet: { [foreignField]: this.localIds } },
      { initiator: this.model.modelName }
    )
  }
}

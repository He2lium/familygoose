import mongoose, { Types, models } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const OneToManyUpdateFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.PostQueryMiddleware | undefined => {
  if (!localField || !foreignField) return undefined
  return async function (doc) {
    const foreignModel = doc.$model(foreignModelName)

    // Update related documents
    const isRequired = !!foreignModel.schema.path(foreignField)?.isRequired

    if (isRequired || cascade) {
      await foreignModel.deleteMany(
        {
          _id: { $nin: doc.get(localField) },
          [foreignField]: doc._id,
        },
        { initiator: this.model.modelName }
      )
    } else {
      await foreignModel.updateMany(
        { _id: { $nin: doc.get(localField) }, [foreignField]: doc._id },
        { $unset: { [foreignField]: 1 } },
        { initiator: this.model.modelName }
      )
    }
    await foreignModel.updateMany(
      { _id: { $in: doc.get(localField) } },
      { $set: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
  }
}

export const OneToManyUpdateManyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!localField || !foreignField) return undefined
  return async function (_res) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = this.mongooseCollection.conn.models[foreignModelName]

    // Update related documents
    const isRequired = !!foreignModel.schema.path(foreignField)?.isRequired

    const foreignIds = await this.model.distinct<Types.ObjectId>(localField, this.getFilter())

    if (isRequired || cascade) {
      await foreignModel.deleteMany(
        {
          _id: { $nin: foreignIds },
          [foreignField]: this.localIds,
        },
        { initiator: this.model.modelName }
      )
    } else {
      await foreignModel.updateMany(
        { _id: { $nin: foreignIds }, [foreignField]: this.localIds },
        { $unset: { [foreignField]: true } },
        { initiator: this.model.modelName }
      )
    }
  }
}

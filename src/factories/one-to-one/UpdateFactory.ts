import { Types, models } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const OneToOneUpdateFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.PostQueryMiddleware | undefined => {
  if (!localField || !foreignField) return undefined
  return async function (doc) {
    const foreignModel = models[foreignModelName]

    // Update related documents
    const isRequired = !!foreignModel.schema.path(foreignField)?.isRequired

    if (isRequired || cascade) {
      await foreignModel.deleteMany(
        {
          _id: { $ne: doc.get(localField) },
          [foreignField]: doc._id,
        },
        { initiator: this.model.modelName }
      )
    } else {
      await foreignModel.updateMany(
        { _id: { $ne: doc.get(localField) }, [foreignField]: doc._id },
        { $unset: { [foreignField]: 1 } },
        { initiator: this.model.modelName }
      )
    }
    await foreignModel.updateMany(
      { _id: doc.get(localField) },
      { $set: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
  }
}

export const OneToOneUpdateManyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!localField || !foreignField) return undefined
  return async function (_res) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = models[foreignModelName]

    // Update related documents
    const isRequired = !!foreignModel.schema.path(foreignField)?.isRequired

    this.foreignIds = await this.model.distinct<Types.ObjectId>(localField, this.getFilter())

    if (isRequired || cascade) {
      await foreignModel.deleteMany(
        {
          _id: { $nin: this.foreignIds },
          [foreignField]: this.localIds,
        },
        { initiator: this.model.modelName }
      )
    } else {
      await foreignModel.updateMany(
        { _id: { $nin: this.foreignIds }, [foreignField]: this.localIds },
        { $unset: { [foreignField]: true } },
        { initiator: this.model.modelName }
      )
    }
  }
}

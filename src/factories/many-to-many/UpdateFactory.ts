import { models, Types } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToManyUpdateFactory = (
  foreignModelName: string,
  localField: string,
  foreignField: string
): Relationship.PostQueryMiddleware =>
  async function (doc) {
    const foreignModel = models[foreignModelName]

    if (!doc.get(localField)) return

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

export const ManyToManyUpdateManyFactory = (
  foreignModelName: string,
  localField: string,
  foreignField: string
): Relationship.PostQueryResponseMiddleware =>
  async function (_res, next) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = models[foreignModelName]

    this.foreignIds = await this.model.distinct<Types.ObjectId>(localField, this.getFilter())

    // Update related documents
    await foreignModel.updateMany(
      { _id: { $nin: this.foreignIds }, [foreignField]: { $in: this.localIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName }
    )
    await foreignModel.updateMany(
      { _id: { $in: this.foreignIds } },
      { $addToSet: { [foreignField]: this.localIds } },
      { initiator: this.model.modelName }
    )
  }

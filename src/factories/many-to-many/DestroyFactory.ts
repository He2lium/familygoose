import { models } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToManyDestroyFactory = (
  foreignModelName: string,
  localField: string,
  foreignField: string
): Relationship.PostQueryMiddleware =>
  async function (doc, next) {
    if (doc.get(localField)) {
      const foreignModel = models[foreignModelName]

      // Update related documents
      await foreignModel.updateMany(
        { _id: { $in: doc.get(localField) } },
        { $pull: { [foreignField]: doc._id } },
        { initiator: this.model.modelName }
      )
    }
    next()
  }

export const ManyToManyDestroyManyFactory = (
  foreignModelName: string,
  foreignField: string
): Relationship.PostQueryResponseMiddleware =>
  async function (_res, next) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = models[foreignModelName]

    // Update related documents
    await foreignModel.updateMany(
      { [foreignField]: { $in: this.localIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName }
    )
    next()
  }

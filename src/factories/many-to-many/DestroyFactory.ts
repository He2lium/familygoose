import { FilterQuery, models } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const ManyToManyDestroyFactory = (
  foreignModelName: string,
  foreignField: string,
  localField?: string,
): Relationship.PostQueryMiddleware | undefined => {
  if (!foreignField) return undefined

  return async function (doc, next) {
    const foreignModel = models[foreignModelName]

    const queryFilter: FilterQuery<any> & { $or: FilterQuery<any>[] } = {
      $or: [],
    }

    if (localField) queryFilter.$or.push({ _id: { $in: doc.get(localField) } })
    queryFilter.$or.push({ [foreignField]: doc._id })

    // Update related documents
    await foreignModel.updateMany(
      queryFilter,
      { $pull: { [foreignField]: doc._id } },
      { initiator: this.model.modelName },
    )

    next()
  }
}

export const ManyToManyDestroyManyFactory = (
  foreignModelName: string,
  foreignField: string,
): Relationship.PostQueryResponseMiddleware =>
  async function (_res, next) {
    if (this.getOptions().initiator === foreignModelName) return

    const foreignModel = models[foreignModelName]

    // Update related documents
    await foreignModel.updateMany(
      { [foreignField]: { $in: this.localIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName },
    )
    next()
  }

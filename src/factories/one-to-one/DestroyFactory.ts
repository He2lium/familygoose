import { FilterQuery, Types, models } from 'mongoose'
import { Relationship } from '../../types/Factory'

export const OneToOneDestroyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false,
): Relationship.PostQueryMiddleware | undefined => {
  if (!foreignField) return undefined
  return async function (doc) {
    const foreignModel = models[foreignModelName]

    const queryFilter: FilterQuery<any> & { $or: FilterQuery<any>[] } = { $or: [] }

    if (localField) queryFilter.$or.push({ _id: doc.get(localField) })
    queryFilter.$or.push({ [foreignField]: doc._id })

    // Get required status of  relationship field
    const isRequired = Boolean(foreignField && foreignModel.schema.path(foreignField)?.isRequired)

    // Update related documents
    if (isRequired || cascade) {
      await foreignModel.deleteMany(queryFilter, { initiator: this.model.modelName })
    } else {
      await foreignModel.updateMany(
        queryFilter,
        { $unset: { [foreignField]: true } },
        { initiator: this.model.modelName },
      )
    }
  }
}

export const OneToOneDestroyManyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false,
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!localField && !foreignField) return undefined
  return async function (_res) {
    const foreignModel = models[foreignModelName]

    const queryFilter: FilterQuery<any> & { $or: FilterQuery<any>[] } = { $or: [] }

    if (localField) {
      const foreignIds = await this.model.distinct<Types.ObjectId>(localField, this.getFilter())
      queryFilter.$or.push({ _id: foreignIds })
    }
    if (foreignField) queryFilter.$or.push({ [foreignField]: this.localIds })

    // Get required status of  relationship field
    const isRequired = Boolean(foreignField && foreignModel.schema.path(foreignField)?.isRequired)

    // Update related documents
    if (isRequired || cascade) {
      await foreignModel.deleteMany(queryFilter, { initiator: this.model.modelName })
    } else if (foreignField) {
      await foreignModel.updateMany(
        queryFilter,
        { $unset: { [foreignField]: true } },
        { initiator: this.model.modelName },
      )
    }
  }
}

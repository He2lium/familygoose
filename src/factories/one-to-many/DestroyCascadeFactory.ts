import { FilterQuery, Model, models, PreMiddlewareFunction, Types } from 'mongoose'

export const OneToManyDestroyCascadeFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): PreMiddlewareFunction | undefined => {
  return async function (next) {
    // Get models and originalQuery
    const foreignModel = models[foreignModelName]
    const localModel: Model<any> = this.model
    const originalQuery: FilterQuery<any> = this.getQuery()

    const touchableLocalIds = await localModel
      .find(originalQuery)
      .distinct<Types.ObjectId>('_id')
      .exec()

    // Set touchable list of depending on documents
    let deleteManyIdList: Types.ObjectId[] = []
    if (localField) {
      const relationshipLists = await localModel
        .find(originalQuery)
        .distinct<Types.ObjectId[]>(localField)
        .exec()
      for (let list of relationshipLists) deleteManyIdList = [...deleteManyIdList, ...list]
    }
    if (foreignField) {
      const relationshipLists = await foreignModel
        .find({ [foreignField]: { $in: touchableLocalIds } })
        .distinct<Types.ObjectId>(foreignField)
        .exec()
      deleteManyIdList = [...deleteManyIdList, ...relationshipLists]
    }

    if (!deleteManyIdList.length) return next()

    // Make ids array unique
    deleteManyIdList = deleteManyIdList.filter(
      (value, index, array) => array.indexOf(value) === index
    )
    const queryFilter: FilterQuery<any> = { _id: { $in: deleteManyIdList } }
    // Delete or update
    const isRequired = foreignField
      ? foreignModel.schema.path(foreignField).isRequired ?? false
      : false
    if (isRequired || cascade) {
      await foreignModel.deleteMany(queryFilter)
    } else if (foreignField) {
      await foreignModel.updateMany(queryFilter, { $unset: { [foreignField]: true } })
    }

    return next()
  }
}

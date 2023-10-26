import { FilterQuery, Model, models, PreMiddlewareFunction, Types } from 'mongoose'

export const ManyToManyDestroyCascadeFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
): PreMiddlewareFunction | undefined => {
  if (!localField || !foreignField) return undefined
  return async function (next) {
    // Get models and originalQuery
    const foreignModel = models[foreignModelName]
    const localModel: Model<any> = this.model
    const originalQuery: FilterQuery<any> = this.getQuery()

    // Get ids which will be touched
    const touchableLocalIds = await localModel
      .find(originalQuery)
      .distinct<Types.ObjectId>('_id')
      .exec()

    // Set touchable list of depending on documents
    let updateManyIdList: Types.ObjectId[] = []
    const relationshipIds = await localModel
      .find(originalQuery)
      .distinct<Types.ObjectId[]>(localField)
      .exec()
    relationshipIds.forEach((val, i, array) => {
      updateManyIdList = [...updateManyIdList, ...val]
    })

    const relationshipLists = await foreignModel
      .find({ [foreignField]: { $in: touchableLocalIds } })
      .distinct<Types.ObjectId>('_id')
      .exec()
    updateManyIdList = [...updateManyIdList, ...relationshipLists]

    if (!updateManyIdList.length) return next()

    // Make ids array unique
    updateManyIdList = updateManyIdList.filter(
      (value, index, array) => array.indexOf(value) === index,
    )
    const queryFilter: FilterQuery<any> = { _id: { $in: updateManyIdList } }

    await foreignModel.updateMany(
      queryFilter,
      { $pull: { [foreignField]: { $in: updateManyIdList } } },
      { multi: true },
    )

    return next()
  }
}

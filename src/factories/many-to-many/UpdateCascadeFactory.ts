import { FilterQuery, Model, models, PostMiddlewareFunction, Types, UpdateQuery } from 'mongoose'

export const ManyToManyUpdateCascadeFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
): PostMiddlewareFunction | undefined => {
  if (!localField || !foreignField) return undefined
  return async function () {
    // Get models and originalQuery
    const foreignModel = models[foreignModelName]
    const localModel: Model<any> = this.model
    const originalQuery: FilterQuery<any> = this.getQuery()
    const originalUpdate: UpdateQuery<unknown> = this.getUpdate()

    //if(originalUpdate[localField])

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
  }
}

import {
  Collection,
  HydratedDocument,
  Model,
  PostMiddlewareFunction,
  PreMiddlewareFunction,
  Query,
  SchemaDefinitionProperty,
  Types,
} from 'mongoose'

export namespace Relationship {
  export interface Middlewares {
    localField?: {
      definition: SchemaDefinitionProperty
      key: string
    }

    preQueryWithUpdateResult?: PreQueryMiddleware

    postSave?: PostSaveMiddleware

    postUpdate?: PostQueryMiddleware
    postUpdateWithUpdateResult?: PostQueryResponseMiddleware

    postDelete?: PostQueryMiddleware
    postDeleteWithUpdateResult?: PostQueryResponseMiddleware
  }

  type ExpandedQuery = Query<any, any> & {
    localIds: Types.ObjectId[]
    foreignModel: Model<any>
  }

  type MongooseCollection = { mongooseCollection: Collection }

  export type PostSaveMiddleware = PostMiddlewareFunction<
    HydratedDocument<unknown>,
    HydratedDocument<unknown>
  >
  export type PreQueryMiddleware = PreMiddlewareFunction<ExpandedQuery & MongooseCollection>
  export type PostQueryMiddleware = PostMiddlewareFunction<
    Query<any, any>,
    HydratedDocument<unknown>
  >
  export type PostQueryResponseMiddleware = PostMiddlewareFunction<ExpandedQuery>
}

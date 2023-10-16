import {
  HydratedDocument,
  PostMiddlewareFunction,
  PreMiddlewareFunction,
  Query,
  SchemaDefinitionProperty,
  Types,
} from 'mongoose'

export namespace Relationship {
  interface Middlewares {
    localField?: {
      definition: SchemaDefinitionProperty
      key: string
    }
    postSave?: PostSaveMiddleware

    postUpdate?: PostQueryMiddleware
    preUpdateMany?: PreQueryMiddleware
    postUpdateMany?: PostQueryResponseMiddleware

    postDelete?: PostQueryMiddleware
    preDeleteMany?: PreQueryMiddleware
    postDeleteMany?: PostQueryResponseMiddleware
  }

  export interface ManyToManyMiddlewares extends Middlewares {}
  export interface ManyToOneMiddlewares extends Middlewares {}
  export interface OneToManyMiddlewares extends Middlewares {}

  type ExpandedQuery = Query<any, any> & {
    op?: string
    foreignIds?: Types.ObjectId[]
    localIds?: Types.ObjectId[]
  }

  export type PostSaveMiddleware = PostMiddlewareFunction<
    HydratedDocument<unknown>,
    HydratedDocument<unknown>
  >
  export type PreQueryMiddleware = PreMiddlewareFunction<ExpandedQuery>
  export type PostQueryMiddleware = PostMiddlewareFunction<ExpandedQuery, HydratedDocument<unknown>>
  export type PostQueryResponseMiddleware = PostMiddlewareFunction<ExpandedQuery>
}

import { send } from 'micro'

export default function declareProblem({ type, title, status, detail }) {
  class Problem extends Error {
    constructor(instanceDetail, context, instance) {
      super(instanceDetail || detail)
      this.name = type
      Error.captureStackTrace(this, this.constructor)
      this.context = context
      this.instance = instance
      this.statusCode = status
    }
  }

  return {
    handler(req, res) {
      send(res, 200, {
        type,
        title,
        status,
        detail,
      })
    },
    Problem,
    decorator(fn) {
      return async function withProblem(req, res) {
        try {
          return await fn(req, res)
        } catch (exception) {
          if (exception instanceof Problem) {
            res.setHeader('Content-Type', 'application/json+problem')
            return send(res, status, {
              type,
              title,
              status,
              detail: exception.message,
              instance: exception.instance,
              ...exception.context,
            })
          }
          throw exception
        }
      }
    },
  }
}

import * as T from './types'
import { Result, Val, Err, fmap } from './result'
import { Env, StdLib, lookUp } from './environment'
import { pp } from './prettyPrint'

export const evaluate = (e: T.Expr, env: Env = StdLib): Result<T.Expr> => {
  switch (e.type) {
    case 'atom':
      return fmap(lookUp(e.v, env), (e) => evaluate(e, env))
    case 'number':
      return Val(e)
    case 'procedure':
      return Err('Cannot evaluate procedure')
    case 'list':
      const head = e.v[0]
      if (!head) {
        return Err('Cannot evaluate empty list.')
      }
      if (head.type !== 'atom') {
        return Err(`Cannot evaluate using ${pp(head)}.`)
      }
      return fmap(
        lookUp(head.v, env),
        (lookedUp: T.Expr) => {
          if (lookedUp.type === 'procedure') {
            return lookedUp.v(...e.v.slice(1))
          } else {
            return Err(`Cannote evaluate non-procedure, found: ${pp(head)}`)
          }
        }
      )
  }
}

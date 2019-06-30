import * as T from './types'
import { Result, Val, Err, fmap } from './result'
import { Proc } from './expr'
import { evaluate } from './evaluate'
import { Num } from './expr'
import { pp } from './prettyPrint'

export const lookUp = (name: string, env: Env): Result<T.Expr> => {
  const lookedUp = env[name]
  if (lookedUp) {
    return Val(lookedUp)
  } else {
    return Err(`${name} could not be found in the env.`)
  }
}

export type Env = {
  [key in string]: T.Expr
}

export const StdLib: Env = {
  'add': Proc((...args) => {
    if (args.length !== 2) {
      return Err(`'add' requires two arguments, recieved values: ${args.map(pp)}`)
    }
    return fmap(
      evaluate(args[0]),
      (e1) => {
        return fmap(evaluate(args[1]), (e2) => {
          if (e1.type === 'number' && e2.type === 'number') {
            return Val(Num(e1.v + e2.v))
          }
          return Err(`cannot add ${e1} and ${e2}}`)
        })
      }
    )
  })
}


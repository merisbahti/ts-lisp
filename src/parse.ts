import { Parser, lazy, surroundedBy, many, alt, map, token, regexp } from './parserCombinator'
import { Atom, List, Num } from './expr'
import { Expr } from './types'
type ExprParser = Parser<string, Expr>

const ws = regexp(/[\s|\t]*/)
const trimWhitespace = <A>(parser: Parser<string, A>) => surroundedBy(
  ws,
  parser,
  ws
)

const digit = map(
  trimWhitespace(regexp(/\d+/)),
  x => Num(Number(x))
)

const atom = map(trimWhitespace(regexp(/\w+/)), Atom)

const list = lazy(() => {
  if (!expr) throw new Error('Failed :(')
  return map(surroundedBy(
    token('('),
    many(
      trimWhitespace(
        expr
      )
    ),
    token(')')
  ), ls => List(...ls))
})

const expr: ExprParser = trimWhitespace(
  alt('digit, atom, list')(digit, atom, list)
)
export const parse = expr

import { Parser, lazy, surroundedBy, many, alt, map, token, regexp, pOK, pFail } from './parserCombinator'
import { Atom, List, Num } from './expr'
import { Expr } from './types'

const ws = regexp(/[\s|\t]*/)
const trimWhitespace = <A>(parser: Parser<A>) => surroundedBy(
  ws,
  parser,
  ws,
)

const digit = map(
  trimWhitespace(regexp(/\d+/)),
  x => Num(Number(x))
)

const atom = map(trimWhitespace(regexp(/\w+/)), Atom)

let expr: Parser<Expr>;

const list = lazy(() => {
  if (!expr) throw new Error('Failed :(')
  return map(surroundedBy(
    token("("),
    many(
      trimWhitespace(
        expr,
      ),
    ),
    token(")")
  ), ls => List(...ls))
})

expr = trimWhitespace(
  alt(digit, atom, list),
)
export const parse = expr

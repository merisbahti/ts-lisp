type ParseResult<T> = OK<T> | Fail;
type OK<T> = { ok: true; value: T; rest: string };
type Fail = { ok: false; expected: string; actual: string };
export type Parser<T> = (input: string) => ParseResult<T>;
export const pOK = <T>(value: T, rest: string): ParseResult<T> => ({
  ok: true,
  value,
  rest
})
export const pFail = <T>(expected: string, actual: string): ParseResult<T> => ({
  ok: false,
  expected,
  actual
})

export const token = (myToken: string): Parser<string> => (input: string) => {
  const index = input.indexOf(myToken)
  if (index === 0) {
    return pOK(myToken, input.slice(myToken.length))
  }
  return pFail(myToken, input)
}

export const regexp = (myRegexp: RegExp): Parser<string> => (input: string) => {
  const match = myRegexp.exec(input)
  if (match && match.index === 0) {
    const matched = match[0]
    return pOK(matched, input.slice(matched.length))
  }
  return pFail(String(myRegexp), input)
}

export const map = <A, B>(parser: Parser<A>, f: (a: A) => B): Parser<B> => (
  input: string
) => {
  const parsed = parser(input)
  return parsed.ok ? pOK(f(parsed.value), parsed.rest) : parsed
}

export const many = <A>(parser: Parser<A>): Parser<Array<A>> => (
  input: string
) => {
  const results: Array<A> = []
  let prev: ParseResult<A> = parser(input)
  if (!prev.ok) {
    return pOK(results, input)
  }
  let curr: ParseResult<A> = prev
  while (curr.ok) {
    results.push(curr.value)
    prev = curr
    curr = parser(curr.rest)
  }
  return pOK(results, prev.rest)
}

export const alt = <A>(...alts: Array<Parser<A>>): Parser<A> => (
  input: string
) => {
  for (const parser of alts) {
    const result = parser(input)
    if (result.ok) {
      return result
    }
  }
  return pFail(`one of ${alts.length} alternatives`, input)
}

export const lazy = <A>(getParser: () => Parser<A>) => (input: string) =>
  getParser()(input)

export const precededBy = <A, B>(left: Parser<A>, right: Parser<B>) => (input: string) => {
  const pleft = left(input)
  if (!pleft.ok) return pleft
  const pright = right(pleft.rest)
  return pright
}

export const followedBy = <A, B>(left: Parser<A>, right: Parser<B>) => (input: string) => {
  const pleft = left(input)
  if (!pleft.ok) return pleft
  const pright = right(pleft.rest)
  if (!pright.ok) return pright
  return pOK(pleft.value, pright.rest)
}

export const surroundedBy = <A, B>(
  left: Parser<A>,
  mid: Parser<B>,
  right: Parser<A>
) => (input: string) => {
    const first = precededBy(left, mid)(input)
    if (!first.ok) return first
    const rest = right(first.rest)
    if (!rest.ok) return rest
    return pOK(first.value, rest.rest)
  }

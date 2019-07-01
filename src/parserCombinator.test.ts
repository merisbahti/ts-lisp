import { Parser, lazy, surroundedBy, many, alt, map, token, regexp, pOK, pFail } from './parserCombinator'
import { List, Num } from './expr'
import { Expr } from './types'

test('parse token', () => {
  expect(token("5")("5")).toStrictEqual(pOK("5", ""))
  expect(token("123")("123 455")).toStrictEqual(pOK("123", " 455"))
  expect(token("123")("5")).toStrictEqual(pFail("123", "5"))
})

test('parse regexp', () => {
  expect(regexp(/\d/)("5")).toStrictEqual(pOK("5", ""))
  expect(regexp(/\d+/)("123 455")).toStrictEqual(pOK("123", " 455"))
  expect(regexp(/\d+/)("p")).toStrictEqual(pFail("/\\d+/", "p"))
})

test('map', () => {
  expect(
        map(
          regexp(/\d/),
          Number)("5")
  ).toStrictEqual(pOK(5, ""))
})

test('alt', () => {
  expect(
        alt(
          regexp(/\d/),
          token("hello")
          )("5")
  ).toStrictEqual(pOK("5", ""))
  expect(
        alt(
          regexp(/\d/),
          token("hello")
          )("hello")
  ).toStrictEqual(pOK("hello", ""))
})

test('alt', () => {
  const parser = many(
    alt(
      regexp(/\d/),
      token("hello")
    )
  )
  expect(parser("5")).toStrictEqual(pOK(["5"], ""))
  expect(parser("hello")).toStrictEqual(pOK(["hello"], ""))
  expect(parser("5hello5")).toStrictEqual(pOK(["5", "hello", "5"], ""))
})
test('surroundedBy', () => {
  const ws = regexp(/\s+/)
  const digit = regexp(/\d+/)
  const parser = surroundedBy(
    ws,
    digit,
    ws
  )
  expect(parser(" 5 ")).toStrictEqual(pOK("5", ""))
})

test('list', () => {
  const digit = surroundedBy(
    regexp(/\s*/),
    regexp(/\d+/),
    regexp(/\s*/)
  )
  const list = surroundedBy(
    token("("),
    many(digit),
    token(")")
  )
  expect(list("(1 2 3)")).toStrictEqual(pOK(["1", "2", "3"], ""))
  expect(list("(123)")).toStrictEqual(pOK(["123"], ""))
  expect(list("123")).toStrictEqual(pFail("(", '123'))
})

test('nested list', () => {
  const digit = map(surroundedBy(
    regexp(/\s*/),
    regexp(/\d+/),
    regexp(/\s*/)
  ), x => Num(Number(x)))
  let expr: Parser<Expr>;
  const list = lazy(() => {
    if (!expr) throw new Error('Failed :(')
    return map(surroundedBy(
      token("("),
      many(
        surroundedBy(
          regexp(/\s*/),
          expr,
          regexp(/\s*/),
        )
      ),
      token(")")
    ), ls => List(...ls))
  })
  expr = alt(digit, list)

  expect(list("((1))")).toStrictEqual(pOK(List(List(Num(1))), ""))
  expect(list("((1 2))")).toStrictEqual(pOK(List(List(Num(1), Num(2))), ""))
  expect(list("((1 2) (3 4))")).toStrictEqual(pOK(List(List(Num(1), Num(2)), List(Num(3), Num(4))), ""))
})

// test('simple atoms', () => {
//   expect(parse('5')).toMatchSnapshot()
//   expect(parse('a')).toMatchSnapshot()
//   expect(parse('abc')).toMatchSnapshot()
// })

// test('multiple atoms', () => {
//   expect(parse('1 2')).toMatchSnapshot()
//   expect(parse('a b c')).toMatchSnapshot()
// })
//
// test('nested lists', () => {
//   expect(parse('(add (add 1 2) (add 3 4))')).toMatchSnapshot()
// })

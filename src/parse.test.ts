import { parse } from './parse'
import { Atom, List, Num } from './expr'
import { pOK } from './parserCombinator'

test('parse token', () => {
  const complexExpression = `(1 2 3)`
  expect(parse(complexExpression)).toStrictEqual(
    pOK(
      List(
        Num(1),
        Num(2),
        Num(3),
      ),
      ""
    )
  )
})

test('parse token', () => {
  const complexExpression = `((1 2) (3 4))`
  expect(parse(complexExpression)).toStrictEqual(
    pOK(
      List(
        List(
          Num(1),
          Num(2),
        ),
        List(
          Num(3),
          Num(4)
        )),
      ""
    )
  )
})

test('parse token', () => {
  const complexExpression = `(a b)`
  expect(parse(complexExpression)).toStrictEqual(
    pOK(
      List(
          Atom('a'),
          Atom('b'),
        ),
      ""
    )
  )
})

test('parse token', () => {
  const complexExpression = `
  (add
    (add 1 2)
    (add 3 4))
  `
  expect(parse(complexExpression)).toStrictEqual(
    pOK(
      List(
        Atom('add'),
        List(
          Atom('add'),
          Num(1),
          Num(2),
        ),
        List(
          Atom('add'),
          Num(3),
          Num(4),
        ),
      ),
      ""
    )
  )
})


test('parse complex expression', () => {
  const complexExpression = `(map (lambda (x) (add 1 2)) (quote (1 2 3 4 5)))`
  expect(parse(complexExpression)).toStrictEqual(
    pOK(
      List(
        Atom('map'),
        List(
          Atom('lambda'),
          List(Atom('x')),
          List(Atom('add'), Num(1), Num(2)),
        ),
        List(
          Atom('quote'),
          List(
            Num(1),
            Num(2),
            Num(3),
            Num(4),
            Num(5),
          )
        ),
      ),
      ""
    )
  )
})

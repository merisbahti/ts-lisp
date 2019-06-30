import { Num, List, Atom } from './expr'
import { evaluate } from './evaluate'

test('simple addition', () => {
  expect(
    evaluate(
      List(
        Atom('add'),
        Num(5),
        Num(3)))
  ).toMatchSnapshot()
  expect(
    evaluate(
      List(
        Atom('add'),
        Num(5),
        Num(-3)))
  ).toMatchSnapshot()
})
test('failure cases', () => {
  expect(
    evaluate(
      List(
        Atom('add'),
        Atom('hey'),
        Num(-3)))
  ).toMatchSnapshot()
  expect(
    evaluate(
      List(
        Atom('add'),
        Num(-3)))
  ).toMatchSnapshot()
  expect(
    evaluate(
      List(
        Atom('add'),
        Atom('foo'),
        Num(3),
        Num(-3)))
  ).toMatchSnapshot()
})

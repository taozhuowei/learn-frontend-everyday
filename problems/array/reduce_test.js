module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[1, 2, 3, 4]', args: ['(acc, x) => acc + x', '0'] },
      expected: 10
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[1, 2, 3, 4]', args: ['(acc, x) => acc * x', '1'] },
      expected: 24
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '[[1, 2], [3, 4], [5]]', args: ['(acc, x) => acc.concat(x)', '[]'] },
      expected: [1, 2, 3, 4, 5]
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[1, 2, 3]', args: ['(acc, x) => acc + x'] },
      expected: 6
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[1]', args: ['(acc, x) => acc + x'] },
      expected: 1
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '["a", "b", "c"]', args: ['(acc, x) => acc + x', '""'] },
      expected: 'abc'
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[{a: 1}, {a: 2}, {a: 3}]', args: ['(acc, x) => ({ a: acc.a + x.a })'] },
      expected: { a: 6 }
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '[1, 2, 3, 4]', args: ['(acc, x, i) => acc + x * i', '0'] },
      expected: 20
    }
  ]
}

module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[1, 2, 3, 4, 5, 6]', args: ['x => x % 2 === 0'] },
      expected: [2, 4, 6]
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[1, 2, 3, 4]', args: ['x => x > 2'] },
      expected: [3, 4]
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '["a", "bb", "ccc", "d"]', args: ['s => s.length > 1'] },
      expected: ['bb', 'ccc']
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[]', args: ['x => true'] },
      expected: []
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[1, 2, 3]', args: ['x => true'] },
      expected: [1, 2, 3]
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, 2, 3]', args: ['x => false'] },
      expected: []
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[1, 2, 3, 4]', args: ['(x, i) => i > 1'] },
      expected: [3, 4]
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '[{a: 1}, {a: 2}, {a: 3}]', args: ['x => x.a > 1'] },
      expected: [{ a: 2 }, { a: 3 }]
    }
  ]
}

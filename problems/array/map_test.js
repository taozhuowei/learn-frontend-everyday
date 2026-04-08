module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[1, 2, 3]', args: ['x => x * 2'] },
      expected: [2, 4, 6]
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[1, 2, 3]', args: ['x => String(x)'] },
      expected: ['1', '2', '3']
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '[1, 2, 3]', args: ['x => x * x'] },
      expected: [1, 4, 9]
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[]', args: ['x => x * 2'] },
      expected: []
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[1, 2, 3]', args: ['(x, i) => x + i'] },
      expected: [1, 3, 5]
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, , 3]', args: ['x => x * 2'] },
      expected: [2, , 6]
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[1, 2, 3]', args: ['x => ({ value: x })'] },
      expected: [{ value: 1 }, { value: 2 }, { value: 3 }]
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '["a", "b", "c"]', args: ['(x, i, arr) => x + i + arr.length'] },
      expected: ['a03', 'b13', 'c23']
    }
  ]
}

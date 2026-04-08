module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '{ a: 1, b: 2 }', args: [] },
      expected: { a: 1, b: 2 }
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '{ arr: [1, 2, 3] }', args: [] },
      expected: { arr: [1, 2, 3] }
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '{ nested: { a: 1 } }', args: [] },
      expected: { nested: { a: 1 } }
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[]', args: [] },
      expected: []
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '{ a: { b: { c: 1 } } }', args: [] },
      expected: { a: { b: { c: 1 } } }
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, [2, [3]]]', args: [] },
      expected: [1, [2, [3]]]
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '{ a: null, b: undefined }', args: [] },
      expected: { a: null, b: undefined }
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '{ date: new Date(2024, 0, 1) }', args: [] },
      expected: { date: new Date(2024, 0, 1) }
    }
  ]
}

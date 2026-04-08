module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[1, 2, 3]' },
      expected: [3, 2, 1]
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[1]' },
      expected: [1]
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '[]' },
      expected: []
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[1, 2]' },
      expected: [2, 1]
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[5, 4, 3, 2, 1]' },
      expected: [1, 2, 3, 4, 5]
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, 2, 3, 4]' },
      expected: [4, 3, 2, 1]
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[1, 1, 1, 1]' },
      expected: [1, 1, 1, 1]
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '[10, 20, 30, 40, 50]' },
      expected: [50, 40, 30, 20, 10]
    }
  ]
}

module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[3, 9, 20, null, null, 15, 7]' },
      expected: 3
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[1, null, 2]' },
      expected: 2
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '[]' },
      expected: 0
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[1]' },
      expected: 1
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[1, 2, 3, 4, 5, 6, 7]' },
      expected: 3
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, 2, null, 3, null, 4]' },
      expected: 4
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[1, 2, 3, null, null, null, 4]' },
      expected: 3
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '[5, 4, 7, 3, null, 2, null, 1]' },
      expected: 4
    }
  ]
}

module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[3, 2, 0, -4]' },
      expected: false
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[1, 2]' },
      expected: false
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '[1]' },
      expected: false
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[]' },
      expected: false
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[1, 2, 3, 4, 5]' },
      expected: false
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, 2, 3]' },
      expected: false
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[0, 0, 0]' },
      expected: false
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '[1, 2, 3, 4]' },
      expected: false
    }
  ]
}

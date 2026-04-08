module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[1, 2, 4]', args: ['[1, 3, 4]'] },
      expected: [1, 1, 2, 3, 4, 4]
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '[]', args: ['[]'] },
      expected: []
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: '[]', args: ['[0]'] },
      expected: [0]
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: '[1]', args: ['[2]'] },
      expected: [1, 2]
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '[1, 3, 5]', args: ['[2, 4, 6]'] },
      expected: [1, 2, 3, 4, 5, 6]
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: '[1, 2, 3]', args: ['[]'] },
      expected: [1, 2, 3]
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: '[1, 1, 1]', args: ['[1, 1]'] },
      expected: [1, 1, 1, 1, 1]
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: '[-3, -1, 0]', args: ['[-2, 2]'] },
      expected: [-3, -2, -1, 0, 2]
    }
  ]
}

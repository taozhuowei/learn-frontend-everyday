module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: { target: '[]', args: ['Array'] },
      expected: true
    },
    {
      id: 'example-2',
      hidden: false,
      input: { target: '{}', args: ['Array'] },
      expected: false
    },
    {
      id: 'example-3',
      hidden: false,
      input: { target: 'new Date()', args: ['Date'] },
      expected: true
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: { target: 'function() {}', args: ['Function'] },
      expected: true
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: { target: '/abc/', args: ['RegExp'] },
      expected: true
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: { target: 'new String("hello")', args: ['String'] },
      expected: true
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: { target: 'null', args: ['Object'] },
      expected: false
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: { target: 'Object.create(null)', args: ['Object'] },
      expected: false
    }
  ]
}

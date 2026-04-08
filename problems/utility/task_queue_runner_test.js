module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 0 }
    },
    {
      id: 'example-2',
      hidden: false,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => Promise.resolve()]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'example-3',
      hidden: false,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => Promise.resolve(), () => Promise.resolve()]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 2 }
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 3 }
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => Promise.reject(new Error("err"))]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 1, hasError: true }
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => new Promise(r => setTimeout(r, 100))]'] },
          { type: 'tick', ms: 100 },
          { type: 'await' }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => Promise.resolve(), () => Promise.resolve()]'] },
          { type: 'call', args: ['[() => Promise.resolve()]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 3 }
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: {
        target: '',
        steps: [
          { type: 'call', args: ['[() => Promise.resolve(1)]'] },
          { type: 'await' },
          { type: 'call', args: ['[() => Promise.resolve(2)]'] },
          { type: 'await' }
        ]
      },
      expected: { callCount: 2 }
    }
  ]
}

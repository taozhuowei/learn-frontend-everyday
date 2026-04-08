module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: {
        target: '200',
        steps: [
          { type: 'call', args: [] },
          { type: 'call', args: [] },
          { type: 'tick', ms: 200 }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'example-2',
      hidden: false,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: ['"a"'] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: ['"b"'] },
          { type: 'tick', ms: 100 }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'example-3',
      hidden: false,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: [] },
          { type: 'tick', ms: 150 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 150 }
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
        target: '100',
        steps: [
          { type: 'call', args: ['1'] },
          { type: 'tick', ms: 100 }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: {
        target: '50',
        steps: [
          { type: 'call', args: [] },
          { type: 'tick', ms: 25 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 25 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 50 }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: ['"first"'] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: ['"second"'] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: ['"third"'] },
          { type: 'tick', ms: 100 }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: {
        target: '0',
        steps: [
          { type: 'call', args: [] },
          { type: 'call', args: [] },
          { type: 'tick', ms: 0 }
        ]
      },
      expected: { callCount: 1 }
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: ['1', '2', '3'] },
          { type: 'tick', ms: 100 }
        ]
      },
      expected: { callCount: 1 }
    }
  ]
}

module.exports = {
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: [] },
          { type: 'call', args: [] },
          { type: 'tick', ms: 100 }
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
          { type: 'call', args: [] },
          { type: 'tick', ms: 100 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 100 },
          { type: 'call', args: [] }
        ]
      },
      expected: { callCount: 3 }
    },
    {
      id: 'example-3',
      hidden: false,
      input: {
        target: '50',
        steps: [
          { type: 'call', args: [] },
          { type: 'tick', ms: 25 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 25 },
          { type: 'call', args: [] }
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
          { type: 'call', args: [] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: [] }
        ]
      },
      expected: { callCount: 3 }
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: {
        target: '200',
        steps: [
          { type: 'call', args: [] },
          { type: 'tick', ms: 100 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 100 },
          { type: 'call', args: [] }
        ]
      },
      expected: { callCount: 2 }
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: [] },
          { type: 'call', args: [] },
          { type: 'call', args: [] },
          { type: 'tick', ms: 100 },
          { type: 'call', args: [] }
        ]
      },
      expected: { callCount: 2 }
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: {
        target: '50',
        steps: [
          { type: 'call', args: ['1'] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: ['2'] },
          { type: 'tick', ms: 50 },
          { type: 'call', args: ['3'] }
        ]
      },
      expected: { callCount: 3 }
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: {
        target: '100',
        steps: [
          { type: 'call', args: [] },
          { type: 'tick', ms: 300 },
          { type: 'call', args: [] },
          { type: 'tick', ms: 300 },
          { type: 'call', args: [] }
        ]
      },
      expected: { callCount: 3 }
    }
  ]
}

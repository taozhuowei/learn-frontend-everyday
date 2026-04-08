module.exports = {
  noCustomCase: true,
  examples: [
    {
      id: 'example-1',
      hidden: false,
      input: {
        target: 'new MyPromise(resolve => resolve(42))',
        args: []
      },
      expected: 42
    },
    {
      id: 'example-2',
      hidden: false,
      input: {
        target: 'new MyPromise((resolve, reject) => reject(new Error("fail")))',
        args: []
      },
      expected: { error: 'fail' }
    },
    {
      id: 'example-3',
      hidden: false,
      input: {
        target: 'new MyPromise(resolve => resolve(5))',
        args: ['v => v * 2']
      },
      expected: 10
    }
  ],
  hidden: [
    {
      id: 'hidden-1',
      hidden: true,
      input: {
        target: 'new MyPromise(resolve => setTimeout(() => resolve(100), 10))',
        args: []
      },
      expected: 100
    },
    {
      id: 'hidden-2',
      hidden: true,
      input: {
        target: 'new MyPromise(resolve => resolve(1))',
        args: ['v => v + 1', 'v => v * 2']
      },
      expected: 4
    },
    {
      id: 'hidden-3',
      hidden: true,
      input: {
        target: 'new MyPromise((resolve, reject) => reject("error"))',
        args: []
      },
      expected: { error: 'error' }
    },
    {
      id: 'hidden-4',
      hidden: true,
      input: {
        target: 'new MyPromise(resolve => resolve({ a: 1 }))',
        args: ['obj => obj.a']
      },
      expected: 1
    },
    {
      id: 'hidden-5',
      hidden: true,
      input: {
        target: 'MyPromise.resolve(10)',
        args: []
      },
      expected: 10
    }
  ]
}

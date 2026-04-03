module.exports = [
  {
    input: "Render the component in the local launcher.",
    expected: "The component should mount correctly.",
  },
  {
    input: "Trigger the main user interaction once.",
    expected: "The main visible state should update once.",
  },
  {
    input: "Repeat the main interaction several times.",
    expected: "The component should keep responding without stale state.",
  },
  {
    input: "Use an empty or boundary input state in the launcher.",
    expected: "The component should stay stable and render fallback UI.",
  },
  {
    input: "Keep the component mounted in a longer interactive session.",
    expected: "The component should remain responsive.",
  },
];

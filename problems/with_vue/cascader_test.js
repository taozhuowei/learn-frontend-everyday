module.exports = [
  {
    input: "Render the component in the local launcher.",
    expected: "The component should mount correctly.",
  },
  {
    input: "Select a province option once.",
    expected:
      "The city dropdown should show only the cities under that province.",
  },
  {
    input: "Select a province and city, then change to another province.",
    expected: "The city and area selections should reset to avoid stale state.",
  },
  {
    input:
      "Keep the city and area dropdowns empty before choosing upper levels.",
    expected:
      "The component should remain stable and show empty dependent options.",
  },
  {
    input: "Complete a province, city, and area selection flow.",
    expected:
      "The current selection summary should update with all three levels.",
  },
];

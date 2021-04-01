project_name: "viz-utils"

constant: VIS_LABEL {
  value: "Viz Utils"
  export: override_optional
}

constant: VIS_ID {
  value: "viz_utils-marketplace"
  export:  override_optional
}

visualization: {
  id: "@{VIS_ID}"
  file: "dist/bundle.js"
  label: "@{VIS_LABEL}"
}

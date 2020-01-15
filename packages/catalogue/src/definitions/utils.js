function validateWidgetFields(widget) {
  if (!widget || typeof widget !== 'object')
    throw new Error(
      'Invalid component type, must be an object with properties `name`, `Component`, `description`, `tags` and optionally `screenshot`'
    )

  const { name, Component, description, tags, screenshot } = widget

  if (!name || typeof name !== 'string')
    throw new Error(`Invalid component name "${name}" (${typeof name})`)
  if (!Component || typeof Component !== 'function')
    throw new Error(
      `Invalid Component renderer for ${name} (${typeof Component})`
    )
  if (!description || typeof description !== 'string')
    throw new Error(
      `Invalid component description "${description}" for ${name} (${typeof description})`
    )
  if (!tags || !Array.isArray(tags))
    throw new Error(`Invalid component tags for ${name} (${typeof tags})`)

  return {
    name,
    Component,
    description,
    tags,
    screenshot,
  }
}

export { validateWidgetFields }
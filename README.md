# Repository is archived, reach out if this needs to be undone.


## Virtual Template IED Plugin

IED generation menu plugin for CoMPAS Open SCD (next)

## Transformation rules applied in this plugin

- Each `Function` and `Subfunction` with more than one `LNode` becomes a Logical Device (name attributes are mapped to `inst` attribute of `LDevice`).
- `Function` name attribute becomes the value of the `inst` attribute of the element `LDevice`. !! This plugin does not normalize the `name` attributes to fit to the restriction of the `inst` attributes. This is up to the user to restrict `name` attributes in function-type element to alphanumeric characters, including `_`. -`Function`s with the same name inside substation elements (e.g. same `Function`s in different Bays) are modelled to `ìnst` by prefixing the next higher Substation/Process Level (e.g. `AA1E1A01Protection`).
- For `LNode` within leaf `Subfunction` (one with only one child `LNode`) the prefix is modelled from the `Subfunction` name attribute.


## `src/virtual-template-ied.ts`:

### class: `VirtualTemplateIED`, `virtual-template-ied`

#### Superclass

| Name         | Module | Package     |
| ------------ | ------ | ----------- |
| `LitElement` |        | lit-element |

#### Fields

| Name        | Privacy | Type          | Default | Description                                                            | Inherited From |
| ----------- | ------- | ------------- | ------- | ---------------------------------------------------------------------- | -------------- |
| `doc`       |         | `XMLDocument` |         | The document being edited as provided to plugins by \[\[\`OpenSCD\`]]. |                |
| `editCount` |         | `number`      | `-1`    | The editCount represents the current position in the edit history.     |                |

#### Methods

| Name  | Privacy | Description                     | Parameters | Return          | Inherited From |
| ----- | ------- | ------------------------------- | ---------- | --------------- | -------------- |
| `run` |         | Run method to start the plugin. |            | `Promise<void>` |                |

<hr/>

### Exports

| Kind | Name      | Declaration        | Module                      | Package |
| ---- | --------- | ------------------ | --------------------------- | ------- |
| `js` | `default` | VirtualTemplateIED | src/virtual-template-ied.ts |         |


&copy; 2023 Alliander N.V.

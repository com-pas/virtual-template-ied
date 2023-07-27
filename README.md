## Virtual Template IED Plugin

IED generation menu plugin for CoMPAS Open SCD (next)

## Scripts

- `start` runs your app for development, reloading on file changes
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

### Icon font

Material Icons are being used for the icons. This font needs to be added in the html first.
You can add it like so:

```html
<link
  href="https://fonts.googleapis.com/css?family=Material+Icons&display=block"
  rel="stylesheet"
/>
```

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `index.html`


## `src/foundation.ts`:

### Functions

| Name                      | Description                                                                                                                                                            | Parameters                                                   | Return            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------- |
| `isLeafFunction`          | Some element Function, SubFunction, EqFunction or EqSubFunction.&#xD;&#xA;Returns whether the element is a leaf function acc. to IEC 61850-6-100                       | `element: Element \| null`                                   | `boolean`         |
| `getNonLeafParent`        | Returns closest non-leaf function type parent element                                                                                                                  | `element: Element \| null`                                   | `Element \| null` |
| `getFunctionNamingPrefix` | Returns prefix of LNode element acc. to IEC 61850-6-100                                                                                                                | `lNode: Element`                                             | `string`          |
| `getUniqueFunctionName`   | Returns a unique name for the given element. If the name already exists the parents name will be added as a prefix. This happens recursively until the name is unique. | `element: Element`                                           | `string`          |
| `getSpecificationIED`     | Returns schema valid SPECIFICATION type IED based on virtualIED object                                                                                                 | `ownerDocument: Document, virtualIED: VirtualIEDDescription` | `Element`         |

<hr/>

### Exports

| Kind | Name                      | Declaration             | Module            | Package |
| ---- | ------------------------- | ----------------------- | ----------------- | ------- |
| `js` | `isLeafFunction`          | isLeafFunction          | src/foundation.ts |         |
| `js` | `getNonLeafParent`        | getNonLeafParent        | src/foundation.ts |         |
| `js` | `getFunctionNamingPrefix` | getFunctionNamingPrefix | src/foundation.ts |         |
| `js` | `getUniqueFunctionName`   | getUniqueFunctionName   | src/foundation.ts |         |
| `js` | `getSpecificationIED`     | getSpecificationIED     | src/foundation.ts |         |

## `src/virtual-template-ied.ts`:

### class: `VirtualTemplateIED`, `virtual-template-ied`

#### Superclass

| Name         | Module | Package     |
| ------------ | ------ | ----------- |
| `LitElement` |        | lit-element |

#### Fields

| Name                  | Privacy | Type                           | Default | Description                                                                                                        | Inherited From |
| --------------------- | ------- | ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------ | -------------- |
| `doc`                 |         | `XMLDocument`                  |         | The document being edited as provided to plugins by \[\[\`OpenSCD\`]].                                             |                |
| `editCount`           |         | `number`                       | `-1`    | The editCount represents the current position in the edit history.                                                 |                |
| `isValidManufacturer` |         | `boolean`                      |         | Returns true if the manufacturer input contains value.                                                             |                |
| `isValidApName`       |         | `boolean`                      |         | Returns true if the access point input contains value.                                                             |                |
| `someItemsSelected`   |         | `boolean`                      |         | Returns true if an LNode is selected in the list.                                                                  |                |
| `validPriparyAction`  |         | `boolean`                      |         | Returns true if manufacturer and access point fields contain value and if atleast 1 LNode is selected in the list. |                |
| `unreferencedLNodes`  |         | `Element[]`                    |         | Returns an array of Logical Nodes that have no reference to a IED and can therfore be used for the virtual IED.    |                |
| `lLN0s`               |         | `Element[]`                    |         | Returns an array of LLN0 Logical Nodes.                                                                            |                |
| `dialog`              |         | `Dialog`                       |         | The dialog in which the user can create a virtual template IED.                                                    |                |
| `selectedLNodeItems`  |         | `CheckListItem[] \| undefined` |         | A list of LNode items that are selected.                                                                           |                |

#### Methods

| Name  | Privacy | Description                     | Parameters | Return          | Inherited From |
| ----- | ------- | ------------------------------- | ---------- | --------------- | -------------- |
| `run` |         | Run method to start the plugin. |            | `Promise<void>` |                |

<details><summary>Private API</summary>

#### Methods

| Name              | Privacy | Description | Parameters                                                 | Return             | Inherited From |
| ----------------- | ------- | ----------- | ---------------------------------------------------------- | ------------------ | -------------- |
| `onPrimaryAction` | private |             | `functions: Record<string, FunctionElementDescription>`    | `void`             |                |
| `onClosed`        | private |             | `ae: CustomEvent<{ action: string } \| null>`              | `void`             |                |
| `renderLLN0s`     | private |             | `functionID: string, lLN0Types: Element[], lNode: Element` | `TemplateResult`   |                |
| `renderLNodes`    | private |             | `lNodes: Element[], disabled: boolean`                     | `TemplateResult[]` |                |

</details>

<hr/>

### Exports

| Kind | Name      | Declaration        | Module                      | Package |
| ---- | --------- | ------------------ | --------------------------- | ------- |
| `js` | `default` | VirtualTemplateIED | src/virtual-template-ied.ts |         |


&copy; 2023 Alliander N.V.

import { css, html, LitElement, PropertyValueMap, TemplateResult } from 'lit';

import { query, property, state } from 'lit/decorators.js';

import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-menu';
import '@material/mwc-switch';
import '@material/mwc-textfield';

import { IconButton } from '@material/mwc-icon-button';

import { Menu } from '@material/mwc-menu';
import { SingleSelectedEvent } from '@material/mwc-list/mwc-list-foundation';
import { Switch } from '@material/mwc-switch';
import { TextField } from '@material/mwc-textfield';
/**
 * @tag oscd-textfield
 */
export class OscdTextfield extends LitElement {
  @property({
    type: Boolean,
  })
  nullable = false;

  @property({
    type: Array,
  })
  multipliers = [null, ''];

  private multiplierIndex = 0;

  @property({
    type: String,
  })
  get multiplier(): string | null {
    if (this.unit === '') return null;
    return (
      this.multipliers[this.multiplierIndex] ?? this.multipliers[0] ?? null
    );
  }

  set multiplier(value: string | null) {
    const index = this.multipliers.indexOf(value);
    if (index >= 0) this.multiplierIndex = index;
    this.suffix = (this.multiplier ?? '') + this.unit;
  }

  @property({
    type: String,
  })
  unit = '';

  private isNull = false;

  @state()
  private get null(): boolean {
    return this.nullable && this.isNull;
  }

  private set null(value: boolean) {
    if (!this.nullable || value === this.isNull) return;
    this.isNull = value;
    if (this.null) {
      this.disable();
    } else {
      this.enable();
    }
  }

  @property({ type: String })
  get maybeValue(): string | null {
    return this.null ? null : this.value;
  }

  set maybeValue(value: string | null) {
    if (value === null) {
      this.null = true;
      if (!this.rendered) {
        return;
      }
      this.value = '';
    } else {
      this.null = false;
      this.value = value;
    }
  }

  /** The default `value` displayed if [[`maybeValue`]] is `null`. */
  @property({ type: String })
  defaultValue = '';
  /** Additional values that cause validation to fail. */
  @property({ type: Array })
  reservedValues: string[] = [];

  @property({
    type: String,
  })
  suffix = '';

  @property({
    type: Boolean,
  })
  disabled = false;

  @property({
    type: Boolean,
  })
  helperPersistent = false;

  /**
   * @prop {String} value - The value of the Form Control
   */
  @property({
    type: String,
  })
  set value(value: string) {
    this._value = value;

    if (this.textfield) {
      this.textfield.value = value;
    }
  }

  get value(): string {
    return this.textfield ? this.textfield.value : this._value;
  }

  /**
   * @internal
   */
  private _value = '';

  @property({
    type: String,
  })
  label = '';

  @property({
    type: Boolean,
  })
  required = false;

  @property({
    type: String,
  })
  helper = '';

  @property({
    type: String,
  })
  validationMessage = '';

  @property({
    type: String,
  })
  pattern = '';

  @property({
    type: Number,
  })
  minLength = -1;

  @property({
    type: Number,
  })
  maxLength = -1;

  @property({
    type: Number,
  })
  min = -1;

  @property({
    type: Number,
  })
  max = -1;

  // FIXME: workaround to allow disable of the whole component - need basic refactor
  private disabledSwitch = false;

  @query('mwc-switch') nullSwitch?: Switch;
  @query('mwc-menu') multiplierMenu?: Menu;
  @query('mwc-icon-button') multiplierButton?: IconButton;

  @query('mwc-textfield')
  textfield!: TextField;

  private nulled: string | null = null;

  private rendered = false;

  private selectMultiplier(se: SingleSelectedEvent): void {
    this.multiplier = this.multipliers[se.detail.index];
  }

  private enable(): void {
    if (this.nulled === null) return;
    this.value = this.nulled;
    this.nulled = null;
    this.helperPersistent = false;
    this.disabled = false;
  }

  private disable(): void {
    if (this.nulled !== null) return;
    this.nulled = this.value;
    this.value = this.defaultValue;

    this.helperPersistent = true;
    this.disabled = true;
  }

  async firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): Promise<void> {
    await super.firstUpdated(_changedProperties);
    await this.textfield.firstUpdated();
    if (this.multiplierMenu)
      this.multiplierMenu.anchor = this.multiplierButton ?? null;

    // eslint-disable-next-line no-self-assign
    if (!this.maybeValue) {
      this.disable();
    }
  }

  checkValidity(): boolean {
    if (
      this.reservedValues &&
      this.reservedValues.some(array => array === this.value)
    ) {
      this.textfield.setCustomValidity('unique');
      return false;
    }
    // Reset to prevent super.checkValidity to always return false
    this.textfield.setCustomValidity('');
    return this.textfield.checkValidity();
  }

  constructor() {
    super();
    this.disabledSwitch = this.hasAttribute('disabled');
  }

  renderUnitSelector(): TemplateResult {
    if (this.multipliers.length && this.unit)
      return html`<div style="position:relative;">
        <mwc-icon-button
          style="margin:5px;"
          icon="more"
          ?disabled=${this.null || this.disabledSwitch}
          @click=${() => this.multiplierMenu?.show()}
        ></mwc-icon-button>
        <mwc-menu
          @selected=${this.selectMultiplier}
          fixed
          .anchor=${this.multiplierButton ?? null}
          >${this.renderMulplierList()}</mwc-menu
        >
      </div>`;
    else return html``;
  }

  renderMulplierList(): TemplateResult {
    return html`${this.multipliers.map(
      multiplier =>
        html`<mwc-list-item ?selected=${multiplier === this.multiplier}
          >${multiplier === null ? 'no Multiplier' : multiplier}</mwc-list-item
        >`
    )}`;
  }

  renderSwitch(): TemplateResult {
    if (this.nullable) {
      return html`<mwc-switch
        style="margin-left: 12px;"
        ?selected=${!this.null}
        ?disabled=${this.disabledSwitch}
        @click=${() => {
          this.null = !this.nullSwitch!.selected;
        }}
      ></mwc-switch>`;
    }
    return html``;
  }

  private renderTextfield(): TemplateResult {
    return html`<mwc-textfield
      value=${this.value}
      ?disabled=${this.disabled}
      ?helperPersistent=${this.helperPersistent}
      ?required=${this.required}
      .suffix=${this.suffix}
      .label=${this.label}
      .pattern=${this.pattern}
      .minLength=${this.minLength}
      .maxLength=${this.maxLength}
      .min=${this.min}
      .max=${this.max}
    ></mwc-textfield>`;
  }

  render(): TemplateResult {
    this.rendered = true;
    return html`
      <div style="display: flex; flex-direction: row;">
        <div style="flex: auto;">${this.renderTextfield()}</div>
        ${this.renderUnitSelector()}
        <div style="display: flex; align-items: center; height: 56px;">
          ${this.renderSwitch()}
        </div>
      </div>
    `;
  }

  static styles = css`
    mwc-textfield {
      width: 100%;
    }
  `;
}

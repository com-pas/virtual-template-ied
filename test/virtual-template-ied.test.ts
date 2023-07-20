/* eslint-disable no-return-await */
import { expect, fixture, html } from '@open-wc/testing';
import { SinonSpy, spy } from 'sinon';

import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
import { Insert, isInsert } from '@openscd/open-scd-core';
import { OscdTextfield } from '../to-be-made-a-dependency/oscd-textfield.js';
import VirtualTemplateIED from '../src/virtual-template-ied.js';

describe('Plugin that creates with some user input a virtual template IED - SPECIFICATION', () => {
  if (customElements.get('virtual-template-i-e-d') === undefined)
    customElements.define('virtual-template-i-e-d', VirtualTemplateIED);

  let doc: XMLDocument;
  let element: VirtualTemplateIED;

  let manufacturer: OscdTextfield;
  let apName: OscdTextfield;

  let primaryAction: HTMLElement;
  let checkItems: CheckListItem[];

  let editorAction: SinonSpy;

  beforeEach(async () => {
    doc = await fetch('/test/testfiles/virtualied/specificfromfunctions.ssd')
      .then(response => response.text())
      .then(str => new DOMParser().parseFromString(str, 'application/xml'));

    element = await fixture(html`
      <virtual-template-i-e-d .doc=${doc}></virtual-template-i-e-d>
    `);

    editorAction = spy();
    window.addEventListener('editor-action', editorAction);

    element.run();
    await element.requestUpdate();

    checkItems = Array.from(
      element.dialog.querySelectorAll('mwc-check-list-item') ?? []
    );
    manufacturer = element.dialog.querySelector<OscdTextfield>(
      'wizard-textfield[label="manufacturer"]'
    )!;
    apName = element.dialog.querySelector<OscdTextfield>(
      'wizard-textfield[label="AccessPoint name"]'
    )!;

    primaryAction = <HTMLElement>(
      element.dialog.querySelector('mwc-button[slot="primaryAction"]')
    );
  });

  it('looks like the latest snapshot', async () =>
    await expect(element.dialog).dom.to.equalSnapshot());

  it('shows all LNode that is not class LLN0 as check list items', () =>
    expect(checkItems.length).to.equal(
      doc.querySelectorAll('LNode[iedName="None"]:not([lnClass="LLN0"])').length
    ));

  it('does not trigger any actions with missing input fields', () => {
    primaryAction.click();

    expect(editorAction).to.not.have.been.called;
  });

  it('does not trigger any actions with missing input fields', () => {
    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';

    primaryAction.click();

    expect(editorAction).to.not.have.been.called;
  });

  it('does trigger an create actions if at least one LNode is selected', async () => {
    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';

    checkItems[1].selected = true;

    await element.requestUpdate();

    primaryAction.click();

    expect(editorAction).to.have.been.calledOnce;
  });

  it('allows to add more than one SPECIFICATION type IED to the document', async () => {
    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';

    checkItems[1].selected = true;

    await element.requestUpdate();

    primaryAction.click();

    const { action } = editorAction.args[0][0].detail;
    expect(action).to.satisfy(isInsert);

    // const createAction = <Insert>action;
    // expect(createAction.checkValidity).to.exist; TODO: Implement checkValidity
    // expect(createAction.checkValidity!()).to.be.true;  TODO: Implement checkValidity
  });

  it('enables primary action button only with required information', async () => {
    expect(primaryAction).to.have.attribute('disabled');

    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';
    await element.requestUpdate();

    expect(primaryAction).to.have.attribute('disabled');

    checkItems[1].selected = true;
    await element.requestUpdate();

    expect(primaryAction).to.not.have.attribute('disabled');
  });

  it('IEDs data model show selected logical nodes and its structure', async () => {
    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';

    checkItems[1].selected = true;
    checkItems[10].selected = true;
    checkItems[15].selected = true;

    await element.requestUpdate();

    primaryAction.click();

    const { action } = editorAction.args[0][0].detail;
    expect(action).to.satisfy(isInsert);

    const createAction = <Insert>action;
    await expect(createAction.node).dom.to.equalSnapshot();
  });
});

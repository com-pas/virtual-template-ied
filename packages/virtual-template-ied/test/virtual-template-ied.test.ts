/* eslint-disable no-return-await */
import { expect, fixture, html } from '@open-wc/testing';
import { SinonSpy, spy } from 'sinon';

import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
import { OscdTextfield } from '@openscd/oscd-textfield';
import { Edit, Insert, isInsert } from '@openscd/open-scd-core';
import VirtualTemplateIED from '../dist/virtual-template-ied.js';

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
    doc = await fetch('/test/testfile/specificfromfunctions.ssd')
      .then(response => response.text())
      .then(str => new DOMParser().parseFromString(str, 'application/xml'));

    element = await fixture(html`
      <virtual-template-i-e-d .doc=${doc}></virtual-template-i-e-d>
    `);

    editorAction = spy();
    window.addEventListener('oscd-edit', editorAction);

    element.run();
    element.requestUpdate();
    await element.updateComplete;

    checkItems = Array.from(
      element.dialog.querySelectorAll('mwc-check-list-item') ?? []
    );
    manufacturer = element.dialog.querySelector<OscdTextfield>(
      'oscd-textfield[label="manufacturer"]'
    )!;
    apName = element.dialog.querySelector<OscdTextfield>(
      'oscd-textfield[label="AccessPoint name"]'
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

    element.requestUpdate();
    await element.updateComplete;

    primaryAction.click();

    expect(editorAction).to.have.been.calledOnce;
  });

  it('allows to add more than one SPECIFICATION type IED to the document', async () => {
    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';

    checkItems[1].selected = true;

    element.requestUpdate();
    await element.updateComplete;

    primaryAction.click();

    const edit: Edit = editorAction.args[0][0].detail;
    // const { action } = editorAction.args[0][0].detail;
    expect(edit).to.satisfy(isInsert);

    // const createAction = <Insert>action;
    // expect(createAction.checkValidity).to.exist; TODO: Implement checkValidity
    // expect(createAction.checkValidity!()).to.be.true;  TODO: Implement checkValidity
  });

  it('enables primary action button only with required information', async () => {
    expect(primaryAction).to.have.attribute('disabled');

    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';
    element.requestUpdate();
    await element.updateComplete;

    expect(primaryAction).to.have.attribute('disabled');

    checkItems[1].selected = true;
    element.requestUpdate();
    await element.updateComplete;

    expect(primaryAction).to.not.have.attribute('disabled');
  });

  it('IEDs data model show selected logical nodes and its structure', async () => {
    manufacturer.value = 'SomeCompanyName';
    apName.value = 'P1';

    checkItems[1].selected = true;
    checkItems[10].selected = true;
    checkItems[15].selected = true;

    element.requestUpdate();
    await element.updateComplete;

    primaryAction.click();

    const edit: Edit = editorAction.args[0][0].detail;
    // const { action } = editorAction.args[0][0].detail;
    expect(edit).to.satisfy(isInsert);

    const createAction = <Insert>edit;
    await expect(createAction.node).dom.to.equalSnapshot();
  });
});

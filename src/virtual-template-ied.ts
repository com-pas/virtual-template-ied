/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
import { css, html, LitElement, TemplateResult } from 'lit';
import { property, query, queryAll, state } from 'lit/decorators.js';
import { customElement } from 'lit/decorators/custom-element.js';

// import { translate } from 'lit-translate'; ----- TODO: Change dependency to lit-localize and refactor accordingly

import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-list/mwc-list-item';
import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-list/mwc-radio-list-item';
import { Select } from '@material/mwc-select';

import '@openscd/oscd-filtered-list';
import { newEditEvent } from '@openscd/open-scd-core';
import { OscdTextfield } from './to-be-made-a-dependency/oscd-textfield.js';
import { identity } from './to-be-made-a-dependency/oscd-scl/identities/identity.js';
import { selector } from './to-be-made-a-dependency/oscd-scl/identities/selector.js';
import { getReference } from './to-be-made-a-dependency/oscd-scl/utils/scldata.js';
import { getChildElementsByTagName } from './to-be-made-a-dependency/oscd-scl/foundation.js';
import {
  getFunctionNamingPrefix,
  getNonLeafParent,
  getSpecificationIED,
  getUniqueFunctionName,
  LDeviceDescription,
} from './foundation.js';

export type FunctionElementDescription = {
  uniqueName: string;
  lNodes: Element[];
  lln0?: Element;
};

/** converts FunctionElementDescription's to LDeviceDescription's */
function getLDeviceDescriptions(
  functions: Record<string, FunctionElementDescription>,
  selectedLNodes: Element[],
  selectedLLN0s: string[]
): LDeviceDescription[] {
  const lDeviceDescriptions: LDeviceDescription[] = [];

  Object.values(functions).forEach(functionDescription => {
    if (
      functionDescription.lNodes.some(lNode => selectedLNodes.includes(lNode))
    ) {
      const lLN0 = selectedLLN0s.find(selectedLLN0 =>
        selectedLLN0.includes(functionDescription.uniqueName)
      )!;
      const lnType = lLN0?.split(': ')[1];

      lDeviceDescriptions.push({
        validLdInst: functionDescription.uniqueName,
        anyLNs: [
          { prefix: null, lnClass: 'LLN0', inst: '', lnType },
          ...functionDescription.lNodes
            .filter(lNode => selectedLNodes.includes(lNode))
            .map(lNode => ({
              prefix: getFunctionNamingPrefix(lNode),
              lnClass: lNode.getAttribute('lnClass')!,
              inst: lNode.getAttribute('lnInst')!,
              lnType: lNode.getAttribute('lnType')!,
            })),
        ],
      });
    }
  });

  return lDeviceDescriptions;
}

/** Groups all incomming LNode's with non-leaf parent function type elements */
function groupLNodesToFunctions(
  lNodes: Element[]
): Record<string, FunctionElementDescription> {
  const functionElements: Record<string, FunctionElementDescription> = {};

  lNodes.forEach(lNode => {
    const parentFunction = getNonLeafParent(lNode);
    if (!parentFunction) return;

    if (functionElements[identity(parentFunction)])
      functionElements[identity(parentFunction)].lNodes.push(lNode);
    else {
      functionElements[identity(parentFunction)] = {
        uniqueName: getUniqueFunctionName(parentFunction),
        lNodes: [lNode],
        lln0: getChildElementsByTagName(parentFunction, 'LNode').find(
          lNode => lNode.getAttribute('lnClass') === 'LLN0'
        ),
      };
    }
  });

  return functionElements;
}

@customElement('virtual-template-ied')
export default class VirtualTemplateIED extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property({ type: Number })
  editCount = -1;

  @state()
  get isValidManufacturer(): boolean {
    const manufacturer = this.dialog?.querySelector<OscdTextfield>(
      'oscd-textfield[label="manufacturer"]'
    )!.value;

    return (manufacturer && manufacturer !== '') || false;
  }

  @state()
  get isValidApName(): boolean {
    const apName = this.dialog?.querySelector<OscdTextfield>(
      'oscd-textfield[label="AccessPoint name"]'
    )!.value;

    return (apName && apName !== '') || false;
  }

  @state()
  get someItemsSelected(): boolean {
    if (!this.selectedLNodeItems) return false;
    return !!this.selectedLNodeItems.length;
  }

  @state()
  get validPriparyAction(): boolean {
    return (
      this.someItemsSelected && this.isValidManufacturer && this.isValidApName
    );
  }

  get unreferencedLNodes(): Element[] {
    return Array.from(
      this.doc.querySelectorAll('LNode[iedName="None"]')
    ).filter(lNode => lNode.getAttribute('lnClass') !== 'LLN0');
  }

  get lLN0s(): Element[] {
    return Array.from(this.doc.querySelectorAll('LNodeType[lnClass="LLN0"]'));
  }

  @query('mwc-dialog') dialog!: Dialog;

  @queryAll('mwc-check-list-item[selected]')
  selectedLNodeItems?: CheckListItem[];

  async run(): Promise<void> {
    this.dialog.open = true;
  }

  private onPrimaryAction(
    functions: Record<string, FunctionElementDescription>
  ): void {
    const selectedLNode = Array.from(
      this.dialog.querySelectorAll<CheckListItem>(
        'mwc-check-list-item[selected]:not([disabled])'
      ) ?? []
    ).map(
      selectedItem =>
        this.doc.querySelector(selector('LNode', selectedItem.value))!
    );
    if (!selectedLNode.length) return;

    const selectedLLN0s = Array.from(
      this.dialog.querySelectorAll<Select>('mwc-select') ?? []
    ).map(selectedItem => selectedItem.value);

    const manufacturer = this.dialog.querySelector<OscdTextfield>(
      'oscd-textfield[label="manufacturer"]'
    )!.value;
    const desc = this.dialog.querySelector<OscdTextfield>(
      'oscd-textfield[label="desc"]'
    )!.maybeValue;
    const apName = this.dialog.querySelector<OscdTextfield>(
      'oscd-textfield[label="AccessPoint name"]'
    )!.value;

    const ied = getSpecificationIED(this.doc, {
      manufacturer,
      desc,
      apName,
      lDevices: getLDeviceDescriptions(functions, selectedLNode, selectedLLN0s),
    });

    // checkValidity: () => true disables name check as is the same here: SPECIFICATION
    this.dispatchEvent(
      newEditEvent({
        parent: this.doc.documentElement,
        node: ied,
        reference: getReference(this.doc.documentElement, 'IED'),
        // checkValidity: () => true  TODO: Add checkValidity function ?
      })
    );
    this.dialog.close();
  }

  private onClosed(ae: CustomEvent<{ action: string } | null>): void {
    if (!(ae.target instanceof Dialog && ae.detail?.action)) return;
  }

  private renderLLN0s(
    functionID: string,
    lLN0Types: Element[],
    lNode?: Element
  ): TemplateResult {
    if (!lNode && !lLN0Types.length) return html``;

    if (lNode)
      return html`<mwc-select
        disabled
        naturalMenuWidth
        value="${`${functionID}: ${lNode.getAttribute('lnType')}`}"
        style="width:100%"
        label="LLN0"
        >${html`<mwc-list-item
          value="${`${functionID}: ${lNode.getAttribute('lnType')}`}"
          >${lNode.getAttribute('lnType')}
        </mwc-list-item>`}</mwc-select
      >`;

    return html`<mwc-select
      naturalMenuWidth
      style="width:100%"
      label="LLN0"
      value="${`${functionID}: ${lLN0Types[0].getAttribute('id')}`}"
      >${lLN0Types.map(
        lLN0Type => html`<mwc-list-item
          value="${`${functionID}: ${lLN0Type.getAttribute('id')}`}"
          >${lLN0Type.getAttribute('id')}</mwc-list-item
        >`
      )}</mwc-select
    >`;
  }

  private renderLNodes(lNodes: Element[], disabled: boolean): TemplateResult[] {
    return lNodes.map(lNode => {
      const prefix = getFunctionNamingPrefix(lNode);
      const lnClass = lNode.getAttribute('lnClass')!;
      const lnInst = lNode.getAttribute('lnInst')!;

      const label = `${prefix} ${lnClass} ${lnInst}`;
      return html`<mwc-check-list-item
        ?disabled=${disabled}
        value="${identity(lNode)}"
        >${label}</mwc-check-list-item
      >`;
    });
  }

  render(): TemplateResult {
    if (!this.doc) {
      this.doc = new DOMParser().parseFromString(
        `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
	<Header id="virtualtemplate"/>
	<Substation name="AA1">
		<VoltageLevel name="E1" desc="" nomFreq="50" numPhases="3">
			<Voltage unit="V" multiplier="k">110</Voltage>
			<Bay name="Q01" desc="">
				<ConductingEquipment name="QC9" type="DIS" desc="">
					<Terminal name="T1" cNodeName="grounded" substationName="AA1" voltageLevelName="E1" bayName="Q01" connectivityNode="AA1/E1/Q01/grounded"/>
					<EqFunction name="Earth_Switch">
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="OpenSCD_CSWI"/>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="OpenSCD_CILO"/>
						<LNode iedName="None" lnClass="XSWI" lnInst="1" lnType="OpenSCD_XSWI_EarthSwitch"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="QB1" type="DIS" desc="">
					<EqFunction name="Disconnector">
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="OpenSCD_CSWI"/>
						<LNode iedName="None" lnClass="XSWI" lnInst="1" lnType="OpenSCD_XSWI_DIS"/>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="OpenSCD_CILO"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="QA1" type="CBR" desc="">
					<EqFunction name="Circuit_Breaker">
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="OpenSCD_CSWI"/>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="OpenSCD_CILO"/>
						<LNode iedName="None" lnClass="XCBR" lnInst="1" lnType="OpenSCD_XCBR"/>
					</EqFunction>
				</ConductingEquipment>
				<ConnectivityNode name="grounded" pathName="AA1/E1/Q01/grounded"/>
				<Function name="Timed_Overcurrent">
					<LNode iedName="None" lnClass="LLN0" lnInst="" lnType="OpenSCD_LLN01" prefix=""/>
					<LNode iedName="None" lnClass="PTOC" lnInst="2" lnType="OpenSCD_PTOC" prefix="ID_"/>
					<LNode iedName="None" lnClass="PTOC" lnInst="1" lnType="OpenSCD_PTOC" prefix="IDD_"/>
				</Function>
				<Function name="Distance_Protection">
					<SubFunction name="Zone4">
						<LNode iedName="None" lnClass="PDIS" lnInst="1" lnType="OpenSCD_PDIS"/>
					</SubFunction>
					<SubFunction name="Zon3">
						<LNode iedName="None" lnClass="PDIS" lnInst="1" lnType="OpenSCD_PDIS"/>
					</SubFunction>
					<SubFunction name="Zone2">
						<LNode iedName="None" lnClass="PDIS" lnInst="1" lnType="OpenSCD_PDIS"/>
					</SubFunction>
					<SubFunction name="Zone1">
						<LNode iedName="None" lnClass="PDIS" lnInst="1" lnType="OpenSCD_PDIS"/>
					</SubFunction>
				</Function>
			</Bay>
			<Bay name="Q02" desc="">
				<ConductingEquipment name="QC9" type="DIS" desc="">
					<Terminal name="T1" cNodeName="grounded" substationName="AA1" voltageLevelName="E1" bayName="Q01" connectivityNode="AA1/E1/Q01/grounded"/>
					<EqFunction name="Earth_Switch">
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="QB1" type="DIS" desc="">
					<EqFunction name="Disconnector">
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="OpenSCD_CSWI"/>
						<LNode iedName="None" lnClass="XSWI" lnInst="1" lnType="OpenSCD_XSWI_DIS"/>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="OpenSCD_CILO"/>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment name="QA1" type="CBR" desc="">
					<EqFunction name="Circuit_Breaker">
					</EqFunction>
				</ConductingEquipment>
			</Bay>
		</VoltageLevel>
		<VoltageLevel name="J1" desc="" nomFreq="50" numPhases="3">
			<Voltage unit="V" multiplier="k">20</Voltage>
			<Bay name="Q01" desc="">
				<ConductingEquipment name="QC9" type="DIS" desc="">
					<Terminal name="T1" cNodeName="grounded" substationName="AA1" voltageLevelName="E1" bayName="Q01" connectivityNode="AA1/E1/Q01/grounded"/>
					<EqFunction name="Earth_Switch">
					<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="OpenSCD_CSWI"/>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="OpenSCD_CILO"/>
						<LNode iedName="None" lnClass="XSWI" lnInst="1" lnType="OpenSCD_XSWI_EarthSwitch"/>
					</EqFunction>
				</ConductingEquipment>
			</Bay>
		</VoltageLevel>
	</Substation>
	<DataTypeTemplates>
		<LNodeType lnClass="LLN0" id="OpenSCD_LLN0" desc="some LLN0">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_LD"/>
			<DO name="LocKey" type="OpenSCD_SPS_simple"/>
			<DO name="Loc" type="OpenSCD_SPS_simple"/>
		</LNodeType>
		<LNodeType lnClass="LLN0" id="OpenSCD_LLN01" desc="some other LLN0">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_LD"/>
			<DO name="LocKey" type="OpenSCD_SPS_simple"/>
			<DO name="Loc" type="OpenSCD_SPS_simple"/>
		</LNodeType>
		<LNodeType lnClass="PTOC" id="OpenSCD_PTOC">
			<DO name="Op" type="OpenSCD_ACT_general"/>
			<DO name="Str" type="OpenSCD_ACD_general"/>
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
		</LNodeType>
		<LNodeType lnClass="PDIS" id="OpenSCD_PDIS">
			<DO name="Op" type="OpenSCD_ACT_general"/>
			<DO name="Str" type="OpenSCD_ACD_general"/>
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
		</LNodeType>
		<LNodeType lnClass="XCBR" id="OpenSCD_XCBR" desc="Circuit Breaker: one phase representation">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
			<DO name="LocKey" type="OpenSCD_SPS_simple"/>
			<DO name="Loc" type="OpenSCD_SPS_simple"/>
			<DO name="OpCnt" type="OpenSCD_INS_simple"/>
			<DO name="Pos" type="OpenSCD_DPC_statusonly"/>
			<DO name="BlkOpn" type="OpenSCD_SPC_statusonly"/>
			<DO name="BlkCls" type="OpenSCD_SPC_statusonly"/>
		</LNodeType>
		<LNodeType lnClass="XSWI" id="OpenSCD_XSWI_EarthSwitch" desc="Switch: one phase represenation">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
			<DO name="LocKey" type="OpenSCD_SPS_simple"/>
			<DO name="Loc" type="OpenSCD_SPS_simple"/>
			<DO name="OpCnt" type="OpenSCD_INS_simple"/>
			<DO name="Pos" type="OpenSCD_DPC_statusonly"/>
			<DO name="BlkOpn" type="OpenSCD_SPC_statusonly"/>
			<DO name="BlkCls" type="OpenSCD_SPC_statusonly"/>
			<DO name="SwTyp" type="OpenSCD_SwType_EarthSwitch"/>
		</LNodeType>
		<LNodeType lnClass="PTRC" id="OpenSCD_PTRC" desc="Trip conditioning: General trip signal">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
			<DO name="Tr" type="OpenSCD_ACT_general"/>
			<DO name="Op" transient="true" type="OpenSCD_ACT_general"/>
			<DO name="Str" type="OpenSCD_ACD_general"/>
		</LNodeType>
		<LNodeType lnClass="CILO" id="OpenSCD_CILO" desc="Interlocking">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
			<DO name="EnaOpn" type="OpenSCD_SPS_simple"/>
			<DO name="EnaCls" type="OpenSCD_SPS_simple"/>
		</LNodeType>
		<LNodeType lnClass="XSWI" id="OpenSCD_XSWI_DIS" desc="Disconnector single phase">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
			<DO name="LocKey" type="OpenSCD_SPS_simple"/>
			<DO name="Loc" type="OpenSCD_SPS_simple"/>
			<DO name="OpCnt" type="OpenSCD_INS_simple"/>
			<DO name="Pos" type="OpenSCD_DPC_statusonly"/>
			<DO name="BlkOpn" type="OpenSCD_SPC_statusonly"/>
			<DO name="BlkCls" type="OpenSCD_SPC_statusonly"/>
			<DO name="SwTyp" type="OpenSCD_ENS_SwTyp_DIS"/>
		</LNodeType>
		<LNodeType lnClass="CSWI" id="OpenSCD_CSWI" desc="Switch control: three phase">
			<DO name="Mod" type="OpenSCD_ENC_Mod"/>
			<DO name="Beh" type="OpenSCD_ENS_Beh"/>
			<DO name="Health" type="OpenSCD_ENS_Health"/>
			<DO name="NamPlt" type="OpenSCD_LPL_noLD"/>
			<DO name="LocKey" type="OpenSCD_SPS_simple"/>
			<DO name="Loc" type="OpenSCD_SPS_simple"/>
			<DO name="Pos" type="OpenSCD_DPC"/>
			<DO name="OpOpn" transient="true" type="OpenSCD_ACT_general_control"/>
			<DO name="OpCls" transient="true" type="OpenSCD_ACT_general_control"/>
			<DO name="SelOpn" type="OpenSCD_SPS_simple"/>
			<DO name="SelCls" type="OpenSCD_SPS_simple"/>
		</LNodeType>
		<DOType cdc="LPL" id="OpenSCD_LPL_LD">
			<DA name="vendor" bType="VisString255" fc="DC"/>
			<DA name="swRev" bType="VisString255" fc="DC"/>
			<DA name="d" bType="VisString255" fc="DC"/>
			<DA name="configRev" bType="VisString255" fc="DC"/>
			<DA name="ldNs" bType="VisString255" fc="EX">
				<Val>IEC 61850-7-4:2007B4</Val>
			</DA>
		</DOType>
		<DOType cdc="ENS" id="OpenSCD_SwType_EarthSwitch">
			<DA fc="ST" dchg="true" name="stVal" bType="Enum" type="SwitchFunctionKind">
				<Val>Earthing Switch</Val>
			</DA>
			<DA fc="ST" qchg="true" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ACD" id="OpenSCD_ACD_general">
			<DA name="general" bType="BOOLEAN" dchg="true" fc="ST"/>
			<DA name="dirGeneral" bType="Enum" dchg="true" type="FaultDirectionKind" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType cdc="ACT" id="OpenSCD_ACT_general">
			<DA name="general" bType="BOOLEAN" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType cdc="ENS" id="OpenSCD_ENS_SwTyp_DIS">
			<DA fc="ST" dchg="true" name="stVal" bType="Enum" type="SwitchFunctionKind">
				<Val>Disconnector</Val>
			</DA>
			<DA fc="ST" qchg="true" name="q" bType="Quality"/>
			<DA fc="ST" name="t" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPC" id="OpenSCD_SPC_statusonly">
			<DA name="stVal" bType="BOOLEAN" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="ctlModel" bType="Enum" dchg="true" type="OpenSCD_StatusOnly" fc="CF">
				<Val>status-only</Val>
			</DA>
		</DOType>
		<DOType cdc="DPC" id="OpenSCD_DPC_statusonly">
			<DA name="stVal" bType="Dbpos" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="ctlModel" bType="Enum" fc="CF" type="OpenSCD_StatusOnly">
				<Val>status-only</Val>
			</DA>
		</DOType>
		<DOType cdc="INS" id="OpenSCD_INS_simple">
			<DA name="stVal" bType="INT32" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="d" bType="VisString255" fc="DC"/>
		</DOType>
		<DOType cdc="ACT" id="OpenSCD_ACT_general_control">
			<DA name="general" bType="BOOLEAN" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="originSrc" bType="Struct" type="OpenSCD_Originator" fc="ST"/>
		</DOType>
		<DOType cdc="DPC" id="OpenSCD_DPC">
			<DA name="origin" bType="Struct" dchg="true" fc="ST" type="OpenSCD_Originator"/>
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="BehaviourModeKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="ctlModel" bType="Enum" fc="CF" type="CtlModelKind">
				<Val>sbo-with-enhanced-security</Val>
			</DA>
			<DA name="sboTimeout" bType="INT32U" fc="CF">
				<Val>30000</Val>
			</DA>
			<DA name="operTimeout" bType="INT32U" fc="CF">
				<Val>600</Val>
			</DA>
			<DA name="pulseConfig" bType="Struct" fc="CO" type="OpenSCD_PulseConfig"/>
			<DA name="SBOw" bType="Struct" fc="CO" type="OpenSCD_OperSBOw_Dbpos"/>
			<DA name="Oper" bType="Struct" fc="CO" type="OpenSCD_OperSBOw_Dbpos"/>
			<DA name="Cancel" bType="Struct" fc="CO" type="OpenSCD_Cancel_Dbpos"/>
		</DOType>
		<DOType cdc="SPS" id="OpenSCD_SPS_simple">
			<DA name="stVal" bType="BOOLEAN" dchg="true" fc="ST"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="d" bType="VisString255" fc="DC"/>
		</DOType>
		<DOType cdc="LPL" id="OpenSCD_LPL_noLD">
			<DA name="vendor" bType="VisString255" fc="DC"/>
			<DA name="swRev" bType="VisString255" fc="DC"/>
			<DA name="d" bType="VisString255" fc="DC"/>
			<DA name="configRev" bType="VisString255" fc="DC"/>
		</DOType>
		<DOType cdc="ENS" id="OpenSCD_ENS_Health">
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="HealthKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType cdc="ENS" id="OpenSCD_ENS_Beh">
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="BehaviourModeKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType cdc="ENC" id="OpenSCD_ENC_Mod">
			<DA name="origin" bType="Struct" dchg="true" fc="ST" type="OpenSCD_Originator"/>
			<DA name="stVal" bType="Enum" dchg="true" fc="ST" type="BehaviourModeKind"/>
			<DA name="q" bType="Quality" qchg="true" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
			<DA name="ctlModel" bType="Enum" fc="CF" type="CtlModelKind">
				<Val>sbo-with-enhanced-security</Val>
			</DA>
			<DA name="sboTimeout" bType="INT32U" fc="CF">
				<Val>30000</Val>
			</DA>
			<DA name="operTimeout" bType="INT32U" fc="CF">
				<Val>600</Val>
			</DA>
			<DA name="SBOw" bType="Struct" fc="CO" type="OpenSCD_OperSBOw_BehaviourModeKind"/>
			<DA name="Oper" bType="Struct" fc="CO" type="OpenSCD_OperSBOw_BehaviourModeKind"/>
			<DA name="Cancel" bType="Struct" fc="CO" type="OpenSCD_Cancel_BehaviourModeKind"/>
		</DOType>
		<DAType id="OpenSCD_Cancel_Dbpos">
			<BDA name="ctlVal" bType="Dbpos"/>
			<BDA name="origin" bType="Struct" type="OpenSCD_Originator"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<ProtNs type="8-MMS">IEC 61850-8-1:2003</ProtNs>
		</DAType>
		<DAType id="OpenSCD_OperSBOw_Dbpos">
			<BDA name="ctlVal" bType="Dbpos"/>
			<BDA name="origin" bType="Struct" type="OpenSCD_Originator"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
			<ProtNs type="8-MMS">IEC 61850-8-1:2003</ProtNs>
		</DAType>
		<DAType id="OpenSCD_PulseConfig">
			<BDA name="cmdQual" bType="Enum" type="OutputSignalKind"/>
			<BDA name="onDur" bType="INT32U"/>
			<BDA name="offDur" bType="INT32U"/>
			<BDA name="numPls" bType="INT32U"/>
		</DAType>
		<DAType id="OpenSCD_Cancel_BehaviourModeKind">
			<BDA name="ctlVal" bType="Enum" type="BehaviourModeKind"/>
			<BDA name="origin" bType="Struct" type="OpenSCD_Originator"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<ProtNs type="8-MMS">IEC 61850-8-1:2003</ProtNs>
		</DAType>
		<DAType id="OpenSCD_OperSBOw_BehaviourModeKind">
			<BDA name="ctlVal" bType="Enum" type="BehaviourModeKind"/>
			<BDA name="origin" bType="Struct" type="OpenSCD_Originator"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
			<ProtNs type="8-MMS">IEC 61850-8-1:2003</ProtNs>
		</DAType>
		<DAType id="OpenSCD_Originator">
			<BDA name="orCat" bType="Enum" type="OriginatorCategoryKind"/>
			<BDA name="orIdent" bType="Octet64"/>
		</DAType>
		<EnumType id="FaultDirectionKind">
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
			<EnumVal ord="3">both</EnumVal>
		</EnumType>
		<EnumType id="SwitchFunctionKind">
			<EnumVal ord="1">Load Break</EnumVal>
			<EnumVal ord="2">Disconnector</EnumVal>
			<EnumVal ord="3">Earthing Switch</EnumVal>
			<EnumVal ord="4">High Speed Earthing Switch</EnumVal>
		</EnumType>
		<EnumType id="OpenSCD_StatusOnly">
			<EnumVal ord="0">status-only</EnumVal>
		</EnumType>
		<EnumType id="OutputSignalKind">
			<EnumVal ord="0">pulse</EnumVal>
			<EnumVal ord="1">persistent</EnumVal>
			<EnumVal ord="2">persistent-feedback</EnumVal>
		</EnumType>
		<EnumType id="HealthKind">
			<EnumVal ord="1">Ok</EnumVal>
			<EnumVal ord="2">Warning</EnumVal>
			<EnumVal ord="3">Alarm</EnumVal>
		</EnumType>
		<EnumType id="CtlModelKind">
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
		<EnumType id="BehaviourModeKind">
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="OriginatorCategoryKind">
			<EnumVal ord="0">not-supported</EnumVal>
			<EnumVal ord="1">bay-control</EnumVal>
			<EnumVal ord="2">station-control</EnumVal>
			<EnumVal ord="3">remote-control</EnumVal>
			<EnumVal ord="4">automatic-bay</EnumVal>
			<EnumVal ord="5">automatic-station</EnumVal>
			<EnumVal ord="6">automatic-remote</EnumVal>
			<EnumVal ord="7">maintenance</EnumVal>
			<EnumVal ord="8">process</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>`,
        'application/xml'
      );
    } // TODO: Remove this hardcoded test .doc file

    const existValidLLN0 = this.lLN0s.length !== 0;

    const functionElementDescriptions = groupLNodesToFunctions(
      this.unreferencedLNodes
    );

    return html`<mwc-dialog
      heading="Create SPECIFICATION type IED"
      @closed=${this.onClosed}
      ><div>
        <oscd-textfield
          label="manufacturer"
          .maybeValue=${''}
          required
          @keypress=${() => this.requestUpdate()}
        ></oscd-textfield>
        <oscd-textfield
          label="desc"
          .maybeValue=${null}
          nullable
        ></oscd-textfield>
        <oscd-textfield
          label="AccessPoint name"
          .maybeValue=${''}
          required
          @keypress=${() => this.requestUpdate()}
        ></oscd-textfield>
        <oscd-filtered-list multi @selected=${() => this.requestUpdate()}
          >${Object.entries(functionElementDescriptions).flatMap(
            ([id, functionDescription]) => [
              html`<mwc-list-item
                twoline
                noninteractive
                value="${id}"
                style="font-weight:500"
                ><span>${functionDescription.uniqueName}</span
                ><span slot="secondary"
                  >${existValidLLN0 ? id : 'Invalid LD: Missing LLN0'}</span
                ></mwc-list-item
              >`,
              this.renderLLN0s(
                functionDescription.uniqueName,
                this.lLN0s,
                functionDescription.lln0
              ),
              ...this.renderLNodes(functionDescription.lNodes, !existValidLLN0),
              html`<li padded divider role="separator"></li>`,
            ]
          )}</oscd-filtered-list
        >
      </div>
      <mwc-button
        slot="secondaryAction"
        dialogAction="close"
        label="close"
        style="--mdc-theme-primary: var(--mdc-theme-error)"
      ></mwc-button>
      <mwc-button
        ?disabled=${!this.validPriparyAction}
        slot="primaryAction"
        icon="save"
        label="save"
        trailingIcon
        @click=${() => this.onPrimaryAction(functionElementDescriptions)}
      ></mwc-button
    ></mwc-dialog>`;
  }

  // TODO: Use lit localize for buttons and labels

  static styles = css`
    mwc-dialog {
      --mdc-dialog-max-width: 92vw;
    }

    div {
      display: flex;
      flex-direction: column;
    }

    div > * {
      display: block;
      margin-top: 16px;
    }
  `;
}

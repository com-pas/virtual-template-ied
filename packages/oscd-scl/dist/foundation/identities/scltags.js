"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = void 0;
const identity_js_1 = require("./identity.js");
const selector_js_1 = require("./selector.js");
exports.tags = {
    AccessControl: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    AccessPoint: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    Address: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Association: {
        identity: identity_js_1.associationIdentity,
        selector: selector_js_1.associationSelector,
    },
    Authentication: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    BDA: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    BitRate: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Bay: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    ClientLN: {
        identity: identity_js_1.clientLNIdentity,
        selector: selector_js_1.clientLNSelector,
    },
    ClientServices: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    CommProt: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Communication: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConductingEquipment: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    ConfDataSet: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConfLdName: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConfLNs: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConfLogControl: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConfReportControl: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConfSG: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConfSigRef: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ConnectedAP: {
        identity: identity_js_1.connectedAPIdentity,
        selector: selector_js_1.connectedAPSelector,
    },
    ConnectivityNode: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    DA: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    DAI: {
        identity: identity_js_1.ixNamingIdentity,
        selector: selector_js_1.ixNamingSelector,
    },
    DAType: {
        identity: identity_js_1.idNamingIdentity,
        selector: selector_js_1.idNamingSelector,
    },
    DO: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    DOI: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    DOType: {
        identity: identity_js_1.idNamingIdentity,
        selector: selector_js_1.idNamingSelector,
    },
    DataObjectDirectory: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    DataSet: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    DataSetDirectory: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    DataTypeTemplates: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    DynAssociation: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    DynDataSet: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    EnumType: {
        identity: identity_js_1.idNamingIdentity,
        selector: selector_js_1.idNamingSelector,
    },
    EnumVal: {
        identity: identity_js_1.enumValIdentity,
        selector: selector_js_1.enumValSelector,
    },
    EqFunction: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    EqSubFunction: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    ExtRef: {
        identity: identity_js_1.extRefIdentity,
        selector: selector_js_1.extRefSelector,
    },
    FCDA: {
        identity: identity_js_1.fCDAIdentity,
        selector: selector_js_1.fCDASelector,
    },
    FileHandling: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Function: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    GeneralEquipment: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    GetCBValues: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GetDataObjectDefinition: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GetDataSetValue: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GetDirectory: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GOOSE: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GOOSESecurity: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    GSE: {
        identity: identity_js_1.controlBlockIdentity,
        selector: selector_js_1.controlBlockSelector,
    },
    GSEDir: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GSEControl: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    GSESettings: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    GSSE: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Header: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    History: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Hitem: {
        identity: identity_js_1.hitemIdentity,
        selector: selector_js_1.hitemSelector,
    },
    IED: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    IEDName: {
        identity: identity_js_1.iEDNameIdentity,
        selector: selector_js_1.iEDNameSelector,
    },
    Inputs: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    IssuerName: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    KDC: {
        identity: identity_js_1.kDCIdentity,
        selector: selector_js_1.kDCSelector,
    },
    LDevice: {
        identity: identity_js_1.lDeviceIdentity,
        selector: selector_js_1.lDeviceSelector,
    },
    LN: {
        identity: identity_js_1.lNIdentity,
        selector: selector_js_1.lNSelector,
    },
    LN0: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    LNode: {
        identity: identity_js_1.lNodeIdentity,
        selector: selector_js_1.lNodeSelector,
    },
    LNodeType: {
        identity: identity_js_1.idNamingIdentity,
        selector: selector_js_1.idNamingSelector,
    },
    Line: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    Log: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    LogControl: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    LogSettings: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    MaxTime: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    McSecurity: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    MinTime: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    NeutralPoint: {
        identity: identity_js_1.terminalIdentity,
        selector: selector_js_1.terminalSelector,
    },
    OptFields: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    P: {
        identity: identity_js_1.pIdentity,
        selector: selector_js_1.pSelector,
    },
    PhysConn: {
        identity: identity_js_1.physConnIdentity,
        selector: selector_js_1.physConnSelector,
    },
    PowerTransformer: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    Private: {
        identity: () => NaN,
        selector: () => selector_js_1.voidSelector,
    },
    Process: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    ProtNs: {
        identity: identity_js_1.protNsIdentity,
        selector: selector_js_1.protNsSelector,
    },
    Protocol: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ReadWrite: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    RedProt: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ReportControl: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    ReportSettings: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    RptEnabled: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SamplesPerSec: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SampledValueControl: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    SecPerSamples: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SCL: {
        identity: identity_js_1.sCLIdentity,
        selector: selector_js_1.sCLSelector,
    },
    SDI: {
        identity: identity_js_1.ixNamingIdentity,
        selector: selector_js_1.ixNamingSelector,
    },
    SDO: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    Server: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    ServerAt: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Services: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SetDataSetValue: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SettingControl: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SettingGroups: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SGEdit: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SmpRate: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SMV: {
        identity: identity_js_1.controlBlockIdentity,
        selector: selector_js_1.controlBlockSelector,
    },
    SmvOpts: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SMVsc: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SMVSecurity: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    SMVSettings: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    SubEquipment: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    SubFunction: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    SubNetwork: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    Subject: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Substation: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    SupSubscription: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    TapChanger: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    Terminal: {
        identity: identity_js_1.terminalIdentity,
        selector: selector_js_1.terminalSelector,
    },
    Text: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    TimerActivatedControl: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    TimeSyncProt: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    TransformerWinding: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
    TrgOps: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Val: {
        identity: identity_js_1.valIdentity,
        selector: selector_js_1.valSelector,
    },
    ValueHandling: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    Voltage: {
        identity: identity_js_1.singletonIdentity,
        selector: selector_js_1.singletonSelector,
    },
    VoltageLevel: {
        identity: identity_js_1.namingIdentity,
        selector: selector_js_1.namingSelector,
    },
};

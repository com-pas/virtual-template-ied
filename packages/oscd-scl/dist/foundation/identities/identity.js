"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idNamingIdentity = exports.singletonIdentity = exports.namingIdentity = exports.sCLIdentity = exports.protNsIdentity = exports.enumValIdentity = exports.pIdentity = exports.physConnIdentity = exports.controlBlockIdentity = exports.connectedAPIdentity = exports.valIdentity = exports.ixNamingIdentity = exports.clientLNIdentity = exports.lNIdentity = exports.extRefIdentity = exports.fCDAIdentity = exports.iEDNameIdentity = exports.lDeviceIdentity = exports.associationIdentity = exports.kDCIdentity = exports.lNodeIdentity = exports.terminalIdentity = exports.hitemIdentity = exports.identity = void 0;
const scldata_js_1 = require("../utils/scldata.js");
const scltags_js_1 = require("./scltags.js");
/** @returns a string uniquely identifying `e` in its document, or NaN if `e`
 * is unidentifiable. */
function identity(e) {
    if (e === null)
        return NaN;
    if (e.closest('Private'))
        return NaN;
    const tag = e.tagName;
    if ((0, scldata_js_1.isSCLTag)(tag))
        return scltags_js_1.tags[tag].identity(e);
    return NaN;
}
exports.identity = identity;
function hitemIdentity(e) {
    return `${e.getAttribute('version')}\t${e.getAttribute('revision')}`;
}
exports.hitemIdentity = hitemIdentity;
function terminalIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('connectivityNode')}`;
}
exports.terminalIdentity = terminalIdentity;
function lNodeIdentity(e) {
    const [iedName, ldInst, prefix, lnClass, lnInst, lnType] = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'lnType',
    ].map(name => e.getAttribute(name));
    if (iedName === 'None')
        return `${identity(e.parentElement)}>(${lnClass} ${lnType})`;
    return `${iedName} ${ldInst || '(Client)'}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''}`;
}
exports.lNodeIdentity = lNodeIdentity;
function kDCIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('iedName')} ${e.getAttribute('apName')}`;
}
exports.kDCIdentity = kDCIdentity;
function associationIdentity(e) {
    var _a;
    return `${identity(e.parentElement)}>${(_a = e.getAttribute('associationID')) !== null && _a !== void 0 ? _a : ''}`;
}
exports.associationIdentity = associationIdentity;
function lDeviceIdentity(e) {
    return `${identity(e.closest('IED'))}>>${e.getAttribute('inst')}`;
}
exports.lDeviceIdentity = lDeviceIdentity;
function iEDNameIdentity(e) {
    const iedName = e.textContent;
    const [apRef, ldInst, prefix, lnClass, lnInst] = [
        'apRef',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
    ].map(name => e.getAttribute(name));
    return `${identity(e.parentElement)}>${iedName} ${apRef || ''} ${ldInst || ''}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass !== null && lnClass !== void 0 ? lnClass : ''} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''}`;
}
exports.iEDNameIdentity = iEDNameIdentity;
function fCDAIdentity(e) {
    const [ldInst, prefix, lnClass, lnInst, doName, daName, fc, ix] = [
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
        'fc',
        'ix',
    ].map(name => e.getAttribute(name));
    const dataPath = `${ldInst}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''}.${doName} ${daName || ''}`;
    return `${identity(e.parentElement)}>${dataPath} (${fc}${ix ? ` [${ix}]` : ''})`;
}
exports.fCDAIdentity = fCDAIdentity;
function extRefIdentity(e) {
    if (!e.parentElement)
        return NaN;
    const parentIdentity = identity(e.parentElement);
    const iedName = e.getAttribute('iedName');
    const intAddr = e.getAttribute('intAddr');
    const intAddrIndex = Array.from(e.parentElement.querySelectorAll(`ExtRef[intAddr="${intAddr}"]`)).indexOf(e);
    if (!iedName)
        return `${parentIdentity}>${intAddr}[${intAddrIndex}]`;
    const [ldInst, prefix, lnClass, lnInst, doName, daName, serviceType, srcLDInst, srcPrefix, srcLNClass, srcLNInst, srcCBName,] = [
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
        'serviceType',
        'srcLDInst',
        'srcPrefix',
        'srcLNClass',
        'srcLNInst',
        'srcCBName',
    ].map(name => e.getAttribute(name));
    const cbPath = srcCBName
        ? `${serviceType}:${srcCBName} ${srcLDInst !== null && srcLDInst !== void 0 ? srcLDInst : ''}/${srcPrefix !== null && srcPrefix !== void 0 ? srcPrefix : ''} ${srcLNClass !== null && srcLNClass !== void 0 ? srcLNClass : ''} ${srcLNInst !== null && srcLNInst !== void 0 ? srcLNInst : ''}`
        : '';
    const dataPath = `${iedName} ${ldInst}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''} ${doName} ${daName || ''}`;
    return `${parentIdentity}>${cbPath ? `${cbPath} ` : ''}${dataPath}${
    // eslint-disable-next-line no-useless-concat
    intAddr ? '@' + `${intAddr}` : ''}`;
}
exports.extRefIdentity = extRefIdentity;
function lNIdentity(e) {
    const [prefix, lnClass, inst] = ['prefix', 'lnClass', 'inst'].map(name => e.getAttribute(name));
    return `${identity(e.parentElement)}>${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${inst}`;
}
exports.lNIdentity = lNIdentity;
function clientLNIdentity(e) {
    const [apRef, iedName, ldInst, prefix, lnClass, lnInst] = [
        'apRef',
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
    ].map(name => e.getAttribute(name));
    return `${identity(e.parentElement)}>${iedName} ${apRef || ''} ${ldInst}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst}`;
}
exports.clientLNIdentity = clientLNIdentity;
function ixNamingIdentity(e) {
    const [name, ix] = ['name', 'ix'].map(naming => e.getAttribute(naming));
    return `${identity(e.parentElement)}>${name}${ix ? `[${ix}]` : ''}`;
}
exports.ixNamingIdentity = ixNamingIdentity;
function valIdentity(e) {
    if (!e.parentElement)
        return NaN;
    const sGroup = e.getAttribute('sGroup');
    const index = Array.from(e.parentElement.children)
        .filter(child => child.getAttribute('sGroup') === sGroup)
        .findIndex(child => child.isSameNode(e));
    return `${identity(e.parentElement)}>${sGroup ? `${sGroup}.` : ''} ${index}`;
}
exports.valIdentity = valIdentity;
function connectedAPIdentity(e) {
    const [iedName, apName] = ['iedName', 'apName'].map(name => e.getAttribute(name));
    return `${iedName} ${apName}`;
}
exports.connectedAPIdentity = connectedAPIdentity;
function controlBlockIdentity(e) {
    const [ldInst, cbName] = ['ldInst', 'cbName'].map(name => e.getAttribute(name));
    return `${ldInst} ${cbName}`;
}
exports.controlBlockIdentity = controlBlockIdentity;
function physConnIdentity(e) {
    if (!e.parentElement)
        return NaN;
    if (!e.parentElement.querySelector('PhysConn[type="RedConn"]'))
        return NaN;
    const pcType = e.getAttribute('type');
    if (e.parentElement.children.length > 1 &&
        pcType !== 'Connection' &&
        pcType !== 'RedConn')
        return NaN;
    return `${identity(e.parentElement)}>${pcType}`;
}
exports.physConnIdentity = physConnIdentity;
function pIdentity(e) {
    if (!e.parentElement)
        return NaN;
    const eParent = e.parentElement;
    const eType = e.getAttribute('type');
    if (eParent.tagName === 'PhysConn')
        return `${identity(e.parentElement)}>${eType}`;
    const index = Array.from(e.parentElement.children)
        .filter(child => child.getAttribute('type') === eType)
        .findIndex(child => child.isSameNode(e));
    return `${identity(e.parentElement)}>${eType} [${index}]`;
}
exports.pIdentity = pIdentity;
function enumValIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('ord')}`;
}
exports.enumValIdentity = enumValIdentity;
function protNsIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('type') || '8-MMS'}\t${e.textContent}`;
}
exports.protNsIdentity = protNsIdentity;
function sCLIdentity() {
    return '';
}
exports.sCLIdentity = sCLIdentity;
function namingIdentity(e) {
    return e.parentElement.tagName === 'SCL'
        ? e.getAttribute('name')
        : `${identity(e.parentElement)}>${e.getAttribute('name')}`;
}
exports.namingIdentity = namingIdentity;
function singletonIdentity(e) {
    return identity(e.parentElement).toString();
}
exports.singletonIdentity = singletonIdentity;
function idNamingIdentity(e) {
    return `#${e.id}`;
}
exports.idNamingIdentity = idNamingIdentity;

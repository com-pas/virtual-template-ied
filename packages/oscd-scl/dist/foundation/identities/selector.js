"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idNamingSelector = exports.singletonSelector = exports.namingSelector = exports.sCLSelector = exports.protNsSelector = exports.enumValSelector = exports.pSelector = exports.physConnSelector = exports.controlBlockSelector = exports.connectedAPSelector = exports.valSelector = exports.ixNamingSelector = exports.clientLNSelector = exports.lNSelector = exports.extRefSelector = exports.fCDASelector = exports.iEDNameSelector = exports.lDeviceSelector = exports.associationSelector = exports.kDCSelector = exports.lNodeSelector = exports.terminalSelector = exports.hitemSelector = exports.findElement = exports.selector = exports.voidSelector = void 0;
const scldata_js_1 = require("../utils/scldata.js");
const scltags_js_1 = require("./scltags.js");
exports.voidSelector = ':not(*)';
function selector(tagName, identity) {
    if (typeof identity !== 'string')
        return exports.voidSelector;
    if ((0, scldata_js_1.isSCLTag)(tagName))
        return scltags_js_1.tags[tagName].selector(tagName, identity);
    return tagName;
}
exports.selector = selector;
function findElement(root, { tagName, identity }) {
    return root.querySelector(selector(tagName, identity));
}
exports.findElement = findElement;
function crossProduct(...arrays) {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);
}
function pathParts(identity) {
    var _a;
    const path = identity.split('>');
    const end = (_a = path.pop()) !== null && _a !== void 0 ? _a : '';
    const start = path.join('>');
    return [start, end];
}
function hitemSelector(tagName, identity) {
    const [version, revision] = identity.split('\t');
    if (!version || !revision)
        return exports.voidSelector;
    return `${tagName}[version="${version}"][revision="${revision}"]`;
}
exports.hitemSelector = hitemSelector;
function terminalSelector(tagName, identity) {
    const [parentIdentity, connectivityNode] = pathParts(identity);
    const parentSelectors = scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    return crossProduct(parentSelectors, ['>'], [`${tagName}[connectivityNode="${connectivityNode}"]`])
        .map(strings => strings.join(''))
        .join(',');
}
exports.terminalSelector = terminalSelector;
function lNodeSelector(tagName, identity) {
    if (identity.endsWith(')')) {
        const [parentIdentity, childIdentity] = pathParts(identity);
        const [lnClass, lnType] = childIdentity
            .substring(1, childIdentity.length - 1)
            .split(' ');
        if (!lnClass || !lnType)
            return exports.voidSelector;
        const parentSelectors = scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
        return crossProduct(parentSelectors, ['>'], [`${tagName}[iedName="None"][lnClass="${lnClass}"][lnType="${lnType}"]`])
            .map(strings => strings.join(''))
            .join(',');
    }
    const [iedName, ldInst, prefix, lnClass, lnInst] = identity.split(/[ /]/);
    if (!iedName || !ldInst || !lnClass)
        return exports.voidSelector;
    const [iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors,] = [
        [`[iedName="${iedName}"]`],
        ldInst === '(Client)'
            ? [':not([ldInst])', '[ldInst=""]']
            : [`[ldInst="${ldInst}"]`],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
    ];
    return crossProduct([tagName], iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.lNodeSelector = lNodeSelector;
function kDCSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [iedName, apName] = childIdentity.split(' ');
    return `${selector('IED', parentIdentity)}>${tagName}[iedName="${iedName}"][apName="${apName}"]`;
}
exports.kDCSelector = kDCSelector;
function associationSelector(tagName, identity) {
    const [parentIdentity, associationID] = pathParts(identity);
    if (!associationID)
        return exports.voidSelector;
    return `${selector('Server', parentIdentity)}>${tagName}[associationID="${associationID}"]`;
}
exports.associationSelector = associationSelector;
function lDeviceSelector(tagName, identity) {
    const [iedName, inst] = identity.split('>>');
    if (!inst)
        return exports.voidSelector;
    return `IED[name="${iedName}"] ${tagName}[inst="${inst}"]`;
}
exports.lDeviceSelector = lDeviceSelector;
function iEDNameSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [iedName, apRef, ldInst, prefix, lnClass, lnInst] = childIdentity.split(/[ /]/);
    const [parentSelectors, apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors,] = [
        scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        [`${iedName}`],
        apRef ? [`[apRef="${apRef}"]`] : [':not([apRef])', '[apRef=""]'],
        ldInst ? [`[ldInst="${ldInst}"]`] : [':not([ldInst])', '[ldInst=""]'],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.iEDNameSelector = iEDNameSelector;
function fCDASelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [ldInst, prefix, lnClass, lnInst] = childIdentity.split(/[ /.]/);
    const matchDoDa = childIdentity.match(/.([A-Z][A-Za-z0-9.]*) ([A-Za-z0-9.]*) \(/);
    const doName = matchDoDa && matchDoDa[1] ? matchDoDa[1] : '';
    const daName = matchDoDa && matchDoDa[2] ? matchDoDa[2] : '';
    const matchFx = childIdentity.match(/\(([A-Z]{2})/);
    const matchIx = childIdentity.match(/ \[([0-9]{1,2})\]/);
    const fc = matchFx && matchFx[1] ? matchFx[1] : '';
    const ix = matchIx && matchIx[1] ? matchIx[1] : '';
    const [parentSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, fcSelectors, ixSelectors,] = [
        scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        [`[ldInst="${ldInst}"]`],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
        [`[doName="${doName}"]`],
        daName ? [`[daName="${daName}"]`] : [':not([daName])', '[daName=""]'],
        [`[fc="${fc}"]`],
        ix ? [`[ix="${ix}"]`] : [':not([ix])', '[ix=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, fcSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.fCDASelector = fCDASelector;
function extRefSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const parentSelectors = scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    if (childIdentity.endsWith(']')) {
        const [intAddr] = childIdentity.split('[');
        const intAddrSelectors = [`[intAddr="${intAddr}"]`];
        return crossProduct(parentSelectors, ['>'], [tagName], intAddrSelectors)
            .map(strings => strings.join(''))
            .join(',');
    }
    let iedName;
    let ldInst;
    let prefix;
    let lnClass;
    let lnInst;
    let doName;
    let daName;
    let serviceType;
    let srcCBName;
    let srcLDInst;
    let srcPrefix;
    let srcLNClass;
    let srcLNInst;
    let intAddr;
    if (!childIdentity.includes(':') && !childIdentity.includes('@')) {
        [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] =
            childIdentity.split(/[ /]/);
    }
    else if (childIdentity.includes(':') && !childIdentity.includes('@')) {
        [
            serviceType,
            srcCBName,
            srcLDInst,
            srcPrefix,
            srcLNClass,
            srcLNInst,
            iedName,
            ldInst,
            prefix,
            lnClass,
            lnInst,
            doName,
            daName,
        ] = childIdentity.split(/[ /:]/);
    }
    else if (!childIdentity.includes(':') && childIdentity.includes('@')) {
        [iedName, ldInst, prefix, lnClass, lnInst, doName, daName, intAddr] =
            childIdentity.split(/[ /@]/);
    }
    else {
        [
            serviceType,
            srcCBName,
            srcLDInst,
            srcPrefix,
            srcLNClass,
            srcLNInst,
            iedName,
            ldInst,
            prefix,
            lnClass,
            lnInst,
            doName,
            daName,
            intAddr,
        ] = childIdentity.split(/[ /:@]/);
    }
    const [iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, serviceTypeSelectors, srcCBNameSelectors, srcLDInstSelectors, srcPrefixSelectors, srcLNClassSelectors, srcLNInstSelectors, intAddrSelectors,] = [
        iedName ? [`[iedName="${iedName}"]`] : [':not([iedName])'],
        ldInst ? [`[ldInst="${ldInst}"]`] : [':not([ldInst])', '[ldInst=""]'],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        lnClass ? [`[lnClass="${lnClass}"]`] : [':not([lnClass])'],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
        doName ? [`[doName="${doName}"]`] : [':not([doName])'],
        daName ? [`[daName="${daName}"]`] : [':not([daName])', '[daName=""]'],
        serviceType
            ? [`[serviceType="${serviceType}"]`]
            : [':not([serviceType])', '[serviceType=""]'],
        srcCBName
            ? [`[srcCBName="${srcCBName}"]`]
            : [':not([srcCBName])', '[srcCBName=""]'],
        srcLDInst
            ? [`[srcLDInst="${srcLDInst}"]`]
            : [':not([srcLDInst])', '[srcLDInst=""]'],
        srcPrefix
            ? [`[srcPrefix="${srcPrefix}"]`]
            : [':not([srcPrefix])', '[srcPrefix=""]'],
        srcLNClass
            ? [`[srcLNClass="${srcLNClass}"]`]
            : [':not([srcLNClass])', '[srcLNClass=""]'],
        srcLNInst
            ? [`[srcLNInst="${srcLNInst}"]`]
            : [':not([srcLNInst])', '[srcLNInst=""]'],
        intAddr ? [`[intAddr="${intAddr}"]`] : [':not([intAddr])', '[intAddr=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, serviceTypeSelectors, srcCBNameSelectors, srcLDInstSelectors, srcPrefixSelectors, srcLNClassSelectors, srcLNInstSelectors, intAddrSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.extRefSelector = extRefSelector;
function lNSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const parentSelectors = scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    const [prefix, lnClass, inst] = childIdentity.split(' ');
    if (!lnClass)
        return exports.voidSelector;
    const [prefixSelectors, lnClassSelectors, instSelectors] = [
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        [`[inst="${inst}"]`],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], prefixSelectors, lnClassSelectors, instSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.lNSelector = lNSelector;
function clientLNSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const parentSelectors = scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    const [iedName, apRef, ldInst, prefix, lnClass, lnInst] = childIdentity.split(/[ /]/);
    const [iedNameSelectors, apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors,] = [
        iedName ? [`[iedName="${iedName}"]`] : [':not([iedName])', '[iedName=""]'],
        apRef ? [`[apRef="${apRef}"]`] : [':not([apRef])', '[apRef=""]'],
        ldInst ? [`[ldInst="${ldInst}"]`] : [':not([ldInst])', '[ldInst=""]'],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], iedNameSelectors, apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.clientLNSelector = clientLNSelector;
function ixNamingSelector(tagName, identity, depth = -1) {
    var _a;
    // eslint-disable-next-line no-param-reassign
    if (depth === -1)
        depth = identity.split('>').length;
    const [parentIdentity, childIdentity] = pathParts(identity);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_0, name, _1, ix] = (_a = childIdentity.match(/([^[]*)(\[([0-9]*)\])?/)) !== null && _a !== void 0 ? _a : [];
    if (!name)
        return exports.voidSelector;
    if (depth === 0)
        return `${tagName}[name="${name}"]`;
    const parentSelectors = scldata_js_1.relatives[tagName].parents
        .flatMap(parentTag => parentTag === 'SDI'
        ? ixNamingSelector(parentTag, parentIdentity, depth - 1).split(',')
        : selector(parentTag, parentIdentity).split(','))
        // eslint-disable-next-line no-shadow
        .filter(selector => !selector.startsWith(exports.voidSelector));
    if (parentSelectors.length === 0)
        return exports.voidSelector;
    const [nameSelectors, ixSelectors] = [
        [`[name="${name}"]`],
        ix ? [`[ix="${ix}"]`] : ['[ix=""]', ':not([ix])'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], nameSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.ixNamingSelector = ixNamingSelector;
function valSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [sGroup, indexText] = childIdentity.split(' ');
    const index = parseFloat(indexText);
    const parentSelectors = scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    const [nameSelectors, ixSelectors] = [
        sGroup ? [`[sGroup="${sGroup}"]`] : [''],
        index ? [`:nth-child(${index + 1})`] : [''],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], nameSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.valSelector = valSelector;
function connectedAPSelector(tagName, identity) {
    const [iedName, apName] = identity.split(' ');
    if (!iedName || !apName)
        return exports.voidSelector;
    return `${tagName}[iedName="${iedName}"][apName="${apName}"]`;
}
exports.connectedAPSelector = connectedAPSelector;
function controlBlockSelector(tagName, identity) {
    const [ldInst, cbName] = identity.split(' ');
    if (!ldInst || !cbName)
        return exports.voidSelector;
    return `${tagName}[ldInst="${ldInst}"][cbName="${cbName}"]`;
}
exports.controlBlockSelector = controlBlockSelector;
function physConnSelector(tagName, identity) {
    const [parentIdentity, pcType] = pathParts(identity);
    const [parentSelectors, typeSelectors] = [
        scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        pcType ? [`[type="${pcType}"]`] : [''],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], typeSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.physConnSelector = physConnSelector;
function pSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [type] = childIdentity.split(' ');
    const index = childIdentity &&
        childIdentity.match(/\[([0-9]+)\]/) &&
        childIdentity.match(/\[([0-9]+)\]/)[1]
        ? parseFloat(childIdentity.match(/\[([0-9]+)\]/)[1])
        : NaN;
    const [parentSelectors, typeSelectors, ixSelectors] = [
        scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        [`[type="${type}"]`],
        index ? [`:nth-child(${index + 1})`] : [''],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], typeSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
exports.pSelector = pSelector;
function enumValSelector(tagName, identity) {
    const [parentIdentity, ord] = pathParts(identity);
    return `${selector('EnumType', parentIdentity)}>${tagName}[ord="${ord}"]`;
}
exports.enumValSelector = enumValSelector;
function protNsSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [type, value] = childIdentity.split('\t');
    const [parentSelectors] = [
        scldata_js_1.relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], [`[type="${type}"]`], ['>'], [value])
        .map(strings => strings.join(''))
        .join(',');
}
exports.protNsSelector = protNsSelector;
function sCLSelector() {
    return ':root';
}
exports.sCLSelector = sCLSelector;
function namingSelector(tagName, identity, depth = -1) {
    // eslint-disable-next-line no-param-reassign
    if (depth === -1)
        depth = identity.split('>').length;
    const [parentIdentity, name] = pathParts(identity);
    if (!name)
        return exports.voidSelector;
    if (depth === 0)
        return `${tagName}[name="${name}"]`;
    // eslint-disable-next-line prefer-destructuring
    const parents = scldata_js_1.relatives[tagName].parents;
    if (!parents)
        return exports.voidSelector;
    const parentSelectors = parents
        .flatMap(parentTag => scltags_js_1.tags[parentTag].selector === scltags_js_1.tags.Substation.selector
        ? namingSelector(parentTag, parentIdentity, depth - 1).split(',')
        : selector(parentTag, parentIdentity).split(','))
        // eslint-disable-next-line no-shadow
        .filter(selector => !selector.startsWith(exports.voidSelector));
    if (parentSelectors.length === 0)
        return exports.voidSelector;
    return crossProduct(parentSelectors, ['>'], [tagName], [`[name="${name}"]`])
        .map(strings => strings.join(''))
        .join(',');
}
exports.namingSelector = namingSelector;
function singletonSelector(tagName, identity) {
    // eslint-disable-next-line prefer-destructuring
    const parents = scldata_js_1.relatives[tagName].parents;
    if (!parents)
        return exports.voidSelector;
    const parentSelectors = parents
        .flatMap(parentTag => selector(parentTag, identity).split(','))
        // eslint-disable-next-line no-shadow
        .filter(selector => !selector.startsWith(exports.voidSelector));
    if (parentSelectors.length === 0)
        return exports.voidSelector;
    return crossProduct(parentSelectors, ['>'], [tagName])
        .map(strings => strings.join(''))
        .join(',');
}
exports.singletonSelector = singletonSelector;
function idNamingSelector(tagName, identity) {
    const id = identity.replace(/^#/, '');
    if (!id)
        return exports.voidSelector;
    return `${tagName}[id="${id}"]`;
}
exports.idNamingSelector = idNamingSelector;

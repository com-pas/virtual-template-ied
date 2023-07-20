/**
 * @param element - Some element Function, SubFunction, EqFunction or EqSubFunction
 * @returns Whether the element is a leaf function acc. to IEC 61850-6-100
 * */
export declare function isLeafFunction(element: Element | null): boolean;
/** @returns closest non-leaf function type parent element */
export declare function getNonLeafParent(element: Element | null): Element | null;
/** @returns prefix of LNode element acc. to IEC 61850-6-100 */
export declare function getFunctionNamingPrefix(lNode: Element): string;
export declare function getUniqueFunctionName(element: Element): string;
type AnyLNDescription = {
    lnClass: string;
    inst: string;
    prefix: string | null;
    lnType: string;
};
export type LDeviceDescription = {
    validLdInst: string;
    anyLNs: AnyLNDescription[];
};
export type VirtualIEDDescription = {
    manufacturer: string;
    desc: string | null;
    apName: string;
    lDevices: LDeviceDescription[];
};
/** @returns schema valid SPECIFICATION type IED based on virtualIED object  */
export declare function getSpecificationIED(ownerDocument: Document, virtualIED: VirtualIEDDescription): Element;
export {};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = exports.getChildElementsByTagName = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
function getChildElementsByTagName(element, tag) {
    if (!element || !tag)
        return [];
    return Array.from(element.children).filter(e => e.tagName === tag);
}
exports.getChildElementsByTagName = getChildElementsByTagName;
/** @returns a new [[`tag`]] element owned by [[`doc`]]. */
function createElement(doc, tag, attrs) {
    const element = doc.createElementNS(doc.documentElement.namespaceURI, tag);
    Object.entries(attrs)
        .filter(([_, value]) => value !== null)
        .forEach(([name, value]) => element.setAttribute(name, value));
    return element;
}
exports.createElement = createElement;

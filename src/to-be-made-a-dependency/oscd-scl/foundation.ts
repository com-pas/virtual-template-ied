/* eslint-disable @typescript-eslint/no-unused-vars */
export function getChildElementsByTagName(
  element: Element | null | undefined,
  tag: string | null | undefined
): Element[] {
  if (!element || !tag) return [];
  return Array.from(element.children).filter(e => e.tagName === tag);
}

/** @returns a new [[`tag`]] element owned by [[`doc`]]. */
export function createElement(
  doc: Document,
  tag: string,
  attrs: Record<string, string | null>
): Element {
  const element = doc.createElementNS(doc.documentElement.namespaceURI, tag);
  Object.entries(attrs)
    .filter(([_, value]) => value !== null)
    .forEach(([name, value]) => element.setAttribute(name, value!));
  return element;
}

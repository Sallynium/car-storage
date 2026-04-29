/**
 * @typedef {'box'|'basket'|'hanging'|'other'} ContainerType
 * @typedef {'floor'|'left'|'right'|'front'|'cabin'} ViewKey
 */

/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} name
 * @property {number} quantity
 * @property {string} notes
 */

/**
 * @typedef {Object} Compartment
 * @property {string} id
 * @property {string} name
 * @property {Item[]} items
 */

/**
 * @typedef {Object} Container
 * @property {string}        id
 * @property {string}        name
 * @property {ContainerType} type
 * @property {ViewKey}       view
 * @property {number}        x
 * @property {number}        y
 * @property {number}        w
 * @property {number}        h
 * @property {number}        layer          - z-index level, default 1
 * @property {string|null}   parentId       - id of parent container, null if independent
 * @property {boolean}       isStoredInside - hidden from canvas when true
 * @property {Compartment[]} compartments
 * @property {string}        color          - sticky-note hex color
 * @property {import('firebase/firestore').Timestamp} createdAt
 */

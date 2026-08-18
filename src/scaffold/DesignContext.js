import { createContext } from 'react'

/**
 * Lets a Cite marker anywhere in the tree open the chapter that justifies it.
 * Kept out of Cite.jsx so that file only exports a component — a module that
 * exports both a component and a context breaks fast refresh.
 */
export const DesignContext = createContext({ onOpenChapter: () => {} })

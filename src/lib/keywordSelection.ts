import { createContext } from 'react';

// Keep content badge links aware of the active filter, even after section navigation.
export const KeywordSelectionContext = createContext<readonly string[]>([]);

import React, { createContext, useContext, useState, useCallback } from 'react';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
    // Keep a map of drafted teams by jackpotId, so context isn't lost globally
    const [drafts, setDrafts] = useState({});

    const getDraft = useCallback((jackpotId) => drafts[jackpotId] || [], [drafts]);
    
    const setDraft = useCallback((jackpotId, players) => {
        setDrafts(prev => ({ ...prev, [jackpotId]: players }));
    }, []);

    const clearDraft = useCallback((jackpotId) => {
        setDrafts(prev => {
            const newDrafts = { ...prev };
            delete newDrafts[jackpotId];
            return newDrafts;
        });
    }, []);

    return (
        <SelectionContext.Provider value={{ drafts, getDraft, setDraft, clearDraft }}>
            {children}
        </SelectionContext.Provider>
    );
};

export const useSelection = () => useContext(SelectionContext);

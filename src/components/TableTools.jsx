import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React from 'react';

export default function TableTools({ children }) {
    return (
        <AnimatePresence>
            <LayoutGroup>
                <motion.div key="tabletools" className="flex space-x-5 m-auto pl-5">
                    {children}
                </motion.div>
            </LayoutGroup>
        </AnimatePresence>
    );
}

import { BiExport } from "react-icons/bi";
import { HiDocumentPlus, HiFolderPlus } from "react-icons/hi2";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { TbTable } from 'react-icons/tb'
import TextRevealIconButton from "./TextRevealIconButton";

export default function TableTools({children}) {
    return (
        <AnimatePresence>
            <LayoutGroup>
                <motion.div key='tabletools' className="flex space-x-5 m-auto pl-5">
                    {children}
                </motion.div>
            </LayoutGroup>
        </AnimatePresence>

    );
}

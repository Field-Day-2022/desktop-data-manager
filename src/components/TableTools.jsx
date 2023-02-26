import { BiExport } from "react-icons/bi";
import { HiDocumentPlus, HiFolderPlus } from "react-icons/hi2";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { TbTable } from 'react-icons/tb'
import TextRevealIconButton from "./TextRevealIconButton";

export default function TableTools() {
    return (
        <AnimatePresence>
            <LayoutGroup>
                <motion.div key='tabletools' className="flex space-x-5 m-auto pl-5">
                    <TextRevealIconButton text='Form Builder' icon={<TbTable />} onClick={()=> console.log('Clicked form builder')} />
                    <TextRevealIconButton text='Export to CSV' icon={<BiExport />} onClick={()=> console.log('Clicked export to csv')} />
                    <TextRevealIconButton text='New Session' icon={<HiFolderPlus />} onClick={()=> console.log('Clicked new session')} />
                    <TextRevealIconButton text='New Data Entry' icon={<HiDocumentPlus onClick={()=> console.log('Clicked new entry')} />} />
                </motion.div>
            </LayoutGroup>
        </AnimatePresence>

    );
}

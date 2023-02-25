import { useState } from "react";
import { AiFillTool } from "react-icons/ai";
import { BiExport } from "react-icons/bi";
import { HiDocument } from "react-icons/hi";
import { BsPlusSquareFill } from 'react-icons/bs'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

export default function TableTools() {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);


    return (
        <div className="flex">
            <LayoutGroup>
                <motion.div
                    layout
                    key='container'
                    className='flex space-x-5 items-center m-auto p-2 z-50 bg-neutral-200 h-16 w-fit border-r-2 border-asu-maroon active:bg-neutral-300'>

                    <AnimatePresence>

                        {open &&
                            <motion.div layout key='toolkit' transition={{ duration: .3 }} initial={{ x: '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} className="flex space-x-5 mx-auto">
                                <div className='flex-col items-center text-sm w-36 text-center'>
                                    <HiDocument className="text-4xl mx-auto" />
                                    {'Form Builder'}
                                </div>
                                <div className='flex-col items-center text-sm w-36 text-center'>
                                    <BiExport className="text-4xl mx-auto" />
                                    {'Export to CSV'}
                                </div>

                            </motion.div>}
                        <motion.div layout key='wrench' onClick={() => setOpen(!open)}>
                            <AiFillTool className="text-4xl" />
                        </motion.div>

                    </AnimatePresence>
                </motion.div >
            </LayoutGroup>
            <LayoutGroup>
                <motion.div
                    layout
                    key='container'
                    className='flex space-x-5 m-auto p-2 items-center bg-neutral-200 h-16 w-fit border-r-2 border-asu-maroon active:bg-neutral-300'>

                    <AnimatePresence>

                        {open2 &&
                            <motion.div layout key='toolkit' transition={{ duration: .3 }} initial={{ x: '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} className="flex space-x-5 mx-auto">
                                <div className='flex-col items-center text-sm w-36 text-center'>
                                    <HiDocument className="text-4xl mx-auto" />
                                    {'New Session'}
                                </div>
                                <div className='flex-col items-center text-sm w-36 text-center'>
                                    <HiDocument className="text-4xl mx-auto" />
                                    {'New Data Entry'}
                                </div>

                            </motion.div>}
                        <motion.div layout key='plus' onClick={() => setOpen2(!open2)}>
                            <BsPlusSquareFill className="text-3xl" />
                        </motion.div>

                    </AnimatePresence>
                </motion.div >
            </LayoutGroup>
        </div>
    );
}
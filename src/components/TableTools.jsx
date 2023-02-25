import { useState } from "react";
import { AiFillTool } from "react-icons/ai";
import { BiExport } from "react-icons/bi";
import { HiDocument } from "react-icons/hi";
import Button from "./Button";
import { AnimatePresence, motion } from "framer-motion";

export default function TableTools() {
    const [open, setOpen] = useState(false);

    return (
        <div className='flex ml-3 m-auto p-2'>
            <AiFillTool
                className='text-4xl rounded-xl h-12 w-12 text-neutral-800 cursor-pointer m-auto z-50 bg-neutral-300'
                onClick={() => setOpen(!open)} />
            <AnimatePresence>
                {(open)
                    &&
                    <motion.div
                        key='toolkit'
                        initial={{ scaleX:0.5, opacity: 0, x: '-100%' }}
                        animate={{ scaleX:1, opacity: 1, x: '-8%' }}
                        exit={{ scaleX:.5, opacity: 0, x: '-100%' }}
                        transition={{ duration: .2, ease: 'easeOut' }}
                        className="flex space-x-5 my-auto bg-neutral-300 p-1 px-5 pl-10 rounded-xl">
                        <Button className='w-40' icon={<HiDocument />} text={'Form Builder'} />
                        <Button className='w-40' icon={<BiExport />} text={'Export to CSV'} />
                    </motion.div>}
            </AnimatePresence>
        </div>
    );
}
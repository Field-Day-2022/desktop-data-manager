import { useState } from "react";
import { AiFillTool } from "react-icons/ai";
import { BiExport } from "react-icons/bi";
import { HiDocument } from "react-icons/hi";
import Button from "./Button";
import { AnimatePresence, motion } from "framer-motion";

export default function TableTools() {
    const [open, setOpen] = useState(false);

    return (
        <div className='flex ml-3 m-auto p-2 space-x-5'>
            <AiFillTool
                className='text-4xl rounded-xl h-12 w-12 text-neutral-800 cursor-pointer m-auto z-50 bg-neutral-300'
                onClick={() => setOpen(!open)} />
            <AnimatePresence>
                {(open)
                    &&
                    <motion.div
                        key='toolkit'
                        initial={{ x: '-100%' }}
                        animate={{ x: '0' }}
                        exit={{ x: '-100%' }}
                        transition={{duration: 0.3, ease: 'easeOut'}}
                        className="flex space-x-5 ml-5 my-auto bg-neutral-300">
                        <Button className='w-40' icon={<HiDocument />} text={'Form Builder'} />
                        <Button className='w-40' icon={<BiExport />} text={'Export to CSV'} />
                    </motion.div>}
            </AnimatePresence>

        </div>
    );
}
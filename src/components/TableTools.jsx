import { useState } from "react";
import { AiFillTool } from "react-icons/ai";
import { BiExport } from "react-icons/bi";
import { HiDocument } from "react-icons/hi";
import Button from "./Button";

export default function TableTools() {
    const [open, setOpen] = useState(false);
    return (
        <div className='flex m-auto px-3 text-neutral-800'>
            <AiFillTool
                className='text-4xl cursor-pointer m-auto'
                onClick={() => setOpen(!open)} />
            {(open)
                ? <div className="flex space-x-5 ml-5">
                    <Button className='w-40' icon={<HiDocument />} text={'Form Builder'} />
                    <Button className='w-40' icon={<BiExport />} text={'Export to CSV'} />
                </div>
                : null}
        </div>
    );
}
import { useEffect } from "react";
import Dropdown from "../components/Dropdown";

export default function NewDataTool() {
    useEffect(() => {
        console.log('NewDataTool mounted');
    }, []);

    return (
        <div className='flex-col p-4'>
            <div className="heading">
                Select a Session for New Entry
            </div>
            <div className="flex">
                <div className="flex-1 p-2">
                    <div>
                        Year:
                    </div>
                    <Dropdown
                        options={[
                            '2021',
                            '2020',
                        ]}
                        onClickHandler={() => { }}
                        value={'2021'}
                    />
                </div>
                <div className="flex-1 p-2">
                    <div>
                        Session:
                    </div>
                    <Dropdown
                        options={[
                            '2021',
                            '2020',
                        ]}
                        onClickHandler={() => { }}
                        value={'2021'}
                    />
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
import DataForm from "../forms/DataForm";

export default function NewDataTool() {
   const [project, setProject] = useState('Gateway');

   return(
        <DataForm 
            project={project}
            setProject={setProject}
        />
   )
}
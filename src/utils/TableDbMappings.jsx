import TablePage from "../pages/TablePage";

export const getTable = (currentPage, currentProject, environment) => {    
    const mappings = {
        test: {
            Turtle: `Test${currentProject}Data`,
            Lizard: `Test${currentProject}Data`,
            Mammal: `Test${currentProject}Data`,
            Snake: `Test${currentProject}Data`,
            Arthropod: `Test${currentProject}Data`,
            Amphibian: `Test${currentProject}Data`,
            Session: `Test${currentProject}Session`,
        },
        live: {
            Turtle: `${currentProject}Data`,
            Lizard: `${currentProject}Data`,
            Mammal: `${currentProject}Data`,
            Snake: `${currentProject}Data`,
            Arthropod: `${currentProject}Data`,
            Amphibian: `${currentProject}Data`,
            Session: `${currentProject}Session`,
        } 
    }
    return <TablePage tableName={currentPage} collectionName={mappings[environment][currentPage]} />  
}
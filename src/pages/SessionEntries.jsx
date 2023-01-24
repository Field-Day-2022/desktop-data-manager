import Table from "../components/Table"

export default function SessionEntries () {
    return (
        <div className="bg-slate-200 w-11/12 h-full rounded-3xl p-4 my-12">
            <Table 
                tableName="Session"
            />
        </div>
    )
}
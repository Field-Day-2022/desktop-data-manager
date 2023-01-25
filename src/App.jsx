import Table from "./components/Table"

export default function App() {
    return (
        <div className="absolute h-screen inset-0 flex flex-col items-center bg-slate-400">
            <Table 
                tableName="Session"
                collectionName="GatewaySession"
            />
        </div>
    );
}
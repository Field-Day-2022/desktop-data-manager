import { db } from "../utils/firebase"

export default function Table ({
    tableName,
}) {
    return (
        <div>
            <p>{`${tableName} - Entries`}</p>
        </div>
    )
}
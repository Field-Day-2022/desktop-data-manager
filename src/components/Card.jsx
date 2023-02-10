export default function Card({className, children}) {
    return (
        <div className={"m-5 p-10 rounded-lg shadow-md " + className}>
            {children}
        </div>
    )
}
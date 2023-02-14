export default function PageWrapper({children}) {
    return(
        <div className="w-full text-center overflow-auto max-h-full-minus-nav">
            {children}
        </div>
    )
}
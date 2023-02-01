export default function PageWrapper({children}) {
    return(
        <div className="w-full text-center overflow-scroll max-h-full-minus-nav">
            {children}
        </div>
    )
}
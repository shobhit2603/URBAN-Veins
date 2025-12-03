export default function BackgroundBlobs() {
    return (
        <>
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-200 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-lime-200 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }} />
        </>
    )
}

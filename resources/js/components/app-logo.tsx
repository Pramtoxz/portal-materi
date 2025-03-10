export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center size-8">
                <img 
                    src="/images/logojayanusa.png"
                    alt="Logo Jayanusa" 
                    className="h-8 w-auto"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Portal Materi Jayanusa</span>
            </div>
        </>
    );
}

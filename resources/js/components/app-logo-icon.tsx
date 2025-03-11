import LogoJayanusa from '@/assets/jayanusa.webp';

export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img 
        src={LogoJayanusa}
            alt="Logo Jayanusa" 
            className={className}
        />
    );
}

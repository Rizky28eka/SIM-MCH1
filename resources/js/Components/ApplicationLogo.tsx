interface ApplicationLogoProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function ApplicationLogo({ className, style }: ApplicationLogoProps) {
    return (
        <img
            src="/logo.png"
            alt="SIM-MCH Logo"
            className={className}
            style={style}
        />
    );
}

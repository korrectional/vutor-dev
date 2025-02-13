export default function QuickLinkButton({ href, icon, text }) {
    return (
        <a
            href={href}
            className="flex items-center rounded-full justify-center gap-3 bg-blue-600 text-white py-3 px-6 font-medium hover:bg-blue-700 transition-colors duration-300"
        >
            {icon}
            {text}
        </a>
    );
}

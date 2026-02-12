export const LoaderLarge = () => (
    <div className="flex justify-center items-center py-4" role="status" aria-live="polite">
        <svg className="w-12 h-12 animate-spin" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2"/>
            <path d="M45 25a20 20 0 0 1-20 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
    </div>
);
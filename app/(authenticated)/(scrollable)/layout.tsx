import type {ReactNode} from "react";

type ScrollableLayoutProps = {
    children: ReactNode;
}

const ScrollableLayout = ({children}: ScrollableLayoutProps) => (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth antialiased">
        <div className="max-w-md mx-auto">
            {children}
        </div>
    </div>
)

export default ScrollableLayout;

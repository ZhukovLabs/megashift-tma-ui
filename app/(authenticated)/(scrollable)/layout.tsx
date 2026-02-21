import type {ReactNode} from "react";

type ScrollableLayoutProps = {
    children: ReactNode;
}

const ScrollableLayout = ({children}: ScrollableLayoutProps) => (
    <div className="h-[80vh] max-h-[80vh] overflow-y-auto overflow-x-hidden p-2 pr-4">
        {children}
    </div>
)

export default ScrollableLayout;
import {Schedule} from "@/components/schedule";
import {ScheduleProvider} from "@/components/schedule/context";

const SchedulePage = () => {
    return <ScheduleProvider>
        <Schedule/>
    </ScheduleProvider>;
}

export default SchedulePage;
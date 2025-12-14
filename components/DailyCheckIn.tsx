import { Provider } from "jotai";
import { DailyCheckIn as DailyCheckInWizard } from "./check-in-wizard/DailyCheckIn";

export function DailyCheckIn() {
  return (
    <Provider>
      <DailyCheckInWizard />
    </Provider>
  );
}

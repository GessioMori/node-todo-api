import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { container } from "tsyringe";

container.registerSingleton<IDateProvider>("DateProvider", DayJsDateProvider);

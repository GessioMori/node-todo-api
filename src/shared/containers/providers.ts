import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { dayJsDateProvider } from "@shared/providers/dateProvider/implementations/dayJsDateProvider";
import { container } from "tsyringe";

container.registerSingleton<IDateProvider>("dateProvider", dayJsDateProvider);

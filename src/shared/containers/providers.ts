import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";
import { EtherealMailProvider } from "@shared/providers/emailProvider/implementations/EtherealMailProvider";
import { container } from "tsyringe";

container.registerSingleton<IDateProvider>("DateProvider", DayJsDateProvider);

container.registerInstance<IEmailProvider>(
  "EmailProvider",
  container.resolve(EtherealMailProvider)
);

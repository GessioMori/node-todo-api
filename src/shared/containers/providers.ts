import dotenv from "dotenv";

import { IDateProvider } from "@shared/providers/dateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/providers/dateProvider/implementations/DayJsDateProvider";
import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";
import { EtherealMailProvider } from "@shared/providers/emailProvider/implementations/EtherealMailProvider";
import { SESMailProvider } from "@shared/providers/emailProvider/implementations/SESMailProvider";
import { container } from "tsyringe";

dotenv.config();

container.registerSingleton<IDateProvider>("DateProvider", DayJsDateProvider);

container.registerInstance<IEmailProvider>(
  "EmailProvider",
  process.env.ENV === "production"
    ? container.resolve(SESMailProvider)
    : container.resolve(EtherealMailProvider)
);

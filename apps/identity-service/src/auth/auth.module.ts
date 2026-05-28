import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@pothys/db-base";
import { AuthPackageModule } from "@pothys/auth";
import { Customer } from "src/customers/entities/customer.entity";
import { CustomerOtp } from "src/customers/entities/customer-otp.entity";
import { CustomerDevices } from "src/customers/entities/customer-devices.entity";
import { AdminUsers } from "./entities/admin-users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CustomerOtp,
      CustomerDevices,
      AdminUsers,
    ]),
    AuthPackageModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

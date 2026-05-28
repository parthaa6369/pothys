import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { TypeOrmModule } from "@pothys/db-base";
import { Customer } from "./entities/customer.entity";
import { CustomerAddress } from "./entities/customer-address.entity";
import { AuthPackageModule } from "@pothys/auth";
import { CustomerOtp } from "./entities/customer-otp.entity";
import { CustomerDevices } from "./entities/customer-devices.entity";
import { AuthService } from "src/auth/auth.service";
// import { JwtService } from '@pothys/auth';
import { AdminUsers } from "src/auth/entities/admin-users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CustomerAddress,
      CustomerOtp,
      CustomerDevices,
      AdminUsers,
    ]),
    AuthPackageModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService, AuthService],
})
export class CustomersModule {}

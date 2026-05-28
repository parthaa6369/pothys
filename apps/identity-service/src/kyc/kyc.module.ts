import { Module } from "@nestjs/common";
import { KycService } from "./kyc.service";
import { KycController } from "./kyc.controller";
import { TypeOrmModule } from "@pothys/db-base";
import { AuthPackageModule } from "@pothys/auth";
import { NomineeDetails } from "./entities/nominee_details.entity";
import { BankDetails } from "./entities/bank-details.entity";
import { KycDocuments } from "./entities/kyc-documents.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([NomineeDetails, BankDetails, KycDocuments]),
    AuthPackageModule,
  ],
  controllers: [KycController],
  providers: [KycService],
})
export class KycModule {}

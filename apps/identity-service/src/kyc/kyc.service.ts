import { CreateKycDto } from "./dto/create-kyc.dto";
import { UpdateKycDto } from "./dto/update-kyc.dto";
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { NomineeDetails } from "./entities/nominee_details.entity";
import { InjectRepository } from "@pothys/db-base";
import { Repository, Not, IsNull } from "typeorm";
import { MessageContent } from "@pothys/core/dist/messages/common";
import { AuthUser } from "@pothys/auth";
import { BankDetails } from "./entities/bank-details.entity";
import { AddBankDto } from "./dto/create-bank.dto";
import { KycDocuments } from "./entities/kyc-documents.entity";

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  constructor(
    @InjectRepository(NomineeDetails)
    private readonly nomineeRepo: Repository<NomineeDetails>,
    @InjectRepository(BankDetails)
    private readonly bankRepo: Repository<BankDetails>,
    @InjectRepository(KycDocuments)
    private readonly kycRepo: Repository<KycDocuments>,
  ) {}

  async addNominee(nominee_type: string, nominee_name: string, Req: AuthUser) {
    try {
      const addressObj = {
        customer_id: Req.user.user_id,
        nominee_type,
        nominee_name,
      };

      const insertNominee = await this.nomineeRepo.save(addressObj);

      if (!insertNominee) {
        this.logger.error(
          `Getting error from addNominee, Error: addNominee not added from db}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Nominee create"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addNominee: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async getNominee(Req: AuthUser) {
    try {
      const findData = await this.nomineeRepo.find({
        where: {
          customer_id: Req.user.user_id || null,
          deleted_at: IsNull(),
        } as any,
        order: { created_at: "DESC" },
      });

      let resObj = {
        success: true,
        message: MessageContent.FETCHED("Nominee"),
        data: findData,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from getNominee: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async editNominee(
    nominee_id: string,
    nominee_type: string,
    nominee_name: string,
    Req: AuthUser,
  ) {
    try {
      const findNominee = await this.nomineeRepo.findOne({
        where: {
          id: nominee_id,
          deleted_at: IsNull(),
        },
      });

      if (!findNominee) {
        this.logger.error(
          `Getting error from editNominee: ${MessageContent.NOT_FOUND_MESSAGE("Nominee")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Nominee"),
        );
      }

      const updateNominee = await this.nomineeRepo.update(
        { id: nominee_id },
        { nominee_type, nominee_name },
      );

      if (!updateNominee.affected || updateNominee.affected === 0) {
        this.logger.error(
          `Getting error from editNominee: ${MessageContent.OPERATION_FAILED("Edit nominee")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Edit nominee"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.UPDATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from editNominee: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async deleteNominee(nominee_id: string, Req: AuthUser) {
    try {
      const findNominee = await this.nomineeRepo.findOne({
        where: {
          id: nominee_id,
          deleted_at: IsNull(),
        },
      });

      if (!findNominee) {
        this.logger.error(
          `Getting error from deleteNominee: ${MessageContent.NOT_FOUND_MESSAGE("Nominee")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Nominee"),
        );
      }

      const DeleteNominee = await this.nomineeRepo.update(
        { id: nominee_id },
        { deleted_at: new Date() },
      );

      if (!DeleteNominee.affected || DeleteNominee.affected === 0) {
        this.logger.error(
          `Getting error from deleteNominee: ${MessageContent.OPERATION_FAILED("Remove nominee")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Remove nominee"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.DATA_DELETED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from deleteNominee: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async addBank(addBankDto: AddBankDto, Req: AuthUser) {
    try {
      const findExist = await this.bankRepo.findOne({
        where: {
          account_number: addBankDto.account_number,
          ifsc: addBankDto.ifsc,
          deleted_at: IsNull(),
        },
      });

      if (findExist) {
        this.logger.error(
          `Getting error from addBank, Error: Bank acc number exist,customerId:${Req.user.user_id}}`,
        );
        throw new BadRequestException(
          MessageContent.ALREADY_EXISTS_MESSAGE("Bank acc number"),
        );
      }

      const createObj = {
        customer_id: Req.user.user_id,
        ...addBankDto,
      };

      const insertBank = await this.bankRepo.save(createObj);

      if (!insertBank) {
        this.logger.error(
          `Getting error from addBank, Error: Bank details not added from db,customerId:${Req.user.user_id}}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Bank details create"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addBank: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async getBank(Req: AuthUser) {
    try {
      const findData = await this.bankRepo.findOne({
        where: {
          customer_id: Req.user.user_id || null,
          deleted_at: IsNull(),
        } as any,
      });

      let resObj = {
        success: true,
        message: MessageContent.FETCHED("Bank details"),
        data: findData,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from getBank: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async editBank(
    bank_details_id: string,
    addBankDto: AddBankDto,
    Req: AuthUser,
  ) {
    try {
      const findData = await this.bankRepo.findOne({
        where: {
          id: bank_details_id,
          deleted_at: IsNull(),
        },
      });

      if (!findData) {
        this.logger.error(
          `Getting error from editBank: ${MessageContent.NOT_FOUND_MESSAGE("Bank details")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Bank details"),
        );
      }

      const findExist = await this.bankRepo.findOne({
        where: {
          account_number: addBankDto.account_number,
          ifsc: addBankDto.ifsc,
          deleted_at: IsNull(),
          id: Not(bank_details_id),
        },
      });

      if (findExist) {
        this.logger.error(
          `Getting error from addBank, Error: Bank acc number exist,customerId:${Req.user.user_id}}`,
        );
        throw new BadRequestException(
          MessageContent.ALREADY_EXISTS_MESSAGE("Bank acc number"),
        );
      }

      const updateData = await this.bankRepo.update(
        { id: bank_details_id },
        addBankDto,
      );

      if (!updateData.affected || updateData.affected === 0) {
        this.logger.error(
          `Getting error from editBank: ${MessageContent.OPERATION_FAILED("Edit bank details")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Edit bank details"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.UPDATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from editBank: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async addKyc(createKycDto: CreateKycDto, Req: AuthUser) {
    try {
      const findExist = await this.kycRepo.findOne({
        where: [
          {
            pan: createKycDto.pan,
            deleted_at: IsNull(),
          },
          {
            aadhar: createKycDto.aadhar || null,
            deleted_at: IsNull(),
          } as any,
        ],
      });

      if (findExist) {
        this.logger.error(
          `Getting error from addKyc, Error: Kyc details exist,customerId:${Req.user.user_id}}`,
        );
        if (findExist.pan === createKycDto.pan)
          throw new BadRequestException(
            MessageContent.ALREADY_EXISTS_MESSAGE("Pan"),
          );
        if (findExist.aadhar === createKycDto.aadhar)
          throw new BadRequestException(
            MessageContent.ALREADY_EXISTS_MESSAGE("Aadhar"),
          );
      }
      const createObj = {
        customer_id: Req.user.user_id,
        ...createKycDto,
      };

      const insertData = await this.kycRepo.save(createObj);

      if (!insertData) {
        this.logger.error(
          `Getting error from addKyc, Error: Kyc details not added from db}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Kyc details create"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addKyc: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async getKyc(Req: AuthUser) {
    try {
      const findData = await this.kycRepo.findOne({
        where: {
          customer_id: Req.user.user_id || null,
          deleted_at: IsNull(),
        } as any,
      });

      let resObj = {
        success: true,
        message: MessageContent.FETCHED("Kyc details"),
        data: findData,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from getKyc: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async editKyc(kyc_doc_id: string, createKycDto: CreateKycDto, Req: AuthUser) {
    try {
      const findData = await this.kycRepo.findOne({
        where: {
          id: kyc_doc_id,
          deleted_at: IsNull(),
        },
      });

      if (!findData) {
        this.logger.error(
          `Getting error from editKyc: ${MessageContent.NOT_FOUND_MESSAGE("Kyc details")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Kyc details"),
        );
      }

      const findExist = await this.kycRepo.findOne({
        where: [
          {
            pan: createKycDto.pan,
            deleted_at: IsNull(),
            id: Not(kyc_doc_id),
          },
          {
            aadhar: createKycDto.aadhar || null,
            deleted_at: IsNull(),
            id: Not(kyc_doc_id),
          } as any,
        ],
      });

      if (findExist) {
        this.logger.error(
          `Getting error from addKyc, Error: Kyc details exist,customerId:${Req.user.user_id}}`,
        );
        if (findExist.pan === createKycDto.pan)
          throw new BadRequestException(
            MessageContent.ALREADY_EXISTS_MESSAGE("Pan"),
          );
        if (findExist.aadhar === createKycDto.aadhar)
          throw new BadRequestException(
            MessageContent.ALREADY_EXISTS_MESSAGE("Aadhar"),
          );
      }

      const updateData = await this.kycRepo.update(
        { id: kyc_doc_id },
        createKycDto,
      );

      if (!updateData.affected || updateData.affected === 0) {
        this.logger.error(
          `Getting error from editKyc: ${MessageContent.OPERATION_FAILED("Edit kyc details")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Edit kyc details"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.UPDATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from editKyc: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }
}

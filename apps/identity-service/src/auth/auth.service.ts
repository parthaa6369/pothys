import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { Customer } from "src/customers/entities/customer.entity";
import { CustomerOtp } from "src/customers/entities/customer-otp.entity";
import { CustomerDevices } from "src/customers/entities/customer-devices.entity";
import {
  RoleTypes,
  AuthUser,
  BaseAuthService,
  hashCompare,
  hashPassword,
  JwtService,
} from "@pothys/auth";
import { InjectRepository } from "@pothys/db-base";
import { Repository, Not, IsNull } from "typeorm";
import { MessageContent } from "@pothys/core/dist/messages/common";
import dayjs from "dayjs";
import { AdminUsers } from "./entities/admin-users.entity";

@Injectable()
export class AuthService extends BaseAuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(CustomerOtp)
    private readonly customerOtpRepo: Repository<CustomerOtp>,
    @InjectRepository(CustomerDevices)
    private readonly deviceRepo: Repository<CustomerDevices>,
    @InjectRepository(AdminUsers)
    private readonly adminRepo: Repository<AdminUsers>,
    protected readonly jwtService: JwtService,
  ) {
    super(jwtService);
  }
  async sendOtp(mobile_number: string) {
    try {
      const findCustomer = await this.customerRepo.findOne({
        where: {
          mobile_number: mobile_number,
        },
      });

      if (!findCustomer) {
        this.logger.error(
          `Getting error from sendOtp: ${MessageContent.NOT_FOUND_MESSAGE("Customer")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Customer"),
        );
      }

      let otp: string = process.env.TEST_OTP || "5566";
      if (process.env.APP_ENV === "production")
        otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expires_at = dayjs().add(30, "seconds").toDate();

      const otp_hash = await hashPassword(otp);

      const createData = await this.customerOtpRepo.save({
        customer_id: findCustomer.customer_id,
        otp_hash,
        expires_at,
      });

      if (!createData) {
        this.logger.error(
          `Getting error from sendOtp, Error: Otp not created}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Create otp"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.OTP_SENT_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      console.log(Error);
      this.logger.error(`Getting error from sendOtp: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async verifyOtp(mobile_number: string, otp: string) {
    try {
      const findCustomer = await this.customerRepo
        .createQueryBuilder("customer")
        .leftJoinAndSelect(
          "customer.customer_devices",
          "customer_devices",
          "customer_devices.deleted_at IS NULL",
        )
        .where("customer.mobile_number = :mobile_number", { mobile_number })
        .getOne();

      if (!findCustomer) {
        this.logger.error(
          `Getting error from verifyOtp: ${MessageContent.NOT_FOUND_MESSAGE("Customer")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Customer"),
        );
      }

      const findOtp = await this.customerOtpRepo.findOne({
        where: {
          customer_id: findCustomer?.customer_id,
        },
        order: { created_at: "DESC" },
      });

      if (!findOtp) {
        this.logger.error(
          `Getting error from verifyOtp, Error: ${MessageContent.NOT_FOUND_MESSAGE("OTP")}}`,
        );
        throw new BadRequestException(MessageContent.NOT_FOUND_MESSAGE("OTP"));
      }

      if (findOtp.status === "verified") {
        this.logger.error(
          `Getting error from verifyOtp, Error: Otp not found}`,
        );
        throw new BadRequestException(MessageContent.OTP_ALREADY_VERIFIED);
      }

      if (dayjs().isAfter(dayjs(findOtp.expires_at))) {
        await this.customerOtpRepo.update(findOtp.id, { status: "expired" });
        this.logger.error(`Getting error from sendOtp, Error: Otp expired}`);
        throw new BadRequestException(MessageContent.OTP_EXPIRED);
      }

      const verifyOtpHash = await hashCompare(otp, findOtp.otp_hash);

      if (!verifyOtpHash) {
        this.logger.error(`Getting error from sendOtp, Error: Otp invalid}`);
        throw new BadRequestException(MessageContent.INVALID_OTP);
      }

      await this.customerOtpRepo.update(
        { id: findOtp.id },
        { status: "verified" },
      );

      const authPayload: AuthUser = {
        user: {
          user_id: findCustomer.customer_id,
          name: findCustomer.customer_name,
          email: findCustomer.email_id,
          mobile: findCustomer.mobile_number,
        },
        role: RoleTypes.USER,
      };

      const { access_token, refresh_token } = await this.login(authPayload);
      if (!access_token || !refresh_token) {
        this.logger.error(
          `Getting error from verifyOtp, Error: JWT tokens not generated}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Token not generated"),
        );
      }
      this.updateRefreshToken(findCustomer.customer_id, refresh_token);

      let resObj = {
        success: true,
        message: MessageContent.OTP_VERIFIED_SUCCESSFULLY,
        data: {
          mpin: findCustomer.customer_devices[0],
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from verifyOtp: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async mpinLogin(device_id: string, mpin: string) {
    try {
      const findDevice = await this.deviceRepo.findOne({
        where: {
          device_id,
          deleted_at: null,
        } as any,
        relations: {
          customer: true,
        },
      });

      if (!findDevice) {
        this.logger.error(
          `Getting error from mpinLogin: ${MessageContent.NOT_FOUND_MESSAGE("Device")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Device"),
        );
      }

      const mpinVerify = await hashCompare(mpin, findDevice.mpin);

      if (!mpinVerify) {
        this.logger.error(
          `Getting error from changeMpin: ${MessageContent.OPERATION_FAILED("Mpin verification")}, customerId:${findDevice.customer_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Mpin verification"),
        );
      }

      const authPayload: AuthUser = {
        user: {
          user_id: findDevice.customer_id,
          name: findDevice.customer.customer_name,
          email: findDevice.customer.email_id,
          mobile: findDevice.customer.customer_name,
        },
        role: RoleTypes.USER,
      };

      const { access_token, refresh_token } = await this.login(authPayload);
      if (!access_token || !refresh_token) {
        this.logger.error(
          `Getting error from mpinLogin, Error: JWT tokens not generated}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Token not generated"),
        );
      }
      this.updateRefreshToken(findDevice.customer_id, refresh_token);

      let resObj = {
        success: true,
        message: MessageContent.LOGIN_SUCCESSFUL,
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from mpinLogin: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.validateToken(refreshToken);

      const findCustomer = await this.customerRepo.findOne({
        where: {
          customer_id: payload?.user.user_id || IsNull(),
        },
      });

      console.log(findCustomer);
      if (!findCustomer) {
        this.logger.error(
          `Getting error from sendOtp: ${MessageContent.NOT_FOUND_MESSAGE("Customer")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Customer"),
        );
      }

      const isMatch = await hashCompare(
        refreshToken,
        findCustomer.refresh_token,
      );
      if (!isMatch) {
        this.logger.error(
          `Getting error from refreshToken: ${MessageContent.INVALID_TOKEN}, customerId:${findCustomer.customer_id}`,
        );
        throw new UnauthorizedException(MessageContent.INVALID_TOKEN);
      }

      const authPayload: AuthUser = {
        user: {
          user_id: findCustomer.customer_id,
          name: findCustomer.customer_name,
          email: findCustomer.email_id,
          mobile: findCustomer.mobile_number,
        },
        role: RoleTypes.USER,
      };

      const { access_token, refresh_token } = await this.login(authPayload);
      if (!access_token || !refresh_token) {
        this.logger.error(
          `Getting error from refreshToken, Error: JWT tokens not generated}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Token not generated"),
        );
      }
      this.updateRefreshToken(findCustomer.customer_id, refresh_token);

      let resObj = {
        success: true,
        message: MessageContent.SUCCESS,
        data: {
          access_token,
          refresh_token,
        },
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from getAddress: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async updateRefreshToken(customerId: string, token: string) {
    try {
      const tokenHash = await hashPassword(token);
      const updateData = await this.customerRepo.update(
        { customer_id: customerId },
        { refresh_token: tokenHash },
      );

      if (!updateData.affected || updateData.affected === 0) {
        this.logger.error(
          `Getting error from updateRefreshToken: Referesh token not updated customerId:${customerId}`,
        );
      }
    } catch (Error) {
      this.logger.error(
        `Getting error from updateRefreshToken: ${Error.stack}`,
      );
    }
  }

  async adminLogin(email_id: string, password: string) {
    try {
      const findData = await this.adminRepo.findOne({
        where: {
          email_id,
          deleted_at: IsNull(),
        },
      });

      if (!findData) {
        this.logger.error(
          `Getting error from adminLogin: ${MessageContent.NOT_FOUND_MESSAGE("Email")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Email"),
        );
      }

      const verify = await hashCompare(password, findData?.password);

      if (!verify) {
        this.logger.error(
          `Getting error from changeMpin: ${MessageContent.OPERATION_FAILED("Password verification")}, customerId:${findData.id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Password verification"),
        );
      }

      const authPayload: AuthUser = {
        user: {
          user_id: findData.id,
          name: "",
          email: findData.email_id,
          mobile: "",
        },
        role: RoleTypes.ADMIN,
      };

      const { access_token, refresh_token } = await this.login(authPayload);
      if (!access_token || !refresh_token) {
        this.logger.error(
          `Getting error from adminLogin, Error: JWT tokens not generated}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Token not generated"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.LOGIN_SUCCESSFUL,
        data: {
          accessToken: refresh_token,
        },
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from adminLogin: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }
}

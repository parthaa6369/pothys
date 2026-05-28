import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@pothys/db-base";
import { Repository, Not, IsNull } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer } from "./entities/customer.entity";
import { CustomerAddress } from "./entities/customer-address.entity";
import { AddAddressDto } from "./dto/add-address.dto";
import { CustomerOtp } from "./entities/customer-otp.entity";
import dayjs from "dayjs";
import { AddDeviceDto } from "./dto/add-device.dto";
import { CustomerDevices } from "./entities/customer-devices.entity";
import { MessageContent } from "@pothys/core/dist/messages/common";
import { AuthService } from "src/auth/auth.service";
import {
  RoleTypes,
  AuthUser,
  BaseAuthService,
  hashCompare,
  hashPassword,
  JwtService,
} from "@pothys/auth";

@Injectable()
export class CustomersService extends BaseAuthService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(CustomerAddress)
    private readonly addressRepo: Repository<CustomerAddress>,
    @InjectRepository(CustomerOtp)
    private readonly customerOtpRepo: Repository<CustomerOtp>,
    @InjectRepository(CustomerDevices)
    private readonly deviceRepo: Repository<CustomerDevices>,
    // private readonly authService: BaseAuthService,
    protected readonly jwtService: JwtService,
    protected readonly authService: AuthService,
  ) {
    super(jwtService);
  }

  async createCustomer(CreateCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customerRepo.findOne({
        where: [
          { email_id: CreateCustomerDto.email_id },
          { mobile_number: CreateCustomerDto.mobile_number },
        ],
      });

      if (customer) {
        if (customer.email_id === CreateCustomerDto.email_id) {
          this.logger.error(
            `Getting error from createCustomer, Error: Email exist}`,
          );
          throw new BadRequestException(
            MessageContent.ALREADY_EXISTS_MESSAGE("Email"),
          );
        }
        if (customer.mobile_number === CreateCustomerDto.mobile_number) {
          this.logger.error(
            `Getting error from createCustomer, Error: Mobile number exist}`,
          );
          throw new BadRequestException(
            MessageContent.ALREADY_EXISTS_MESSAGE("Mobile number"),
          );
        }
      }

      const customerObj = {
        customer_name: CreateCustomerDto.customer_name,
        mobile_number: CreateCustomerDto.mobile_number,
        whatsapp_number: CreateCustomerDto.whatsapp_number || undefined,
        email_id: CreateCustomerDto.email_id,
        gender: CreateCustomerDto.gender,
        dob: CreateCustomerDto.dob,
        dow: CreateCustomerDto.dow,
        marital_status: CreateCustomerDto.marital_status,
        is_agree: CreateCustomerDto.is_agree,
      };

      const insertCustomer = await this.customerRepo.save(customerObj);

      if (!insertCustomer) {
        this.logger.error(
          `Getting error from createCustomer, Error: Customer not created from db}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Customer creation"),
        );
      }

      const addressObj = {
        customer_id: insertCustomer.customer_id,
        city: CreateCustomerDto.city,
        state: CreateCustomerDto.state,
        address: CreateCustomerDto.address,
        pincode: CreateCustomerDto.pincode,
        is_default: true,
      };

      const insertAddress = await this.addressRepo.save(addressObj);

      if (!insertAddress) {
        this.logger.error(
          `Getting error from createCustomer, Error: Address not added from db}`,
        );
      }

      const authPayload: AuthUser = {
        user: {
          user_id: insertCustomer.customer_id,
          name: insertCustomer.customer_name,
          email: insertCustomer.email_id,
          mobile: insertCustomer.mobile_number,
        },
        role: RoleTypes.USER,
      };

      const { access_token, refresh_token } = await this.login(authPayload);
      if (!access_token || !refresh_token) {
        this.logger.error(
          `Getting error from createCustomer, Error: JWT tokens not generated}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Token not generated"),
        );
      }
      this.authService.updateRefreshToken(
        insertCustomer.customer_id,
        refresh_token,
      );

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from createCustomer: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async getProfile(Req: AuthUser) {
    try {
      console.log("_______Req.user", Req.user);
      const findCustomer = await this.customerRepo.findOne({
        where: {
          customer_id: Req.user.user_id,
          deleted_at: null,
        } as any,
        select: [
          "customer_id",
          "customer_name",
          "mobile_number",
          "whatsapp_number",
          "email_id",
          "gender",
          "dob",
          "dow",
          "marital_status",
        ],
      });

      let resObj = {
        success: true,
        message: MessageContent.FETCHED("Profile"),
        data: findCustomer,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from getProfile: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async editProfile(UpdateCustomerDto: UpdateCustomerDto, Req: AuthUser) {
    try {
      const updateCustomer = await this.customerRepo.update(
        { customer_id: Req.user.user_id },
        UpdateCustomerDto,
      );

      if (!updateCustomer.affected || updateCustomer.affected === 0) {
        this.logger.error(
          `Getting error from editProfile: ${MessageContent.OPERATION_FAILED("Profile modification")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Profile modification"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.UPDATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from editProfile: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async addAddress(AddAddressDto: AddAddressDto, Req: AuthUser) {
    try {
      const addressObj = {
        customer_id: Req.user.user_id,
        city: AddAddressDto.city,
        state: AddAddressDto.state,
        address: AddAddressDto.address,
        pincode: AddAddressDto.pincode,
        is_default: AddAddressDto.is_default,
      };

      const insertAddress = await this.addressRepo.save(addressObj);

      if (!insertAddress) {
        this.logger.error(
          `Getting error from addAddress, Error: Address not added from db}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Address create"),
        );
      }

      if (AddAddressDto.is_default) {
        const updateDefault = await this.addressRepo.update(
          {
            customer_id: insertAddress.customer_id,
            id: Not(insertAddress.id),
          },
          { is_default: false },
        );
      }

      const findAddress = await this.addressRepo.find({
        where: {
          customer_id: insertAddress.customer_id,
          deleted_at: null,
        } as any,
        order: { created_at: "DESC" },
      });

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
        data: findAddress,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addAddress: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async getAddress(Req: AuthUser) {
    try {
      const findAddress = await this.addressRepo.find({
        where: {
          customer_id: Req.user.user_id,
          deleted_at: null,
        } as any,
        order: { created_at: "DESC" },
      });

      let resObj = {
        success: true,
        message: MessageContent.FETCHED("Address"),
        data: findAddress,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from getAddress: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async editAddress(
    AddAddressDto: AddAddressDto,
    address_id: string,
    Req: AuthUser,
  ) {
    try {
      const findAddress = await this.addressRepo.findOne({
        where: {
          id: address_id,
          deleted_at: null,
        } as any,
      });

      if (!findAddress) {
        this.logger.error(
          `Getting error from editAddress: ${MessageContent.NOT_FOUND_MESSAGE("Address")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Address"),
        );
      }

      const updateAddress = await this.addressRepo.update(
        { id: address_id },
        AddAddressDto,
      );

      if (!updateAddress.affected || updateAddress.affected === 0) {
        this.logger.error(
          `Getting error from editAddress: ${MessageContent.OPERATION_FAILED("Edit address")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Edit address"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.UPDATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from editAddress: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async deleteAddress(address_id: string, Req: AuthUser) {
    try {
      const findAddress = await this.addressRepo.findOne({
        where: {
          id: address_id,
          deleted_at: null,
        } as any,
      });

      if (!findAddress) {
        this.logger.error(
          `Getting error from deleteAddress: ${MessageContent.NOT_FOUND_MESSAGE("Address")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Address"),
        );
      }

      const deleteAddress = await this.addressRepo.update(
        { id: address_id },
        { deleted_at: new Date() },
      );

      if (!deleteAddress.affected || deleteAddress.affected === 0) {
        this.logger.error(
          `Getting error from deleteAddress: ${MessageContent.OPERATION_FAILED("Remove address")}, customer_id:${Req.user.user_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Remove address"),
        );
      }

      //make default exist address for the customer
      const findExistAddress = await this.addressRepo.find({
        where: {
          customer_id: Req.user.user_id,
          deleted_at: null,
        } as any,
        order: { created_at: "DESC" },
      });

      if (findExistAddress.length) {
        await this.addressRepo.update(
          { id: findExistAddress[0].id },
          { is_default: true },
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.DATA_DELETED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from deleteAddress: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async addDevice(Req: AuthUser, deviceDto: AddDeviceDto) {
    try {
      const findDevice = await this.deviceRepo.findOne({
        where: {
          device_id: deviceDto.device_id,
          deleted_at: null,
        } as any,
      });

      if (findDevice) {
        this.logger.error(
          `Getting error from addDevice: ${MessageContent.ALREADY_EXISTS_MESSAGE("Device")}`,
        );
        throw new BadRequestException(
          MessageContent.ALREADY_EXISTS_MESSAGE("Device"),
        );
      }
      console.log(Req.user);
      const createDevice = await this.deviceRepo.save({
        customer_id: Req.user.user_id,
        device_id: deviceDto.device_id,
        token: deviceDto.token || null,
        token_from: deviceDto.token_from || null,
      } as CustomerDevices);

      if (!createDevice) {
        this.logger.error(
          `Getting error from addDevice: ${MessageContent.OPERATION_FAILED("Add device")}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Add device"),
        );
      }

      //rest of ids should be deleted
      await this.deviceRepo.update(
        {
          customer_id: Req.user.user_id,
          device_id: Not(createDevice.device_id),
        },
        { deleted_at: null },
      );

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
        data: createDevice,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addDevice: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async setMpin(device_id: string, mpin: string) {
    try {
      const findDevice = await this.deviceRepo.findOne({
        where: {
          device_id,
          deleted_at: null,
        } as any,
      });

      if (!findDevice) {
        this.logger.error(
          `Getting error from setMpin: ${MessageContent.NOT_FOUND_MESSAGE("Device")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Device"),
        );
      }

      const mpin_hash = await hashPassword(mpin);

      const updateData = await this.deviceRepo.update(
        { device_id },
        { mpin: mpin_hash },
      );

      if (!updateData.affected || updateData.affected === 0) {
        this.logger.error(
          `Getting error from setMpin: ${MessageContent.OPERATION_FAILED("Set mpin")}, customer_id:${findDevice.customer_id}}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Set mpin"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.CREATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addDevice: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }

  async changeMpin(device_id: string, old_mpin: string, new_mpin: string) {
    try {
      const findDevice = await this.deviceRepo.findOne({
        where: {
          device_id,
          deleted_at: null,
        } as any,
      });

      if (!findDevice) {
        this.logger.error(
          `Getting error from changeMpin: ${MessageContent.NOT_FOUND_MESSAGE("Device")}`,
        );
        throw new BadRequestException(
          MessageContent.NOT_FOUND_MESSAGE("Device"),
        );
      }

      const mpinVerify = await hashCompare(old_mpin, findDevice.mpin);

      if (!mpinVerify) {
        this.logger.error(
          `Getting error from changeMpin: ${MessageContent.OPERATION_FAILED("Mpin verification")}, customerId:${findDevice.customer_id}`,
        );
        throw new BadRequestException(
          MessageContent.OPERATION_FAILED("Mpin verification"),
        );
      }

      const new_mpin_hash = await hashPassword(new_mpin);

      const updateData = await this.deviceRepo.update(
        { device_id },
        { mpin: new_mpin_hash },
      );

      if (!updateData.affected || updateData.affected === 0) {
        this.logger.error(
          `Getting error from setMpin: ${MessageContent.OPERATION_FAILED("Change mpin")}, customer_id:${findDevice.customer_id}}`,
        );
        throw new InternalServerErrorException(
          MessageContent.OPERATION_FAILED("Change mpin"),
        );
      }

      let resObj = {
        success: true,
        message: MessageContent.DATA_UPDATED_SUCCESSFULLY,
      };

      return resObj;
    } catch (Error) {
      this.logger.error(`Getting error from addDevice: ${Error.stack}`);
      throw new InternalServerErrorException(Error.message);
    }
  }
}

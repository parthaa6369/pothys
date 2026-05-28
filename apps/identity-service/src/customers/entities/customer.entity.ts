import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "@pothys/db-base";
import { CustomerAddress } from "./customer-address.entity";
import { CustomerDevices } from "./customer-devices.entity";
import { BankDetails } from "src/kyc/entities/bank-details.entity";
import { NomineeDetails } from "src/kyc/entities/nominee_details.entity";
import { KycDocuments } from "src/kyc/entities/kyc-documents.entity";

@Entity({ name: "customers" })
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  customer_id: string;

  @Column({ name: "customer_name", type: "varchar", nullable: true })
  customer_name: string;

  @Column({ name: "mobile_number", type: "varchar", unique: true })
  mobile_number: string;

  @Column({ name: "whatsapp_number", type: "varchar", unique: true })
  whatsapp_number: string;

  @Column({ name: "email_id", type: "varchar", unique: true, nullable: true })
  email_id: string;

  @Column({ name: "gender", type: "varchar", nullable: true })
  gender: string;

  @Column({ name: "dob", type: "date", nullable: true })
  dob: Date;

  @Column({ name: "dow", type: "date", nullable: true })
  dow: Date;

  @Column({ name: "pincode", type: "varchar", nullable: true })
  marital_status: string;

  @Column({ name: "is_agree", type: "boolean", default: false })
  is_agree: boolean;

  @Column({ name: "mpin", type: "varchar", nullable: true })
  mpin: string;

  @Column({ name: "otp", type: "smallint", nullable: true })
  otp: number;

  @Column({ name: "otp_attempt", type: "smallint", default: 0 })
  otp_attempt: number;

  @Column({ name: "status", type: "smallint", default: 0 })
  status: number;

  @Column({ name: "is_login", type: "boolean", default: false })
  is_login: boolean;

  @Column({ name: "is_kyc", type: "int", default: 0 })
  is_kyc: number;

  @Column({ name: "kyc_reject_reason", type: "text", nullable: true })
  kyc_reject_reason?: string;

  @Column({ name: "kyc_pending_date", nullable: true })
  kyc_pending_date: Date;

  @Column({ name: "kyc_verification_date", nullable: true })
  kyc_verification_date: Date;

  @Column({ name: "refresh_token", type: "text", nullable: true })
  refresh_token: string;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    default: () => "NOW()",
  })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", nullable: true })
  updated_at: Date | null;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => CustomerAddress, (address) => address.customer, {
    cascade: false,
    eager: false,
  })
  customer_address: CustomerAddress[];

  @OneToMany(() => BankDetails, (bank) => bank.customer, {
    cascade: false,
    eager: false,
  })
  bank_details: BankDetails[];

  @OneToMany(() => CustomerDevices, (device) => device.customer, {
    cascade: false,
    eager: false,
  })
  customer_devices: CustomerDevices[];

  @OneToMany(() => NomineeDetails, (nominee) => nominee.customer, {
    cascade: false,
    eager: false,
  })
  nominee_details: NomineeDetails[];

  @OneToMany(() => KycDocuments, (kyc) => kyc.customer, {
    cascade: false,
    eager: false,
  })
  kyc_documents: KycDocuments[];
}

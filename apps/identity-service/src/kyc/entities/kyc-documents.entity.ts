import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "@pothys/db-base";
import { Customer } from "src/customers/entities/customer.entity";

@Entity({ name: "kyc_documents" })
export class KycDocuments {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "customer_id", type: "varchar", nullable: false })
  customer_id: string;

  @Column({ name: "pan", type: "varchar", nullable: true })
  pan: string;

  @Column({
    name: "is_pan_verified",
    type: "boolean",
    nullable: true,
    default: false,
  })
  is_pan_verified: boolean;

  @Column({ name: "aadhar", type: "varchar", nullable: true })
  aadhar: string;

  @Column({
    name: "is_aadhar_verified",
    type: "boolean",
    nullable: true,
    default: false,
  })
  is_aadhar_verified: boolean;

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

  @ManyToOne(() => Customer, (customer) => customer.kyc_documents, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: "customer_id", referencedColumnName: "customer_id" })
  customer: Customer;
}

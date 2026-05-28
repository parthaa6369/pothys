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

@Entity({ name: "bank_details" })
export class BankDetails {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "customer_id", type: "varchar", nullable: false })
  customer_id: string;

  @Column({ name: "account_holder_name", type: "varchar", nullable: true })
  account_holder_name: string;

  @Column({ name: "bank_name", type: "varchar", nullable: true })
  bank_name: string;

  @Column({ name: "branch", type: "varchar", nullable: true })
  branch: string;

  @Column({ name: "ifsc", type: "varchar", nullable: true })
  ifsc: string;

  @Column({ name: "account_number", type: "varchar", nullable: true })
  account_number: string;

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

  @ManyToOne(() => Customer, (customer) => customer.bank_details, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: "customer_id", referencedColumnName: "customer_id" })
  customer: Customer;
}

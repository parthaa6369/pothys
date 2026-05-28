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

@Entity({ name: "nominee_details" })
export class NomineeDetails {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "customer_id", type: "varchar", nullable: false })
  customer_id: string;

  @Column({ name: "nominee_type", type: "varchar", nullable: false })
  nominee_type: string;

  @Column({ name: "nominee_name", type: "varchar", nullable: true })
  nominee_name: string;

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

  @ManyToOne(() => Customer, (customer) => customer.nominee_details, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: "customer_id", referencedColumnName: "customer_id" })
  customer: Customer;
}

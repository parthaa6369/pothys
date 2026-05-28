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
import { Customer } from "./customer.entity";

@Entity({ name: "customer_address" })
export class CustomerAddress {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "customer_id", type: "varchar", nullable: false })
  customer_id: string;

  @Column({
    name: "address_type",
    type: "varchar",
    nullable: true,
    default: "home",
  })
  address_type: string;

  @Column({ name: "city", type: "varchar", nullable: true })
  city: string;

  @Column({ name: "state", type: "varchar", nullable: true })
  state: string;

  @Column({ name: "address", type: "text", nullable: true })
  address: string;

  @Column({ name: "pincode", type: "varchar", nullable: true })
  pincode: string;

  @Column({ name: "is_default", type: "boolean", default: false })
  is_default: boolean;

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

  @ManyToOne(() => Customer, (customer) => customer.customer_address, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: "customer_id", referencedColumnName: "customer_id" })
  customer: Customer;
}

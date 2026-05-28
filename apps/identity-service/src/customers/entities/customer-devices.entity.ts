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

@Entity({ name: "customer_devices" })
export class CustomerDevices {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "customer_id", type: "varchar", nullable: false })
  customer_id: string;

  @Column({ name: "device_id", type: "text", nullable: true })
  device_id: string;

  @Column({ name: "mpin", type: "varchar", nullable: true })
  mpin: string;

  @Column({ name: "token", type: "text", nullable: true })
  token: string;

  @Column({ name: "token_from", type: "varchar", nullable: true })
  token_from: string;

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

  @ManyToOne(() => Customer, (customer) => customer.customer_devices, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: "customer_id", referencedColumnName: "customer_id" })
  customer: Customer;
}

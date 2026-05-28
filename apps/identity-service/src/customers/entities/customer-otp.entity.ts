import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "@pothys/db-base";

@Entity({ name: "customer_otp" })
export class CustomerOtp {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "customer_id", type: "varchar", nullable: false })
  customer_id: string;

  @Column({ name: "otp_hash", type: "text", nullable: true })
  otp_hash: string;

  @Column({ name: "status", type: "varchar", default: "pending" })
  status: "pending" | "verified" | "expired";

  @Column({ name: "expires_at", type: "timestamptz" })
  expires_at: Date;

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
}

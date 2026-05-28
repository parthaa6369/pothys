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

@Entity({ name: "admin_users" })
export class AdminUsers {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "email_id", type: "varchar", nullable: false, unique: true })
  email_id: string;

  @Column({ name: "password", type: "varchar", nullable: false })
  password: string;

  @Column({
    name: "is_active",
    type: "boolean",
    nullable: false,
    default: true,
  })
  is_active: boolean;

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

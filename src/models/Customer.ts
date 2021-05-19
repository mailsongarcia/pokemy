import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('customers')
class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string
}

export default Customer

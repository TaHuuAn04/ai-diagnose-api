import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { BaseEntity } from "../base.entity";

import { Appointment } from "./appointment.entity";
import { Doctor } from "./doctor.entity";
import { Image } from "./image.entity";
import { Patient } from "./patient.entity";

@Entity()
export class Consultation extends BaseEntity {
  @Column('uuid')
  appointmentId: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  doctorId: string;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: 'appointment_id' }) 
  appointment: Appointment;

  @OneToMany(() => Image, (image) => image.consultation)
  image: Image[];

  @ManyToOne(() => Patient )
  @JoinColumn({ name: 'patient_id'})
  patient: Patient;

  @ManyToOne(() => Doctor )
  @JoinColumn({ name: 'doctor_id'})
  doctor: Doctor;
}
import { z } from 'zod';

export const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().optional(),
  lastname: z.string().optional(),
  dni: z.string().min(1, 'DNI is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Phone is required'),
  gender: z.enum(['M', 'F']),
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  province: z.string().min(1, 'Province is required').optional(),
  country: z.string().min(1, 'Country is required'),
  birthDate: z.string().optional(),
});

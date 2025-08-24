import axios from 'axios';
import dayjs from 'dayjs';
import { promises as fs } from 'fs';
import path from 'path';

type RawUser = {
  name: string;
  surname: string;
  lastName?: string;
  birthDate: string; // DD/MM/YYYY
  gender: 'M' | 'F';
  dni: string;
  phone: number | string;
  postalCode: number | string;
  address: string;
  city: string; // en tu API se usa como 'provincia'
  country?: string;
  email: string;
};

export async function fetchUsersData() {
  const file = path.resolve(process.cwd(), 'data/data.json');
  const raw = await fs.readFile(file, 'utf-8');

  const users: RawUser[] = JSON.parse(raw);

  const first20 = users.slice(0, 20);

  for (let i = 0; i < first20.length; i += 1) {
    const u = first20[i];

    // Normaliza fechas a ISO (YYYY-MM-DD) para que tu API parsee bien
    const birthISO = dayjs(u.birthDate, 'DD/MM/YYYY', true).isValid()
      ? dayjs(u.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

    const payload = {
      name: u.name?.toString().trim() || '',
      surname: u.surname?.toString().trim() || '',
      lastname: (u.lastName ?? '').toString().trim() || null,
      birthDate: birthISO,
      gender: u.gender,
      dni: u.dni,
      phone: String(u.phone ?? ''),
      postalCode: String(u.postalCode ?? ''),
      address: u.address ?? '',
      // Tu API espera 'provincia' y lo usa para city/province
      city: u.city ?? '',
      country: u.country ?? 'España',
      email: u.email,
      // roles: opcional
    } as const;

    try {
      const res = await axios.post('http://localhost:4000/api/users', payload, {
        headers: { 'Content-Type': 'application/json' },
        // Evita que axios lance por status >= 400, así podemos registrar y continuar
        validateStatus: () => true,
      });

      if (res.status >= 200 && res.status < 300) {
        console.log(`[${i + 1}/20] OK: ${u.name} ${u.surname} (${u.email})`);
      } else {
        console.warn(
          `[${i + 1}/20] SKIP ${u.email} -> ${res.status}: ${JSON.stringify(res.data)}`,
        );
      }
    } catch (err) {
      console.error(`[${i + 1}/20] ERROR ${u.email}:`, err);
    }
  }

  console.log('Import finished.');
}

fetchUsersData().catch((e) => {
  console.error(e);
  process.exit(1);
});

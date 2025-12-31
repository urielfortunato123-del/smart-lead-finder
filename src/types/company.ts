export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  website?: string;
  sector: string;
  size?: string;
}

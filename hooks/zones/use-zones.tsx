import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Types
export interface Zone {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  classes?: any[];
}

export interface CreateZoneData {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateZoneData {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}

// API functions
const createZone = async (data: CreateZoneData): Promise<Zone> => {
  const response = await axios.post('/api/zones', data);
  return response.data.zone;
};

const getZones = async (): Promise<Zone[]> => {
  const response = await axios.get('/api/zones');
  return response.data;
};

const getZone = async (id: string): Promise<Zone> => {
  const response = await axios.get(`/api/zones?id=${id}`);
  return response.data;
};

const updateZone = async (data: UpdateZoneData): Promise<Zone> => {
  const response = await axios.put('/api/zones', data);
  return response.data.zone;
};

const deleteZone = async (id: string): Promise<void> => {
  await axios.delete('/api/zones', { data: { id } });
};

// Hooks

export function useGetZone(id: string) {
  return useQuery({
    queryKey: ['zones', id],
    queryFn: () => getZone(id),
    enabled: !!id,
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateZone,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      queryClient.invalidateQueries({ queryKey: ['zones', data.id] });
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}

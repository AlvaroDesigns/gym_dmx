'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetMaestres } from '@/hooks/use-get-maesters';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddClassFormProps {
  selectedDate: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddClassForm({
  selectedDate,
  onSuccess,
  onCancel,
}: AddClassFormProps) {
  const { data: maestres } = useGetMaestres();
  console.log(maestres);

  const [formData, setFormData] = useState({
    className: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    room: '',
    maxCapacity: 20,
    monitor: '',
    difficulty: 'MEDIUM',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/classes/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear la clase');
      }

      toast.success('Clase creada exitosamente');
      setFormData({
        className: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        room: '',
        maxCapacity: 20,
        monitor: '',
        difficulty: 'MEDIUM',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la clase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="className">Nombre de la clase *</Label>
        <Select
          value={formData.className}
          onValueChange={(value) => handleInputChange('className', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ej: Yoga, Spinning, Pilates" />
          </SelectTrigger>

          <SelectContent>
            {maestres?.classes?.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Hora de inicio *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">Hora de fin *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Sala *</Label>
          <Select
            value={formData.room}
            onValueChange={(value) => handleInputChange('room', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ej: Sala 1, Studio A" />
            </SelectTrigger>

            <SelectContent>
              {maestres?.zones?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxCapacity">Capacidad máxima *</Label>
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            value={formData.maxCapacity}
            onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monitor">Nombre del monitor</Label>
          <Select
            value={formData.monitor}
            onValueChange={(value) => handleInputChange('monitor', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ej: Juan Perez" />
            </SelectTrigger>

            <SelectContent>
              {maestres?.employees?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Dificultad</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => handleInputChange('difficulty', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Fácil</SelectItem>
              <SelectItem value="MEDIUM">Media</SelectItem>
              <SelectItem value="HARD">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Creando...' : 'Crear Clase'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

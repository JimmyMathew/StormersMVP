import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertPlayerSchema, type InsertPlayer } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface PlayerRegistrationFormProps {
  teamId: string;
  onSuccess?: () => void;
}

export default function PlayerRegistrationForm({ teamId, onSuccess }: PlayerRegistrationFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertPlayer>({
    resolver: zodResolver(insertPlayerSchema),
    defaultValues: {
      name: '',
      email: '',
      teamId,
      jerseyNumber: undefined,
      position: '',
    },
  });

  const createPlayer = useMutation({
    mutationFn: async (data: InsertPlayer) => {
      return await apiRequest('POST', '/api/players', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId, 'players'] });
      toast({
        title: 'Player added',
        description: 'The player has been added successfully.',
      });
      form.reset({ name: '', email: '', teamId, jerseyNumber: undefined, position: '' });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add player. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertPlayer) => {
    createPlayer.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      data-testid="input-player-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="john.doe@email.com" 
                      {...field}
                      value={field.value ?? ''}
                      data-testid="input-player-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jerseyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jersey Number (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="23" 
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      data-testid="input-player-jersey"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-player-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="guard">Guard</SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createPlayer.isPending}
              data-testid="button-add-player"
            >
              {createPlayer.isPending ? 'Adding...' : 'Add Player'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

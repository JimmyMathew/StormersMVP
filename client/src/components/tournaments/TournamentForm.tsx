import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTournamentSchema, type InsertTournament } from '@shared/schema';
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
import { Trophy } from 'lucide-react';

interface TournamentFormProps {
  onSuccess?: () => void;
}

export default function TournamentForm({ onSuccess }: TournamentFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertTournament>({
    resolver: zodResolver(insertTournamentSchema),
    defaultValues: {
      name: '',
      location: '',
      date: '',
      format: 'single-elimination',
      status: 'upcoming',
      maxTeams: 16,
    },
  });

  const createTournament = useMutation({
    mutationFn: async (data: InsertTournament) => {
      return await apiRequest('POST', '/api/tournaments', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments'] });
      toast({
        title: 'Tournament created',
        description: 'The tournament has been created successfully.',
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create tournament. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertTournament) => {
    createTournament.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Create New Tournament
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
                  <FormLabel>Tournament Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Summer 3x3 Championship" 
                      {...field} 
                      data-testid="input-tournament-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Toulouse Sports Arena" 
                      {...field} 
                      data-testid="input-tournament-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      data-testid="input-tournament-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-tournament-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single-elimination">Single Elimination</SelectItem>
                      <SelectItem value="double-elimination">Double Elimination</SelectItem>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="pool-play">Pool Play</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxTeams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Teams</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-max-teams">
                        <SelectValue placeholder="Select max teams" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="8">8 Teams</SelectItem>
                      <SelectItem value="16">16 Teams</SelectItem>
                      <SelectItem value="32">32 Teams</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createTournament.isPending}
              data-testid="button-create-tournament"
            >
              {createTournament.isPending ? 'Creating...' : 'Create Tournament'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTeamSchema, type InsertTeam } from '@shared/schema';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TeamRegistrationFormProps {
  tournamentId: string;
  onSuccess?: () => void;
}

export default function TeamRegistrationForm({ tournamentId, onSuccess }: TeamRegistrationFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertTeam>({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      name: '',
      university: '',
      tournamentId,
    },
  });

  const createTeam = useMutation({
    mutationFn: async (data: InsertTeam) => {
      return await apiRequest('POST', '/api/teams', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments', tournamentId, 'teams'] });
      toast({
        title: 'Team registered',
        description: 'The team has been registered successfully.',
      });
      form.reset({ name: '', university: '', tournamentId });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to register team. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertTeam) => {
    createTeam.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Register Team
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
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="The Stormers" 
                      {...field} 
                      data-testid="input-team-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University/Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Toulouse University" 
                      {...field}
                      value={field.value ?? ''}
                      data-testid="input-team-university"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createTeam.isPending}
              data-testid="button-register-team"
            >
              {createTeam.isPending ? 'Registering...' : 'Register Team'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

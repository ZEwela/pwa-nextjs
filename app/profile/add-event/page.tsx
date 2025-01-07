'use client';

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { createClient } from '@/utilis/supabase/client';
import { uploadEventImage } from '@/lib/storage';
import { createEvent } from '../../actions';
import { withAdmin } from '@/components/with-admin';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  type: z.enum(['exhibition', 'performance', 'opening', 'workshop'], {
    required_error: 'Please select an event type',
  }),
  venue: z.string().min(3, 'Venue must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string({
    required_error: 'Please select a time',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  area: z.string().min(2, 'Area must be at least 2 characters'),
  image: z
    .any()
    .refine((file) => file instanceof File, 'Please upload an image')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Image must be less than 5MB',
    ),
});

const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

function AddEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      venue: '',
      address: '',
      description: '',
      area: '',
      time: '12:00',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      form.setError('image', {
        message: 'Image must be less than 5MB',
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    form.setValue('image', file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      if (!user) {
        return redirect('/sign-in');
      }
      const imageUrl = await uploadEventImage(values.image);

      await createEvent({
        title: values.title,
        type: values.type,
        venue: values.venue,
        address: values.address,
        date: values.date.toISOString().split('T')[0],
        time: values.time,
        description: values.description,
        image: imageUrl,
        area: values.area,
        user_id: user.id,
      });

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating event:', error);
      setAuthError(
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the event',
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Event</h1>
        <p className="text-muted-foreground">
          Create a new event to share with the community
        </p>
      </div>

      {authError && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {authError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="opening">Opening</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && 'text-muted-foreground'
                          }`}
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-white p-0"
                      align="start"
                    >
                      <DayPicker
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" {...field} />
                      <Clock className="text-muted-foreground absolute right-3 top-2.5 h-4 w-4" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter venue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter venue address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter area (e.g., Downtown, West End)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter event description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Event Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <>Creating Event...</> : <>Create Event</>}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default withAdmin(AddEventPage);

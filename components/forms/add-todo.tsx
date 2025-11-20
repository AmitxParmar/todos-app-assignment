"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAddTodo } from "@/hooks/useTodos";

const formSchema = z.object({
    text: z.string().min(1, "Task title is required"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    date: z.date().optional(),
    description: z.string().optional(),
});

interface AddTodoFormProps {
    onSuccess?: () => void;
}

export function AddTodoForm({ onSuccess }: AddTodoFormProps) {
    const { mutate: addTodo } = useAddTodo();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            startTime: "",
            endTime: "",
            description: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        addTodo({
            title: values.text,
            startTime: values.startTime,
            endTime: values.endTime,
            date: values.date ? values.date.toISOString() : undefined,
            description: values.description,
            isCompleted: false,
        });
        form.reset();
        onSuccess?.();
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  mx-auto" >
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem className="">
                            <FormLabel className="text-slate-500 text-[12px] font-medium">Task title</FormLabel>
                            <FormControl>
                                <Input placeholder="Doing Homework" {...field} className="h-12 mx-auto border-slate-200 bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-500 text-[12px] font-medium">Set Time</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="time" {...field} className="h-12  border-slate-200 bg-white pl-10" />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Clock className="h-4 w-4" />
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-500 text-[12px] font-medium">&nbsp;</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="time" {...field} className="h-12  border-slate-200 bg-white pl-10" />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Clock className="h-4 w-4" />
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-slate-500 text-[12px] font-medium">Set Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "h-12 w-full pl-3 text-left font-normal rounded-none border-slate-200 bg-white",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto  p-0" align="start">
                                    <Calendar
                                        className=""
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-500 text-[12px] font-medium">Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add Description"
                                    className="resize-none min-h-[100px]  border-slate-200 rounded-none bg-white"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full rounded-none h-12 text-lg bg-custom-blue hover:bg-custom-blue/80 shadow-lg shadow-custom-blue/20 mt-4">
                    Create task
                </Button>
            </form>
        </Form>
    );
}

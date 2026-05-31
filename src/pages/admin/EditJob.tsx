import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import JobForm from "./JobForm";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditJob() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["job", id], queryFn: () => api.getJob(id!), enabled: !!id });
  if (isLoading) return <div className="space-y-4 max-w-3xl"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-96 w-full" /></div>;
  return <JobForm id={id} initial={data ?? {}} />;
}

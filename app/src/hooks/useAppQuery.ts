/**
 * Simple React Query without provider
 */

import { useQuery as reactUseQuery, useMutation as reactUseMutation } from "@tanstack/react-query";
import { sharedQueryClient } from "@/lib/sharedQueryClient";

export const useQuery = (options: any) => reactUseQuery(options, sharedQueryClient);
export const useMutation = (options: any) => reactUseMutation(options, sharedQueryClient);
export { sharedQueryClient as queryClient };

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractsTable } from "@/components/contracts/ContractsTable"
import { ContractsSearch } from "@/components/contracts/ContractsSearch"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Contract } from "@/types/contracts.types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { FileX } from "lucide-react"

const Contracts = () => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: contracts, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load contracts",
          variant: "destructive",
        })
        throw error
      }

      return data as Contract[]
    },
  })

  const filteredContracts = contracts?.filter((contract) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      contract.title.toLowerCase().includes(searchTerm) ||
      (contract.contract_number?.toLowerCase().includes(searchTerm) ?? false) ||
      (contract.description?.toLowerCase().includes(searchTerm) ?? false)
    )
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Government Contracts</h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Contracts</CardTitle>
              <div className="mt-4">
                <ContractsSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : filteredContracts && filteredContracts.length > 0 ? (
                <ContractsTable contracts={filteredContracts} />
              ) : (
                <div className="text-center py-8">
                  <FileX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery
                      ? "No contracts found matching your search criteria"
                      : "No contracts available"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "Try adjusting your search terms or clearing the search"
                      : "Check back later for new contract opportunities"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Contracts
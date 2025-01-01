import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractsTable } from "@/components/contracts/ContractsTable"
import { ContractsSearch } from "@/components/contracts/ContractsSearch"
import { ContractsFilter } from "@/components/contracts/ContractsFilter"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Contract, ContractStatus } from "@/types/contracts.types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { FileX, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 10

const Contracts = () => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | "all">(
    "all"
  )

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
    const matchesSearch =
      searchQuery === "" ||
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.contract_number?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)

    const matchesStatus =
      selectedStatus === "all" || contract.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil((filteredContracts?.length || 0) / ITEMS_PER_PAGE)
  const paginatedContracts = filteredContracts?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Government Contracts</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Contracts</CardTitle>
              <div className="space-y-4 mt-4">
                <ContractsSearch value={searchQuery} onChange={setSearchQuery} />
                <ContractsFilter
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : paginatedContracts && paginatedContracts.length > 0 ? (
                <>
                  <ContractsTable contracts={paginatedContracts} />
                  {totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.max(1, prev - 1)
                                )
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          )}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1)
                                )
                              }
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <FileX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery || selectedStatus !== "all"
                      ? "No contracts found matching your criteria"
                      : "No contracts available"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedStatus !== "all"
                      ? "Try adjusting your search terms or filters"
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
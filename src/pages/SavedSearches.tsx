import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Search, Calendar, Building2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { SavedSearch, SavedSearchCriteria } from "@/types/saved-searches.types"

export default function SavedSearches() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { data: savedSearches, isLoading, refetch } = useQuery({
    queryKey: ["saved-searches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as SavedSearch[]
    },
  })

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("saved_searches")
      .delete()
      .eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete saved search",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Saved search deleted successfully",
    })
    refetch()
  }

  const handleSearch = (searchCriteria: SavedSearchCriteria) => {
    const queryParams = new URLSearchParams()
    if (searchCriteria.searchTerm) queryParams.set("q", searchCriteria.searchTerm)
    if (searchCriteria.agency) queryParams.set("agency", searchCriteria.agency)
    if (searchCriteria.noticeType) queryParams.set("type", searchCriteria.noticeType)
    
    navigate(`/federal-contracts/search?${queryParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <h1 className="text-3xl font-bold">Saved Searches</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saved Searches</h1>
        <Button onClick={() => navigate("/federal-contracts/search")}>
          New Search
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedSearches?.map((search) => (
          <Card key={search.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{search.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(search.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              {search.search_criteria.searchTerm && (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>{search.search_criteria.searchTerm}</span>
                </div>
              )}
              {search.search_criteria.agency && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{search.search_criteria.agency}</span>
                </div>
              )}
              {search.search_criteria.dateRange?.from && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(search.search_criteria.dateRange.from), "MMM d, yyyy")}
                    {search.search_criteria.dateRange.to && 
                      ` - ${format(new Date(search.search_criteria.dateRange.to), "MMM d, yyyy")}`}
                  </span>
                </div>
              )}
            </div>

            <Button 
              className="w-full"
              onClick={() => handleSearch(search.search_criteria)}
            >
              Run Search
            </Button>
          </Card>
        ))}

        {savedSearches?.length === 0 && (
          <Card className="col-span-full p-8 text-center">
            <h3 className="font-semibold mb-2">No saved searches yet</h3>
            <p className="text-muted-foreground mb-4">
              Save your frequent searches to quickly access them later
            </p>
            <Button onClick={() => navigate("/federal-contracts/search")}>
              Start a New Search
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
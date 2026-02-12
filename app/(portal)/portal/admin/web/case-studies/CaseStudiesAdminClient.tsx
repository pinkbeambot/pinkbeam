"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Building2,
} from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies-types";
import { CaseStudyForm } from "./CaseStudyForm";

interface CaseStudiesAdminClientProps {
  caseStudies: CaseStudy[];
}

export function CaseStudiesAdminClient({
  caseStudies: initialCaseStudies,
}: CaseStudiesAdminClientProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);

  const filteredCaseStudies = caseStudies.filter(
    (study) =>
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = caseStudies.filter((s) => s.published).length;
  const featuredCount = caseStudies.filter((s) => s.featured).length;
  const draftCount = caseStudies.filter((s) => !s.published).length;

  const handleCreate = async (data: Partial<CaseStudy>) => {
    try {
      const response = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create case study");

      const newCaseStudy = await response.json();
      setCaseStudies((prev) => [newCaseStudy, ...prev]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating case study:", error);
      alert("Failed to create case study");
    }
  };

  const handleUpdate = async (id: string, data: Partial<CaseStudy>) => {
    try {
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update case study");

      const updatedCaseStudy = await response.json();
      setCaseStudies((prev) =>
        prev.map((study) => (study.id === id ? updatedCaseStudy : study))
      );
      setEditingCaseStudy(null);
    } catch (error) {
      console.error("Error updating case study:", error);
      alert("Failed to update case study");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete case study");

      setCaseStudies((prev) => prev.filter((study) => study.id !== id));
    } catch (error) {
      console.error("Error deleting case study:", error);
      alert("Failed to delete case study");
    }
  };

  const togglePublished = async (study: CaseStudy) => {
    await handleUpdate(study.id, { published: !study.published });
  };

  const toggleFeatured = async (study: CaseStudy) => {
    await handleUpdate(study.id, { featured: !study.featured });
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Case Studies</h1>
            <p className="text-muted-foreground mt-1">
              Manage client success stories and case studies
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Case Study
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Case Study</DialogTitle>
              </DialogHeader>
              <CaseStudyForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{publishedCount}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{featuredCount}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{draftCount}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.2}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </FadeIn>

      {/* Table */}
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>All Case Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Study</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCaseStudies.length > 0 ? (
                  filteredCaseStudies.map((study) => (
                    <TableRow key={study.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-violet-500" />
                          </div>
                          <div>
                            <p className="font-medium">{study.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {study.isAnonymous
                                ? "Anonymous"
                                : study.clientName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{study.industry}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublished(study)}
                        >
                          {study.published ? (
                            <>
                              <Eye className="w-4 h-4 mr-1 text-green-500" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 mr-1 text-muted-foreground" />
                              Draft
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFeatured(study)}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              study.featured
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/solutions/case-studies/${study.slug}`}
                                target="_blank"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingCaseStudy(study)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(study.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No case studies found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCaseStudy}
        onOpenChange={(open) => !open && setEditingCaseStudy(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Case Study</DialogTitle>
          </DialogHeader>
          {editingCaseStudy && (
            <CaseStudyForm
              caseStudy={editingCaseStudy}
              onSubmit={(data) => handleUpdate(editingCaseStudy.id, data)}
              onCancel={() => setEditingCaseStudy(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

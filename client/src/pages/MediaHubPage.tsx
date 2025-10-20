import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Video, Image as ImageIcon, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface Media {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  tournamentId?: string;
  tags?: string;
  createdAt: string;
}

export default function MediaHubPage() {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [uploadData, setUploadData] = useState({
    title: "",
    type: "video",
    url: "",
    tournamentId: "",
    tags: ""
  });

  const { data: mediaList = [] } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  const uploadMedia = useMutation({
    mutationFn: async (data: typeof uploadData) => {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to upload");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Media uploaded!",
        description: "Your content has been added to the media hub"
      });
      setUploadDialogOpen(false);
      setUploadData({ title: "", type: "video", url: "", tournamentId: "", tags: "" });
    }
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMedia.mutate(uploadData);
  };

  const filteredMedia = filter === "all" 
    ? mediaList 
    : mediaList.filter(m => m.type === filter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Media Hub</h1>
          <p className="text-muted-foreground">Share and browse tournament videos and photos</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="Amazing dunk from finals"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={uploadData.type} onValueChange={(v) => setUploadData({ ...uploadData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="url">URL (mock)</Label>
                <Input
                  id="url"
                  value={uploadData.url}
                  onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                  placeholder="https://example.com/media.mp4"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                  placeholder="dunk, finals, 2025"
                />
              </div>
              <Button type="submit" className="w-full" disabled={uploadMedia.isPending}>
                {uploadMedia.isPending ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="photo">Photos</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredMedia.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mb-4">
            {filter === "video" ? (
              <Video className="w-16 h-16 mx-auto text-muted-foreground" />
            ) : (
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">No media yet</h3>
          <p className="text-muted-foreground mb-4">Upload videos and photos from tournaments</p>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-elevate">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {item.type === 'video' ? (
                  <Video className="w-12 h-12 text-muted-foreground" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.split(',').map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

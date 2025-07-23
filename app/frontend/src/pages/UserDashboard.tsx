import React, { useState } from 'react';
// Replace '@/components/ui/button' with local Button import or fallback
// Replace '@/components/ui/input' with local Input import or fallback
// Replace '@/components/ui/label' with local Label import or fallback
// Replace '@/components/ui/card' with local Card, CardContent, CardDescription, CardHeader, CardTitle import or fallback
// Replace '@/hooks/use-toast' with a simple toast fallback
// Replace 'lucide-react' icons with placeholders or omit if not available

// Fallbacks for missing components
const Button = (props: any) => <button {...props} className={"bg-blue-600 text-white px-4 py-2 rounded " + (props.className || "")}>{props.children}</button>;
const Input = (props: any) => <input {...props} className={"border rounded p-2 w-full " + (props.className || "")}/>;
const Label = (props: any) => <label {...props} className={"font-medium " + (props.className || "")}>{props.children}</label>;
const Card = (props: any) => <div className={"bg-white rounded-lg shadow " + (props.className || "")}>{props.children}</div>;
const CardHeader = (props: any) => <div className="p-4 border-b border-gray-200">{props.children}</div>;
const CardTitle = (props: any) => <h2 className="text-xl font-bold flex items-center gap-2">{props.children}</h2>;
const CardDescription = (props: any) => <p className="text-gray-500 text-sm">{props.children}</p>;
const CardContent = (props: any) => <div className="p-4">{props.children}</div>;
const useToast = () => ({ toast: ({ title, description }: any) => alert(`${title}\n${description || ''}`) });
const Upload = () => <span role="img" aria-label="upload">📤</span>;
const FileText = () => <span role="img" aria-label="file">📄</span>;
const UserIcon = () => <span role="img" aria-label="user">👤</span>;

const UserDashboard = () => {
  const [fullName, setFullName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
        });
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
      });
      return;
    }
    if (!selectedFile) {
      toast({
        title: "Document required",
        description: "Please select a document to upload.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate submission for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Document submitted successfully!",
        description: `Your document "${selectedFile.name}" has been uploaded.`
      });
      setFullName('');
      setSelectedFile(null);
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your document. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <FileText /> Document Submission Portal
            </CardTitle>
            <CardDescription>
              Submit your documents for review. Supported formats: PDF, DOC, DOCX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full-name" className="flex items-center gap-2">
                  <UserIcon /> Full Name
                </Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-upload" className="flex items-center gap-2">
                  <Upload /> Document Upload
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  {selectedFile ? (
                    <p className="text-sm text-gray-500">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Choose a PDF, DOC, or DOCX file (max 5MB)
                    </p>
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Document"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard; 
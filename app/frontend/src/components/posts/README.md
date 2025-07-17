# Post Creation Feature

This directory contains the comprehensive post creation functionality for the social networking application.

## Components

### PostCreate.tsx
The main post creation component that provides:
- **Rich Text Editor**: Powered by React Quill with formatting options
- **Media Upload**: Drag & drop file upload with preview
- **Live Preview**: Toggle between edit and preview modes
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Progress indicators during submission

### MediaUpload.tsx
A reusable component for handling media file uploads:
- **Drag & Drop**: Intuitive file upload interface
- **File Validation**: Type and size restrictions
- **Preview Grid**: Visual preview of selected files
- **File Management**: Remove individual files
- **Progress Tracking**: Upload progress indicators

### PostPreview.tsx
A preview component that shows how the post will appear:
- **Author Information**: User avatar and name
- **Content Rendering**: Formatted text display
- **Media Display**: Image and video previews
- **Action Buttons**: Like, comment, share preview

### api.ts
API interface for post operations:
- **Create Post**: Submit new posts with media
- **Upload Media**: Handle file uploads
- **Get Posts**: Fetch existing posts
- **Like Posts**: Handle post interactions

## Features

### Rich Text Editing
- **Formatting Options**: Bold, italic, underline, strikethrough
- **Text Alignment**: Left, center, right alignment
- **Lists**: Ordered and unordered lists
- **Headers**: Multiple heading levels
- **Links**: URL insertion
- **Blockquotes**: Quote formatting
- **Code Blocks**: Code syntax highlighting
- **Colors**: Text and background colors

### Media Upload
- **Supported Formats**: JPG, PNG, GIF, WebP, MP4, WebM, OGG
- **File Size Limit**: 10MB per file
- **Multiple Files**: Up to 5 files per post
- **Drag & Drop**: Intuitive file selection
- **Preview**: Real-time file preview
- **Progress Tracking**: Upload progress indicators

### Validation
- **Content Required**: Posts must have content
- **Character Limit**: Maximum 5000 characters
- **File Count**: Maximum 5 media files
- **File Size**: Maximum 10MB per file
- **File Type**: Only supported formats allowed

### User Experience
- **Live Preview**: Toggle between edit and preview modes
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages
- **Form Reset**: Clear form functionality
- **Responsive Design**: Works on all screen sizes

## Usage

```tsx
import PostCreate from './components/posts/PostCreate';

function App() {
  return (
    <div>
      <PostCreate />
    </div>
  );
}
```

## API Endpoints

The component expects the following backend endpoints:

- `POST /api/posts` - Create a new post
- `POST /api/posts/upload-media` - Upload media files
- `GET /api/posts` - Get all posts
- `POST /api/posts/:id/like` - Like a post

## Styling

The components use Tailwind CSS for styling and include:
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Compatible with dark themes
- **Custom Components**: Tailored UI components
- **Animations**: Smooth transitions and hover effects

## Dependencies

- `react-quill`: Rich text editor
- `react-dropzone`: File upload handling
- `react-icons`: Icon library
- `tailwindcss`: Styling framework

## Future Enhancements

- **Mention System**: @user mentions
- **Hashtag Support**: #hashtag functionality
- **Scheduled Posts**: Post scheduling
- **Draft Saving**: Auto-save drafts
- **Advanced Media**: Image editing, video trimming
- **Accessibility**: Screen reader support
- **Internationalization**: Multi-language support 
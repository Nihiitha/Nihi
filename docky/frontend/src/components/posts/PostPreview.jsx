import React from 'react';

const PostPreview = ({ content, media }) => {
  return (
    <div className="border rounded p-4 mt-4 bg-gray-50">
      <h4 className="font-bold mb-2">Preview</h4>
      <div className="mb-2 whitespace-pre-line">{content}</div>
      {media && (
        <div>
          {media.type.startsWith('image') ? (
            <img src={URL.createObjectURL(media)} alt="preview" className="max-w-xs max-h-48" />
          ) : media.type.startsWith('video') ? (
            <video controls className="max-w-xs max-h-48">
              <source src={URL.createObjectURL(media)} type={media.type} />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PostPreview; 
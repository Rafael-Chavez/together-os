import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './Documents.css';

export default function Documents() {
  const { userProfile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDocuments();

    // Realtime subscription
    const channel = supabase
      .channel('documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `household_id=eq.${HOUSEHOLD_ID}`,
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by_user:uploaded_by(display_name)
      `)
      .eq('household_id', HOUSEHOLD_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${HOUSEHOLD_ID}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('household-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase.from('documents').insert({
        household_id: HOUSEHOLD_ID,
        file_name: file.name,
        file_type: fileExt,
        file_size: file.size,
        storage_path: filePath,
        category,
        description: description || null,
        uploaded_by: userProfile.id,
      });

      if (dbError) throw dbError;

      // Reset form
      setCategory('other');
      setDescription('');
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(doc) {
    const { data, error } = await supabase.storage
      .from('household-documents')
      .download(doc.storage_path);

    if (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
      return;
    }

    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.file_name}"?`)) return;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('household-documents')
      .remove([doc.storage_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', error);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', doc.id);

    if (dbError) {
      console.error('Error deleting document record:', dbError);
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  const categoryEmoji = {
    lease: '🏠',
    insurance: '🛡️',
    medical: '⚕️',
    financial: '💰',
    legal: '📋',
    other: '📄',
  };

  const fileTypeEmoji = {
    pdf: '📕',
    doc: '📘',
    docx: '📘',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    default: '📄',
  };

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  return (
    <div className="documents">
      <div className="section-header">
        <h2>Documents</h2>
      </div>

      <p className="section-description text-secondary">
        Store important household documents. Lease, insurance, contracts—all in one place.
      </p>

      <div className="card upload-card">
        <h3>Upload Document</h3>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="lease">🏠 Lease/Rent</option>
            <option value="insurance">🛡️ Insurance</option>
            <option value="medical">⚕️ Medical</option>
            <option value="financial">💰 Financial</option>
            <option value="legal">📋 Legal</option>
            <option value="other">📄 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Lease renewal 2024"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file-upload" className="file-upload-label">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="file-input"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <span className="btn-primary">
              {uploading ? 'Uploading...' : 'Choose File'}
            </span>
          </label>
          <p className="text-tertiary text-small">
            PDF, Word docs, or images. Max 50MB.
          </p>
        </div>
      </div>

      <div className="documents-list">
        {documents.length === 0 && (
          <p className="empty-state">
            No documents yet. Upload important files to keep them organized.
          </p>
        )}

        {documents.map((doc) => (
          <div key={doc.id} className="document-item">
            <div className="document-icon">
              {fileTypeEmoji[doc.file_type] || fileTypeEmoji.default}
            </div>
            <div className="document-content">
              <div className="document-header">
                <span className="document-category">
                  {categoryEmoji[doc.category]} {doc.category}
                </span>
                <span className="document-size text-tertiary">
                  {formatFileSize(doc.file_size)}
                </span>
              </div>
              <div className="document-name">{doc.file_name}</div>
              {doc.description && (
                <div className="document-description text-secondary">
                  {doc.description}
                </div>
              )}
              <div className="document-meta text-tertiary text-small">
                Uploaded by {doc.uploaded_by_user?.display_name} •{' '}
                {new Date(doc.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="document-actions">
              <button
                onClick={() => handleDownload(doc)}
                className="btn-secondary btn-small"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(doc)}
                className="document-delete"
                aria-label="Delete document"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

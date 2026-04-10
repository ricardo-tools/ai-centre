'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadSimple, FileHtml, FileZip, SpinnerGap, X, Image as ImageIcon } from '@phosphor-icons/react';
import { useSession } from '@/platform/lib/SessionContext';
import { uploadShowcase } from '@/features/showcase-gallery/action';
import { SkillPicker } from '@/platform/components/SkillPicker';

const MAX_SIZE = 10 * 1024 * 1024;

interface SkillOption {
  slug: string;
  title: string;
}

interface ShowcaseUploadWidgetProps {
  skills?: SkillOption[];
}

export function ShowcaseUploadWidget({ skills = [] }: ShowcaseUploadWidgetProps) {
  const router = useRouter();
  const session = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_SIZE) {
      setError('File must be under 10MB');
      return;
    }
    if (!f.name.endsWith('.html') && !f.name.endsWith('.zip')) {
      setError('Only .html and .zip files are supported');
      return;
    }
    setFile(f);
    setError(null);
    if (!title) {
      setTitle(f.name.replace(/\.(html|zip)$/, '').replace(/[-_]/g, ' '));
    }
  }, [title]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleSubmit = useCallback(async () => {
    if (!file || !title.trim()) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set('title', title.trim());
    formData.set('description', description.trim());
    formData.set('skillIds', JSON.stringify(selectedSkills));
    formData.set('file', file);
    if (thumbnail) formData.set('thumbnail', thumbnail);
    // userId intentionally NOT sent — server reads it from the session

    try {
      const result = await uploadShowcase(formData);
      if (result.ok) {
        router.push(`/gallery/${result.value.id}`);
      } else {
        setError(result.error.message);
        setIsUploading(false);
      }
    } catch {
      setError('Upload failed. Check that the server is running and try again.');
      setIsUploading(false);
    }
  }, [file, title, description, selectedSkills, session, router]);

  const toggleSkill = useCallback((slug: string) => {
    setSelectedSkills((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const FileIcon = file?.name.endsWith('.zip') ? FileZip : FileHtml;

  return (
    <div style={{ maxWidth: 'max(640px, 50vw)', width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
        Share Your Project
      </h1>
      <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
        Upload an HTML presentation or a Next.js project ZIP built with the skill library.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: 32,
          borderRadius: 8,
          border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
          background: dragOver ? 'var(--color-primary-muted)' : 'var(--color-surface)',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: 24,
          transition: 'border-color 150ms, background 150ms',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.zip"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <FileIcon size={32} weight="regular" style={{ color: 'var(--color-primary)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{file.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{(file.size / 1024).toFixed(0)} KB</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <UploadSimple size={32} weight="regular" style={{ color: 'var(--color-text-muted)', marginBottom: 8 }} />
            <div style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 4 }}>
              Drop your file here or click to browse
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              .html or .zip — max 10MB
            </div>
          </>
        )}
      </div>

      {/* Title + Description side-by-side on tablet+, stacked on mobile */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: '1 1 280px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-body)', marginBottom: 6 }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My awesome project"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-body)',
              fontSize: 15,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ flex: '1 1 280px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-body)', marginBottom: 6 }}>
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this project do?"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-body)',
              fontSize: 15,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Skills used */}
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-body)', marginBottom: 8 }}>
        Skills used
      </label>
      <div style={{ marginBottom: 24 }}>
        <SkillPicker
          available={skills}
          selected={selectedSkills}
          onChange={setSelectedSkills}
        />
      </div>

      {/* Thumbnail (ZIP projects only) */}
      {file?.name.endsWith('.zip') && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-body)', marginBottom: 8 }}>
            Preview screenshot (optional)
          </label>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 8px', lineHeight: 1.4 }}>
            ZIP projects have no live preview in the gallery. Upload a screenshot so people can see what it looks like.
          </p>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setThumbnail(f);
                setThumbnailPreview(URL.createObjectURL(f));
              }
            }}
          />
          {thumbnailPreview ? (
            <div style={{ position: 'relative', display: 'inline-block', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <img src={thumbnailPreview} alt="Thumbnail preview" style={{ maxWidth: 320, maxHeight: 200, display: 'block' }} />
              <button
                onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                style={{ position: 'absolute', top: 4, right: 4, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, padding: 2, cursor: 'pointer', display: 'flex' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => thumbnailInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                borderRadius: 6, border: '1px dashed var(--color-border)', background: 'var(--color-surface)',
                color: 'var(--color-text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <ImageIcon size={18} /> Add a screenshot
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ fontSize: 13, color: 'var(--color-danger)', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isUploading || !file || !title.trim()}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: isUploading || !file || !title.trim() ? 'var(--color-text-muted)' : 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: isUploading || !file || !title.trim() ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: isUploading || !file || !title.trim() ? 0.6 : 1,
        }}
      >
        {isUploading && <SpinnerGap size={20} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />}
        {isUploading ? 'Uploading...' : 'Share Project'}
      </button>
    </div>
  );
}

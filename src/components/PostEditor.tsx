import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  ChangeEvent,
} from 'react';
import { uploadImageToUploadThing } from '@/lib/uploadthing';

export interface PostEditorHandle {
  getHTML: () => string;
  setHTML: (html: string) => void;
  insertHTML: (html: string) => void;
}

interface Props {
  id?: string;
  value: string;
  onChange?: (val: string) => void;
  height?: string;
  placeholder?: string;
}

const PostEditor = forwardRef<PostEditorHandle, Props>(function PostEditor(
  { id = 'post_body_editor', value, onChange, height = '360px', placeholder },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Table Modal
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeader, setTableHeader] = useState(true);

  // Link Modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Keep internal text state in sync if prop value changes externally
  // (e.g. when post data finishes loading)
  const lastPropValueRef = useRef(value);
  if (value !== lastPropValueRef.current) {
    lastPropValueRef.current = value;
    setText(value || '');
  }

  // Helper to wrap selected text or insert markup at cursor
  function wrapSelection(before: string, after: string, defaultPlaceholder = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end) || defaultPlaceholder;

    const replacement = before + selectedText + after;
    const newVal =
      currentVal.substring(0, start) + replacement + currentVal.substring(end);

    setText(newVal);
    if (onChange) onChange(newVal);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  }

  // Helper to insert arbitrary text/HTML at current cursor
  function insertAtCursor(toInsert: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const newVal =
      currentVal.substring(0, start) + toInsert + currentVal.substring(end);

    setText(newVal);
    if (onChange) onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      const pos = start + toInsert.length;
      textarea.setSelectionRange(pos, pos);
    }, 10);
  }

  useImperativeHandle(ref, () => ({
    getHTML: () => {
      return textareaRef.current?.value || text || '';
    },
    setHTML: (newHtml: string) => {
      setText(newHtml);
      if (textareaRef.current) {
        textareaRef.current.value = newHtml;
      }
    },
    insertHTML: (html: string) => {
      insertAtCursor(html);
    },
  }));

  // Handle image upload via UploadThing
  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(`Uploading ${file.name} to UploadThing...`);

    const { data, error } = await uploadImageToUploadThing(file);
    setUploading(false);

    if (error || !data) {
      setUploadStatus(`Upload failed: ${error || 'Unknown error'}`);
      setTimeout(() => setUploadStatus(null), 5000);
      return;
    }

    setUploadStatus(`✓ Uploaded & inserted: ${data.name}`);
    setTimeout(() => setUploadStatus(null), 3000);

    const imgHtml = `\n<img src="${data.ufsUrl}" alt="${data.name}" style="max-width: 100%; height: auto; border: 1px solid #ccc; margin: 8px 0;" />\n`;
    insertAtCursor(imgHtml);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Handle table insertion
  function handleInsertTable() {
    const rows = Math.max(1, Math.min(20, tableRows));
    const cols = Math.max(1, Math.min(10, tableCols));

    let tableHtml = `\n<table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; margin: 10px 0; border: 1px solid #888;">`;

    if (tableHeader) {
      tableHtml += `\n  <thead>\n    <tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `\n      <th style="background-color: #eee; border: 1px solid #888; padding: 6px 10px; font-weight: bold;">Header ${c}</th>`;
      }
      tableHtml += `\n    </tr>\n  </thead>`;
    }

    tableHtml += `\n  <tbody>`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `\n    <tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `\n      <td style="border: 1px solid #bbb; padding: 6px 10px;">Row ${r}, Col ${c}</td>`;
      }
      tableHtml += `\n    </tr>`;
    }
    tableHtml += `\n  </tbody>\n</table>\n`;

    insertAtCursor(tableHtml);
    setShowTableModal(false);
  }

  // Handle link insertion
  function handleInsertLink() {
    const url = linkUrl.trim();
    if (!url) return;
    const label = linkText.trim() || url;
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    insertAtCursor(linkHtml);
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  }

  return (
    <div className="post-editor-container my-2">
      {/* Minimal Upper Toolbar */}
      <div className="bg-theme-toolbar border border-theme px-2 py-1 mb-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[0.76rem]">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            onClick={() => wrapSelection('<p>', '</p>', 'Paragraph text')}
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Normal text paragraph"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<h2>', '</h2>', 'Heading 2')}
            className="btn-old text-[0.72rem] py-0 px-1.5 font-bold"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<h3>', '</h3>', 'Heading 3')}
            className="btn-old text-[0.72rem] py-0 px-1.5 font-bold"
            title="Heading 3"
          >
            H3
          </button>

          <span className="text-[#aaa] px-0.5">|</span>

          {/* Text Style */}
          <button
            type="button"
            onClick={() => wrapSelection('<strong>', '</strong>', 'bold text')}
            className="btn-old text-[0.72rem] py-0 px-1.5 font-bold"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<em>', '</em>', 'italic text')}
            className="btn-old text-[0.72rem] py-0 px-1.5 italic"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<u>', '</u>', 'underlined text')}
            className="btn-old text-[0.72rem] py-0 px-1.5 underline"
            title="Underline"
          >
            U
          </button>

          <span className="text-[#aaa] px-0.5">|</span>

          {/* Alignment */}
          <button
            type="button"
            onClick={() =>
              wrapSelection('<p style="text-align: left;">', '</p>', 'left text')
            }
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Align Left"
          >
            Left
          </button>
          <button
            type="button"
            onClick={() =>
              wrapSelection('<p style="text-align: center;">', '</p>', 'centered text')
            }
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Align Center"
          >
            Center
          </button>
          <button
            type="button"
            onClick={() =>
              wrapSelection('<p style="text-align: right;">', '</p>', 'right text')
            }
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Align Right"
          >
            Right
          </button>

          <span className="text-[#aaa] px-0.5">|</span>

          {/* Lists */}
          <button
            type="button"
            onClick={() =>
              insertAtCursor('\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n')
            }
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() =>
              insertAtCursor('\n<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>\n')
            }
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Numbered List"
          >
            1. List
          </button>

          <span className="text-[#aaa] px-0.5">|</span>

          {/* Link */}
          <button
            type="button"
            onClick={() => {
              const textarea = textareaRef.current;
              const sel = textarea
                ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
                : '';
              setLinkText(sel || '');
              setShowLinkModal((prev) => !prev);
            }}
            className="btn-old text-[0.72rem] py-0 px-1.5"
            title="Insert Link"
          >
            🔗 Link
          </button>

          {/* Upload Pic (UploadThing) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            id={`uploadthing_input_${id}`}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="btn-old text-[0.72rem] py-0 px-1.5 flex items-center gap-1 bg-theme-badge border-theme-badge"
            title="Upload and insert image via UploadThing"
          >
            <span>📷</span>
            <span>{uploading ? 'Uploading...' : 'Upload Pic'}</span>
          </button>

          {/* Table */}
          <button
            type="button"
            onClick={() => setShowTableModal((prev) => !prev)}
            className="btn-old text-[0.72rem] py-0 px-1.5 flex items-center gap-1"
            title="Insert custom table"
          >
            <span>⊞</span>
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Uploading Status Banner */}
      {uploadStatus && (
        <div
          className={`p-1 mb-1 text-[0.74rem] mono border ${
            uploadStatus.includes('failed')
              ? 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]'
              : 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]'
          }`}
        >
          {uploadStatus}
        </div>
      )}

      {/* Inline Minimal Link Dialog */}
      {showLinkModal && (
        <div className="bg-theme-card border border-theme p-2 mb-2 text-[0.78rem] space-y-2 shadow-sm">
          <div className="flex items-center justify-between border-b border-theme pb-0.5 font-bold">
            <span>Insert Link</span>
            <button
              type="button"
              onClick={() => setShowLinkModal(false)}
              className="text-[#999] hover:text-[#000]"
            >
              [ &times; ]
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="input-old text-[0.78rem] flex-1 min-w-[180px] py-0 px-1.5"
            />
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text (optional)"
              className="input-old text-[0.78rem] w-40 py-0 px-1.5"
            />
            <button
              type="button"
              onClick={handleInsertLink}
              className="btn-old text-[0.72rem] py-0 px-2"
            >
              Insert Link
            </button>
          </div>
        </div>
      )}

      {/* Inline Minimal Table Dialog */}
      {showTableModal && (
        <div className="bg-theme-card border border-theme p-2 mb-2 text-[0.78rem] space-y-2 shadow-sm">
          <div className="flex items-center justify-between border-b border-theme pb-0.5 font-bold">
            <span>Insert Table</span>
            <button
              type="button"
              onClick={() => setShowTableModal(false)}
              className="text-[#999] hover:text-[#000]"
            >
              [ &times; ]
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1">
              <span>Rows:</span>
              <input
                type="number"
                min={1}
                max={20}
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                className="input-old text-[0.78rem] w-14 py-0 px-1"
              />
            </label>
            <label className="flex items-center gap-1">
              <span>Cols:</span>
              <input
                type="number"
                min={1}
                max={10}
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                className="input-old text-[0.78rem] w-14 py-0 px-1"
              />
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={tableHeader}
                onChange={(e) => setTableHeader(e.target.checked)}
              />
              <span>Header row</span>
            </label>
            <button
              type="button"
              onClick={handleInsertTable}
              className="btn-old text-[0.72rem] py-0 px-2 ml-auto"
            >
              Insert Table
            </button>
          </div>
        </div>
      )}

      {/* Native Responsive Textarea with zero lag */}
      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        rows={16}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="input-old w-full font-mono text-[0.88rem] leading-relaxed p-2"
        style={{ minHeight: height }}
      />
    </div>
  );
});

export default PostEditor;

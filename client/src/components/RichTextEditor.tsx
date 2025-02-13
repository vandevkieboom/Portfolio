import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaLink,
  FaUnlink,
  FaImage,
  FaUndo,
  FaRedo,
  FaHeading,
} from 'react-icons/fa';

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, isActive = false, disabled = false, children }) => {
  return (
    <button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onClick();
      }}
      type="button"
      disabled={disabled}
      className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
        isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, error, setError }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[300px] outline-none w-full h-full',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const addLocalImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setError('Image is too large. Max size: 5MB.');
        return;
      }

      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const setLink = (): void => {
    const previousUrl = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Enter URL', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-2">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <FaHeading />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <FaBold />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <FaItalic />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <FaListUl />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <FaListOl />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          <FaQuoteLeft />
        </MenuButton>

        <MenuButton onClick={setLink} isActive={editor.isActive('link')}>
          <FaLink />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}>
          <FaUnlink />
        </MenuButton>

        <label className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
          <FaImage />
          <input type="file" accept="image/*" className="hidden" onChange={addLocalImage} />
        </label>

        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <FaUndo />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <FaRedo />
        </MenuButton>
      </div>

      <div className="w-full h-full bg-white dark:bg-gray-900" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;

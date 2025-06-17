
// import React, { useState } from 'react';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import { FolderTree, File, ChevronRight, ChevronDown } from 'lucide-react';
// import { FileItem } from '../types';

// interface FileExplorerProps {
//   files: FileItem[];
//   onFileSelect: (file: FileItem) => void;
// }

// interface FileNodeProps {
//   item: FileItem;
//   depth: number;
//   onFileClick: (file: FileItem) => void;
// }

// function FileNode({ item, depth, onFileClick }: FileNodeProps) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleClick = () => {
//     if (item.type === 'folder') {
//       setIsExpanded(!isExpanded);
//     } else {
//       onFileClick(item);
//     }
//   };

//   return (
//     <div className="select-none">
//       <div
//         className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md cursor-pointer"
//         style={{ paddingLeft: `${depth * 1.5}rem` }}
//         onClick={handleClick}
//       >
//         {item.type === 'folder' && (
//           <span className="text-gray-400">
//             {isExpanded ? (
//               <ChevronDown className="w-4 h-4" />
//             ) : (
//               <ChevronRight className="w-4 h-4" />
//             )}
//           </span>
//         )}
//         {item.type === 'folder' ? (
//           <FolderTree className="w-4 h-4 text-blue-400" />
//         ) : (
//           <File className="w-4 h-4 text-gray-400" />
//         )}
//         <span className="text-gray-200">{item.name}</span>
//       </div>
//       {item.type === 'folder' && isExpanded && item.children && (
//         <div>
//           {item.children.map((child, index) => (
//             <FileNode
//               key={`${child.path}-${index}`}
//               item={child}
//               depth={depth + 1}
//               onFileClick={onFileClick}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
//   const downloadFiles = async () => {
//     const zip = new JSZip();

//     // Recursively add files and folders to the ZIP
//     const addFilesToZip = (fileList: FileItem[], folder?: JSZip) => {
//       fileList.forEach((file) => {
//         if (file.type === 'folder') {
//           const subFolder = folder ? folder.folder(file.name) : zip.folder(file.name);
//           if (file.children) {
//             addFilesToZip(file.children, subFolder);
//           }
//         } else {
//           const content = file.content || ''; // Ensure content exists
//           if (folder) {
//             folder.file(file.name, content);
//           } else {
//             zip.file(file.name, content);
//           }
//         }
//       });
//     };

//     addFilesToZip(files);

//     // Generate and download the ZIP file
//     const zipBlob = await zip.generateAsync({ type: 'blob' });
//     saveAs(zipBlob, 'website_files.zip');
//   };

//   return (
//     <div className="bg-gray-900 rounded-lg shadow-lg p-4 h-full overflow-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
//           <FolderTree className="w-5 h-5" />
//           File Explorer
//         </h2>
//         <button
//           onClick={downloadFiles}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           GET CODE
//         </button>
//       </div>
//       <div className="space-y-1">
//         {files.map((file, index) => (
//           <FileNode
//             key={`${file.path}-${index}`}
//             item={file}
//             depth={0}
//             onFileClick={onFileSelect}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }







import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FolderTree, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileItem } from '../types';
import { Octokit } from '@octokit/rest';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md cursor-pointer"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {item.type === 'folder' ? (
          <FolderTree className="w-4 h-4 text-blue-400" />
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-gray-200">{item.name}</span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const downloadFiles = async () => {
    const zip = new JSZip();

    const addFilesToZip = (fileList: FileItem[], folder?: JSZip) => {
      fileList.forEach((file) => {
        if (file.type === 'folder') {
          const subFolder = folder ? folder.folder(file.name) : zip.folder(file.name);
          if (file.children) {
            addFilesToZip(file.children, subFolder!);
          }
        } else {
          const content = file.content || '';
          if (folder) {
            folder.file(file.name, content);
          } else {
            zip.file(file.name, content);
          }
        }
      });
    };

    addFilesToZip(files);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'website_files.zip');
  };

  const pushToGitHub = async () => {
    const githubToken = '';

    if (!githubToken) {
      alert('Please authenticate with GitHub first.');
      return;
    }

    const octokit = new Octokit({
      auth: githubToken,
    });

    const owner = 'Abraarcodes';
    const repo = 'websittee';

    try {
      const response = await octokit.repos.createForAuthenticatedUser({
        name: repo,
        private: false,
      });
      console.log('Repository created or already exists', response);

      const commitMessage = 'Initial commit';
      const branch = 'main';

      const addFilesToGitHub = async (fileList: FileItem[], parentPath: string = '') => {
        for (const file of fileList) {
          if (file.type === 'folder') {
            await addFilesToGitHub(file.children || [], `${parentPath}${file.name}/`);
          } else {
            const content = file.content || '';
            let filePath = `${parentPath}${file.name}`;

            if (filePath.startsWith('/')) {
              filePath = filePath.substring(1);
            }

            const base64Content = btoa(unescape(encodeURIComponent(content)));

            await octokit.repos.createOrUpdateFileContents({
              owner,
              repo,
              path: filePath,
              message: commitMessage,
              content: base64Content,
              branch,
            });
          }
        }
      };

      await addFilesToGitHub(files);

      alert('Code pushed to GitHub successfully!');
    } catch (error: unknown) {
      console.error('Error pushing code to GitHub:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
          <FolderTree className="w-5 h-5" />
          File Explorer
        </h2>
        <button
          onClick={downloadFiles}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          GET CODE
        </button>
        <button
          onClick={pushToGitHub}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Push to GitHub
        </button>
      </div>
      <div className="space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}

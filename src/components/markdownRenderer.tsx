import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const theme = useTheme();

  return (
    <ReactMarkdown
      components={{
        // Headers
        h1: ({ children }) => (
          <Typography variant="h4" component="h1" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="h5" component="h2" sx={{ mb: 1.5, mt: 2, fontWeight: 'bold' }}>
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="h6" component="h3" sx={{ mb: 1, mt: 1.5, fontWeight: 'bold' }}>
            {children}
          </Typography>
        ),
        h4: ({ children }) => (
          <Typography variant="subtitle1" component="h4" sx={{ mb: 1, mt: 1.5, fontWeight: 'bold' }}>
            {children}
          </Typography>
        ),
        h5: ({ children }) => (
          <Typography variant="subtitle2" component="h5" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>
            {children}
          </Typography>
        ),
        h6: ({ children }) => (
          <Typography variant="body1" component="h6" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>
            {children}
          </Typography>
        ),
        
        // Paragraphs
        p: ({ children }) => (
          <Typography 
            variant="body2" 
            component="p" 
            sx={{ 
              mb: 1.5, 
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {children}
          </Typography>
        ),
        
        // Lists
        ul: ({ children }) => (
          <Box component="ul" sx={{ pl: 2, mb: 1.5 }}>
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box component="ol" sx={{ pl: 2, mb: 1.5 }}>
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Typography component="li" variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
            {children}
          </Typography>
        ),
        
        // Code blocks
        code: ({ children, className }) => {
          // Check if it's inline code by looking for the className that indicates a code block
          const inline = !className || !className.includes('language-');
          if (inline) {
            return (
              <Box
                component="code"
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.875em',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  color: theme.palette.mode === 'dark' ? '#e3f2fd' : '#d32f2f',
                }}
              >
                {children}
              </Box>
            );
          }
          
          return (
            <Box
              component="pre"
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f8f8f8',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                component="code"
                sx={{
                  fontSize: '0.875em',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  color: theme.palette.text.primary,
                  whiteSpace: 'pre',
                }}
              >
                {children}
              </Box>
            </Box>
          );
        },
        
        // Blockquotes
        blockquote: ({ children }) => (
          <Box
            component="blockquote"
            sx={{
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              pl: 2,
              py: 1,
              mb: 2,
              backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f9f9f9',
              fontStyle: 'italic',
            }}
          >
            {children}
          </Box>
        ),
        
        // Links
        a: ({ href, children }) => (
          <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            {children}
          </Box>
        ),
        
        // Tables
        table: ({ children }) => (
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {children}
          </Box>
        ),
        th: ({ children }) => (
          <Box
            component="th"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              padding: '8px 12px',
              backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            {children}
          </Box>
        ),
        td: ({ children }) => (
          <Box
            component="td"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              padding: '8px 12px',
            }}
          >
            {children}
          </Box>
        ),
        
        // Horizontal rule
        hr: () => (
          <Box
            component="hr"
            sx={{
              border: 'none',
              borderTop: `1px solid ${theme.palette.divider}`,
              my: 2,
            }}
          />
        ),
        
        // Strong and emphasis
        strong: ({ children }) => (
          <Box component="strong" sx={{ fontWeight: 'bold' }}>
            {children}
          </Box>
        ),
        em: ({ children }) => (
          <Box component="em" sx={{ fontStyle: 'italic' }}>
            {children}
          </Box>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

import { useState } from "react";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useChat } from "../lib/hooks/UseChat";
import { useChatSessionsContext } from "../lib/contexts/ChatSessionsContext";
import { useUserInfoContext } from "../lib/contexts/UserInfoContext";
import { useAlertSnackbar } from "../lib/hooks/UseAlertSnackbar";
import { useTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type TooltipPlacement =
  | "top-start"
  | "top"
  | "top-end"
  | "right-start"
  | "right"
  | "right-end"
  | "bottom-end"
  | "bottom"
  | "bottom-start"
  | "left-end"
  | "left"
  | "left-start";

interface FileUploadProps {
  arrow?: boolean;
  disabled?: boolean;
  placement?: TooltipPlacement;
}

export default function FileUploadButton(props: FileUploadProps) {
  const { arrow, disabled, placement = "top" } = props;

  const theme = useTheme();

  const { userInfo } = useUserInfoContext();
  const { selectedChatSession, setFiles } = useChatSessionsContext();
  const { postUploadDocument, getUploadedFiles } = useChat();
  const { showAlert, AlertSnackbar } = useAlertSnackbar();

  const [processing, setProcessing] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: { progress: number; completed: boolean; error?: string };
  }>({});

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const getRecentlyUploadedFiles = async () => {
    if (userInfo && selectedChatSession) {
      const files = await getUploadedFiles(userInfo, selectedChatSession);
      setFiles(files ?? []);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    const files = event?.target.files;
    const filesArray = files ? Array.from(files) : [];
    setUploadingFiles(filesArray);
    setProcessing(true);

    if (filesArray.length > 0 && userInfo && selectedChatSession) {
      const initialStatus = filesArray.reduce(
        (
          acc: { [key: string]: { progress: number; completed: boolean } },
          file
        ) => {
          acc[file.name] = { progress: 0, completed: false };
          return acc;
        },
        {}
      );

      setUploadStatus(initialStatus);

      const promises = filesArray.map(
        (file) =>
          new Promise(async (resolve, reject) => {
            try {
              if (file.size > MAX_FILE_SIZE) {
                throw new Error("File size cannot be larger than 50 MB");
              }

              const result = await postUploadDocument(
                userInfo,
                selectedChatSession,
                file
              );

              setUploadStatus((prev) => ({
                ...prev,
                [file.name]: { progress: 100, completed: true },
              }));
              resolve(result);
            } catch (error) {
              setUploadStatus((prev) => ({
                ...prev,
                [file.name]: {
                  progress: 0,
                  completed: true,
                  error: (error as Error).message,
                },
              }));
              reject(error);
            }
          })
      );

      Promise.allSettled(promises).then((results) => {
        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;

        if (failed === 0) {
          showAlert(`Successfully uploaded ${successful} files`);

          getRecentlyUploadedFiles();
        } else {
          showAlert(
            `Uploaded ${successful} files, ${failed} failed`,
            "warning"
          );
        }
        setProcessing(false);
        setUploadingFiles([]);
      });
    }
  };

  return (
    <Box>
      <Tooltip
        arrow={arrow}
        placement={placement}
        title={
          <Box>
            <Typography variant="body2">Upload file</Typography>
            <Typography fontSize="0.95em">
              <Box component="span" fontWeight={700}>
                Allowed:{" "}
              </Box>
              <Box component="span">
                .txt, .pdf, .csv, .doc/docx, .md, .html, .xls/xlsx
              </Box>
              <Box component="p">50 MB max in size</Box>
            </Typography>
          </Box>
        }
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -8],
                },
              },
            ],
          },
        }}
      >
        <Button
          component="label"
          size="small"
          role={undefined}
          tabIndex={-1}
          disabled={processing || !selectedChatSession || disabled}
          loading={processing}
          sx={{
            "&.MuiButtonBase-root": {
              minWidth: "32px",
              color: "rgba(0, 0, 0, 0.54)",
              padding: "5px",
              fontSize: "1.125rem",
              backgroundColor: "transparent",
              // keep rounded rectangle for now; if this task action button moves, make circular
              // borderRadius: "50%",
              transition:
                "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              "&.Mui-disabled": {
                border: "1px solid rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
              "&:hover": {
                borderRadius: "50%",
              },
            },
          }}
        >
          <AttachFileIcon />
          <VisuallyHiddenInput
            id="file-input"
            type="file"
            accept=".txt,.md,.html,.doc,.docx,.csv,.xls,.xlsx,.pdf"
            onChange={handleFileUpload}
            multiple
          />
        </Button>
      </Tooltip>
      {processing && (
        <Snackbar
          key="files-upload"
          open
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            "& .MuiPaper-root": {
              background: theme.palette.common.white,
            },
          }}
        >
          <Alert severity="info" icon={false} variant="outlined">
            <AlertTitle>Uploading files</AlertTitle>
            <List dense>
              {uploadingFiles.map((file, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <Box>
                      {uploadStatus[file.name]?.completed && (
                        <Typography color="success">{" ✓"}</Typography>
                      )}
                      {uploadStatus[file.name]?.error && (
                        <Typography color="error">{" x"}</Typography>
                      )}
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex">
                        <Box position="relative" top="2px" mr="5px">
                          <CircularProgress size="15px" />
                        </Box>
                        <Typography component="span">{file.name}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        </Snackbar>
      )}
      <AlertSnackbar />
    </Box>
  );
}

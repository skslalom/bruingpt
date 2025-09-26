import { useMemo } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
// TODO for future use
// import Stack from "@mui/material/Stack";
import FileUploadButton from "./fileUploadButton";
import { useTheme, darken, lighten, useMediaQuery } from "@mui/material";
import { useChatSessionsContext } from "../lib/contexts/ChatSessionsContext";

// TODO for future use
// import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
// import MicOutlinedIcon from "@mui/icons-material/MicOutlined";

interface InputAreaProps {
  currentMessage: string;
  disabled: boolean;
  handleSubmit: any;
  handleInputChange: any;
  handleClearInput?: any;
}

export default function InputArea(props: InputAreaProps) {
  const { currentMessage, disabled, handleSubmit, handleInputChange } = props;

  const { filesForChatSession } = useChatSessionsContext();
  const theme = useTheme();
  const viewportIsSmall = useMediaQuery(theme.breakpoints.between("xs", "sm"));

  const lengthIsValidToSubmit = useMemo(() => {
    if (currentMessage.length === 0) {
      return false;
    }

    if (/^\s*$/.test(currentMessage)) {
      return false;
    }

    if (currentMessage.length > 0) {
      return true;
    }
  }, [currentMessage]);

  const expandPromptInput = useMemo(() => {
    if (currentMessage.length > 0) {
      return true;
    }
    return false;
  }, [currentMessage.length]);

  const mobilePaddingBottom = useMemo(() => {
    if (viewportIsSmall) {
      return `${theme.constants.footerHeight + 20}px`;
    }
    return undefined;
  }, [viewportIsSmall, theme.constants.footerHeight]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.shiftKey && event.key === "Enter" && lengthIsValidToSubmit) {
      return;
    }

    if (event.key === "Enter" && !lengthIsValidToSubmit) {
      return;
    }

    if (event.key === "Enter" && lengthIsValidToSubmit) {
      handleSubmit();
    }
  };

  const fileChipColor = (filename: string) => {
    if (filename.endsWith(".pdf")) return "error";
    if (filename.endsWith(".txt") || filename.endsWith(".html"))
      return "warning";
    if (filename.endsWith(".doc") || filename.endsWith(".docx"))
      return "primary";
    if (filename.endsWith(".xls") || filename.endsWith(".xlsx"))
      return "success";
    if (filename.endsWith(".md")) return "info";
  };

  return (
    <>
      <Box
        id="input-area-panel"
        display="flex"
        sx={{
          borderTop: `1px solid ${darken(
            theme.palette.neutralLightGray.main,
            0.025
          )}`,
          backgroundColor: lighten(theme.palette.neutralLightGray.main, 0.5),
          boxShadow: "0px -5px 10px 0px #E8E8E8;",
        }}
        p={3}
        pb={mobilePaddingBottom}
      >
        <Paper
          sx={{
            display: "flex",
            width: "100%",
            p: 1,
            borderRadius: "8px",
            pt: !expandPromptInput ? "15px" : undefined,
          }}
        >
          <Box flexGrow={1}>
            {filesForChatSession.length > 0 && (
              <Box
                display="flex"
                flexDirection="row"
                gap="4px"
                mb={1}
                pb={1}
                sx={{
                  flexFlow: "wrap",
                  borderBottom: `1px solid ${theme.palette.neutralLightGray.main}`,
                }}
              >
                {filesForChatSession.map((file, _i) => (
                  <Chip
                    key={file.documentId}
                    label={file.fileName}
                    size="small"
                    variant="outlined"
                    color={fileChipColor(file.fileName)}
                  />
                ))}
              </Box>
            )}
            <Box id="input-area-container">
              <InputBase
                autoFocus
                id="input-area-input"
                tabIndex={0}
                value={currentMessage}
                onChange={handleInputChange} // when user enters text, handleInputChange is called to update currentMessage
                onKeyDown={handleKeyDown}
                placeholder="How may I help you?"
                inputProps={{ "aria-label": "How may I help you?" }}
                disabled={disabled}
                multiline
                maxRows={expandPromptInput ? 10 : 2}
                sx={{
                  width: "100%",
                  paddingLeft: "15px",
                  "&.MuiInputBase-root": {
                    scrollbarColor: `${theme.palette.slalomSecondaryRed.light} transparent`,
                  },
                }}
              />
            </Box>
            <Fade in={expandPromptInput}>
              <Box
                id="input-actions"
                display={expandPromptInput ? "flex" : "none"}
                justifyContent="space-between"
                borderTop={`1px solid ${theme.palette.neutralLightGray.main}`}
                mt="10px"
                pt="3px"
              >
                <Box id="input-actions-helper-text">
                  <Box
                    sx={{
                      position: "relative",
                      top: "4px",
                    }}
                  >
                    <Typography component="span" variant="caption">
                      Use{" "}
                    </Typography>
                    <Box
                      component="kbd"
                      sx={{
                        px: "6px",
                        py: "2px",
                        borderRadius: 1,
                        backgroundColor:
                          theme.palette.slalomSecondaryPurple.light,
                      }}
                    >
                      <Typography component="span" variant="caption">
                        shift + enter
                      </Typography>
                    </Box>
                    <Typography component="span" variant="caption">
                      {" "}
                      for new line
                    </Typography>
                  </Box>
                </Box>
                {/** TODO for furture use */}
                {/* <Box id="input-actions-tasks">
                  <Stack direction="row" spacing={2} mr={1}>
                    <IconButton
                      id="task-bookmark"
                      size="small"
                      tabIndex={0}
                      aria-label="bookmark"
                    >
                      <BookmarkAddOutlinedIcon />
                    </IconButton>
                    <IconButton
                      id="task-voice"
                      size="small"
                      tabIndex={0}
                      aria-label="voice"
                    >
                      <MicOutlinedIcon />
                    </IconButton>
                  </Stack>
                </Box> */}
              </Box>
            </Fade>
          </Box>
          <Box
            flexGrow={0}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              id="post-message"
              loading={disabled}
              disabled={disabled || !lengthIsValidToSubmit}
              tabIndex={0}
              aria-label="submit"
              type="submit"
              size="small"
              onClick={handleSubmit}
              sx={{
                position: "relative",
                bottom: currentMessage === "" ? "3px" : 0,
                borderRadius: 1,
                mx: 1,
                "&.Mui-disabled": {
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                },
                "&:hover": {
                  background: lighten(
                    theme.palette.slalomPrimaryBlue.main,
                    0.15
                  ),
                },
                background: theme.palette.slalomPrimaryBlue.main,
                color: theme.palette.common.white,
              }}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <Box
              sx={{
                position: "relative",
                bottom: expandPromptInput ? 0 : "3px",
              }}
            >
              <FileUploadButton arrow disabled={disabled} placement="top-end" />
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

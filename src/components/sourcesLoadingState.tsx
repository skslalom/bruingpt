import { Box, Typography } from "@mui/material";
import { Oval } from "react-loader-spinner";

export default function SourcesLoadingState() {

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        padding: "8px 0",
        marginTop: "8px",
        opacity: 0.8
      }}
    >
      <Oval
        height="18"
        width="18"
        color="#666666"
        secondaryColor="#cccccc"
        strokeWidth={3}
        strokeWidthSecondary={3}
        ariaLabel="sources-loading"
        visible={true}
      />
      <Typography 
        variant="body2" 
        sx={{ 
          marginLeft: "8px", 
          color: "#666666",
          fontSize: "0.875rem",
          fontStyle: "italic"
        }}
      >
        Loading sources...
      </Typography>
    </Box>
  );
}

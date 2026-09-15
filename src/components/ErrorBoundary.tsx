import { Box, Button, Typography } from "@mui/material";
import { Component, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error("Uncaught render error", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography component="h1" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
            Something went wrong.
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>
            Try again, or go back to the home page.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="contained" onClick={this.handleRetry}>
              Try again
            </Button>
            <Button component={RouterLink} to="/" variant="outlined" onClick={this.handleRetry}>
              Home
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error boundary exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center p-6 bg-card border border-border rounded-xl shadow-sm text-center">
          <div className="space-y-4 max-w-md">
            <div className="flex justify-center">
              <div className="p-3 bg-destructive/10 rounded-full text-destructive border border-destructive/20">
                <AlertOctagon className="h-8 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">
                An Unexpected System Exception Occurred
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The application encountered an error while rendering this workspace view. No data was lost. 
                Please try reloading the module using the button below.
              </p>
              {process.env.NODE_ENV !== "production" && (
                <div className="p-3 bg-muted rounded border border-border text-left font-mono text-[10px] text-destructive overflow-auto max-h-32 mt-2">
                  {this.state.errorMessage}
                </div>
              )}
            </div>
            <div className="flex justify-center pt-2">
              <Button
                onClick={this.handleReset}
                className="flex items-center gap-2 font-bold px-4 h-9 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload View</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
